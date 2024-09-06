const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?lat=0.5262455&lon=101.4515727&appid=9d501e56a8e930079560a69ea2acf9b7";

// Make a GET request
const userAction = async () => {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    console.log(response);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const myJson = await response.json(); // Extract JSON from the HTTP response
    console.log(myJson);

    // Update the DOM with the data
    return myJson;
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("content").innerHTML = "Error fetching data.";
  }
};

const convertKelvinToCelsius = (kelvin) => {
  return Math.round(kelvin - 273.15);
};

console.log("hello");
const waitForData = async () => {
  const data = await userAction();
  console.log(data);
  document.getElementById("location").innerHTML = data.name;
  var temps = String(convertKelvinToCelsius(data.main.temp));
  document.getElementById("temp").innerHTML = temps + " &deg;C";
  document.getElementById("main").classList.remove("skeleton-block");
  document.getElementById("humidity").innerHTML = "Humidity: " + data.main.humidity + "%";
  document.getElementById("wind").innerHTML = "Wind: " + data.wind.speed + " m/s";
  document.getElementById("pressure").innerHTML = "Pressure: " + data.main.pressure + " hPa";
  document.getElementById("feelslike").innerHTML = "Feels like : "  + String(convertKelvinToCelsius(data.main.feels_like)) + " &deg;C";
  document.getElementById("content").innerHTML = (data.weather[0].description);
  document.getElementById("weather_image").src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  chrome.action.setIcon({
    path: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  })
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundImage = "url(https://images.unsplash.com/photo-1433863448220-78aaa064ff47)";
  if(data.weather[0].id > 800){
    document.body.style.backgroundImage = "url(https://images.unsplash.com/photo-1511796638626-185958765b0f)";
  }else if(data.weather[0].id = 800){
    document.body.style.backgroundImage = "url(https://images.unsplash.com/photo-1724337133759-79872a17ad3a)";
  }else if(data.weather[0].id > 700){
    document.body.style.backgroundImage = "url(https://images.unsplash.com/photo-1522163723043-478ef79a5bb4)";
  }else if(data.weather[0].id > 600){
    document.body.style.backgroundImage = "https://images.unsplash.com/photo-1482386308359-4d3ec385e0f7";
  }else if(data.weather[0].id > 500){
    document.body.style.backgroundImage = "url(https://images.unsplash.com/photo-1527766833261-b09c3163a791)";
  }else if(data.weather[0].id > 300){
    document.body.style.backgroundImage = "url(https://images.unsplash.com/photo-1493314894560-5c412a56c17c)";
  }else if(data.weather[0].id > 200){
    document.body.style.backgroundImage = "url(https://images.unsplash.com/photo-1457528877294-b48235bdaa68)";
  }
}

waitForData();
