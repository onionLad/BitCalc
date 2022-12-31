/* ======================================================================== *\
 *  File:       BitCalc.js                                                  *
 *  Author:     Bill Xia                                                    *
 *  Created:    12/22/22                                                    *
 *                                                                          *
 *  Purpose:    The driver file for the BitCalc program. It contains all    *
 *              high-level operations for the BitCalc program.              *
\* ======================================================================== */

/* ======================================================================== *\
 *  IMPORTS                                                                 *
\* ======================================================================== */

import React from "react";

import {Bin_To_String} from "./BaseConvert.js"
import {Bin_To_Dec} from "./BaseConvert.js";
import {Bin_To_Hex} from "./BaseConvert.js";
import {Dec_To_Bin} from "./BaseConvert.js";

import {Binary_add} from "./BinaryArith.js";

import {Bitwise_change} from "./BitwiseOps";

import {CalcButton} from "./CalcButton.js";

import {evaluate} from "./commands.js";
import {invalid} from "./commands.js";

/* ======================================================================== *\
 *  HELPER FUNCTIONS                                                        *
\* ======================================================================== */

/* Function that sets the output window to a desired value. */
function setDisplay(output)
{
    const display = document.getElementById("display");
    display.innerHTML = output;
}

/* 
 * Function that sets the output window based on the current state of the
 * BitCalc class.
 */
function setDisplay_auto(state)
{

    // alert(state.firstSign);

    const display = document.getElementById("display");
    let message;
    let FT_local = state.firstTild;
    let ST_local = state.secondTild;
    let FS_local = state.firstSign;
    let SS_local = state.secondSign;

    let conversion;
    if (state.base === 2) {
        conversion = function (binary, isSigned, size) {return Bin_To_String(binary, isSigned, size)};
    } else if (state.base === 10) {
        conversion = function (binary, isSigned, size) {return Bin_To_Dec(binary, isSigned, size)};
    } else if (state.base === 16) {
        conversion = function (binary, isSigned, size) {return Bin_To_Hex(binary, isSigned, size)};
    }

    switch (state.readStage)
    {

        /* Display 0 and toggle tilde sign. */
        case 0:

            if ((Bin_To_Dec(state.firstOp, state.isSigned, state.size) === 0) && (state.base !== 2)) {
                message = "Enter Input";
            } else {
                message = (FS_local ? "-" : "" ) + (FT_local ? "~" : "" ) + 
                            conversion(state.firstOp, state.isSigned, state.size);
            }

            // message = (FT_local ? ("~" + conversion(state.firstOp)) : "Enter Input");

            display.innerHTML = message;
            break;

        /* Toggle the ~ sign in front of the first operand. */
        case 1:

            message = (FS_local ? "-" : "" ) + (FT_local ? "~" : "" ) + 
                        conversion(state.firstOp, state.isSigned, state.size);
            display.innerHTML = message;
            break;

        /* Same as before but with a binary operator. */
        case 2:

            message = (FS_local ? "-" : "" ) + (FT_local ? "~" : "" ) + 
                        conversion(state.firstOp, state.isSigned, state.size) + " " + 
                        state.operator;
            display.innerHTML = message;
            break;

        /* Same as before unless ~ is inputted. */
        case 3: 
        
            message = (FS_local ? "-" : "" ) + (FT_local ? "~" : "" ) + 
                        conversion(state.firstOp, state.isSigned, state.size) + " " + 
                        state.operator + " " +
                        (SS_local ? "-" : "" ) + (ST_local ? "~" : "" ) +
                        ((SS_local || ST_local) ? "0" : "" );
            display.innerHTML = message;
            break;
        
        /* Same as case 2 but with the second operand. */
        case 4:

            message = (FS_local ? "-" : "" ) + (FT_local ? "~" : "" ) + 
                        conversion(state.firstOp, state.isSigned, state.size) + " " + 
                        state.operator + " " +
                        (SS_local ? "-" : "" ) + (ST_local ? "~" : "" ) +
                        conversion(state.secondOp, state.isSigned, state.size);
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
            isSigned: false,
            size: 32,
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
        // alert("Click Processed");

        switch (command) {

            /* ============================================================ *\
             *  First checking for numeral inputs                           *
            \* ============================================================ */
            case "A": case "B": case "C": case "D": case "E": case "F":

                if (this.state.base < 16) {
                    break;
                } else {
                    switch (command) {
                        case "A":
                            command = 10;
                            break;
                        case "B":
                            command = 11;
                            break;
                        case "C":
                            command = 12;
                            break;
                        case "D":
                            command = 13;
                            break;
                        case "E":
                            command = 14;
                            break;
                        case "F":
                            command = 15;
                            break;
                        default:
                            command = 0;
                    }
                }

            case "2": case "3": case "4": case "5":
            case "6": case "7": case "8": case "9":

                if (this.state.base < 10) {
                    break;
                }

            case "0": case "1": 

                let bin = Dec_To_Bin(command, this.state.size);
                let multiplier = this.state.base;

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

                    let prevFirst = Dec_To_Bin(multiplier * Bin_To_Dec(this.state.firstOp, this.state.isSigned, this.state.size),
                                                this.state.size);
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

                    let prevSecond = Dec_To_Bin(multiplier * Bin_To_Dec(this.state.secondOp, this.state.isSigned, this.state.size),
                                        this.state.size);
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

                    let prev = evaluate(this.state);
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
                let RS_local1 = this.state.readStage;
                if ((RS_local1 === 0) || (RS_local1 === 1)) {
                    newTild = !(this.state.firstTild);

                    if ( !(this.state.firstSign) ) {
                        RS_local1 = this.state.firstOp ? 1 : 0;
                    }

                    this.setState({ 
                        firstTild: newTild,
                        readStage: RS_local1
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
             *  The +/- button works almost the same as the ~ button, save  *
             *  for some code that cancels out double negative signs.       *
            \* ============================================================ */
            case "+/-":

                // alert("huh");
                if ( !(this.state.isSigned) ) {
                    break;
                }

                // alert("AAA");

                let newNegative;
                let RS_local2 = this.state.readStage;
                if ((RS_local2 === 0) || (RS_local2 === 1)) {
                    newNegative = !(this.state.firstSign);

                    if ( !(this.state.firstTild) ) {
                        RS_local2 = this.state.firstOp ? 1 : 0;
                    }

                    let firstLocal = this.state.firstOp;
                    // if ((newNegative && (Bin_To_Dec(firstLocal, this.state.isSigned, this.state.size) < 0)) ||
                    //     (!newNegative && (Bin_To_Dec(firstLocal, this.state.isSigned, this.state.size) > 0))) {
                    if (Bin_To_Dec(firstLocal, this.state.isSigned, this.state.size) < 0) {
                        // alert("changed");
                        firstLocal = Bitwise_change(firstLocal, this.state.size);
                    }
                    // alert("isNegative: " + newNegative);

                    this.setState({
                        firstOp: firstLocal,
                        firstSign: newNegative,
                        readStage: RS_local2
                    }, () => {
                        setDisplay_auto(this.state);
                    });
                } else {
                    newNegative = !(this.state.secondSign);

                    let secondLocal = this.state.secondOp;
                    if (newNegative && Bin_To_Dec(secondLocal, this.state.isSigned, this.state.size) < 0) {
                        secondLocal = Bitwise_change(secondLocal, this.state.size);
                    }

                    this.setState({
                        secondOp: secondLocal,
                        secondSign: newNegative 
                    }, () => {
                        setDisplay_auto(this.state);
                    });
                }

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
                }, () => {
                    setDisplay_auto(this.state);
                });

                // setDisplay("Enter Input");

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
                    newFirst = Dec_To_Bin( parseInt(Bin_To_Dec(this.state.firstOp, this.state.isSigned, this.state.size) / this.state.base), 
                                            this.state.size );
                    if (Bin_To_Dec(newFirst, this.state.isSigned, this.state.size) === 0) {
                        newStage--;
                        newFT = false;
                    }
                } else if (this.state.readStage === 3) {
                    newOperator = "";
                    newStage = 1;
                } else if (this.state.readStage === 4) {
                    newSecond = Dec_To_Bin( parseInt(Bin_To_Dec(this.state.secondOp, this.state.isSigned, this.state.size) / this.state.base),
                                            this.state.size );
                    if (Bin_To_Dec(newSecond, this.state.isSigned, this.state.size) === 0) {
                        newStage--;
                        newST = false;
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

                let result = evaluate(this.state);

                this.setState({
                    firstOp: result,
                    secondOp: new Array(64).fill(0),
                    operator: "",
                    firstSign: (Bin_To_Dec(result, this.state.isSigned, this.state.size) < 0) ? true : false,
                    firstTild: false,
                    secondSign: false,
                    secondTild: false,
                    readStage: 0
                }, () => {

                    // alert(this.state.firstSign);

                    if (this.state.base === 2) {
                        setDisplay("= " + Bin_To_String(result, this.state.isSigned, this.state.size));
                    } else if (this.state.base === 10) {
                        // alert(result);
                        setDisplay("= " + Bin_To_Dec(result, this.state.isSigned, this.state.size));
                    } else if (this.state.base === 16) {
                        setDisplay("= " + Bin_To_Hex(result, this.state.isSigned, this.state.size));
                    }

                });

                break;

            /* ============================================================ *\
             *  If the base button is clicked, cycle through the base       *
             *  supported by the calculator.                                *
            \* ============================================================ */
            case "Base":

                const baseButton = document.getElementById("base");
                const hexButtons = document.getElementsByClassName("hexButton");
                const decButtons = document.getElementsByClassName("decButton");

                let currBase = baseButton.innerHTML;
                let newBase;
                let newLabel;
                if (currBase === "BIN") {
                    newBase = 10;
                    newLabel = "DEC";
                } else if (currBase === "DEC") {
                    newBase = 16;
                    newLabel = "HEX";
                } else if (currBase === "HEX") {
                    newBase = 2;
                    newLabel = "BIN";
                }

                // /* Toggling Buttons */
                // for (let i = 0; i < hexButtons.length; i++) {
                //     hexButtons[i].disabled = (newBase !== 16);
                // }
                // for (let i = 0; i < decButtons.length; i++) {
                //     decButtons[i].disabled = (newBase === 2);
                // }

                baseButton.innerHTML = newLabel;

                this.setState({
                    base: newBase
                }, () => {
                    setDisplay_auto(this.state);
                });

                break;

            /* ============================================================ *\
             *  If the representation button is clicked, cycle through the  *
             *  integer representations (sizes/signages) supported by the   *
             * calculator.                                                  *
            \* ============================================================ */
            case "Rep":

                const repButton = document.getElementById("rep");
                const changeButton = document.getElementById("change");

                let currRep = repButton.innerHTML;
                let newRep;
                let newSign;
                let newSize;
                if (currRep === "U32") {
                    newRep = "S32";
                    newSign = true;
                    newSize = 32;
                } else if (currRep === "S32") {
                    newRep = "U64";
                    newSign = false;
                    newSize = 64;
                } else if (currRep === "U64") {
                    newRep = "S64";
                    newSign = true;
                    newSize = 64;
                } else if (currRep === "S64") {
                    newRep = "U32";
                    newSign = false;
                    newSize = 32;
                }

                /* Toggling Buttons */
                if (newSign) {
                    changeButton.disabled = false;
                } else {
                    changeButton.disabled = true;
                }
                // alert("isSigned: " + newSign);
                // alert("Button Disabled: " + document.getElementById("change").disabled);

                /* Cropping Operands */
                let croppedFirst = this.state.firstOp;
                let croppedSecond = this.state.secondOp;
                if (newSize === 32) {
                    for (let i = 63; i >= 32; i--) {
                        croppedFirst[i] = 0;
                        croppedSecond[i] = 0;
                    }
                }

                repButton.innerHTML = newRep;

                this.setState({
                    isSigned: newSign,
                    size: newSize,
                    firstOp: croppedFirst,
                    secondOp: croppedSecond
                }, () => {

                    if ((this.state.readStage === 0) && ( Bin_To_Dec(croppedFirst, newSign, newSize) !== 0 )) {
                        if (this.state.base === 2) {
                            setDisplay("= " + Bin_To_String(croppedFirst, newSign, newSize));
                        } else if (this.state.base === 10) {
                            setDisplay("= " + Bin_To_Dec(croppedFirst, newSign, newSize));
                        } else if (this.state.base === 16) {
                            setDisplay("= " + Bin_To_Hex(croppedFirst, newSign, newSize));
                        }
                    } else {
                        setDisplay_auto(this.state);
                    }

                });

                break;

            /* ============================================================ *\
             *  If input can't be found, display error message              *
            \* ============================================================ */
            default:

                invalid(command);

                this.setState({
                    firstOp: new Array(64).fill(0),
                    secondOp: new Array(64).fill(0),
                    readStage: 0
                }, () => {
                    setDisplay_auto(this.state);
                });

                // setDisplay("Enter Input");

        }
    }

    /* Render a single button */
    renderButton(command) {

        return (
            <CalcButton
                name={command}
                onClick={ () => this.handleClick(command) }
                base={this.state.base}
                isSigned={this.state.isSigned}
            />
        )

    }

/* ======================================================================== *\
 *  Function: render                                                        *
 *  Description: Renders the BitCalc UI.                                    *
 *  Input:  None.                                                           *
 *  Output: An HTML block containing all the components for the BitCalc     *
 *          program.                                                        *
\* ======================================================================== */
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
                        {this.renderButton("Base")}
                        {this.renderButton("Rep")}
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
                    <div>
                        {this.renderButton("+/-")}
                        {this.renderButton("0")}
                        {this.renderButton("=")}
                    </div>
                </div>
                <div class="nameTag">
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
