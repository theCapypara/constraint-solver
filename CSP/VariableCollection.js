const deepClone = require('deep-clone');

/**
 * A ordered collection of CSP variables, indexable by name and number
 * (c) 2017 Marco Köpcke, Tim Beier
 */
class VariableCollection {
    constructor(variableCollection) {
        /**
         * Indexed list of variables
         * @type {Variable[]}
         */
        this.variablesByIdx = [];

        /**
         * Map of variables
         * @type {Object.<Variable>}
         */
        this.variablesByName = {};

        if (variableCollection) {
            // Copy constructor
            for (const variable of variableCollection) {
                this.add(deepClone(variable));
            }
        }

    }

    /**
     *
     * @param {Variable} variable
     */
    add(variable) {
        this.variablesByIdx.push(variable);
        this.variablesByName[variable.name] = variable;
    }

    addAll(iterableVariables) {
        for (const vari of iterableVariables) {
            this.add(vari);
        }
    }

    getById(index) {
        return this.variablesByIdx[index];
    }

    getByName(name) {
        return this.variablesByName[name];
    }

    get(obj) {
        return this.variablesByIdx.find(v => v === obj);
    }

    indexOf(obj) {
        return this.variablesByIdx.indexOf(obj);
    }

    indexOfByName(name) {
        return this.variablesByIdx.findIndex(v => v.name === name);
    }

    /**
     *
     * @returns {Variable[]}
     */
    getAllAsArray() {
        return this.variablesByIdx;
    }

    /**
     *
     * @returns {Object.<Variable>}
     */
    getAllAsMap() {
        return this.variablesByName;
    }

    removeHidden() {
        this.variablesByIdx = this.variablesByIdx.filter(v => !v.hidden);
        for (const idx in this.variablesByName) {
            if (this.variablesByName[idx].hidden) {
                delete this.variablesByName[idx];
            }
        }
    }

    [Symbol.iterator]() {
        return this.variablesByIdx[Symbol.iterator]();
    }
}

module.exports = VariableCollection;