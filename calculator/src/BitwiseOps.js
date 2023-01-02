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

import {Bin_To_Dec} from "./BaseConvert.js";

import {Binary_add} from "./BinaryArith.js";

/* ======================================================================== *\
 *  FUNCTIONS                                                               *
\* ======================================================================== */

function Bitwise_and(first, second, size)
{
    let result = new Array(64).fill(0);
    for (let i = 0; i < size; i++) {
        if (first[i] === second[i]) {
            result[i] = first[i];
        }
    }
    return result;
}

function Bitwise_or(first, second, size)
{
    let result = new Array(64).fill(0);
    for (let i = 0; i < size; i++) {
        if ( (first[i] === 1) || (second[i] === 1) ) {
            result[i] = 1;
        }
    }
    return result;
}

function Bitwise_xor(first, second, size)
{
    let result = new Array(64).fill(0);
    for (let i = 0; i < size; i++) {
        if ( ((first[i] === 1) || (second[i] === 1)) && (first[i] !== second[i]) ) {
            result[i] = 1;
        }
    }
    return result;
}

function Bitwise_invert(binary, size)
{
    let result = new Array(64).fill(0);
    for (let i = 0; i < size; i++) {
        result[i] = binary[i] ? 0 : 1 ;
    }
    return result;
}

function Bitwise_change(binary, size)
{
    let binary_One = new Array(64).fill(0);
    binary_One[0] = 1;
    return Binary_add( Bitwise_invert(binary, size), binary_One, size );
}

function Bitwise_lshift(first, second, size)
{
    let result = first.slice();
    let shift = Bin_To_Dec(second, false, size);

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
    let result = first.slice();
    let shift = Bin_To_Dec(second, false, size);

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

/* ======================================================================== *\
 *  EXPORTS                                                                 *
\* ======================================================================== */

export {Bitwise_and};
export {Bitwise_or};
export {Bitwise_xor};
export {Bitwise_invert};
export {Bitwise_change};
export {Bitwise_lshift};
export {Bitwise_rshift};
