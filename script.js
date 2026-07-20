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
async function getSuggestions(city){
	let url = `http://localhost:3000/suggestions?city=${city}`;
	let response = await fetch(url);

if (!response.ok) {
    console.log("Unable to fetch suggestions");
    return;
}

let data = await response.json();
	if(input.value.trim() === ""){
        suggestions.innerHTML = "";
        return;
    }
	suggestions.innerHTML = ""
	if(data.features.length === 0){
        console.log("No cities found");
        return;
    }

    data.features.forEach(function(place){

        let div = document.createElement("div");

        div.textContent = place.properties.formatted;

        div.classList.add("suggestion-item");
		div.addEventListener("click",function(){
			input.value = place.properties.city
			suggestions.innerHTML = ""
			getweather(place.properties.city)
		})

        suggestions.appendChild(div);

    });

}
async function getweather(city) {

    cityname.textContent = "Loading...";

    try {

        let response = await fetch(`http://localhost:3000/weather?city=${city}`);

        if (!response.ok) {
            cityname.textContent = "City not found!";
            return;
        }

        let data = await response.json();

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
