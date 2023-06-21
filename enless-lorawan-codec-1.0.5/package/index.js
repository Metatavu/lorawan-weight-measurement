const devices = require("./lib/devices/devices");

class Decoder {
    constructor(type) {
        this.type = type;
        this.device = devices.initialize(type);
    }

    decode(payload) {
        if (this.device && (typeof payload === "string" || payload instanceof String)) {
            return this.device.decode(payload);
        } else if (!this.device) {
            return {
                result: null,
                error: `No decoder found for type: ${this.type}`,
            };
        } else {
            return {
                result: null,
                error: "Unsupported paylod type",
            };
        }
    }
}

exports.Decoder = Decoder;
