/* 
 * bin_arith.js
 * Bill Xia
 * 12/23/22
 * 
 * Purpose: A suite of functions that performs BitCalc operations on binary
 *          arrays.
 */

function Binary_add(first, second, size)
{
    var sumArray = new Array(64).fill(0);
    var sum = 0;
    for (let i = 0; i < size; i++) {

        sum = first[i] + second[i] + sumArray[i];

        if (sum === 1) {
            sumArray[i] = 1;
        } 

        /*
         * If the sum exceeds 1 and we aren't at the end of the array, carry
         * a 1 over and proceed as normal. If the loop has reached the end of
         * the array, then a roll-over occurs.
         */
        else if ((sum === 2) || (sum === 3)) {
            sumArray[i] = sum - 2;
            if (i !== size - 1) {
                sumArray[i+1] = 1;
            }
        }

    }

    return sumArray;
}

export {Binary_add};
