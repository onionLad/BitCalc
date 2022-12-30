/* 
 * commands.js
 * Bill Xia
 * 12/23/22
 * 
 * Purpose: Holds functions that control button functions for the BitCalc
 *          program.
 */

/* ======================================================================== *\
 *  IMPORTS                                                                 *
\* ======================================================================== */

import {Binary_add} from "./BinaryArith.js";
import {Binary_subtract} from "./BinaryArith.js";
import {Binary_multiply} from "./BinaryArith.js";
import {Binary_divide} from "./BinaryArith.js";
import {Binary_modulo} from "./BinaryArith.js";

import {Bitwise_and} from "./BitwiseOps";
import {Bitwise_or} from "./BitwiseOps";
import {Bitwise_xor} from "./BitwiseOps";
import {Bitwise_invert} from "./BitwiseOps";
import {Bitwise_lshift} from "./BitwiseOps";
import {Bitwise_rshift} from "./BitwiseOps";

/* ======================================================================== *\
 *  FUNCTIONS                                                               *
\* ======================================================================== */

function evaluate(calcState)
{
    let firstOp_local = calcState.firstOp;
    let secondOp_local = calcState.secondOp;

    if (calcState.firstTild) {
        firstOp_local = Bitwise_invert(firstOp_local, calcState.size);
    }
    if (calcState.secondTild) {
        secondOp_local = Bitwise_invert(secondOp_local, calcState.size);
    }

    switch(calcState.operator) {
        case "+":
            return Binary_add(firstOp_local, secondOp_local,
                              calcState.size);
        case "-":
            return Binary_subtract(firstOp_local, secondOp_local,
                                   calcState.size);
        case "*":
            return Binary_multiply(firstOp_local, secondOp_local,
                                   calcState.size);
        case "/":
            return Binary_divide(firstOp_local, secondOp_local,
                                   calcState.size, calcState.isSigned);
        case "%":
            return Binary_modulo(firstOp_local, secondOp_local,
                                   calcState.size, calcState.isSigned);
        case "&":
            return Bitwise_and(firstOp_local, secondOp_local,
                               calcState.size);
        case "|":
            return Bitwise_or(firstOp_local, secondOp_local,
                                calcState.size);
        case "^":
            return Bitwise_xor(firstOp_local, secondOp_local,
                                calcState.size);
        case "<<":
            return Bitwise_lshift(firstOp_local, secondOp_local,
                                  calcState.size);
        case ">>":
            return Bitwise_rshift(firstOp_local, secondOp_local,
                                  calcState.size);
        default:
            return firstOp_local;
    }
}

function invalid(command)
{
    alert("Error: Invalid Command " + command);
}

/* ======================================================================== *\
 *  EXPORTS                                                                 *
\* ======================================================================== */

export {evaluate};
export {invalid};
