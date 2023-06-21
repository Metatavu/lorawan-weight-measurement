const Decoder = require('./enless-lorawan-codec-1.0.5/package/index.js').Decoder;
const SENSOR_TYPE = '600-035';

// Decodes the payload into the result object.
function decodePayload(payload) {
    const dec = new Decoder(SENSOR_TYPE);
    const asciiData = Buffer.from(payload, 'base64').toString('hex');

    return dec.decode(asciiData).result
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

const payload = 'AC/3DVIJFNIAAAAA';

// Creates an object with all the device info we need.
function getInfo(object) {
    const payload = object.PayloadData;

    return {
        weight: getWeight(getMilliamps(payload)),
        battery: getBattery(payload),
        devEui: object.WirelessMetadata.LoRaWAN.DevEui,
        deviceId: object.WirelessDeviceId,
        timestamp: object.WirelessMetadata.LoRaWAN.Timestamp,
    };
}

console.log(getInfo(
    {
        "MessageId": "d1c8afe5-ff8e-4266-899c-d7751134675c",
        "WirelessDeviceId": "f6befa53-f65a-4bfd-9a85-e35963d74286",
        "PayloadData": "AC/3DVIJFNIAAAAA",
        "WirelessMetadata": {
            "LoRaWAN": {
                "ADR": true,
                "Bandwidth": 125,
                "ClassB": false,
                "CodeRate": "4/5",
                "DataRate": "5",
                "DevAddr": "00abe02d",
                "DevEui": "70b3d54fd0002ff7",
                "FCnt": 84,
                "FOptLen": 0,
                "FPort": 1,
                "Frequency": "868100000",
                "Gateways": [
                    {
                        "GatewayEui": "a84041ffff21af78",
                        "Rssi": -105,
                        "Snr": 8.75
                    }
                ],
                "MIC": "2f28aa1d",
                "MType": "UnconfirmedDataUp",
                "Major": "LoRaWANR1",
                "Modulation": "LORA",
                "PolarizationInversion": false,
                "SpreadingFactor": 7,
                "Timestamp": "2023-06-21T06:30:05Z"
            }
        }
    }
));
