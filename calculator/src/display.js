/* 
 * display.js
 * Bill Xia
 * 12/23/22
 * 
 * Purpose: Holds functions that control the BitCalc output window display.
 */

function displayDec(arr) {
    var sum;
    for (let i = arr.length - 1; i >= 0; i++) {
        sum += (arr[i] * (2**i));
    }
    return sum;
}

export {displayDec};
