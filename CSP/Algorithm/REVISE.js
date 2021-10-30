/**
 * REVISE algorithm to adjust the domain of a variable based on a constraint arc.
 * Will modify the source variable's domain
 *
 * Implementation (c) 2017 Marco Köpcke, Tim Beier
 *
 * @param {VariableCollection} vars  - All Variables that are part of the CSP | Will be modified IN PLACE
 * @param {Arc} arc                  - The constraint Arc to apply
 *
 * @returns {boolean}                - Whether or not the domain of the source variable was changed
 */
function revise(vars, arc) {
    const   vI = arc.source,
            vJ = arc.target;
    // DELETE <- false;
    let del = false;
    //for each X in Di do
    vars.getByName(vI).domain = vars.getByName(vI).domain.filter(x => {
        //if there is no such Y in Dj such that (X,Y) is consistent, then
        if(vars.getByName(vJ).domain.filter(y => arc.constraint(x,y)).length === 0) {
            //DELETE <- true;
            del = true;
            //delete X from Di;
            return false;
        } //endif;
        return true;
    }); //endfor;
    //return DELETE;
    return del;
}

module.exports = revise;