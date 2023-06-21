Enless LoRaWAN payload decoder. This decoder version supports the following types of devices:

* 600-021 (TX T&H AMB)
* 600-022 (TX VOC/T&H AMB)
* 600-023 (TX CO2/VOC/T&H AMB)
* 600-024 (TX CO2/T&H AMB)
* 600-031 (TX TEMP INS)
* 600-032 (TX TEMP CONT1)
* 600-033 (TX TEMP CONT1 MP)
* 600-034 (TX T&H EXT)
* 600-035 (TX 4/20mA)
* 600-036 (TX PULSE)
* 600-037 (TX PULSE ATEX)
* 600-038 (TX PULSE LED)
* 600-039 (TX CONTACT)
* 600-232 (TX TEMP CONT2)
* 600-233 (TX TEMP CONT2 MP)

Example of use:

```javascript
const codec = require("enless-lorawan-codec");

//Sensor definition
const sensorType = "600-033";
const payload = "0000DC100A0100D0000000000000";

// Decoder initialization for required sensor type
const Decoder = new codec.Decoder(sensorType);

// Decode payload
const decodedPayload = Decoder.decode(payload);

// Reasult checking and processing
if (decodedPayload.error) {
    // something went wrong
    console.log("Error: ", decodedPayload.error);
} else {
    // Payload was successfully proccessed.
    const jsonOutput = JSON.stringify(decodedPayload.result);
    // Do another stuff with  the result here ....
    console.log("============= RESULT ===========");
    console.log(jsonOutput);
    console.log("================================");
}
```