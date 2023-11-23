const fetch = require('node-fetch');

// getting date
const date = new Date();
var month = date.getMonth() + 1;
var day = date.getDate();
var year = date.getFullYear();
var today = `${year}-${month}-${day}`;

const API_KEY = "AJ9C85JYEPDC8Q6S8VDNKMA64";
const API_URL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/77840/" + today + "?key=" + API_KEY;

function processWeatherData(response) {
    var day = response.days[0];
    var min = day.tempmin;
    var max = day.tempmax;
    var curr = day.temp;
    var conditions = day.conditions;
    return [min, max, curr, conditions];
}

(async () => {
    try {

        const response = await fetch(API_URL);
        const json = await response.json();
        processWeatherData(json);

    } catch (error) {
        console.log(error);
    }
  })();

  