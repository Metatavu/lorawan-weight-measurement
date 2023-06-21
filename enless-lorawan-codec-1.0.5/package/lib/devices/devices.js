
const devices = {
    "600-021": require("./types/600-021"),
    "600-022": require("./types/600-022"),
    "600-023": require("./types/600-023"),
    "600-024": require("./types/600-024"),
    "600-031": require("./types/600-031"),
    "600-032": require("./types/600-032"),
    "600-033": require("./types/600-033"),
    "600-034": require("./types/600-034"),
    "600-035": require("./types/600-035"),
    "600-036": require("./types/600-036"),
    "600-037": require("./types/600-037"),
    "600-038": require("./types/600-038"),
    "600-039": require("./types/600-039"),
    "600-232": require("./types/600-232"),
    "600-233": require("./types/600-233")
};


exports.initialize = (type) => {
    try {
        //const devicePath = "./types/" + type + ".js";
        //const deviceModule = require(devicePath); // for NodeJs
        const deviceModule = devices[type]; //For browser - not support dynamic require
        return new deviceModule.device();
    } catch (e) {
        //console.log("This device type is not supported", e);
        return null;
    }
};
