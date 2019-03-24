/**
 * @param {number} time 
 */
function wait(time) {
    return new Promise(acc => setTimeout(() => acc(), time));
}