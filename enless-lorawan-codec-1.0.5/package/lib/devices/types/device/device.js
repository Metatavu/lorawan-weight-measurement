const template = require("./../../../tools/template").default;

class Device {
    constructor(name) {
        this.name = name;
        this.template = template.create(name);
    }

    decode(payload, len) {
        if (payload.length === len) {
            return this.template.fill(payload);
        } else {
            return {
                result: null,
                error: `Invalid payload length. Received payload length: ${payload.length}. Expected payload length: ${len}`,
            };
        }
    }
}

exports.default = Device;
