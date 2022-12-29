/*
 * BitCalc.js
 * Bill Xia
 * 12/22/22
 * 
 * Purpose: Implementation of the BitCalc module, which contains all
 *          high-level operations for the BitCalc program.
 */

/* ======================================================================== *\
 *  IMPORTS                                                                 *
\* ======================================================================== */

import React from "react";
import "./index.css";

import {Dec_To_Bin} from "./BaseConvert.js";
import {Bin_To_Dec} from "./BaseConvert.js";

import {Binary_add} from "./BinaryArith.js";

import {evaluate} from "./commands.js";
import {invalid} from "./commands.js";

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

/* Function that sets the output window to a desired value. */
function setDisplay(output) {
    const display = document.getElementById("display");
    display.innerHTML = output;
}

/* Function that sets the output window to a desired value. */
function setDisplay_auto(state) {

    const display = document.getElementById("display");
    let message;
    let FT_local = state.firstTild;
    let ST_local = state.secondTild;

    switch (state.readStage)
    {

        /* Display 0 and toggle tilde sign. */
        case 0:

            if (FT_local) {
                message = "~" + Bin_To_Dec(state.firstOp);
            } else if (Bin_To_Dec(state.firstOp) === 0) {
                message = "Enter Input";
            } else {
                message = Bin_To_Dec(state.firstOp);
            }

            // message = (FT_local ? ("~" + Bin_To_Dec(state.firstOp)) : "Enter Input");

            display.innerHTML = message;
            break;

        /* Toggle the ~ sign in front of the first operand. */
        case 1:

            message = (FT_local ? "~" : "" ) + 
                        Bin_To_Dec(state.firstOp);
            display.innerHTML = message;
            break;

        /* Same as before but with a binary operator. */
        case 2:

            message = (FT_local ? "~" : "" ) + 
                        Bin_To_Dec(state.firstOp) + " " + 
                        state.operator;
            display.innerHTML = message;
            break;

        /* Same as before unless ~ is inputted. */
        case 3: 
        
            message = (FT_local ? "~" : "" ) + 
                        Bin_To_Dec(state.firstOp) + " " + 
                        state.operator +
                        (ST_local ? " ~0" : "" );
            display.innerHTML = message;
            break;
        
        /* Same as case 2 but with the second operand. */
        case 4:

            message = (FT_local ? "~" : "" ) + 
                        Bin_To_Dec(state.firstOp) + " " + 
                        state.operator + " " +
                        (ST_local ? "~" : "" ) +
                        Bin_To_Dec(state.secondOp);
            display.innerHTML = message;
            break;

        default:
            display.innerHTML = "Enter Input";
            break;

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

            firstSign: false,
            firstTild: false,
            secondTild: false,
            secondSign: false,

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

                let bin = Dec_To_Bin(command);

                /* Stage 0: Read first numeral input for first operand */
                if (this.state.readStage === 0) {

                    this.setState({
                        firstOp: bin,
                        readStage: 1
                    }, () => {
                        setDisplay_auto(this.state);
                    });

                    // setDisplay(Bin_To_Dec(bin));

                /* Stage 1: Read further numeral input for first operand */
                } else if (this.state.readStage === 1) {

                    let prevFirst = Dec_To_Bin(10 * Bin_To_Dec(this.state.firstOp));
                    bin = Binary_add(bin, prevFirst, this.state.size);

                    this.setState({
                        firstOp: bin
                    }, () => {
                        setDisplay_auto(this.state);
                    });

                    // setDisplay(Bin_To_Dec(bin));

                /* Stage 2: Read first numeral input for second operand */
                } else if (this.state.readStage === 3) {

                    this.setState({
                        secondOp: bin,
                        readStage: 4
                    }, () => {
                        setDisplay_auto(this.state);
                    });

                    // setDisplay(Bin_To_Dec(this.state.firstOp) + " " +
                    //                       this.state.operator + " " +
                    //            Bin_To_Dec(bin));

                /* Stage 2: Read further numeral input for second operand */
                } else if (this.state.readStage === 4) {

                    let prevSecond = Dec_To_Bin(10 * Bin_To_Dec(this.state.secondOp));
                    bin = Binary_add(bin, prevSecond, this.state.size);

                    this.setState({
                        secondOp: bin
                    }, () => {
                        setDisplay_auto(this.state);
                    });

                    // setDisplay(Bin_To_Dec(this.state.firstOp) + " " +
                    //                       this.state.operator + " " +
                    //            Bin_To_Dec(bin));

                }


                break;

            /* ============================================================ *\
             *  Then check for binary operators. These all set the current  *
             *  operator to the inputted operator then send the program to  *
             *  Stage 3.                                                    *
            \* ============================================================ */
            case "+": case "-": case "*": case "/": case "%":
            case "&": case "|": case "^": case "<<": case ">>":

                if ( (this.state.readStage !== 0) && 
                     (this.state.readStage !== 4)) {

                    this.setState({
                        operator: command,
                        readStage: 3
                    }, () => {
                        setDisplay_auto(this.state);
                    });

                    // setDisplay(Bin_To_Dec(this.state.firstOp) + " " + command);

                } else if ((this.state.readStage === 0) || 
                           (this.state.readStage === 4)) {

                    var prev = evaluate(this.state);
                    this.setState({
                        firstOp: prev,
                        secondOp: new Array(64).fill(0),
                        operator: command,
                        readStage: 3
                    }, () => {
                        setDisplay_auto(this.state);
                    });

                    // setDisplay(Bin_To_Dec(prev) + " " + command);

                }

                break;

            /* ============================================================ *\
             *  Unary operators will toggle a prefix in front of the        *
             *  current operand. These will be processed at evaluation.     *
            \* ============================================================ */
            case "~":

                let newTild;
                let RS_local = this.state.readStage;
                if ((RS_local === 0) || (RS_local === 1)) {
                    newTild = !(this.state.firstTild);
                    this.setState({ 
                        firstTild: newTild,
                        readStage: (this.state.firstOp ? 1 : 0)
                    }, () => {
                        setDisplay_auto(this.state);
                    });
                } else {
                    newTild = !(this.state.secondTild);
                    this.setState({ secondTild: newTild }, () => {
                        setDisplay_auto(this.state);
                    });
                }

                // alert("firstTild: " + this.state.firstTild);
                // setDisplay_auto(this.state);

                break;

            /* ============================================================ *\
             *  The CLR button resets the output window and expression      *
             *  variables, then sends the program to Stage 0.               *
            \* ============================================================ */
            case "CLR":

                this.setState({
                    firstOp: new Array(64).fill(0),
                    secondOp: new Array(64).fill(0),
                    operator: "",
                    firstSign: false,
                    firstTild: false,
                    secondSign: false,
                    secondTild: false,
                    readStage: 0
                });

                setDisplay("Enter Input");

                break;

            /* ============================================================ *\
             *  The DEL button removes the last inputted digit/operator.    *
            \* ============================================================ */
            case "DEL":

                let newFirst = this.state.firstOp;
                let newOperator = this.state.operator;
                let newSecond = this.state.secondOp;
                let newFT = this.state.firstTild;
                let newST = this.state.secondTild;
                let newStage = this.state.readStage;

                if (this.state.readStage === 1) {
                    newFirst = Dec_To_Bin( parseInt(Bin_To_Dec(this.state.firstOp) / 10) );
                    if (Bin_To_Dec(newFirst) === 0) {
                        newStage--;
                        newFT = !newFT;
                    }
                } else if (this.state.readStage === 3) {
                    newOperator = "";
                    newStage = 1;                   // TODO: Change to account for -/~ sign.
                } else if (this.state.readStage === 4) {
                    newSecond = Dec_To_Bin( parseInt(Bin_To_Dec(this.state.secondOp) / 10) );
                    if (Bin_To_Dec(newSecond) === 0) {
                        newStage--;
                        newST = !newST;
                    }
                }

                this.setState({
                    firstOp: newFirst,
                    secondOp: newSecond,
                    operator: newOperator,
                    firstTild: newFT,
                    secondTild: newST,
                    readStage: newStage
                }, () => {
                    setDisplay_auto(this.state);
                });

                // if (newStage === 0) {
                //     setDisplay("Enter Input");
                // } else if (newStage === 1) {
                //     setDisplay(Bin_To_Dec(newFirst));
                // } else if (newStage === 2) {
                //     setDisplay(Bin_To_Dec(newFirst));   // TODO: Change to account for -/~ sign.
                // } else if (newStage === 3) {
                //     setDisplay(Bin_To_Dec(newFirst) + " " + newOperator);
                // } else if (newStage === 4) {
                //     setDisplay(Bin_To_Dec(newFirst) + " " + newOperator + " " +
                //                Bin_To_Dec(newSecond));
                // }

                break;

            /* ============================================================ *\
             *  The = operator evaluates the current expression and sends   *
             *  the program to Stage 0.                                     *
            \* ============================================================ */
            case "=":

                var result = evaluate(this.state);

                this.setState({
                    firstOp: result,
                    secondOp: new Array(64).fill(0),
                    operator: "",
                    firstSign: false,
                    firstTild: false,
                    secondSign: false,
                    secondTild: false,
                    readStage: 0
                });

                setDisplay("= " + Bin_To_Dec(result));

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

                setDisplay("Enter Input");

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
            <div>
                <div class="calcUI">
                    <div 
                        class="outputWindow"
                        id="display"
                    >
                        Enter Input
                    </div>
                    <div>
                        {this.renderButton("DEC")}
                        {this.renderButton("U64")}
                        {this.renderButton("&")}
                        {this.renderButton("|")}
                        {this.renderButton("^")}
                        {this.renderButton("~")}
                    </div>
                    <div>
                        {this.renderButton("CLR")}
                        {this.renderButton("DEL")}
                        {this.renderButton("<<")}
                        {this.renderButton(">>")}
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
                        {this.renderButton("4")}
                        {this.renderButton("5")}
                        {this.renderButton("6")}
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
                <div class="nametag">
                    Made by Bill Xia (wxia01@tufts.edu)
                </div>
            </div>
        );
    }

}

/* ======================================================================== *\
 *  EXPORTS                                                                 *
\* ======================================================================== */

export {BitCalc};
