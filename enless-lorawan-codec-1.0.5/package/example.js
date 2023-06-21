const codec = require("./index");

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
