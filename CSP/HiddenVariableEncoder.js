const util = require('./util');
const VariableCollection = require('./VariableCollection');
/**
 * Implementation of the Hidden Variable Encoding for CSPs.
 * (c) 2017 Marco Köpcke, Tim Beier
 */
class HiddenVariableEncoder {

    /**
     * Constructor.
     * @param {Constraint} constraint
     * @param {VariableCollection} variables
     */
    constructor(constraint, variables) {
        /**
         * Arcs generated for this constraint
         * @type {Arc[]}
         */
        this.arcs = [];

        /**
         * Hidden variables that were generate
         * @tyoe {VariableCollection}
         */
        this.variables = new VariableCollection();

        /**
         * Original variables in the CSP, used for look up
         */
        this.originalVariables = variables;

        this.build(constraint);
    }

    /**
     * Convert to Binary a constraint via Hidden Variable Encoding
     * @param {Constraint} constraint - Original constraint
     */
    build(constraint) {
        const newHiddenVariable = {
            name: `HV${HiddenVariableEncoder.instanceCounter++}->${util.functionToString(constraint.func)}`,
            domain: this.generateDomain(constraint),
            hidden: true
        };
        this.variables.add(newHiddenVariable);

        let n = 0;
        constraint.variables.forEach(variable => {
            let i = n;
            this.arcs.push({
                constraint: util.namedConstraint((a, b) => HiddenVariableEncoder.argumentAt(a, i, b), `isIth(${i})`),
                ignoreInPrint: false,
                source: variable,
                target: newHiddenVariable.name
            });
            // "Gegenkante", wird nicht bei writeGraph ausgegeben
            this.arcs.push({
                constraint: (b, a) => HiddenVariableEncoder.argumentAt(a, i, b),
                ignoreInPrint: true,
                source: newHiddenVariable.name,
                target: variable
            });
            n++;
        });
    }

    getArcs() {
        return this.arcs;
    }

    getVariables() {
        return this.variables;
    }

    /**
     * Calculate the domain for a hidden variable.
     *
     * Example:
     * D1=[1,2]
     * D2=[3,4]
     * D3=[5,6]
     * Original Constraint function: V1 + V2 = V3
     *
     * Dhve=[(1,4,5),(2,3,5),(2,4,6)]
     *
     * @param {Constraint} constraint
     * @returns {Array}
     * @private
     */
    generateDomain(constraint) {
        // Probiere alle denkbaren Kombinationen aus, und wenn sie funktionierne füge das Lösungs-Tupel (=Array)
        // zu den möglichen Kombinatioenn hinzu und returne sie
        return this.findAllCombinations(constraint.variables, 0).filter(e => constraint.func(...e));
    }

    /**
     * Finds all possible domain configurations.
     * Example:
     * D1=[1,2]
     * D2=[3,4]
     * D3=[5,6]
     *
     * Derg=[(1,3,5),(2,3,5),(1,3,5),(2,4,5)...]
     *
     * @param vars
     * @param currentIndex
     * @returns {Array}
     *
     *
     * TODO Nicht wirklich effizienter Algorithmus..
     * @private
     */
    findAllCombinations(vars, currentIndex) {
        let nextIndex = currentIndex + 1;
        const currentVar = this.originalVariables.getByName([vars[currentIndex]]);
        if (vars.length <= nextIndex) {
            // There is no next variable to cross check for, return all possibilities for this variable
            return currentVar.domain;
        }

        let allCombinations = [];
        currentVar.domain.forEach(value => {
            this.findAllCombinations(vars, nextIndex).forEach(childPossibilities => {
                allCombinations.push([value].concat(childPossibilities));
            });
        });
        return allCombinations;
    }

    /**
     * CONSTRAINT
     * Hidden Variable Encoding "position of X within U" constraint
     * @private
     */
    static argumentAt(X, i, U) {
        return U[i] === X;
    }

}
HiddenVariableEncoder.instanceCounter = 0;

module.exports = HiddenVariableEncoder;