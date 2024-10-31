require('dotenv').config({ path: './openweatherApiKey.env' });
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(express.json());

// Ensure the API key is defined
if (!process.env.OPENWEATHER_API_KEY) {
    console.error('ERROR: OpenWeatherMap API key is not set. Please check your .env file.');
    process.exit(1); // Exit if the key is missing
}

// Dialogflow Webhook Endpoint
app.post('/webhook', async (req, res) => {

    console.log('Received webhook request:', req.body); // Log the incoming request for debugging
    res.status(200).send('Webhook received successfully');

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

        // Return weather data from OpenWeatherMap API
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
//const PORT = process.env.PORT || 5000;
// Start the server
app.listen(PORT, () => {
    console.log(`The Server is running on port ${PORT}`);
});
