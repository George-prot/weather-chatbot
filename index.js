require('dotenv').config({ path: './openweatherApiKey.env'});
const axios = require('axios');

//console.log(process.env.OPENWEATHER_API_KEY);
const getWeather = async (city) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await axios.get(url);
        const data = response.data;
        //if(data.main.temp.split(".")[1])
        //console.log(data.main.temp);
        //console.log((data.main.temp + "").split(".")[1]);
        if ((data.main.temp + "").split(".")[1] < 5) {
            //const floorTemp = Math.floor(data.main.temp);
            return `The weather in ${city} is ${data.weather[0].description} with a temperature of ${Math.floor(data.main.temp) }\u00B0C.`;
        }
        else {
            //const ceilTemp = Math.ceil(data.main.temp);
            return `The weather in ${city} is ${data.weather[0].description} with a temperature of ${Math.ceil(data.main.temp) }\u00B0C.`;
        }
    } catch (error) {
        return 'Could not retrieve weather data. Please check the city name or try again later.';
    }
};

const chat = async () => {
    const city = process.argv[2] || 'London'; // Pass city as a command-line argument
    const weatherInfo = await getWeather(city);
    console.log(weatherInfo);
};

chat();
