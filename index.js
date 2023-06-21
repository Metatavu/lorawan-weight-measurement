const IotData = require('aws-sdk').IotData;
const Decoder = require('./enless-lorawan-codec-1.0.5/package/index.js').Decoder;

const SENSOR_TYPE = '600-035';

// Decodes the payload into the result object.
function decodePayload(payload) {
  const dec = new Decoder(SENSOR_TYPE);
  const rawData = Buffer.from(payload, 'base64').toString('hex');

  return dec.decode(rawData).result
}

// Decodes the payload into the result object and returns the milliamps the scale measures.
function getMilliamps(payload) {
  const result = decodePayload(payload);
  return result.values.current.value
}

// Calculates the weight from the milliamps.
function getWeight(milliamps) {
  // The scale of the measurement is from 4 mA (0 kg) to 20 mA (2000 kg), so we step it down 
  // so that 0 mA corresponds to 0 kg, and 16 mA to 2000 kg.
  milliamps -= 4;

  const weightFactor = milliamps / 16; // 1 when 16 mA = 2000 kg
  return weightFactor * 2000;
}

// Decodes the payload into the result object and returns the state of the battery on a scale from 0 to 1.
function getBattery(payload) {
  const result = decodePayload(payload);
  return parseInt(result.states.battery.replace('%', ''), 10) / 100;
}

/**
 * Publish MQTT message to given topic
 *
 * @param topic topic
 * @param payload payload to send
 */
async function publishToIotCore(topic, payload) {
  const iotData = new IotData({
    endpoint: process.env.MQTT_ENDPOINT,
    region: process.env.REGION
  });

  var params = {
    topic: topic,
    payload: JSON.stringify(payload),
    qos: 1
  };

  const response = await iotData.publish(params).promise();

  if (response?.$response?.error) {
    console.error("Error while publishing data", response?.$response.error);
  } else {
    console.info(`Published data: ${response?.$response.data} to topic: ${params.topic}`);
  }
}

// Creates an object with all the device info we need.
function getInfo(object) {
  const payload = object.PayloadData;

  return {
    weight: getWeight(getMilliamps(payload)),
    battery: getBattery(payload),
    devEui: object.WirelessMetadata.LoRaWAN.DevEui,
    deviceId: object.WirelessDeviceId,
    timestamp: object.WirelessMetadata.LoRaWAN.Timestamp,
  }
}

module.exports.handler = async (event) => {
  await publishToIotCore("measurements/data", getInfo(event));
};
