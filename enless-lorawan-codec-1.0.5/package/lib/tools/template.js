const parsers = require("./parsers");

class Template {
    constructor(name = "") {
        this.name = name;
        this.template = {
            id: new TemplatedValue(0, 6, parsers.hexToUInt),
            type: new TemplatedValue(6, 2, parsers.hexToUInt),
            seq_counter: new TemplatedValue(8, 2, parsers.hexToUInt),
            fw_version: new TemplatedValue(10, 2, parsers.hexToFwVerison),
            values: [],
            alarm_status: {},
            states: [],
        };
        this.supportedFields = Object.keys(this.template);
    }

    setField(field, value) {
        if (this.supportedFields.includes(field) && value instanceof TemplatedValue) {
            this.template[field] = value;
        } else {
            console.log(`Field: ${field} is invalid or the inserted value is not of required type.`);
        }
    }

    addValueField(valueDefinition) {
        this.template.values.push(valueDefinition);
    }
    addStateField(stateDefinition) {
        this.template.states.push(stateDefinition);
    }

    fill(data) {
        if(!Boolean(data.match(/^[0-9a-f]+$/i))){
            return{
                result: null,
                error: "Invalid payload. Only hexadecimal digits are allowed."
            };
        }
        const filledTemplate = {};

        const parseField = (field) => {
            if (typeof field === "object" && !(field instanceof TemplatedValue)) {
                let completeField = { ...field };
                for (const key in field) {
                    completeField[key] = parseField(field[key]);
                }
                return completeField;
            } else if (field instanceof TemplatedValue) {
                const evalutedTemplateValue = field.evaluate(data);

                if (evalutedTemplateValue.error) throw new Error("invalid template");
                else return evalutedTemplateValue.result;
            } else {
                return field;
            }
        };

        try {
            for (const field in this.template) {
                if (Array.isArray(this.template[field])) {
                    filledTemplate[field] = [];

                    this.template[field].forEach((arrField) => {
                        filledTemplate[field] = { ...filledTemplate[field], ...parseField(arrField) };
                    });
                } else {
                    filledTemplate[field] = parseField(this.template[field]);
                }
            }

            if (this.name) filledTemplate.type += " - " + this.name;
            return {
                result: filledTemplate,
                error: null,
            };
        } catch (e) {
            return {
                result: null,
                error: e.message,
            };
        }
    }
}

class TemplatedValue {
    constructor(start, len, parser) {
        this.start = start;
        this.len = len;
        this.parser = parser;
    }

    evaluate(hex) {
        if (isFinite(this.start) && isFinite(this.len) && this.len > 0 && this.parser && typeof this.parser === "function") {
            const dataForParser = hex.substr(this.start, this.len);
            return {
                result: this.parser(dataForParser),
                error: null,
            };
        } else {
            return {
                result: null,
                error: "Invalid templated value. Value could not be evaluated",
            };
        }
    }
}

exports.default = {
    create: (name) => new Template(name),
    templatedValue: (start, len, parser) => new TemplatedValue(start, len, parser),
    fields: {
        ID: "id",
        TYPE: "type",
        SEQ_NUMBER: "seq_number",
        METADATA: "metadata",
        ALARM_STATUS: "alarm_status",
        STATUS: "status",
    },
};
