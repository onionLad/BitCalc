/* 
 * BaseConvert.js
 * Bill Xia
 * 12/23/22
 * 
 * Purpose: A suite of functions that convert values between binary, decimal,
 *          and hexadecimal representations.
 */

/* ======================================================================== *\
 *  IMPORTS                                                                 *
\* ======================================================================== */

import {Binary_add} from "./BinaryArith.js";
import {Binary_subtract} from "./BinaryArith.js";

import {Binary_EQ} from "./BinaryLogic.js";

import {Bitwise_invert} from "./BitwiseOps.js";

/* ======================================================================== *\
 * Purpose: Converts a binary array into a string.                          *
\* ======================================================================== */
function Bin_To_String(binary, isSigned, size)
{
    let binCopy = [];
    for (let i = 0; i < size; i++) {
        if ((i % 4 === 0) && (i !== 0)) {
            binCopy.push(" ");
        }
        binCopy.push(binary[i]);
    }

    return binCopy.reverse().join("");

}

/* ======================================================================== *\
 * Purpose: Converts a binary array into a decimal value with value smaller *
 *          than 2^52.                                                      *
 *                                                                          *
 * Bugs:    The entire calculator crashes if the input "1 << 63" is         *
 *          processed while the representation is S64. I believe this       *
 *          function is the source of the issue.                            *
\* ======================================================================== */
function Bin_To_Dec(binary, isSigned, size)
{
    /* Calculating the decimal value. */
    let decimal = 0;
    for (let i = size - 1; i >= 0; i--) {
        decimal += binary[i] * (2**i);
    }

    /* 
     * If the decimal should be negative, change its value to follow two's
     * complement format.
     * 
     * That is, the smallest (in binary) negative value should be the most
     * negative while -1 should have the largest (in binary) value.
     */
    if (isSigned && (binary[size - 1] === 1)) {

        let maxNegative = new Array(64).fill(0);
        maxNegative[63] = 1;

        if (size === 32) {
            decimal = -1 * ((2**size) - decimal);
        } 

        /* 
         * Edge Case: The most negative int64 number causes the program to go
         *            infinite. When we encounter this case, simply print the
         *            number as a string.
         */
        else if (isSigned && (size === 64) && Binary_EQ(binary, maxNegative, size)) {
            return "-9223372036854775808";
        }

        else {
            let max = new Array(64).fill(0);
            let diff = Binary_subtract(max, binary, size);
            decimal = -1 * Bin_To_Dec( diff, isSigned, size );
        }

    }

    /*
     * If decimal exceeds the max accurate value of a JS number (2^52 - 1), we
     * need to manually find its exact value.
     */
    if (Math.abs(decimal) > 4503599627370495) {
        return Bin_To_Large_Dec(binary, isSigned);
    }
    return decimal;
}

/* ======================================================================== *\
 * Purpose: Converts a binary array into a decimal value with value larger  *
 *          than 2^52. No size parameter is passed because the function     *
 *          only ever gets called on 64-bit representations.                *
\* ======================================================================== */
function Bin_To_Large_Dec(binary, isSigned)
{
    if (isSigned) {
        let maxNegative = new Array(64).fill(0);
        binary = Binary_subtract(maxNegative, binary, 64);
    }

    let largeNum = 0;
    let smallNum = 0;
    for (let i = (binary.length - 1); i >= 0; i--) {
        largeNum += binary[i] * (2**i);
        smallNum += (binary[i] * (2**i)) % 1000000;
    }

    smallNum = smallNum % 1000000;
    let upperChunk = parseInt(largeNum / 1000000);

    /* There's definitely a clearner way to write this chunk. */
    if (smallNum < 10) {
        return "" + upperChunk + "00000" + smallNum;
    } else if (smallNum < 100) {
        return "" + upperChunk + "0000" + smallNum;
    } else if (smallNum < 1000) {
        return "" + upperChunk + "000" + smallNum;
    } else if (smallNum < 10000) {
        return "" + upperChunk + "00" + smallNum;
    } else if (smallNum < 100000) {
        return "" + upperChunk + "0" + smallNum;
    }

    return (isSigned ? "-" : "") + upperChunk + smallNum;
}

/* ======================================================================== *\
 * Purpose: Converts a binary array into a hexadecimal value.               *
\* ======================================================================== */
function Bin_To_Hex(binary, isSigned, size)
{
    /* Defining an array for mapping hex values. */
    let hex = [
        "0", "1", "2", "3", "4", "5", "6", "7",
        "8", "9", "A", "B", "C", "D", "E", "F"
    ];

    let hexString = [];
    let currHex;
    let firstNotFound = true;
    for (let i = (size - 1); i >= 0; i--) {

        currHex = 0;
        for (let j = i; j >= i - 3; j--) {
            currHex += (binary[j] * (2**((j - i) + 3)));
        }

        if (firstNotFound) {
            if (currHex > 0) {
                hexString.push(hex[currHex]);
                firstNotFound = false;
            }
        } else {
            hexString.push(hex[currHex]);
        }

        i -= 3;
    }
    return hexString.join("");
}

/* ======================================================================== *\
 * Purpose: Coverts a decimal input into a binary array.                    *
\* ======================================================================== */
function Dec_To_Bin(decimal, size)
{
    let binary = new Array(64).fill(0);
    decimal = parseInt(decimal);

    let isNegative = (decimal < 0) ? true : false ;
    if (isNegative) {
        decimal = -1 * decimal;
    }

    /* Max value is 2^64 - 1 */
    for (let i = 63; i >= 0; i--) {

        /* 
         * If decimal is greater than or equal to the current place value, we
         * set that place value to.
         */
        if (decimal >= (2**i)) {
            binary[i] = 1;

            /* Updating decimal for the next iteration. */
            decimal -= (2**i);
        }
    }

    if (isNegative) {
        let binary_One = new Array(64).fill(0);
        binary_One[0] = 1;
        binary = Binary_add( Bitwise_invert(binary, size), binary_One, size );
    }

    return binary;
}

/* ======================================================================== *\
 *  EXPORTS                                                                 *
\* ======================================================================== */

export {Bin_To_String};
export {Bin_To_Dec};
export {Bin_To_Hex};
export {Dec_To_Bin};
