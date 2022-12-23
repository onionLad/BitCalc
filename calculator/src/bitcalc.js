/*
 * bitcalc.js
 * Bill Xia
 * 12/22/22
 * 
 * Purpose: Implementation of the BitCalc module, which contains all
 *          high-level operations for the BitCalc program.
 * 
 * Note: 
 */

/* ======================================================================== *\
 *  IMPORTS                                                                 *
\* ======================================================================== */

import React from 'react';
import './index.css';
import {numeral} from './commands.js';
import {invalid} from './commands.js';
// import {displayDec} from './display.js'

/* ======================================================================== *\
 *  HELPER FUNCTIONS                                                        *
\* ======================================================================== */

/* Function used to create buttons */
function CalcButton(args) {
    
    if (args.name === '0') {
        return (
            <button
                className="zeroButton"
                onClick={ args.onClick }
            >
                {args.name}
            </button>
        )
    } else {
        return (
            <button
                className="calcButton"
                onClick={ args.onClick }
            >
                {args.name}
            </button>
        )
    }

}

/* ======================================================================== *\
 *  BitCalc                                                                 *
\* ======================================================================== */

class BitCalc extends React.Component {
    
    /* Constructor */
    constructor(props) {
        super(props);
        this.state = {

            /* 
             * Default form will be uint64. Smaller sizes will just ignore the
             * higher-order bits.
             */
            signed: false,
            firstOp: new Array(64).fill(0),
            secondOp: new Array(64).fill(0),
            operator: ""
        }

    }

    handleClick(command)
    {
        switch (command) {

            /* ============================================================ *\
             *  First checking for numeral inputs                           *
            \* ============================================================ */
            case "0": case "1": case "2": case "3": case "4":
            case "5": case "6": case "7": case "8": case "9":
            case "A": case "B": case "C": case "D": case "E": case "F":
                
                numeral(command);

                break;

            /* ============================================================ *\
             *  If input can't be found, display error message              *
            \* ============================================================ */
            default:
                invalid(command);

        }
    }

    /* Render a single button */
    renderButton(command) {

        return (
            <CalcButton
                name={command}
                onClick={ () => this.handleClick(command) }
            />
        )

    }

    /* This block of code can probably be replaced with a loop. */
    render() {

        return (
            <div class="calcUI">
                <div class="outputWindow">
                    Enter Input
                </div>
                <div>
                    {this.renderButton("Base")}
                    {this.renderButton("Size")}
                    {this.renderButton("&&")}
                    {this.renderButton("||")}
                    {this.renderButton("!")}
                    {this.renderButton("==")}
                </div>
                <div>
                    {this.renderButton("<<")}
                    {this.renderButton(">>")}
                    {this.renderButton("&")}
                    {this.renderButton("|")}
                    {this.renderButton("^")}
                    {this.renderButton("~")}
                </div>
                <div>
                    {this.renderButton("<")}
                    {this.renderButton(">")}
                    {this.renderButton("CLR")}
                    {this.renderButton("DEL")}
                    {this.renderButton("%")}
                    {this.renderButton("/")}
                </div>
                <div>
                    {this.renderButton("A")}
                    {this.renderButton("B")}
                    {this.renderButton("7")}
                    {this.renderButton("8")}
                    {this.renderButton("9")}
                    {this.renderButton("*")}
                </div>
                <div>
                    {this.renderButton("C")}
                    {this.renderButton("D")}
                    {this.renderButton("5")}
                    {this.renderButton("6")}
                    {this.renderButton("7")}
                    {this.renderButton("-")}
                </div>
                <div>
                    {this.renderButton("E")}
                    {this.renderButton("F")}
                    {this.renderButton("1")}
                    {this.renderButton("2")}
                    {this.renderButton("3")}
                    {this.renderButton("+")}
                </div>
                <div className="shortRow">
                    {this.renderButton("+/-")}
                    {this.renderButton("0")}
                    {this.renderButton("=")}
                </div>
            </div>
        );
    }

}

/* ======================================================================== *\
 *  EXPORTS                                                                 *
\* ======================================================================== */

export {BitCalc};
