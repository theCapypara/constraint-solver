const VariableCollection = require('./CSP/VariableCollection');
const HiddenVariableEncoder = require('./CSP/HiddenVariableEncoder');
const util = require('./CSP/util');
const nc = require('./CSP/Algorithm/NC');
const ac3la = require('./CSP/Algorithm/AC3LA');
const ac3 = require('./CSP/Algorithm/AC3');

/**
 * Constraint solver written in JavaScript
 * (c) 2017 Marco Köpcke, Tim Beier
 */
class CSP {
    constructor() {
        /**
         * Collection of variables
         * @type {VariableCollection}
         */
        this.variables = new VariableCollection();

        /**
         * List of constraints
         * Each entry has the format
         * @type {Constraint[]}
         */
        this.constraints = [];

        /**
         * Constraint arcs built by buildGraph()
         * @type {Arc[]}
         */
        this.constraintArcs = [];

        /**
         * Constraints with one variable
         * Built by buildGraph()
         * @type {Constraint[]}
         */
        this.unaryConstraints = [];

        /**
         * If changed flag is true, solve-graph has to be rebuilt.
         * @type {boolean}
         */
        this.changed = true;
    }

    /* PUBLIC */
    /**
     * Add a variable to the problem
     * @param {String}      name        Name of the variable
     * @param {Array}       domain      Domain (possible values)
     */
    addVariable(name, domain) {
        this.variables.add({name: name, domain: domain, hidden: false});
        this.changed = true;
    }
    /**
     * Add a constraint to this problem
     * @param {Array}       variables     Array containing all variables for this problem
     * @param {Function}    func          Function that checks the constraint for all variables in this constraint
     */
    addConstraint(variables, func) {
        // First check if all variables are valid
        variables.forEach(variable => {
            if (!this.variableExists(variable)) {
                throw new Error("Invalid variable for constraint: " + variable);
            }
        });
        this.constraints.push({variables: variables, func: func});
        this.changed = true;

    }

    /**
     * Convert the graph behind this problem into a GraphViz DOT-Graph file.
     * @param {String} outputPath
     */
    writeGraph(outputPath) {
        this.buildGraph();

        let outputString = "digraph csp {\n";
        this.constraintArcs.forEach((arc) => {
            if (!arc.ignoreInPrint) {
                outputString += `"${arc.source}" -> "${arc.target}" [label="${util.functionToString(arc.constraint)}"]\n`;
            }
        });
        outputString += "}";
        require('fs').writeFileSync(outputPath, outputString);

    }

    /**
     * Solve this CSP using NC and AC3-LA and return the result.
     */
    solve() {
        this.buildGraph();

        let vars = new VariableCollection(this.variables);

        // NC zuerst um die unären Constraints anzuwenden
        nc(vars, this.unaryConstraints);

        // AC3
        ac3(vars, this.constraintArcs);

        // BACKTRACKING UMS AC3 -- Nachteil davon kein Prolog zu verwenden :(
        let previousIndexToTry = [],
            backups = [],
            indexToTry = 0,
            consistent;

        for (let i = 0; i < vars.getAllAsArray().length; i++) {
            // Backup
            backups.push(new VariableCollection(vars));

            // Probiere Wert aus
            vars.getById(i).domain = [vars.getById(i).domain[indexToTry]];

            consistent = ac3la(vars, i, this.constraintArcs);

            if (!consistent){
                // Setze zurück! BACKTRACKING
                ++indexToTry;
                vars = backups.pop();
                if (indexToTry >= vars.getById(i).domain.length) {
                    // Haben alle Inidcies ausprobiert... Fehler muss weiter oben liegen.
                    // Also: Noch weiter zurück! Wir probieren die vorherige Variable aus!
                    vars = backups.pop();
                    indexToTry = previousIndexToTry.pop() + 1;
                    --i; // Zähle i NOCH eins runter, um einen Schritt ZURÜCK zu gehen
                }
                --i; // Zähle i eins runter um den aktuellen Iterationsschritt zu wiederholen
                if (i < -1) {
                    // Jetzt versuchen wir ins Negative zu backtracken... kann nicht sein!
                    throw new Error("Constraint not solvable");
                }
            } else {
                previousIndexToTry.push(indexToTry);
                indexToTry = 0;
            }
        }

        vars.removeHidden();
        return vars.getAllAsMap();
    }

    /* PRIVATE */
    /**
     * Check if a given variable exists
     * @param {String} variableName
     * @private
     */
    variableExists(variableName) {
        // noinspection EqualityComparisonWithCoercionJS
        return this.variables.getByName(variableName) != null;
    }

    /**
     * Build a graph solvable by AC3-LA (solve-graph), that means
     * a graph containing only unary and binary constraints
     *
     * Only build if changed flag is true.
     * Sets changed flag to false.
     * @private
     */
    buildGraph() {
        if (!this.changed) {
            return;
        }
        // Arcs zurücksetzen
        this.constraintArcs = [];
        this.unaryConstraints = [];
        this.variables.removeHidden();
        // Adde alle Arcs pro Constraint
        this.constraints.forEach(constraint => {
            this.addArcsFor(constraint);
        });

        this.changed = false;
    }

    /**
     * Add arcs for the given contraints
     * @param {Constraint} constraint
     * @private
     */
    addArcsFor(constraint) {
        if (constraint.variables.length < 2) {
            // Ist unär (oder leer)
            // Wird im Graphen ignoriert...
            // aber dafür extra getracked!
            this.unaryConstraints.push(constraint);
        } else if (constraint.variables.length === 2) {
            // Ist binär
            this.constraintArcs.push({
                constraint: constraint.func,
                ignoreInPrint: false,
                source: constraint.variables[0],
                target: constraint.variables[1]
            });
            // "Gegenkante", wird nicht bei writeGraph ausgegeben
            this.constraintArcs.push({
                constraint: (b,a) => constraint.func(a, b),
                ignoreInPrint: true,
                source: constraint.variables[1],
                target: constraint.variables[0]
            });

        } else {
            // Oh oh... Zeit zum binärisieren
            // Strategie: Hidden Variable Encoding
            const encoder = new HiddenVariableEncoder(constraint, this.variables);
            this.constraintArcs = [...this.constraintArcs, ...encoder.getArcs()];
            this.variables.addAll(encoder.getVariables());
        }
    }
}

module.exports = CSP;