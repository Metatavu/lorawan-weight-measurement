const Device = require("./device/device").default;
const template = require("./../../tools/template").default;
const parsers = require("./../../tools/parsers");

class D600_033 extends Device {
    constructor() {
        super("TX TEMP CONT1 MP");

        this.PAYLOAD_LENGTH = 28;

        this.template.addValueField({
            "temperature_1": {
                unit: "°C",
                value: template.templatedValue(12, 4, (hex) => parsers.hexToInt(hex, 10)),
            },
        });
        this.template.addValueField({
            "temperature_2": {
                unit: "°C",
                value: template.templatedValue(16, 4, (hex) => parsers.hexToInt(hex, 10)),
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
            { name: "temperature_1", values: [{ high: false }, { high: true }], bit: 1 },
            { name: "temperature_1", values: [{ low: false }, { low: true }], bit: 2 },
        ];

        return parsers.hexToStatus(hexValue, defs);
    }

    decode(payload) {
        return super.decode(payload, this.PAYLOAD_LENGTH);
    }
}

exports.device = D600_033;
