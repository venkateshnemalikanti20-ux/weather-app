let input = document.getElementById("cityinput")
let button = document.getElementById("searchbtn")
let tempature = document.getElementById("temp")
let cityname = document.getElementById("city")
let humidity = document.getElementById("humidity")
let wind = document.getElementById("wind")
let feels = document.getElementById("feels")
let description = document.getElementById("description")
let login = localStorage.getItem("login")
let suggestions = document.getElementById("suggestions")
button.addEventListener("click",function(){
	let city = input.value.trim()
	if(city === ""){
		alert("Please enter city name!")
	}
	else{
		getweather(city)
	}
})
input.addEventListener("input",function(){
	let city = input.value.trim()
	console.log(city.length)
	if(city === ""){
		suggestions.innerHTML = ""
		clearWeather();
	}
	 getSuggestions(city)
})
function clearWeather() {
    tempature.textContent = "--°C";
    cityname.textContent = "Search for a city";
    humidity.textContent = "Humidity: --";
    wind.textContent = "Wind: --";
    feels.textContent = "Feels Like: --";
    description.textContent = "Description: --";
}
async function getSuggestions(city) {
    try {
        let url = `https://weather-app-r342.onrender.com/suggestions?city=${city}`;

        let response = await fetch(url);

        if (!response.ok) {
            console.log("Unable to fetch suggestions");
            return;
        }

        let data = await response.json();

        if (input.value.trim() === "") {
            suggestions.innerHTML = "";
            return;
        }

        suggestions.innerHTML = "";

        if (data.features.length === 0) {
            console.log("No cities found");
            return;
        }

        data.features.forEach(function(place) {

            let div = document.createElement("div");

            div.textContent = place.properties.formatted;

            div.classList.add("suggestion-item");

            div.addEventListener("click", function() {

                input.value = place.properties.city;
                suggestions.innerHTML = "";
                getweather(place.properties.city);

            });

            suggestions.appendChild(div);

        });

    } catch (error) {
        console.log("Server Error");
    }
}
async function getweather(city) {

    cityname.textContent = "Loading...";

    try {

        let response = await fetch(`https://weather-app-r342.onrender.com/weather?city=${city}`);
        if (!response.ok) {
            cityname.textContent = "City not found!";
            return;
        }

        let data = await response.json();
		changeBackground(data.description)

        cityname.textContent = "City: " + data.city;
        tempature.textContent = "Temperature: " + data.temperature + " °C";
        humidity.textContent = "Humidity: " + data.humidity + "%";
        wind.textContent = "Wind: " + data.wind + " m/s";
        feels.textContent = "Feels Like: " + data.feelsLike + " °C";
        description.textContent = "Description: " + data.description;

    } catch (error) {

        cityname.textContent = "Server Error";

    }
}
function changeBackground(weather){
	document.body.classList.remove(
	"sunny",
	"cloudy",
	"rainy",
	"thunder",
	"snow",
	"night"
	)
	weather = weather.toLowerCase()
	if(weather.includes("clear")){
		document.body.classList.add("sunny")
	}
	else if(weather.includes("cloud")){
		document.body.classList.add("cloudy")
	}
	else if(weather.includes("thunder")){
		document.body.classList.add("thunder")
	}
	else if(weather.includes("rain")){
		document.body.classList.add("rainy")
	}
	else if(weather.includes("snow")){
		document.body.classList.add("snow")
	}
	else{
		document.body.classList.add(background)
	}
}
async function getWeatherNews(){
	const response = await fetch("https://weather-app-r342.onrender.com/news")
    const articles = await response.json()	
	const newsContainer = document.getElementById("newsContainer")
	newsContainer.innerHTML = "" 
	articles.forEach(article => {
      console.log(article)
    newsContainer.innerHTML += `
    
    <div class="col-lg-4 col-md-6 col-12 mb-4">

        <div class="card news-card h-100">

            <img
                src="${article.image}"
                class="card-img-top"
                alt="Weather News">

            <div class="card-body">

                <h5 class="card-title">
                    ${article.title}
                </h5>

                <p class="card-text">
                    ${article.description}
                </p>

                <a
                    href="${article.url}"
                    target="_blank"
                    class="btn btn-primary">
                    Read More
                </a>

            </div>

        </div>

    </div>

    `;

});
}
getWeatherNews()
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("service-worker.js")
            .then(() => {
                console.log("Service Worker Registered Successfully");
            })
            .catch((error) => {
                console.log("Service Worker Registration Failed", error);
            });
    });
}
