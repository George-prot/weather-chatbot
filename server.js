require('dotenv').config({ path: './openweatherApiKey.env' });
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON request
app.use(express.json());

// Ensure the API key is defined
if (!process.env.OPENWEATHER_API_KEY) {
    console.error('ERROR: OpenWeatherMap API key is not set. Please check your .env file.');
    process.exit(1); // Exit if the key is missing
}

// Dialogflow Webhook Endpoint
app.post('/webhook', async (req, res) => {
    console.log('Webhook endpoint hit');
    console.log('Received webhook request:', req.body);

    const city = req.body.queryResult.parameters.address?.city || lastCity;
    const temp_unit = req.body.queryResult.parameters.unit || 'C';
    const dateTime = req.body.queryResult.parameters['date-time'];
    console.log('Start Date:', dateTime.startDate);
    console.log('End Date:', dateTime.endDate);
    if (!city) {
        return res.json({
            fulfillmentText: "Please specify the city you'd like weather information for."
        });
    }
    lastCity = city; // Save city for future requests

    const unit = temp_unit === 'F' ? 'imperial' : (temp_unit === 'K' ? 'standard' : 'metric');
    const unit_symbol = unit === 'imperial' ? 'F' : (unit === 'standard' ? 'K' : 'C');

    const now = new Date();
    const fiveDaysLater = new Date(now);
    fiveDaysLater.setDate(now.getDate() + 5);

    try {
        // Handle current weather if no date is specified
        if (!dateTime) {
            endDateMemory = null; // Reset end date memory for single-date or current requests
            const currentWeather = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: {
                    q: city,
                    appid: process.env.OPENWEATHER_API_KEY,
                    units: unit,
                }
            });
            const description = currentWeather.data.weather[0].description;
            const temp = currentWeather.data.main.temp;
            return res.json({
                fulfillmentText: `The current weather in ${city} is ${description} with a temperature of ${temp}\u00B0${unit_symbol}.`
            });
        }

        const startDate = new Date(dateTime.startDate || dateTime);
        const endDate = dateTime.endDate ? new Date(dateTime.endDate) : null;

        // Check if request is for a single date (no endDate) or a range
        if (!endDate) {
            endDateMemory = null; // Reset end date memory for specific single-date requests

            if (startDate < now) {
                return res.json({
                    fulfillmentText: `I can only provide current and future weather data. Historical data is not available.`
                });
            }

            if (startDate > fiveDaysLater) {
                return res.json({
                    fulfillmentText: `I can only provide a forecast up to 5 days from today. Please specify a date within the next 5 days.`
                });
            }

            // Fetch weather for the specific date if within 5 days
            const forecastResponse = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
                params: {
                    q: city,
                    appid: process.env.OPENWEATHER_API_KEY,
                    units: unit,
                }
            });

            // Find the closest forecast data to the requested date
            const forecastList = forecastResponse.data.list;
            const specificForecast = forecastList.find(forecast => {
                const forecastDate = new Date(forecast.dt * 1000);
                return forecastDate.toDateString() === startDate.toDateString();
            });

            if (specificForecast) {
                const description = specificForecast.weather[0].description;
                const temp = specificForecast.main.temp;
                return res.json({
                    fulfillmentText: `The weather in ${city} on ${startDate.toLocaleDateString()} at ${startDate.toLocaleTimeString()} is expected to be ${description} with a temperature of ${temp}\u00B0${unit_symbol}.`
                });
            } else {
                return res.json({
                    fulfillmentText: `I couldn't find specific forecast data for ${city} on ${startDate.toLocaleDateString()}.`
                });
            }
        } else {
            // Handle forecast range up to 5 days
            if (startDate < now) {
                return res.json({
                    fulfillmentText: `I can only provide current and future weather data. Historical data is not available.`
                });
            }

            if (endDate > fiveDaysLater) {
                let endDate = req.body.queryResult.parameters['date-time']?.endDate || new Date(); // Limit to 5 days from now
            }
            endDateMemory = endDate; // Store endDate for future requests if needed

            // Fetch 5-day forecast
            const forecastResponse = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
                params: {
                    q: city,
                    appid: process.env.OPENWEATHER_API_KEY,
                    units: unit,
                }
            });

            const forecastList = forecastResponse.data.list;

            // Filter forecasts within the specified date range
            const forecastsInRange = forecastList.filter(forecast => {
                const forecastDate = new Date(forecast.dt * 1000);
                return forecastDate >= startDate && forecastDate <= endDate;
            });

            if (forecastsInRange.length === 0) {
                return res.json({
                    fulfillmentText: `I couldn't find forecast data for ${city} in the specified date range.`
                });
            }

            // Format the forecast data
            const responseText = forecastsInRange.map(forecast => {
                const forecastDate = new Date(forecast.dt * 1000);
                return `${forecastDate.toLocaleDateString()} at ${forecastDate.toLocaleTimeString()}: ${forecast.weather[0].description} with a temperature of ${forecast.main.temp}\u00B0${unit_symbol}.`;
            }).join('\n');

            if (endDate > fiveDaysLater) {
                return res.json({
                    fulfillmentText: `Note: I can only provide up to 5 days of forecast data. Here's the forecast for ${city} from ${startDate.toLocaleDateString()} to ${fiveDaysLater.toLocaleDateString()}:\n${responseText}\n\n`
                });
            } else {
                return res.json({
                    fulfillmentText: `Here's the forecast for ${city} from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}:\n${responseText}\n\n`
                }); }
        }

    } catch (error) {
        console.error('Error fetching weather data:', error);
        return res.json({
            fulfillmentText: "I couldn't retrieve the weather data at the moment. Please try again later."
        });
    }
});

// Root Test Route
app.get('/', (req, res) => {
    res.send('Root route is working');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.all('*', (req, res) => {
    console.log('Received unknown request on path:', req.path);
    res.status(404).send('Route not found');
});