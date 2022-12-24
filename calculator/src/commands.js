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

import {Binary_add} from "./bin_arith.js";
import {Binary_subtract} from "./bin_arith.js";
import {Binary_multiply} from "./bin_arith.js";
import {Binary_divide} from "./bin_arith.js";
import {Binary_modulo} from "./bin_arith.js";

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
        default:
            return calcState.firstOp;
    }
}

// function changeBase(props)
// {
//     /* */
// }

// function changeSize(props)
// {
//     /* */
// }

function invalid(command)
{
    alert("UNIMPLEMENTED: " + command);
}

export {evaluate};
export {invalid};
