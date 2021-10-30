/**
 * Sehr einfaches Problem
 * zum testen des Contraint Solvers
 * (c) 2017 Marco Köpcke, Tim Beier
 */
const CSP = require('./CSP');

const problem = new CSP();

const vars = ["X","Y","Z","Q"];
const numbers = [1,2,3,4];
vars.forEach((variable) => problem.addVariable(variable, numbers));

problem.addConstraint(vars, require('./einsteinConstraintClasses').allDifferent);
problem.addConstraint(["X","Y"], (X, Y) => Y === 2*X);
problem.addConstraint(["X","Y"], (X, Y) => X + Y < 4);
problem.addConstraint(["Z","Y"], (Z, Y) => Z === Y*2);
problem.addConstraint(["X","Z"], (X, Z) => X === Z/4);
problem.addConstraint(["Q","X","Y"], (Q, X, Y) => Q === X + Y);

problem.writeGraph("generatedGraph.dot");

console.log(problem.solve());