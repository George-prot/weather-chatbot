const axios = require('axios');
require('dotenv').config({ path: 'C:/Users/aek_g/Desktop/weather-chatbot/openweatherApiKey.env' });

const RECAST_API_TOKEN = process.env.RECAST_API_TOKEN;
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
console.log('RECAST_API_TOKEN:', RECAST_API_TOKEN);

// Function to process input through RecastAI
const getIntentFromRecast = async (userInput) => {
    try {
        const response = await axios.post(
            'https://api.cai.tools.sap/build/v1/dialog',
            { message: { content: userInput, type: 'text' } },
            {
                headers: {
                    Authorization: `Token ${RECAST_API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.results;
    } catch (error) {
        console.error('Error with RecastAI API:', error);
        return null;
    }
};

// Function to get weather data from OpenWeatherMap
const getWeather = async (city) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;
    try {
        const response = await axios.get(url);
        const data = response.data;
        return `The weather in ${city} is ${data.weather[0].description} with a temperature of ${data.main.temp}°C.`;
    } catch (error) {
        return 'Could not retrieve weather data. Please check the city name or try again later.';
    }
};

// Main function to handle user input
const handleInput = async (userInput) => {
    const recastResponse = await getIntentFromRecast(userInput);

    if (!recastResponse) {
        return "I'm sorry, I couldn't understand that. Could you rephrase?";
    }

    const intent = recastResponse.intent;
    const entities = recastResponse.entities;
    const city = entities.location ? entities.location[0].raw : 'London'; // Default to London if no city found

    if (intent.slug === 'weather-get') {
        return await getWeather(city);
    } else if (intent.slug === 'weather-forecast') {
        return `I currently don't support detailed forecasts. However, I can show you the current weather in ${city}.`;
    } else {
        return "I'm not sure how to help with that. Try asking about the weather!";
    }
};

// Example usage
(async () => {
    const userInput = "What's the weather in London?";
    const response = await handleInput(userInput);
    console.log(response);
})();
