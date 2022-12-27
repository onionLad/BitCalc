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
import {Bitwise_lshift} from "./BitwiseOps";
import {Bitwise_rshift} from "./BitwiseOps";

/* ======================================================================== *\
 *  FUNCTIONS                                                               *
\* ======================================================================== */

function evaluate(calcState)
{
    switch(calcState.operator) {
        case "+":
            return Binary_add(calcState.firstOp, calcState.secondOp,
                              calcState.size);
        case "-":
            return Binary_subtract(calcState.firstOp, calcState.secondOp,
                                   calcState.size);
        case "*":
            return Binary_multiply(calcState.firstOp, calcState.secondOp,
                                   calcState.size);
        case "/":
            return Binary_divide(calcState.firstOp, calcState.secondOp,
                                   calcState.size);
        case "%":
            return Binary_modulo(calcState.firstOp, calcState.secondOp,
                                   calcState.size);
        case "&":
            return Bitwise_and(calcState.firstOp, calcState.secondOp,
                               calcState.size);
        case "|":
        return Bitwise_or(calcState.firstOp, calcState.secondOp,
                            calcState.size);
        case "^":
            return Bitwise_xor(calcState.firstOp, calcState.secondOp,
                                calcState.size);
        case "<<":
            return Bitwise_lshift(calcState.firstOp, calcState.secondOp,
                                  calcState.size);
        case ">>":
            return Bitwise_rshift(calcState.firstOp, calcState.secondOp,
                                  calcState.size);
        default:
            return calcState.firstOp;
    }
}

function invalid(command)
{
    alert("Error: Invalid Command " + command);
}

export {evaluate};
export {invalid};
