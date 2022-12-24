/* 
 * bin_arith.js
 * Bill Xia
 * 12/23/22
 * 
 * Purpose: A suite of functions that performs BitCalc operations on binary
 *          arrays.
 */

/* ======================================================================== *\
 *  IMPORTS                                                                 *
\* ======================================================================== */

import {To_Binary} from "./convert.js";
import {Bin_To_Dec} from "./convert.js";

/* ======================================================================== *\
 *  FUNCTIONS                                                               *
\* ======================================================================== */

function Binary_add(first, second, size)
{
    // var sumArray = new Array(64).fill(0);
    // var sum = 0;
    // for (let i = 0; i < size; i++) {

    //     sum = first[i] + second[i] + sumArray[i];

    //     if (sum === 1) {
    //         sumArray[i] = 1;
    //     } 

    //     /*
    //      * If the sum exceeds 1 and we aren't at the end of the array, carry
    //      * a 1 over and proceed as normal. If the loop has reached the end of
    //      * the array, then a roll-over occurs.
    //      */
    //     else if ((sum === 2) || (sum === 3)) {
    //         sumArray[i] = sum - 2;
    //         if (i !== size - 1) {
    //             sumArray[i+1] = 1;
    //         }
    //     }

    // }

    // return sumArray;

    return To_Binary(Bin_To_Dec(first) + Bin_To_Dec(second));
}

function Binary_subtract(first, second, size)
{
    var diffArray = new Array(64).fill(0);

    if (Bin_To_Dec(first) < Bin_To_Dec(second)) {
        let temp = first;
        first = second;
        second = temp;
    }

    for (let i = 0; i < size; i++) {
        if (first[i] < second[i]) {
            first[i+1]--;
            first[i] += 2;
        }
        diffArray[i] = first[i] - second[i];
    }

    return diffArray;

    // return To_Binary(Bin_To_Dec(first) - Bin_To_Dec(second));
}

function Binary_multiply(first, second, size)
{
    return To_Binary(Bin_To_Dec(first) * Bin_To_Dec(second));
}

function Binary_divide(first, second, size)
{
    return To_Binary(Bin_To_Dec(first) / Bin_To_Dec(second));
}

function Binary_modulo(first, second, size)
{
    return To_Binary(Bin_To_Dec(first) % Bin_To_Dec(second));
}

export {Binary_add};
export {Binary_subtract};
export {Binary_multiply};
export {Binary_divide};
export {Binary_modulo};
