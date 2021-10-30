/**
 * Apply NC algorithm using the unary constraints provided
 * Implementation (c) 2017 Marco Köpcke, Tim Beier
 *
 * @param {VariableCollection} variables        - All Variables that are part of the CSP | Will be modified IN PLACE
 * @param {Constraint[]} unaryConstraints       - A list of unary constraints in the CSP
 */
function nc(variables, unaryConstraints) {
    // Hole alle Variablen
    for (const variable of variables) {
        // Für alle Varablen, gehe alle unären Constraints durch
        unaryConstraints.forEach(c => {
            // Falls die aktuelle Variable für das aktuelle Constraint gilt...
            if (c.variables.indexOf(variable.name) !== -1) {
                // ...wende es an
                variable.domain = variable.domain.filter(c.func);
            }
        });
    }
}

module.exports = nc;