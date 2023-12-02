// const fetch = require('node-fetch');

import { Box, Typography, Dialog, DialogTitle, DialogContent, Button, SvgIcon} from "@mui/material";
import { useEffect, useState } from "react";

// getting date
const date = new Date();
var month = date.getMonth() + 1;
var day = date.getDate();
var year = date.getFullYear();
var today = `${year}-${month}-${day}`;

const API_KEY = "AJ9C85JYEPDC8Q6S8VDNKMA64";
const API_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/77840/" + today + "?key=" + API_KEY + "&iconSet=icons2";

function processWeatherData(response) {
    var day = response.days[0];
    var min = day.tempmin;
    var max = day.tempmax;
    var curr = day.temp;
    var conditions = day.conditions;
    var icon = day.icon;
    var description = day.description;
    var svg;
//     if (icon === "partly-cloudy-day") {
//         svg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 113.56 78.96"><defs><style>{`.cls-1{fill:#f5b952;}.cls-2{fill:#cae3f6;}.cls-3,.cls-4,.cls-5{fill:none;stroke-miterlimit:10;stroke-width:4px;}.cls-3,.cls-4{stroke:#000;}.cls-4{stroke-linecap:square;}.cls-5{stroke:#0a0b0b;}`}</style></defs><title>partly-cloudy-dayAsset 159colored</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M40.4,15.88A24.8,24.8,0,1,0,65.19,40.67,24.82,24.82,0,0,0,40.4,15.88Z"/><path class="cls-2" d="M91,77H38.92c-2.19,0-5.09-1.72-5.92-3.58a9.49,9.49,0,0,1-.4-9.56,9.78,9.78,0,0,1,9.37-5c1.57.08,1.9-.5,2.09-1.8a23.93,23.93,0,0,1,19.7-19.77l.12,0a24,24,0,0,1,16,3.39c.46.28.93.6,1.39.94a24.66,24.66,0,0,1,6.47,7.32l.75,1.27"/><path class="cls-2" d="M66.19,63.82a10.32,10.32,0,0,1,8.23-8.68,11.11,11.11,0,0,1,2-.15,10.62,10.62,0,0,1,7.19,2.78,10,10,0,0,1,2.84,4.75"/><path class="cls-2" d="M80.26,55.63c3-4.65,9.95-6.36,15.49-5.22a12.58,12.58,0,0,1,10,9.69c.71,3.06.93,4.22,3.29,5.86,3.36,2.33,3.13,7.53.41,10a4.19,4.19,0,0,1-2.61,1h-18"/><line class="cls-2" x1="94.67" y1="76.95" x2="100.07" y2="76.95"/><path class="cls-3" d="M63.22,31A24.79,24.79,0,1,0,28.14,62"/><line class="cls-4" x1="40.21" y1="15.51" x2="40.21" y2="2"/><line class="cls-4" x1="15.51" y1="40.47" x2="2" y2="40.47"/><line class="cls-4" x1="22.7" y1="22.88" x2="13.14" y2="13.32"/><line class="cls-4" x1="57.81" y1="22.7" x2="67.36" y2="13.14"/><line class="cls-4" x1="22.88" y1="57.99" x2="13.32" y2="67.54"/><path class="cls-5" d="M91,77H38.92c-2.19,0-5.09-1.72-5.92-3.58a9.49,9.49,0,0,1-.4-9.56,9.78,9.78,0,0,1,9.37-5c1.57.08,1.9-.5,2.09-1.8a23.93,23.93,0,0,1,19.7-19.77l.12,0a24,24,0,0,1,16,3.39c.46.28.93.6,1.39.94a24.66,24.66,0,0,1,6.47,7.32l.75,1.27"/><path class="cls-5" d="M66.19,63.82a10.32,10.32,0,0,1,8.23-8.68,11.11,11.11,0,0,1,2-.15,10.62,10.62,0,0,1,7.19,2.78,10,10,0,0,1,2.84,4.75"/><path class="cls-5" d="M80.26,55.63c3-4.65,9.95-6.36,15.49-5.22a12.58,12.58,0,0,1,10,9.69c.71,3.06.93,4.22,3.29,5.86,3.36,2.33,3.13,7.53.41,10a4.19,4.19,0,0,1-2.61,1h-3.36"/><line class="cls-5" x1="94.67" y1="76.95" x2="100.07" y2="76.95"/></g></g></svg>;
//     }
//     else if (icon === "clear-day") {
//         svg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80.68 80.68"><defs><style>{`.cls-1{fill:#f5b952;}.cls-2,.cls-3{fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:4px;}.cls-3{stroke-linecap:square;}`}</style></defs><title>clear-dayAsset 157colored</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M40.25,15.51A24.8,24.8,0,1,0,65,40.31,24.83,24.83,0,0,0,40.25,15.51Z"/><path class="cls-2" d="M40.25,15.51A24.8,24.8,0,1,0,65,40.31,24.83,24.83,0,0,0,40.25,15.51Z"/><line class="cls-3" x1="40.21" y1="15.51" x2="40.21" y2="2"/><line class="cls-3" x1="40.47" y1="65.17" x2="40.47" y2="78.68"/><line class="cls-3" x1="65.17" y1="40.21" x2="78.68" y2="40.21"/><line class="cls-3" x1="15.51" y1="40.47" x2="2" y2="40.47"/><line class="cls-3" x1="22.7" y1="22.88" x2="13.14" y2="13.32"/><line class="cls-3" x1="57.99" y1="57.81" x2="67.54" y2="67.36"/><line class="cls-3" x1="57.81" y1="22.7" x2="67.36" y2="13.14"/><line class="cls-3" x1="22.88" y1="57.99" x2="13.32" y2="67.54"/></g></g></svg>;
//     }
//     else if (icon === "clear-night") {
//         svg = 
//         <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
//              viewBox="-5 4.8 52.1 56.2" style="enable-background:new -5 4.8 52.1 56.2;" >
//         <style type="text/css">{`
//             .st0{fill:#EAD88C;}
//             .st1{fill:none;stroke:#000000;stroke-width:3;stroke-miterlimit:10;}
//             .st2{fill:none;}
//             `}</style>
//         <title>clear-nightAsset 158colored</title>
//         <g>
//             <path class="st0" d="M28.9,11.5C16.1,13,6.9,24.4,8.1,37.3C9.3,50.1,20.8,59.4,33.5,58c3-0.4,5.7-1.2,8.5-2.7
//                 c-1.6-1.1-3-2.3-4.3-3.7c-4.5-4.2-7.6-9.6-8.6-15.7C28,28.5,30,21.4,32.3,16.5c0.8-1.6,1.6-3.4,2.6-4.9C33,11.3,31,11.3,28.9,11.5z
//                 "/>
//             <path class="st1" d="M28.9,11.5C16.1,13,6.9,24.4,8.1,37.3C9.3,50.1,20.8,59.4,33.5,58c3-0.4,5.7-1.2,8.5-2.7
//                 c-1.6-1.1-3-2.3-4.3-3.7c-4.5-4.2-7.6-9.6-8.6-15.7C28,28.5,30,21.4,32.3,16.5c0.8-1.6,1.6-3.4,2.6-4.9C33,11.3,31,11.3,28.9,11.5z
//                 "/>
//             <path class="st2" d="M50.1,14l-0.4-0.3c-5-3.6-11.1-5.2-18.3-4.6c-3.9,0.3-11.3,4-11.5,4.2C10.7,18.7,6,31.2,9,42.2
//                 c0.3,1,0.6,1.9,1,2.9c1.4,3.6,3.7,6.9,6.6,9.5"/>
//         </g>
//         </svg>;
//     }
//     else if (icon === "cloudy") {
//         svg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84.06 43.94"><defs><style>{`.cls-1{fill:#cae3f6;}.cls-2{fill:none;stroke:#0a0b0b;stroke-miterlimit:10;stroke-width:4px;}`}</style></defs><title>cloudyAsset 161colored</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M61.52,42.56H9.42c-2.18,0-5.08-1.72-5.91-3.59a9.47,9.47,0,0,1-.41-9.55,9.79,9.79,0,0,1,9.38-5c1.57.08,1.89-.49,2.09-1.8A23.9,23.9,0,0,1,34.26,2.88l.12,0a24,24,0,0,1,16,3.38c.47.29.94.6,1.4,1a24.37,24.37,0,0,1,6.46,7.32L59,15.78"/><path class="cls-1" d="M36.7,29.41a10.32,10.32,0,0,1,8.22-8.68,13.4,13.4,0,0,1,2-.15,10.68,10.68,0,0,1,7.19,2.78A10.16,10.16,0,0,1,57,28.12"/><path class="cls-1" d="M50.77,21.22c3-4.64,9.95-6.35,15.49-5.21a12.57,12.57,0,0,1,10,9.69c.7,3.05.93,4.22,3.29,5.85,3.36,2.33,3.12,7.54.4,10a4.26,4.26,0,0,1-2.6,1h-18"/><line class="cls-1" x1="65.18" y1="42.55" x2="70.57" y2="42.55"/><path class="cls-2" d="M61.52,41.94H9.42c-2.18,0-5.08-1.72-5.91-3.58A9.49,9.49,0,0,1,3.1,28.8a9.79,9.79,0,0,1,9.38-5c1.57.08,1.89-.49,2.09-1.79A23.9,23.9,0,0,1,34.26,2.26l.12,0a24.08,24.08,0,0,1,16,3.38c.47.29.94.61,1.4,1a24.49,24.49,0,0,1,6.46,7.32L59,15.16"/><path class="cls-2" d="M36.7,28.79a10.31,10.31,0,0,1,8.22-8.67A12.28,12.28,0,0,1,47,20a10.64,10.64,0,0,1,7.19,2.79A10.08,10.08,0,0,1,57,27.5"/><path class="cls-2" d="M50.77,20.61c3-4.65,9.95-6.36,15.49-5.22a12.58,12.58,0,0,1,10,9.69c.7,3.06.93,4.22,3.29,5.86,3.36,2.32,3.12,7.53.4,10a4.26,4.26,0,0,1-2.6,1H74"/><line class="cls-2" x1="65.18" y1="41.93" x2="70.57" y2="41.93"/></g></g></svg>;
//     }
//     else if (icon === "fog") {
//         svg = <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px"
//         viewBox="29 0.6 121.6 63.4" style="enable-background:new 29 0.6 121.6 63.4;" >
//    <style type="text/css">{`
//        .st0{fill:none;stroke:#221F1F;stroke-width:2.5;stroke-linecap:round;stroke-miterlimit:10;}`}
//    </style>
//    <title>3Asset 227FOG</title>
//    <g id="XMLID_5_">
//        <path id="XMLID_4_" class="st0" d="M35.3,24.8c0,0,25,13.7,55.7,1.7s50.3-0.4,54.6,2.1"/>
//        <path id="XMLID_3_" class="st0" d="M35.3,38c0,0,25,13.7,55.7,1.7s50.3-0.4,54.6,2.1"/>
//        <path id="XMLID_2_" class="st0" d="M34.3,51.2c0,0,25,13.7,55.7,1.7s50.3-0.4,54.6,2.1"/>
//        <path id="XMLID_1_" class="st0" d="M35.3,11.6c0,0,25,13.7,55.7,1.7s50.3-0.4,54.6,2.1"/>
//    </g>
//    </svg>;
//     }
//     else if (icon === "hail") {
//         svg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 79.62 81.74"><defs><style>{`.cls-1{fill:#cae3f6;}.cls-2,.cls-3{fill:none;stroke-miterlimit:10;}.cls-2{stroke:#231f20;stroke-width:3.5px;}.cls-3{stroke:#0a0b0b;stroke-width:4px;}`}</style></defs><title>hailAsset 175colored</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><circle class="cls-1" cx="18.82" cy="55.71" r="7.76"/><circle class="cls-1" cx="39.06" cy="55.71" r="7.76"/><circle class="cls-1" cx="59.85" cy="55.71" r="7.76"/><circle class="cls-1" cx="29.18" cy="74.35" r="5.64"/><circle class="cls-1" cx="47.29" cy="74.35" r="5.64"/><path class="cls-1" d="M58.62,40.09H9.71a6.89,6.89,0,0,1-5.55-3.41,9,9,0,0,1,8.42-13.85c1.47.08,1.78-.47,2-1.71A22.63,22.63,0,0,1,33,2.29l.11,0a22.34,22.34,0,0,1,15,3.22c.44.28.88.58,1.31.91a23.1,23.1,0,0,1,6.07,7l.71,1.21"/><path class="cls-1" d="M35.31,27.57A9.77,9.77,0,0,1,43,19.3a10.75,10.75,0,0,1,1.91-.14,9.91,9.91,0,0,1,6.75,2.65,9.55,9.55,0,0,1,2.67,4.53"/><path class="cls-1" d="M48.52,19.77c2.83-4.43,9.34-6.06,14.54-5A11.88,11.88,0,0,1,72.47,24c.67,2.91.88,4,3.09,5.58,3.16,2.22,2.94,7.18.38,9.52a3.92,3.92,0,0,1-2.44,1H56.58"/><line class="cls-1" x1="62.05" y1="40.09" x2="67.11" y2="40.09"/><circle class="cls-2" cx="18.82" cy="55.71" r="7.76"/><circle class="cls-2" cx="39.06" cy="55.71" r="7.76"/><circle class="cls-2" cx="59.85" cy="55.71" r="7.76"/><circle class="cls-2" cx="29.18" cy="74.35" r="5.64"/><circle class="cls-2" cx="47.29" cy="74.35" r="5.64"/><path class="cls-3" d="M58.22,39.72H9a7,7,0,0,1-5.59-3.38,9,9,0,0,1-.38-9,9.25,9.25,0,0,1,8.86-4.71c1.48.08,1.79-.46,2-1.69A22.6,22.6,0,0,1,32.47,2.24h.12A22.69,22.69,0,0,1,47.66,5.42q.66.41,1.32.9a23.26,23.26,0,0,1,6.11,6.91l.71,1.2"/><path class="cls-3" d="M34.77,27.31a9.73,9.73,0,0,1,7.77-8.2A10.79,10.79,0,0,1,44.46,19a10.05,10.05,0,0,1,6.79,2.62,9.68,9.68,0,0,1,2.69,4.49"/><path class="cls-3" d="M48.06,19.57c2.85-4.38,9.4-6,14.63-4.92a11.85,11.85,0,0,1,9.47,9.15c.67,2.89.88,4,3.11,5.53,3.18,2.2,3,7.12.39,9.44a4,4,0,0,1-2.47.95H70"/><line class="cls-3" x1="61.67" y1="39.72" x2="66.77" y2="39.72"/></g></g></svg>;
//     }
//     else if (icon === "rain") {
//         svg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84.06 69.39"><defs><style>{`.cls-1{fill:#cae3f6;}.cls-2,.cls-3{fill:none;stroke-miterlimit:10;}.cls-2{stroke:#000;stroke-linecap:round;stroke-width:3px;}.cls-3{stroke:#0a0b0b;stroke-width:4px;}`}</style></defs><title>rainAsset 162colored</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M61.52,42.12H9.42c-2.18,0-5.08-1.72-5.91-3.59A9.47,9.47,0,0,1,3.1,29a9.79,9.79,0,0,1,9.38-5c1.57.08,1.89-.49,2.09-1.8A23.9,23.9,0,0,1,34.26,2.44l.12,0a24,24,0,0,1,16,3.38c.47.29.94.6,1.4,1a24.37,24.37,0,0,1,6.46,7.32L59,15.34"/><path class="cls-1" d="M36.7,29a10.32,10.32,0,0,1,8.22-8.68,13.4,13.4,0,0,1,2-.15,10.68,10.68,0,0,1,7.19,2.78A10.16,10.16,0,0,1,57,27.68"/><path class="cls-1" d="M50.77,20.78c3-4.64,9.95-6.35,15.49-5.21a12.57,12.57,0,0,1,10,9.69c.7,3,.93,4.22,3.29,5.85,3.36,2.33,3.12,7.54.4,10a4.26,4.26,0,0,1-2.6,1h-18"/><line class="cls-1" x1="65.18" y1="42.11" x2="70.57" y2="42.11"/><line class="cls-2" x1="67.9" y1="62.01" x2="61.69" y2="67.89"/><line class="cls-2" x1="25.68" y1="62.01" x2="19.48" y2="67.89"/><line class="cls-2" x1="46.79" y1="62.01" x2="40.59" y2="67.89"/><line class="cls-2" x1="67.9" y1="49.22" x2="61.69" y2="55.1"/><line class="cls-2" x1="25.68" y1="49.22" x2="19.48" y2="55.1"/><line class="cls-2" x1="46.79" y1="49.22" x2="40.59" y2="55.1"/><path class="cls-3" d="M61.52,41.94H9.42c-2.18,0-5.08-1.72-5.91-3.58A9.49,9.49,0,0,1,3.1,28.8a9.79,9.79,0,0,1,9.38-5c1.57.08,1.89-.49,2.09-1.79A23.9,23.9,0,0,1,34.26,2.26l.12,0a24.08,24.08,0,0,1,16,3.38c.47.29.94.61,1.4,1a24.49,24.49,0,0,1,6.46,7.32L59,15.16"/><path class="cls-3" d="M36.7,28.79a10.31,10.31,0,0,1,8.22-8.67A12.28,12.28,0,0,1,47,20a10.64,10.64,0,0,1,7.19,2.79A10.08,10.08,0,0,1,57,27.5"/><path class="cls-3" d="M50.77,20.61c3-4.65,9.95-6.36,15.49-5.22a12.58,12.58,0,0,1,10,9.69c.7,3.06.93,4.22,3.29,5.86,3.36,2.32,3.12,7.53.4,10a4.26,4.26,0,0,1-2.6,1H74"/><line class="cls-3" x1="65.18" y1="41.93" x2="70.57" y2="41.93"/></g></g></svg>;
//     }
//     else if (icon === "rain-snow") {
//         svg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84.06 73.32"><defs><style>{`.cls-1{fill:#cae3f6;}.cls-2,.cls-3,.cls-4{fill:none;stroke-miterlimit:10;}.cls-2,.cls-3{stroke:#000;}.cls-2{stroke-width:2.5px;}.cls-3{stroke-linecap:round;stroke-width:3px;}.cls-4{stroke:#0a0b0b;stroke-width:4px;}`}</style></defs><title>rain-snowAsset 166colored</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M61.63,41.86H9.79c-2.17,0-5-1.71-5.88-3.57a9.42,9.42,0,0,1-.4-9.5,9.74,9.74,0,0,1,9.32-5c1.57.08,1.89-.49,2.08-1.78A23.81,23.81,0,0,1,34.51,2.38l.12,0A23.88,23.88,0,0,1,50.5,5.73c.47.28.93.6,1.39.94A24.41,24.41,0,0,1,58.33,14l.74,1.27"/><path class="cls-1" d="M36.93,28.78a10.24,10.24,0,0,1,8.18-8.63,12.09,12.09,0,0,1,2-.16,10.57,10.57,0,0,1,7.15,2.77,10,10,0,0,1,2.84,4.73"/><path class="cls-1" d="M50.93,20.63c3-4.62,9.9-6.32,15.41-5.19a12.53,12.53,0,0,1,10,9.64c.7,3,.92,4.2,3.27,5.83,3.34,2.32,3.11,7.5.4,9.94a4.23,4.23,0,0,1-2.59,1H59.47"/><line class="cls-1" x1="65.26" y1="41.85" x2="70.63" y2="41.85"/><polyline class="cls-2" points="12.91 70.81 18.27 65.15 23.55 70.64"/><polyline class="cls-2" points="23.55 48.67 18.19 54.32 12.91 48.83"/><line class="cls-2" x1="18.19" y1="45.97" x2="18.19" y2="73.32"/><polyline class="cls-2" points="29.39 64.97 23.74 59.6 29.23 54.32"/><polyline class="cls-2" points="7.25 54.32 12.91 59.69 7.42 64.97"/><line class="cls-2" x1="4.55" y1="59.69" x2="31.91" y2="59.69"/><line class="cls-3" x1="67.9" y1="64.01" x2="61.69" y2="69.89"/><line class="cls-3" x1="46.79" y1="64.01" x2="40.59" y2="69.89"/><line class="cls-3" x1="67.9" y1="51.22" x2="61.69" y2="57.1"/><line class="cls-3" x1="46.79" y1="51.22" x2="40.59" y2="57.1"/><path class="cls-4" d="M61.52,41.94H9.42c-2.18,0-5.08-1.72-5.91-3.58A9.49,9.49,0,0,1,3.1,28.8a9.79,9.79,0,0,1,9.38-5c1.57.08,1.89-.49,2.09-1.79A23.9,23.9,0,0,1,34.26,2.26l.12,0a24.08,24.08,0,0,1,16,3.38c.47.29.94.61,1.4,1a24.49,24.49,0,0,1,6.46,7.32L59,15.16"/><path class="cls-4" d="M36.7,28.79a10.31,10.31,0,0,1,8.22-8.67A12.28,12.28,0,0,1,47,20a10.64,10.64,0,0,1,7.19,2.79A10.08,10.08,0,0,1,57,27.5"/><path class="cls-4" d="M50.77,20.61c3-4.65,9.95-6.36,15.49-5.22a12.58,12.58,0,0,1,10,9.69c.7,3.06.93,4.22,3.29,5.86,3.36,2.32,3.12,7.53.4,10a4.26,4.26,0,0,1-2.6,1H74"/><line class="cls-4" x1="65.18" y1="41.93" x2="70.57" y2="41.93"/></g></g></svg>;
//     }
//     else if (icon === "rain-snow-showers-day") {
//         svg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 101.39 100.4"><defs><style>{`.cls-1{fill:#f5b952;}.cls-2{fill:#cae3f6;}.cls-3,.cls-4,.cls-5,.cls-6,.cls-7{fill:none;stroke-miterlimit:10;}.cls-3,.cls-4,.cls-5,.cls-6{stroke:#000;}.cls-3{stroke-width:2.5px;}.cls-4{stroke-linecap:round;stroke-width:3px;}.cls-5,.cls-6,.cls-7{stroke-width:4px;}.cls-6{stroke-linecap:square;}.cls-7{stroke:#0a0b0b;}`}</style></defs><title>rain-snow-showers-dayAsset 167colored</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M36.52,13.88A22.63,22.63,0,1,0,59.15,36.5,22.65,22.65,0,0,0,36.52,13.88Z"/><path class="cls-2" d="M81.18,68.4H35a6.55,6.55,0,0,1-5.25-3.17,8.41,8.41,0,0,1-.36-8.47,8.68,8.68,0,0,1,8.31-4.41c1.4.07,1.69-.44,1.86-1.6A21.19,21.19,0,0,1,57,33.23l.1,0a21.34,21.34,0,0,1,14.15,3c.41.25.83.54,1.24.84a21.86,21.86,0,0,1,5.73,6.49l.66,1.13"/><path class="cls-2" d="M59.17,56.75a9.15,9.15,0,0,1,7.3-7.69,11.41,11.41,0,0,1,1.79-.14,9.49,9.49,0,0,1,6.38,2.47,8.9,8.9,0,0,1,2.52,4.21"/><path class="cls-2" d="M71.65,49.49c2.67-4.11,8.82-5.63,13.73-4.62a11.16,11.16,0,0,1,8.89,8.59c.62,2.71.82,3.74,2.92,5.19,3,2.06,2.77,6.68.35,8.86a3.8,3.8,0,0,1-2.31.89h-16"/><line class="cls-2" x1="84.42" y1="68.4" x2="89.2" y2="68.4"/><polyline class="cls-3" points="36.23 97.89 41.6 92.23 46.88 97.72"/><polyline class="cls-3" points="46.88 75.75 41.52 81.4 36.23 75.91"/><line class="cls-3" x1="41.51" y1="73.04" x2="41.51" y2="100.4"/><polyline class="cls-3" points="52.72 92.05 47.06 86.68 52.55 81.4"/><polyline class="cls-3" points="30.58 81.4 36.23 86.76 30.75 92.05"/><line class="cls-3" x1="27.88" y1="86.76" x2="55.24" y2="86.76"/><line class="cls-4" x1="91.22" y1="91.09" x2="85.02" y2="96.97"/><line class="cls-4" x1="70.12" y1="91.09" x2="63.91" y2="96.97"/><line class="cls-4" x1="91.22" y1="79.3" x2="85.02" y2="85.18"/><line class="cls-4" x1="70.12" y1="79.3" x2="63.91" y2="85.18"/><path class="cls-5" d="M56.42,27.77A22,22,0,1,0,25.24,55.29"/><line class="cls-6" x1="35.97" y1="14.01" x2="35.97" y2="2"/><line class="cls-6" x1="14.01" y1="36.2" x2="2" y2="36.2"/><line class="cls-6" x1="20.4" y1="20.56" x2="11.9" y2="12.06"/><line class="cls-6" x1="51.61" y1="20.4" x2="60.1" y2="11.9"/><line class="cls-6" x1="20.56" y1="51.77" x2="12.06" y2="60.26"/><path class="cls-7" d="M81.13,68.63H34.82a6.53,6.53,0,0,1-5.26-3.18A8.4,8.4,0,0,1,29.2,57a8.69,8.69,0,0,1,8.33-4.43c1.4.07,1.69-.44,1.86-1.6A21.26,21.26,0,0,1,56.9,33.36l.11,0a21.37,21.37,0,0,1,14.18,3c.41.26.83.54,1.24.84a21.74,21.74,0,0,1,5.75,6.51l.67,1.13"/><path class="cls-7" d="M59.06,57a9.17,9.17,0,0,1,7.31-7.71,10.54,10.54,0,0,1,1.81-.14,9.47,9.47,0,0,1,6.39,2.47A9,9,0,0,1,77.1,55.8"/><path class="cls-7" d="M71.57,49.67C74.25,45.54,80.41,44,85.34,45a11.19,11.19,0,0,1,8.91,8.62c.63,2.71.83,3.75,2.93,5.2,3,2.07,2.78,6.7.36,8.89a3.83,3.83,0,0,1-2.32.89h-3"/><line class="cls-7" x1="84.38" y1="68.63" x2="89.18" y2="68.63"/></g></g></svg>;
//     }
    svg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 113.56 78.96"><defs><style>{`.cls-1{fill:#f5b952;}.cls-2{fill:#cae3f6;}.cls-3,.cls-4,.cls-5{fill:none;stroke-miterlimit:10;stroke-width:4px;}.cls-3,.cls-4{stroke:#000;}.cls-4{stroke-linecap:square;}.cls-5{stroke:#0a0b0b;}`}</style></defs><title>partly-cloudy-dayAsset 159colored</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M40.4,15.88A24.8,24.8,0,1,0,65.19,40.67,24.82,24.82,0,0,0,40.4,15.88Z"/><path class="cls-2" d="M91,77H38.92c-2.19,0-5.09-1.72-5.92-3.58a9.49,9.49,0,0,1-.4-9.56,9.78,9.78,0,0,1,9.37-5c1.57.08,1.9-.5,2.09-1.8a23.93,23.93,0,0,1,19.7-19.77l.12,0a24,24,0,0,1,16,3.39c.46.28.93.6,1.39.94a24.66,24.66,0,0,1,6.47,7.32l.75,1.27"/><path class="cls-2" d="M66.19,63.82a10.32,10.32,0,0,1,8.23-8.68,11.11,11.11,0,0,1,2-.15,10.62,10.62,0,0,1,7.19,2.78,10,10,0,0,1,2.84,4.75"/><path class="cls-2" d="M80.26,55.63c3-4.65,9.95-6.36,15.49-5.22a12.58,12.58,0,0,1,10,9.69c.71,3.06.93,4.22,3.29,5.86,3.36,2.33,3.13,7.53.41,10a4.19,4.19,0,0,1-2.61,1h-18"/><line class="cls-2" x1="94.67" y1="76.95" x2="100.07" y2="76.95"/><path class="cls-3" d="M63.22,31A24.79,24.79,0,1,0,28.14,62"/><line class="cls-4" x1="40.21" y1="15.51" x2="40.21" y2="2"/><line class="cls-4" x1="15.51" y1="40.47" x2="2" y2="40.47"/><line class="cls-4" x1="22.7" y1="22.88" x2="13.14" y2="13.32"/><line class="cls-4" x1="57.81" y1="22.7" x2="67.36" y2="13.14"/><line class="cls-4" x1="22.88" y1="57.99" x2="13.32" y2="67.54"/><path class="cls-5" d="M91,77H38.92c-2.19,0-5.09-1.72-5.92-3.58a9.49,9.49,0,0,1-.4-9.56,9.78,9.78,0,0,1,9.37-5c1.57.08,1.9-.5,2.09-1.8a23.93,23.93,0,0,1,19.7-19.77l.12,0a24,24,0,0,1,16,3.39c.46.28.93.6,1.39.94a24.66,24.66,0,0,1,6.47,7.32l.75,1.27"/><path class="cls-5" d="M66.19,63.82a10.32,10.32,0,0,1,8.23-8.68,11.11,11.11,0,0,1,2-.15,10.62,10.62,0,0,1,7.19,2.78,10,10,0,0,1,2.84,4.75"/><path class="cls-5" d="M80.26,55.63c3-4.65,9.95-6.36,15.49-5.22a12.58,12.58,0,0,1,10,9.69c.71,3.06.93,4.22,3.29,5.86,3.36,2.33,3.13,7.53.41,10a4.19,4.19,0,0,1-2.61,1h-3.36"/><line class="cls-5" x1="94.67" y1="76.95" x2="100.07" y2="76.95"/></g></g></svg>;
    return {min, max, curr, conditions, icon, description, svg};
}

// const getWeatherData = () => {
//     const 
//     var weatherReport = [];
//     try {
//         const response = await fetch(API_URL);
//         const json = await response.json();
//         weatherReport = processWeatherData(json);

//     } catch (error) {
//         console.log(error);
//     }
//     return weatherReport;
// }

export const Weather = () => {
    const [ weather, setWeather ] = useState({});
    const [open, setOpen] = useState(false);

    const handleBoxClick = () => {
        setOpen(true);
    };
    
      const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const getWeatherData = async () => {
            try {
                const response = await fetch(API_URL);
                const json = await response.json();
                // console.log(json);
                setWeather(processWeatherData(json));
            }
            catch (error) {
                console.log(error);
            }
            // console.log(weather);
        }
        getWeatherData();
    }, []);

    if (Object.entries(weather).length === 0) {
        return <div>L</div>; // Added a loading placeholder
    }
    // console.log(weather);

    return (
        <>
            <Box sx={{alignItems: 'center', m: 1 }} onClick={handleBoxClick}>
                {/* First Line with Icon and Text */}
                <Box>
                    {/* <Icon height='100%'>
                        {<img src={'./WeatherIcons/'+weather.icon+'.svg'}></img>}
                    </Icon> */}
                    <SvgIcon>
                        weather.svg    
                    </SvgIcon>
                    <Typography variant="string">
                        {` ${weather.curr}°`}
                    </Typography>
                </Box>

                {/* Second Line */}
                <div>
                    <Typography variant="string">
                        {`${weather.conditions}`}
                    </Typography>
                </div>

                {/* Third Line */}
                <div>
                    <Typography variant="string">
                        {`\nH: ${weather.min}° L: ${weather.max}°`}
                    </Typography>
                </div>

                {/* Dialog for the Pop-up */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Today's Weather</DialogTitle>
                    <DialogContent>
                        <Typography>
                            {`${weather.description}`}
                        </Typography>
                    </DialogContent>
                    <Button onClick={handleClose}>Close</Button>
                </Dialog>
            </Box>
        </>
    )
}

