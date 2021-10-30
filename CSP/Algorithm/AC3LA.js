const revise = require('./REVISE');

/**
 * AC3 Algorithm with Look-Ahead for the Constraint Solver
 * Implementation (c) 2017 Marco Köpcke, Tim Beier
 *
 * @param {VariableCollection} vars     - All Variables that are part of the CSP | Will be modified IN PLACE
 * @param {int} cv                      - The index of the current variable
 * @param {Arc[]} arcs                  - A list of all binary constraint arcs in the CSP
 *
 * @returns {boolean}                   - Whether or not this run of the AC3LA could produce a consistent output
 */
function ac3la(vars, cv, arcs) {
    // 1. Hole alle Arcs, die die Variable am Index cv als Ziel haben und eine Variable nach cv als Quelle
    //Q <- {(Vi,Vcv) in arcs(G),i>cv};
    let Q = arcs.filter(arc => vars.indexOfByName(arc.source) > cv && arc.target === vars.getById(cv).name);
    //consistent <- true;
    let currentArc,
        consistent = true;
    // 2. Solange bis keine Arcs mehr übrig sind oder eine Inkonsistenz festgestellt wurde
    //while not Q empty & consistent
    while (Q.length > 0 && consistent) {
        //select and delete any arc (Vk,Vm) from Q;
        currentArc = Q.pop();
        // 3. Revise passt die Domäne der Quellvariable der aktuellen Arc anhand des Constraints an
        //if REVISE(Vk,Vm) then
        if (revise(vars, currentArc)) {
            // 4. Füge alle Arcs zu Q hinzu, die die aktuelle Quellvariable als Ziel haben und die als Quelle keine Variable im aktuellen Arc hat
            //    UND dessen Index größer ist als cv.
            //    Q <- Q union {(Vi,Vk) such that (Vi,Vk) in arcs(G),i#k,i#m,i>cv}
            Q = Array.from(new Set([...Q,
                ...arcs.filter(arc =>
                    arc.target === currentArc.source
                    && arc.source !== currentArc.source
                    && arc.source !== currentArc.target
                    && vars.indexOfByName(arc.source) > cv
                )]));
            //    consistent <- not Dk empty
            // 5. Falls die aktuelle Quellvariable jetzt keine Einträge mehr in der Domäne hat: Inkonsistenz!
            consistent = vars.getByName(currentArc.source).domain.length !== 0;
        } //endif
    } //endwhile
    //return consistent
    return consistent;
}

module.exports = ac3la;