/**
 * Einsten Problem in JavaScript
 * (c) 2017 Marco Köpcke, Tim Beier
 */
const CSP = require('./CSP');
const c = require('./einsteinConstraintClasses');
const timeBefore = new Date().getTime();

const problem = new CSP();

// Variablen
const nationalitaeten = ["Brite", "Schwede", "Däne", "Norweger", "Deutscher"];
const farben = ["rot", "grün", "weiß", "blau", "gelb"];
const getraenke = ["Tee", "Kaffee", "Milch", "Bier", "Wasser"];
const zigaretten = ["Pall Mall", "Dunhill", "Malboro", "Winfield", "Rothmanns"];
const tiere = ["Hund", "Vogel", "Pferd", "Katze", "Fisch"];

// Domäne für alle Variablen
const haueser = [1, 2, 3, 4, 5];

// Variablen mit Domänen hinzufügen
nationalitaeten.forEach((variable) => problem.addVariable(variable, haueser));
farben.forEach(         (variable) => problem.addVariable(variable, haueser));
getraenke.forEach(      (variable) => problem.addVariable(variable, haueser));
zigaretten.forEach(     (variable) => problem.addVariable(variable, haueser));
tiere.forEach(          (variable) => problem.addVariable(variable, haueser));

// All-Different "Basis"-Contraints nicht vergessen! Das Rätsel impliziert ja je Haus nur eine Sache von jedem Typ!
problem.addConstraint(nationalitaeten, c.allDifferent);
problem.addConstraint(farben, c.allDifferent);
problem.addConstraint(getraenke, c.allDifferent);
problem.addConstraint(zigaretten, c.allDifferent);
problem.addConstraint(tiere, c.allDifferent);

// Constraints aus dem Rätsel
// 1.
problem.addConstraint(["Brite", "rot"],           c.equal);
/problem.addConstraint(["Schwede", "Hund"],        c.equal);
problem.addConstraint(["Däne", "Tee"],            c.equal);
problem.addConstraint(["grün", "weiß"],           c.leftTo);
problem.addConstraint(["grün", "Kaffee"],         c.equal);
// 6.
problem.addConstraint(["Pall Mall", "Vogel"],     c.equal);
problem.addConstraint(["Milch"],                  milch => milch === 3);
problem.addConstraint(["gelb", "Dunhill"],        c.equal);
problem.addConstraint(["Norweger"],               norweger => norweger === 1);
problem.addConstraint(["Malboro", "Katze"],       c.nextTo);
// 11.
problem.addConstraint(["Pferd", "Dunhill"],       c.nextTo);
problem.addConstraint(["Winfield", "Bier"],       c.equal);
problem.addConstraint(["Norweger", "blau"],       c.nextTo);
problem.addConstraint(["Deutscher", "Rothmanns"], c.equal);
problem.addConstraint(["Malboro", "Wasser"],      c.nextTo);

// Ausgabe als Graph in Datei
const timeBeforeGraph = new Date().getTime();
problem.writeGraph("generatedGraph.dot");

// Ausgabe der Lösung
try {
    const timeBeforeSolve = new Date().getTime();
    const solution = problem.solve();
    const timeAfter = new Date().getTime();
    console.log(solution);
    console.log(`Der Fisch lebt in Haus ${solution.Fisch.domain[0]}.`);
    console.log(`Zeit zur Beschreibung des CSP: ${timeBeforeGraph-timeBefore}ms.`);
    console.log(`Zeit zur Erstellung des Constraint-Graphen: ${timeBeforeSolve-timeBeforeGraph}ms.`);
    console.log(`Zeit zur Lösung: ${timeAfter-timeBeforeSolve}ms.`);
} catch(err) {
    console.error("Fehler beim Lösen!");
    console.error(err);
}