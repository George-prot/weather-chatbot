require('dotenv').config({ path: 'C:/Users/aek_g/Desktop/weather-chatbot/openweatherApiKey.env'});
const axios = require('axios');

//console.log(process.env.OPENWEATHER_API_KEY);
const getWeather = async (city) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    try {
        const response = await axios.get(url);
        const data = response.data;
        return `The weather in ${city} is ${data.weather[0].description} with a temperature of ${data.main.temp}°C.`;
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
