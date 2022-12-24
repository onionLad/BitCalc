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

import {To_Binary} from './convert.js';
import {Bin_To_Dec} from './convert.js';

import {Binary_add} from './bin_arith.js';

import {invalid} from './commands.js';

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

            /* Default base is 10. */
            base: 10,

            /* 
             * Default representation will be uint64. Smaller sizes will just
             * ignore the higher-order bits. Signage only alters how values
             * are interpretted.
             */
            signed: false,
            size: 64,
            firstOp: new Array(64).fill(0),
            secondOp: new Array(64).fill(0),
            operator: "",

            /*
             * There's probably a cleaner solution to the stages of input, but
             * this was the best I could come up with after ~2 seconds of
             * brainstorming.
             * 
             * In Stage 0, the program waits for the first numeral input. In
             * this mode, the user can only input numerals, change the base,
             * or change the size of the binary array.
             * 
             * After the first numeral is read in, we move to Stage 1. Here,
             * the program will accept more numerals or an operator.
             * 
             * If the !, ~, +/-, or = operator is called, we move to Stage 2,
             * stop reading numerals, and instead wait for an operator input.
             * Once an operator that isn't !, ~, +/-, or = is called, we move
             * onto the next section.
             * 
             * If an operator that isn't one of the four above is called, we
             * move to Stage 3 and the program waits for a second numeral
             * input, blocking operators from being called.
             * 
             * Once a numeral is inputted, the program will unlock operators
             * and wait for the next input. If an operator is passed, the
             * result will be computed before we jump back to Stage 3.
             */
            readStage: 0
        }

    }

    handleClick(command)
    {
        switch (command) {

            /* ============================================================ *\
             *  First checking for numeral inputs                           *
            \* ============================================================ */
            case "A": case "B": case "C": case "D": case "E": case "F":

                if (this.state.base !== 16) {
                    break;
                }

            case "0": case "1": case "2": case "3": case "4":
            case "5": case "6": case "7": case "8": case "9":

                let bin = To_Binary(command);

                if (this.state.readStage === 0) {

                    this.setState({
                        firstOp: bin,
                        readStage: 1
                    });

                    const display = document.getElementById("display");
                    display.innerHTML = Bin_To_Dec(bin);

                } else if (this.state.readStage === 1) {

                    let prev = To_Binary(10 * Bin_To_Dec(this.state.firstOp));
                    bin = Binary_add(bin, prev, this.state.size);

                    this.setState({
                        firstOp: bin
                    });

                    const display = document.getElementById("display");
                    display.innerHTML = Bin_To_Dec(bin);
                }


                break;

            /* ============================================================ *\
             *  If input can't be found, display error message              *
            \* ============================================================ */
            default:

                invalid(command);

                this.setState({
                    firstOp: new Array(64).fill(0),
                    readStage: 0
                });

                // let displayTxt = "Enter Input";
                const display = document.getElementById("display");
                display.innerHTML = "Enter Input";

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
                <div 
                    class="outputWindow"
                    id="display"
                >
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
                <div class="shortRow">
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
