/* ======================================================================== *\
 *  File:       index.js                                                    *
 *  Author:     Bill Xia                                                    *
 *  Created:    12/22/22                                                    *
 *                                                                          *
 *  Purpose:    The "main" file for the BitCalc program. Renders an         *
 *              instance of the BitCalc class.                              *
\* ======================================================================== */

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
