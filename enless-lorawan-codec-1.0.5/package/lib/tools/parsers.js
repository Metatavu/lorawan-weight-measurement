const consts = require("./constants");

exports.hexToUInt = (hex, divider = 1) => {
    return parseInt(hex, 16) / divider;
};

exports.hexToInt = (hex, divider = 1) => {
    const upperHex = hex.toUpperCase();

    if (upperHex >= "8000" && upperHex <= "FFFF") {
        return (parseInt(hex, 16) - consts.INT_MAX - 1) / divider;
    } else {
        return parseInt(hex, 16) / divider;
    }
};

exports.hexToBin = (hex, numOfBytes = 2) => {
    return parseInt(hex, 16)
        .toString(2)
        .padStart(numOfBytes * 4, "0");
};

exports.binToUInt = (bin) => {
    return parseInt(bin, 2);
};

exports.hexToFwVerison = (hex) => {
    const binNum = exports.hexToBin(hex);
    return exports.binToUInt(binNum.substring(binNum.length - 4, binNum.length));
};

exports.hexToStatus = (hex, defs) => {
    const status = {};
    const binNum = exports.hexToBin(hex, 4);

    defs.forEach((def) => {
        const bitValue = +binNum[binNum.length - def.bit];
        const textValue = def.values[bitValue];
        if (status.hasOwnProperty(def.name)) {
            status[def.name] = { ...status[def.name], ...textValue };
        } else {
            status[def.name] = textValue;
        }
    });
    return status;
};

exports.hexToBatteryLvl = (hex, startBit = 4, endBit = 2) => {
    const binNum = exports.hexToBin(hex, 4);
    const batteryCode = binNum.substring(binNum.length - startBit, binNum.length - endBit);

    switch (batteryCode) {
        case "00":
            return "100%";
        case "01":
            return "75%";
        case "10":
            return "50%";
        case "11":
            return "25%";
        default:
            return "unknown";
    }
};

exports.hexToMsgType = (hex, bit = 1) => {
    const binNum = exports.hexToBin(hex, 4);
    const bitValue = +binNum[binNum.length - bit];
    if(bitValue) return "alarm";
    else return "normal";
};
