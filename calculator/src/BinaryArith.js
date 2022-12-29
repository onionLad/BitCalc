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
import {Bitwise_invert} from "./BitwiseOps.js";
import {Bitwise_lshift} from "./BitwiseOps.js";
import {Bitwise_rshift} from "./BitwiseOps.js";

/* ======================================================================== *\
 *  FUNCTIONS                                                               *
\* ======================================================================== */

function Binary_add(first, second, size)
{
    let sumArray = new Array(64).fill(0);
    let sum = 0;
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
    let diffArray = new Array(64).fill(0);
    let isNegative = false;

    if (Bin_To_Dec(first, false, size) < Bin_To_Dec(second, false, size)) {
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
        diffArray = Binary_subtract(diffArray, Dec_To_Bin(1, size), size);
        diffArray = Binary_subtract(new Array(64).fill(1), diffArray, size);
    }

    return diffArray;
}

function Binary_multiply(first, second, size,)
{
    let product = new Array(64).fill(0);
    let firstLocal = first.slice();
    let secondLocal = second.slice();

    let binary_One = Dec_To_Bin(1, size);

    /* Repeat until the second operand gets shifted to 0. */
    while ( Bin_To_Dec(secondLocal, false, size) > 0 ) {

        /* If the second operand is odd, add the first operand to the product. */
        if ( Bin_To_Dec( Bitwise_and(secondLocal, binary_One, size), false, size ) ) {
            product = Binary_add(product, firstLocal, size);
        }

        /* Performing shifts. This works because [ a*b = (a*2) * (b/2) ] */
        firstLocal = Bitwise_lshift(firstLocal, binary_One, size);
        secondLocal = Bitwise_rshift(secondLocal, binary_One, size);

    }

    // alert(Bin_To_Dec(product));

    return product;

    // return Dec_To_Bin(Bin_To_Dec(first) * Bin_To_Dec(second));
}

function Binary_divide(first, second, size, isSigned)
{
    /* Determining signage. */
    let firstNegative = (Bin_To_Dec(first, isSigned, size) < 0) ? true : false;
    let secondNegative = (Bin_To_Dec(second, isSigned, size) < 0) ? true : false;

    alert("FIRST: " + firstNegative + " | SECOND: " + secondNegative);

    let binary_One = Dec_To_Bin(1, size);

    /* Different cases for each signage variation. */
    if (firstNegative) {

        first = Binary_add( Bitwise_invert(first, size), binary_One, size );

        /* First and second are negative. */
        if (secondNegative) {
            second = Binary_add( Bitwise_invert(second, size), binary_One, size );
            return Dec_To_Bin( Bin_To_Dec(first, isSigned, size) / Bin_To_Dec(second, isSigned, size),
                                size );
        } 

        /* Only first is negative. */
        else {
            return Dec_To_Bin( -1 * (parseInt(Bin_To_Dec(first, isSigned, size) / Bin_To_Dec(second, isSigned, size))),
                                size );
        }
    }

    /* Only second is negative. */
    else if (secondNegative) {
        second = Binary_add( Bitwise_invert(second, size), binary_One, size );
        return Dec_To_Bin( -1 * (parseInt(Bin_To_Dec(first, isSigned, size) / Bin_To_Dec(second, isSigned, size))),
                            size );
    }

    /* Neither operand is negative. */
    else {
        alert(Bin_To_Dec(first, isSigned, size) / Bin_To_Dec(second, isSigned, size));
        return Dec_To_Bin( Bin_To_Dec(first, isSigned, size) / Bin_To_Dec(second, isSigned, size),
                            size );
    }

    // return Dec_To_Bin(Bin_To_Dec(first) / Bin_To_Dec(second));
}

function Binary_modulo(first, second, size)
{
    return Dec_To_Bin( Bin_To_Dec(first, true, size) % Bin_To_Dec(second, true, size),
                        size );
}

export {Binary_add};
export {Binary_subtract};
export {Binary_multiply};
export {Binary_divide};
export {Binary_modulo};
