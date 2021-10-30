/**
 * Two+Two=Four Problem in JavaScript
 * zum testen des Contraint Solvers
 * (c) 2017 Marco Köpcke, Tim Beier
 */
const CSP = require('./CSP');
const timeBefore = new Date().getTime();

const problem = new CSP();

const vars = ["T","W","O","F","U","R"];
const numbers = [1,2,3,4,5,6,7,8,9];
vars.forEach((variable) => problem.addVariable(variable, numbers));
problem.addVariable("C10", [0,1]);
problem.addVariable("C100", [0,1]);
problem.addVariable("C1000", [0,1]);

/*
   T W O
 + T W O
   -----
 F O U R
 */

problem.addConstraint(vars, require('./einsteinConstraintClasses').allDifferent);
problem.addConstraint(["O","R","C10"], (O, R, C10)                  => O + O === R + 10 * C10);
problem.addConstraint(["C10","W","U", "C100"], (C10, W, U, C100)    => C10 + W + W === U + 10 * C100);
problem.addConstraint(["C100","T","O", "C1000"], (C100, T, O, C1000)=> C100 + T + T === O + 10 * C1000);
problem.addConstraint(["C1000", "F"], (C1000, F)                    => C1000 === F);

const timeBeforeGraph = new Date().getTime();
problem.writeGraph('./generatedGraph.dot');

const timeBeforeSolve = new Date().getTime();
console.log(problem.solve());
const timeAfter = new Date().getTime();
console.log(`Zeit zur Beschreibung des CSP: ${timeBeforeGraph-timeBefore}ms.`);
console.log(`Zeit zur Erstellung des Constraint-Graphen: ${timeBeforeSolve-timeBeforeGraph}ms.`);
console.log(`Zeit zur Lösung: ${timeAfter-timeBeforeSolve}ms.`);