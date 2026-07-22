const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const axios = require("axios")

dotenv.config()

const app = express()


app.use(cors())

const PORT = process.env.PORT || 3000
const API_KEY = process.env.WEATHER_API_KEY
const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY


app.get("/", (req, res) => {
    res.send("Weather Backend Server Running");
})


app.get("/weather", async (req, res) => {
    const city = req.query.city;

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        )

        res.json({
    city: response.data.name,
    temperature: response.data.main.temp,
    humidity: response.data.main.humidity,
    wind: response.data.wind.speed,
    feelsLike: response.data.main.feels_like,
    description: response.data.weather[0].description
})

    } catch (error) {
    
    res.status(500).json({
        message: "Unable to fetch weather data"
    })
}
})
app.get("/news",async(req,res) => {
	try{
		const response = await axios.get("https://gnews.io/api/v4/search",{
		params:{
			q:"weather",
			language:"en",
			max:6,
			sortby:"publishedAt",
			apikey:process.env.GNEWS_API_KEY
		}
		})
		res.json(response.data.articles)
	}
	catch(err){
		res.status(500).json({
			err:"Fail to fetch weather News"
		})
	}
})

app.get("/suggestions", async (req, res) => {
    const city = req.query.city;

    try {
        const response = await axios.get(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${city}&apiKey=${GEOAPIFY_API_KEY}`
        )

        res.json(response.data)

    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch suggestions"
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})