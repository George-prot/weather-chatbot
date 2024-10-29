require('dotenv').config({ path: './openweatherApiKey.env' });
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());

// Dialogflow Webhook Endpoint
app.post('/webhook', async (req, res) => {
    try {
        // Get the city parameter from Dialogflow's request
        const city = req.body.queryResult.parameters.city;

        if (!city) {
            return res.json({
                fulfillmentText: "I couldn't detect the city. Please specify the city you'd like weather information for."
            });
        }

        // Make a request to OpenWeatherMap API for weather data
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: city,
                appid: process.env.OPENWEATHER_API_KEY,
                units: 'metric'
            }
        });

        const weatherData = weatherResponse.data;
        const description = weatherData.weather[0].description;
        const temp = weatherData.main.temp;

        const responseText = `The weather in ${city} is currently ${description} with a temperature of ${temp}\u00B0C.`;

        return res.json({
            fulfillmentText: responseText
        });
    } catch (error) {
        console.error('Error fetching weather data:', error);

        return res.json({
            fulfillmentText: "I couldn't retrieve the weather data at the moment. Please try again later."
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
