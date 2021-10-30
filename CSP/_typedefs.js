/**
 * @typedef {Object} Variable
 *
 * CSP variable
 *
 * @property {String} name  - Name of the variable representing this node
 * @property {Array} domain - Domain of the variable representing this node
 * @property {boolean} hidden - Hidden or temporary variable
 *
 */

/**
 * @typedef {Object} Constraint
 *
 * CSP constraint
 *
 * @property {Variable[]} variables  - List of variables
 * @property {Function}   func       - Function that represents this constraint
 *
 */

/**
 * @typedef {Object} Arc
 *
 * Constraint Graph arc
 *
 * @property {Function} constraint - Function representing the constraint behind this edge
 * @property {String}   source      - Source node name
 * @property {String}   target      - Target node name
 * @property {Boolean}  ignoreInPrint - If true, will not be print by writeGraph.
 */