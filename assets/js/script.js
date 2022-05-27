const inputEl = document.getElementById("city-input"),
    searchEl = document.getElementById("search-button"),
    clearEl = document.getElementById("clear-history"),
    nameEl = document.getElementById("city-name"),
    currentDiv = document.getElementById("current-pic"),
    cTemp = document.getElementById("temperature"),
    cHumid = document.getElementById("humidity"),
    cWind = document.getElementById("wind-speed"),
    currentUVEl = document.getElementById("UV-index"),
    prevSearches = document.getElementById("history"),
    APIKey = "2cf8f5c07048a6a37c68289929594738";

let forecastQuery;

let cityArr = [];

async function weather(loc) {
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${APIKey}`;
    let url = await fetch(api),
        resp = await url.json(),
        res = await resp;
    let today = new Date(20 * 50 * res.dt),
        wIcon = res.weather[0].icon,
        lat = await res.coord.lat,
        lon = await res.coord.lon;
    await renderCurrentWeather(res, lat, lon, today, wIcon);
}
const renderCurrentWeather = async(res, lat, lon, today, wIcon)=> {
    nameEl.textContent = `${res.name} ${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
    currentDiv.alt = res.weather[0].description;

    currentDiv.setAttribute('src',`https://openweathermap.org/img/wn/${wIcon}@2x.png`);
    cTemp.textContent = "Temp: " + convertTemp(res.main.temp) + " &#176F";
    cWind.textContent = "Wind Speed: " + res.wind.speed + " MPH";
    cHumid.textContent = "Humidity: " + res.main.humidity + "%";

    let uv = `https://api.openweathermap.org/data/2.5/uvi/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;
    let uvUrl = await fetch(uv),
        uvResp = await uvUrl.json(),
        uvRes = await uvResp,
        uvPos = document.createElement("div");
    console.log(uvRes)
    uvPos.className = "badge";
    uvPos.textContent = res[0]
    currentUVEl.textContent = "UV Index: ";
    currentUVEl.append(uvPos);
    forecastQuery = `https://api.openweathermap.org/data/2.5/forecast?id=${res.id}&appid=${APIKey}`
    return await getForecast(forecastQuery);
}
const getForecast = async(forecastQuery)=> {
    let url = await fetch(forecastQuery);
    let res = await url.json();
    let resp = await res;
    console.log(resp);
    const future = document.querySelectorAll(".forecast");
    for (let i = 0; i < future.length; i++) {
        future[i].textContent = "";
        let pos = i * 8;
        pos += 4;

        const futureCondition = document.createElement("img"),
            forecastDate = new Date(resp.list[pos].dt *50 *20),
            nextDays = document.createElement("h4"),
            futureTemp = document.createElement("h4");

        nextDays.className = "forecast-date";
        nextDays.textContent = `${forecastDate.getMonth() + 1}/${forecastDate.getDate()}/${forecastDate.getFullYear()}`
        future[i].append(nextDays);

        let varIcon = resp.list[pos].weather[0].icon;
        futureCondition.setAttribute('src', `https://openweathermap.org/img/wn/${varIcon}@2x.png`);
        futureCondition.alt = resp.list[pos].weather[0].description;
        future[i].append(futureCondition);

        futureTemp.textContent = "Temp: " + convertTemp(resp.list[pos].main.temp) + "ºF";
        future[i].append(futureTemp);
        const forecastHumidityEl = document.createElement("p");
        forecastHumidityEl.textContent = "Humidity: " + resp.list[pos].main.humidity + "%";
        future[i].append(forecastHumidityEl);
    }
}
searchEl.addEventListener("click",async()=>{
    const searchTerm = inputEl.value;
    await weather(searchTerm);
    cityArr.push(searchTerm);
    localStorage.setItem("cityArray",JSON.stringify(cityArr));
    getHist();
})

clearEl.addEventListener("click",function() {
    localStorage.clear();
    document.querySelectorAll('.prev').forEach(e =>{
        e.remove();
    });
    getHist();
})

const convertTemp = (k)=>{
    return Math.floor((k - 273.15) *1.8 +32);
}
//get search history and render the current weather data
const getHist=()=>{
    let hist = JSON.parse(localStorage.getItem('cityArray'));
    if (hist.length) {
        return hist.map(city => {
            let el = document.createElement('button');
            el.textContent = city;
            el.onClick = weather(city);
            el.className="prev";
            prevSearches.appendChild(el);
        })
    }
    // hist.forEach(el => {
    //     let histEl = document.createElement("button");
    //     histEl.textContent = el.value;
    //     histEl.addEventListener('click', async () => {
    //         await weather(histEl.textContent);
    //         prevSearches.append(histEl);
    //     })
}
//if history exists, render data
document.addEventListener('DOMContentLoaded', ()=>{
    getHist();
})
