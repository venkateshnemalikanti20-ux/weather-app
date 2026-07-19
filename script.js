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
let apiKey ="735d8b1078874f3c8eef3cf48d7350ff"
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
	let url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${city}&apiKey=${apiKey}`;
	let response = await fetch(url)
	let data = await response.json()
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
async function getweather(city){
	let apikey = "c744a74802428239f3dd32bd7b44e934"
	let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;
    console.log(url)
	cityname.textContent="Loading..."
	let response = await fetch(url)
	if(!response.ok){
		cityname.textContent = "City not found!"
		return
	}
	let data = await response.json()
	cityname.textContent = "City: "+data.name
	tempature.textContent = "Temparature: "+data.main.temp+" °C"
	humidity.textContent = "Humidity: "+data.main.humidity+"%"
	wind.textContent = "Wind: "+data.wind.speed+" m/s"
	feels.textContent = "Feels Like: "+data.main.feels_like+" °C"
	description.textContent = "Description: "+data.weather[0].description
}
