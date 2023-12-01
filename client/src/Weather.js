// const fetch = require('node-fetch');

import { Box, Divider, Icon, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { WbSunny as SunnyIcon, Cloud as CloudyIcon, Thermostat as TemperatureIcon } from '@mui/icons-material';

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
    return {min, max, curr, conditions, icon};
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
        return <div></div>
    }
    // console.log(weather);

    return (
        // <Box>
            // <SunnyIcon />
        // </Box>
        <>
        <Box sx={{ display: 'flex', alignItems: 'center', m: 1 }}>
    <Icon style={{ maxHeight: 70 }}>
        <SunnyIcon />
        {/* <img src={'./WeatherIcons/'+weather.icon+'.png'} /> */}
    </Icon>
    <Box sx={{ ml: 1, mt:.5 }}>
        {` ${weather.min} / ${weather.max} F`}
    </Box>
</Box>
            {/* <Typography>
                Hello
            </Typography> */}
        </>
    )
}

