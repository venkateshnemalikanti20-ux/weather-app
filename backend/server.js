const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

// Load environment variables
dotenv.config();
console.log("API KEY:", process.env.WEATHER_API_KEY);

// Create Express App
const app = express();

// Enable CORS
app.use(cors());

// Read values from .env
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.WEATHER_API_KEY;
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;

// Home Route
app.get("/", (req, res) => {
    res.send("Weather Backend Server Running");
});

// Weather Route
app.get("/weather", async (req, res) => {
    const city = req.query.city;

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        res.json({
    city: response.data.name,
    temperature: response.data.main.temp,
    humidity: response.data.main.humidity,
    wind: response.data.wind.speed,
    feelsLike: response.data.main.feels_like,
    description: response.data.weather[0].description
});

    } catch (error) {
    console.log("========== ERROR ==========");
    console.log(error.response?.status);
    console.log(error.response?.data);
    console.log(error.message);
    console.log("===========================");

    res.status(500).json({
        message: "Unable to fetch weather data"
    });
}
});
// Suggestions Route
app.get("/suggestions", async (req, res) => {
    const city = req.query.city;

    try {
        const response = await axios.get(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${city}&apiKey=${GEOAPIFY_API_KEY}`
        );

        res.json(response.data);

    } catch (error) {
        console.log("Geoapify Error:", error.response?.data || error.message);

        res.status(500).json({
            message: "Unable to fetch suggestions"
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});