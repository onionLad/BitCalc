/* 
 * BitwiseOps.js
 * Bill Xia
 * 12/26/22
 * 
 * Purpose: A suite of functions that performs bitwise operations on binary
 *          arrays.
 */

/* ======================================================================== *\
 *  IMPORTS                                                                 *
\* ======================================================================== */

import {Bin_To_Dec} from "./BaseConvert.js"

/* ======================================================================== *\
 *  FUNCTIONS                                                               *
\* ======================================================================== */

function Bitwise_and(first, second, size)
{
    var result = new Array(64).fill(0);
    for (let i = 0; i < size; i++) {
        if (first[i] === second[i]) {
            result[i] = first[i];
        }
    }
    return result;
}

function Bitwise_or(first, second, size)
{
    var result = new Array(64).fill(0);
    for (let i = 0; i < size; i++) {
        if ( (first[i] === 1) || (second[i] === 1) ) {
            result[i] = 1;
        }
    }
    return result;
}

function Bitwise_xor(first, second, size)
{
    var result = new Array(64).fill(0);
    for (let i = 0; i < size; i++) {
        if ( ((first[i] === 1) || (second[i] === 1)) && (first[i] !== second[i]) ) {
            result[i] = 1;
        }
    }
    return result;
}

function Bitwise_invert(binary, size)
{
    var result = new Array(64).fill(0);
    for (let i = 0; i < size; i++) {
        result[i] = binary[i] ? 0 : 1 ;
    }
    return result;
}

function Bitwise_lshift(first, second, size)
{
    var result = first.slice();
    let shift = Bin_To_Dec(second);

    if (shift > size) {
        alert("Error: Attempted shift exceeding " + size);
        return result;
    }

    for (let j = 0; j < shift; j++) {
        for (let i = size - 1; i > 0; i--) {
            result[i] = result[i - 1];
        }
        result[0] = 0;
    }
    return result;
}

function Bitwise_rshift(first, second, size)
{
    var result = first.slice();
    let shift = Bin_To_Dec(second);

    if (shift > size) {
        alert("Error: Attempted shift exceeding " + size);
        return result;
    }

    for (let j = 0; j < shift; j++) {
        for (let i = 0; i < size - 1; i++) {
            result[i] = result[i + 1];
        }
        result[size] = 0;
    }
    return result;
}

export {Bitwise_and};
export {Bitwise_or};
export {Bitwise_xor};
export {Bitwise_invert};
export {Bitwise_lshift};
export {Bitwise_rshift};
