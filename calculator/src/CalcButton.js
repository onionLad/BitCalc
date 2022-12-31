/* ======================================================================== *\
 *  File:       CalcButton.js                                               *
 *  Author:     Bill Xia                                                    *
 *  Created:    12/31/22                                                    *
 *                                                                          *
 *  Purpose:    Contains a function that returns HTML buttons for the       *
 *              BitCalc calculator UI.                                      *
\* ======================================================================== */

/* ======================================================================== *\
 *  Function: CalcButton                                                    *
 *  Description: Creates an HTML button.                                    *
 *  Input:  The name of the button, a function to call when the button is   *
 *          clicked, the BitCalc program's current base, and the BitCalc    *
 *          program's current signage (whether it's signed or unsigned).    *
 *  Output: An HTML button.                                                 *
\* ======================================================================== */
function CalcButton(args)
{
    /*
     * The base and representation buttons each have a special ID that lets
     * the BitCalc class methods interact with them.
     */
    if (args.name === "Base") {
        return (
            <button
                class="calcButton"
                id="base"
                onClick={ args.onClick }
            >
                DEC
            </button>
        )
    } else if (args.name === "Rep") {
        return (
            <button
                class="calcButton"
                id="rep"
                onClick={ args.onClick }
            >
                U32
            </button>
        )
    }

    /*
     * The 0 button has its own case because it's formatted differently from
     * the other calculator buttons.
     */
    else if (args.name === "0") {
        return (
            <button
                class="zeroButton"
                onClick={ args.onClick }
            >
                {args.name}
            </button>
        )
    }

    /*
     * The +/- button must be disabled/enabled based on the current state of
     * the calculator.
     */
    else if (args.name === "+/-") {

        let isDisabled;
        if (args.isSigned === true) {
            isDisabled = false;
        } else {
            isDisabled = true;
        }

        return (
            <button
                disabled={isDisabled}
                class="changeButton"
                id="change"
                onClick={ args.onClick }
            >
                {args.name}
            </button>
        )

    }

    /*
     * The hexadecimal-exclusive digit buttons are disabled when the BitCalc
     * program isn't in base 16.
     */
    else if ((args.name === "A") || (args.name === "B") ||
                (args.name === "C") || (args.name === "D") ||
                (args.name === "E") || (args.name === "F")) {

        let isNotHex;
        if (args.base === 16) {
            isNotHex = false;
        } else {
            isNotHex = true;
        }

        return (
            <button
                disabled={isNotHex}
                class="hexButton"
                onClick={ args.onClick }
            >
                {args.name}
            </button>
        )
    }

    /*
     * The non-binary digit buttons are disabled when the BitCalc program
     * isn't in base 10 or base 16.
     */
    else if ((args.name === "2") || (args.name === "3") ||
                (args.name === "4") || (args.name === "5") ||
                (args.name === "6") || (args.name === "7") ||
                (args.name === "8") || (args.name === "9")) {
        
        let tooSmall;
        if (args.base >= 10) {
            tooSmall = false;
        } else {
            tooSmall = true;
        }
        
        return (
            <button
                disabled={tooSmall}
                class="decButton"
                onClick={ args.onClick }
            >
                {args.name}
            </button>
        )
    }

    /* Base Case. */
    else {
        return (
            <button
                class="calcButton"
                onClick={ args.onClick }
            >
                {args.name}
            </button>
        )
    }

}

/* ======================================================================== *\
 *  EXPORTS                                                                 *
\* ======================================================================== */

export {CalcButton};
