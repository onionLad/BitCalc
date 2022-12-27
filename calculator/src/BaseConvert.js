/* 
 * BaseConvert.js
 * Bill Xia
 * 12/23/22
 * 
 * Purpose: A suite of functions that convert values between binary, decimal,
 *          and hexadecimal representations.
 */

/* ======================================================================== *\
 * Purpose: Coverts a decimal input into a binary array.                    *
\* ======================================================================== */
function Dec_To_Bin(decimal)
{
    let binary = new Array(64).fill(0);
    decimal = parseInt(decimal);

    /* Max value is 2^64 - 1 */
    for (let i = 63; i >= 0; i--) {

        /* 
         * If decimal is greater than or equal to the current place value, we
         * set that place value to.
         */
        if (decimal >= (2**i)) {
            binary[i] = 1;

            /* Updating decimal for the next iteration. */
            decimal -= (2**i);
        }
    }

    return binary;
}

/* ======================================================================== *\
 * Purpose: Converts a binary array into a decimal value with value smaller *
 *          than 2^52.                                                      *
\* ======================================================================== */
function Bin_To_Dec(binary)
{
    let decimal = 0;
    for (let i = (binary.length - 1); i >= 0; i--) {
        decimal += binary[i] * (2**i);
    }

    /*
     * If decimal exceeds the max value of a JS number, we need to manually
     * find its value.
     */
    if (decimal > 4503599627370495) {
        return Bin_To_Large_Dec(binary);
    }
    return decimal;
}

/* ======================================================================== *\
 * Purpose: Converts a binary array into a decimal value with value larger  *
 *          than 2^52.                                                      *
\* ======================================================================== */
function Bin_To_Large_Dec(binary)
{
    let largeNum = 0;
    let smallNum = 0;
    for (let i = (binary.length - 1); i >= 0; i--) {
        largeNum += binary[i] * (2**i);
        smallNum += (binary[i] * (2**i)) % 1000000;
    }

    smallNum = smallNum % 1000000;
    let upperChunk = parseInt(largeNum / 1000000);

    /* There's definitely a clearner way to write this chunk. */
    if (smallNum < 10) {
        return "" + upperChunk + "00000" + smallNum;
    } else if (smallNum < 100) {
        return "" + upperChunk + "0000" + smallNum;
    } else if (smallNum < 1000) {
        return "" + upperChunk + "000" + smallNum;
    } else if (smallNum < 10000) {
        return "" + upperChunk + "00" + smallNum;
    } else if (smallNum < 100000) {
        return "" + upperChunk + "0" + smallNum;
    }

    return "" + upperChunk + smallNum;
}

export {Dec_To_Bin};
export {Bin_To_Dec};
