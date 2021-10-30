/**
 * Utility functions for the Constraint solver
 * (c) 2017 Marco Köpcke, Tim Beier
 */
const util = {
    /**
     * Gives the provided function a name for functionToString and returns it
     * @param func
     * @param name
     */
    namedConstraint(func, name) {
        func.internalName = name;
        return func;
    },

    /**
     * Not prettry, but works
     * @param func
     */
    functionToString(func) {
        // Entweder name der funktion, oder falls anonym, die Signatur
        if (func.internalName) return func.internalName;
        if (func.name) return func.name;
        return func.toString().match(/(?:function )?(\(.*\)).*/)[1];
    }
};

module.exports = util;