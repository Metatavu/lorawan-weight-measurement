const Device = require("./device/device").default;
const template = require("./../../tools/template").default;
const parsers = require("./../../tools/parsers");

class D600_034 extends Device {
    constructor() {
        super("TX T&H EXT");

        this.PAYLOAD_LENGTH = 28;

        this.template.addValueField({
            temperature: {
                unit: "°C",
                value: template.templatedValue(12, 4, (hex) => parsers.hexToInt(hex, 10)),
            },
        });
        this.template.addValueField({
            humidity: {
                unit: "%",
                value: template.templatedValue(16, 4, (hex) => parsers.hexToUInt(hex, 10)),
            },
        });

        this.template.setField(template.fields.ALARM_STATUS, template.templatedValue(20, 4, this.alarmParser));

        this.template.addStateField({
            battery: template.templatedValue(24, 4, parsers.hexToBatteryLvl),
        });
        this.template.addStateField({
            msg_type: template.templatedValue(24, 4, parsers.hexToMsgType)
        });
    }

    alarmParser(hexValue) {
        const defs = [
            { name: "temperature", values: [{ high: false }, { high: true }], bit: 1 },
            { name: "temperature", values: [{ low: false }, { low: true }], bit: 2 },
            { name: "humidity", values: [{ high: false }, { high: true }], bit: 3 },
            { name: "humidity", values: [{ low: false }, { low: true }], bit: 4 },
        ];

        return parsers.hexToStatus(hexValue, defs);
    }

    decode(payload) {
        return super.decode(payload, this.PAYLOAD_LENGTH);
    }
}

exports.device = D600_034;
