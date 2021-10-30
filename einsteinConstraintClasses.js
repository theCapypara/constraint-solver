/**
 * Constraintklassen für das Einsteinrätsel
 */
const einsteinConstraintClasses = {
    // -- All different --
    allDifferent(...variables) {
        // In eine Menge umwandeln um Duplikate heraus zu filtern und gucken ob noch alles drin ist
        return (new Set(variables)).size === variables.length;
    },

    // -- Binäre --
    nextTo(a, b) {
        return Math.abs(a - b) === 1;
    },
    leftOf(a, b) {
        return a < b;
    },
    leftTo(a, b) {
        return einsteinConstraintClasses.leftOf(a, b) && einsteinConstraintClasses.nextTo(a, b);
    },
    equal(a, b) {
        return a === b;
    }

    // -- Unäre --
    // sind direkt in einstein.js
};

module.exports = einsteinConstraintClasses;