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

/* ======================================================================== *\
 *  HELPER FUNCTIONS                                                        *
\* ======================================================================== */

/* Function used to create buttons */
function CalcButton(args) {
    
    if (args.name === '0') {
        return (
            <button
                className="zeroButton"
            >
                {args.name}
            </button>
        )
    } else {
        return (
            <button
                className="calcButton"
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
    
    /* Render a single button */
    renderButton(command) {
        return (
            <CalcButton
                name={command}
            />
        )
    }

    /* This block of code can probably be replaced with a loop. */
    render() {
        return (
            <div class="calcUI">
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
