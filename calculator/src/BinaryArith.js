/* 
 * BinaryArith.js
 * Bill Xia
 * 12/23/22
 * 
 * Purpose: A suite of functions that performs arithmetic operations on binary
 *          arrays.
 */

/* ======================================================================== *\
 *  IMPORTS                                                                 *
\* ======================================================================== */

import {Dec_To_Bin} from "./BaseConvert.js";
import {Bin_To_Dec} from "./BaseConvert.js";

import {Bitwise_and} from "./BitwiseOps.js";
import {Bitwise_lshift} from "./BitwiseOps.js";
import {Bitwise_rshift} from "./BitwiseOps.js";

/* ======================================================================== *\
 *  FUNCTIONS                                                               *
\* ======================================================================== */

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

    // return Dec_To_Bin(Bin_To_Dec(first) + Bin_To_Dec(second));
}

function Binary_subtract(first, second, size)
{
    var diffArray = new Array(64).fill(0);
    let isNegative = false;

    if (Bin_To_Dec(first) < Bin_To_Dec(second)) {
        let temp = first;
        first = second;
        second = temp;
        isNegative = true;
    }

    for (let i = 0; i < size; i++) {
        if (first[i] < second[i]) {
            first[i+1]--;
            first[i] += 2;
        }
        diffArray[i] = first[i] - second[i];
    }

    if (isNegative) {
        diffArray = Binary_subtract(diffArray, Dec_To_Bin(1), size);
        diffArray = Binary_subtract(new Array(64).fill(1), diffArray, size);
    }

    return diffArray;
}

function Binary_multiply(first, second, size)
{
    let product = new Array(64).fill(0);
    let firstLocal = first.slice();
    let secondLocal = second.slice();

    let binary_One = Dec_To_Bin(1);

    while (Bin_To_Dec(secondLocal) > 0) {
        if ( Bin_To_Dec( Bitwise_and(secondLocal, binary_One, size) ) ) {
            product = Binary_add(product, firstLocal, size);
        }
        firstLocal = Bitwise_lshift(firstLocal, binary_One, size);
        secondLocal = Bitwise_rshift(secondLocal, binary_One, size);
    }

    return product;

    // return Dec_To_Bin(Bin_To_Dec(first) * Bin_To_Dec(second));
}

function Binary_divide(first, second, size)
{
    return Dec_To_Bin(Bin_To_Dec(first) / Bin_To_Dec(second));
}

function Binary_modulo(first, second, size)
{
    return Dec_To_Bin(Bin_To_Dec(first) % Bin_To_Dec(second));
}

export {Binary_add};
export {Binary_subtract};
export {Binary_multiply};
export {Binary_divide};
export {Binary_modulo};
