const Device = require("./device/device").default;
const template = require("./../../tools/template").default;
const parsers = require("./../../tools/parsers");

class D600_037 extends Device {
    constructor() {
        super("TX PULSE ATEX");

        this.PAYLOAD_LENGTH = 44;

        this.template.addValueField({
            "pulse_ch1": {
                unit: "count",
                value: template.templatedValue(12, 8, parsers.hexToUInt),
            },
        });
        this.template.addValueField({
            "pulse_ch2": {
                unit: "count",
                value: template.templatedValue(20, 8, parsers.hexToUInt),
            },
        });
        this.template.addValueField({
            "pulse_oc": {
                unit: "count",
                value: template.templatedValue(28, 8, parsers.hexToUInt),
            },
        });

        this.template.setField(template.fields.ALARM_STATUS, template.templatedValue(36, 4, this.alarmParser));

        this.template.addStateField({
            battery: template.templatedValue(40, 4, parsers.hexToBatteryLvl),
        });
        this.template.addStateField(template.templatedValue(40, 4, this.stateParser));
    }

    alarmParser(hexValue) {
        const defs = [
            { name: "pulse_ch1_flow", values: [{ high: false }, { high: true }], bit: 1 },
            { name: "pulse_ch2_flow", values: [{ high: false }, { high: true }], bit: 2 },
            { name: "pulse_oc_flow", values: [{ high: false }, { high: true }], bit: 3 },
            { name: "pulse_ch1_flow", values: [{ low: false }, { low: true }], bit: 5 },
            { name: "pulse_ch2_flow", values: [{ low: false }, { low: true }], bit: 6 },
            { name: "pulse_oc_flow", values: [{ low: false }, { low: true }], bit: 7 },
            { name: "pulse_ch1_leak", values: [false, true], bit: 9 },
            { name: "pulse_ch2_leak", values: [false, true], bit: 10 },
            { name: "pulse_oc_leak", values: [false, true], bit: 11 },
        ];

        return parsers.hexToStatus(hexValue, defs);
    }

    stateParser(hexValue) {
        const defs = [
            { name: "msg_type", values: ["normal", "alarm"], bit: 1},
            { name: "pulse_ch1", values: ["open", "closed"], bit: 5 },
            { name: "pulse_ch2", values: ["open", "closed"], bit: 6 },
            { name: "pulse_oc", values: ["open", "closed"], bit: 7 },
        ];

        return parsers.hexToStatus(hexValue, defs);
    }

    decode(payload) {
        return super.decode(payload, this.PAYLOAD_LENGTH);
    }
}

exports.device = D600_037;
