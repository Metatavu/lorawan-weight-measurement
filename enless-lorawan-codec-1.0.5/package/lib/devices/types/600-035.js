const Device = require("./device/device").default;
const template = require("./../../tools/template").default;
const parsers = require("./../../tools/parsers");

class D600_035 extends Device {
    constructor() {
        super("TX 4/20mA");

        this.PAYLOAD_LENGTH = 24;

        this.template.addValueField({
            current: {
                unit: "mA",
                value: template.templatedValue(12, 4, (hex) => parsers.hexToUInt(hex, 1000)),
            },
        });

        this.template.setField(template.fields.ALARM_STATUS, template.templatedValue(16, 4, this.alarmParser));

        this.template.addStateField({
            battery: template.templatedValue(20, 4, parsers.hexToBatteryLvl),
        });
        this.template.addStateField({
            msg_type: template.templatedValue(20, 4, parsers.hexToMsgType)
        });
    }

    alarmParser(hexValue) {
        const defs = [
            { name: "current", values: [{ high: false }, { high: true }], bit: 1 },
            { name: "current", values: [{ low: false }, { low: true }], bit: 2 },
        ];

        return parsers.hexToStatus(hexValue, defs);
    }

    decode(payload) {
        return super.decode(payload, this.PAYLOAD_LENGTH);
    }
}

exports.device = D600_035;
