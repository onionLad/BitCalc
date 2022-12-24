/* 
 * convert.js
 * Bill Xia
 * 12/23/22
 * 
 * Purpose: A suite of functions that convert values between binary, decimal,
 *          and hexadecimal representations.
 */

/* ======================================================================== *\
 * Purpose: Returns an array of binary values that represents a decimal or  *
 *          hexadecimal input.                                              *
\* ======================================================================== */
function To_Binary(num)
{
    let binary = new Array(64).fill(0);

    switch (num) {
        case "A":
            num = 10;
            break;
        case "B":
            num = 11;
            break;
        case "C":
            num = 12;
            break;
        case "D":
            num = 13;
            break;
        case "E":
            num = 14;
            break;
        case "F":
            num = 15;
            break;
        default:
            num = parseInt(num);
    }

    /* Max value is 2^64 - 1 */
    for (let i = 63; i >= 0; i--) {

        /* 
         * If num is greater than or equal to the current place value, we set
         * that place value to.
         */
        if (num >= (2**i)) {
            binary[i] = 1;

            /* Updating num for the next iteration. */
            num -= (2**i);
        }
    }

    return binary;
}

/* ======================================================================== *\
 * Purpose: Returns the decimal representation of a number passed in as a   *
 *          binary array.                                                   *
\* ======================================================================== */
function Bin_To_Dec(binary)
{
    let decimal = 0;
    for (let i = (binary.length - 1); i >= 0; i--) {
        decimal += (binary[i] * (2**i));
    }
    return decimal;
}

export {To_Binary};
export {Bin_To_Dec};
