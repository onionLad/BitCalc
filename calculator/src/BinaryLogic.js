/* 
 * BinaryLogic.js
 * Bill Xia
 * 12/30/22
 * 
 * Purpose: A suite of functions that performs logical operations on binary
 *          arrays. It may be expanded in a future BitCalc update.
 */

/*
 * Equals.
 */
function Binary_EQ(first, second, size)
{
    for (let i = 0; i < size; i++) {
        if (first[i] !== second[i]) {
            return 0;
        }
    }
    return 1;
}

/* 
 * Greater Than.
 * Determines if the first binary array is larger than the second. 
 */
function Binary_GT(first, second, size, isSigned)
{
    let isGreater = 0;

    /*
     * Four Cases:
     *  1. Both are positive. Check if first's bits are greater.
     *  2. First is negative, second is positive. Return 0 (false).
     *  3. First is positive, second is negative. Return 1 (true).
     *  4. Both are negative. Check if first's bits are lesser.
     */

    let lastIdx = size - 1;
    if (isSigned && (first[lastIdx] === 1)) {

        /* Both Negative */
        if (second[lastIdx] === 1) {

            for (let i = lastIdx; i >= 0; i--) {
                if (first[i] < second[i]) {
                    isGreater = 1;
                }
            }

        }

        /* First Negative */
        else {
            isGreater = 0;
        }

    }

    /* Second Negative */
    else if (isSigned && (second[lastIdx] === 1)) {
        isGreater = 1;
    }

    /* Both Positive */
    else {

        for (let i = lastIdx; i >= 0; i--) {
            if (first[i] > second[i]) {
                isGreater = 1;
            }
        }

    }

    return isGreater;

}

/* ======================================================================== *\
 *  EXPORTS                                                                 *
\* ======================================================================== */

export {Binary_EQ};
export {Binary_GT};
