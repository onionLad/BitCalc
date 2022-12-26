/* 
 * index.js
 * Bill Xia
 * 12/22/22
 * 
 * Purpose: Driver file for the BitCalc program.
 */

/* ======================================================================== *\
 *  IMPORTS                                                                 *
\* ======================================================================== */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {BitCalc} from './BitCalc.js';

/* ======================================================================== *\
 *  PROGRAM START                                                           *
\* ======================================================================== */

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<BitCalc/>);
