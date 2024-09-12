// get location latitude an dlongitude, needs promise because it is async and returns a callback
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (loc) => {
        const { coords } = loc;
        let { latitude, longitude } = coords;
        latitude = latitude.toFixed(7);
        longitude = longitude.toFixed(7);
        resolve({ latitude, longitude });
      },
      (err) => {
        reject(err);
      }
    );
  });
}

const apikey = "appid=9d501e56a8e930079560a69ea2acf9b7";

// Make a GET request to the OpenWeatherMap API
const userAction = async () => {
  try {
    const { latitude, longitude } = await getCurrentLocation();
    const formatting = `lat=${latitude}&lon=${longitude}&`;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?${formatting}${apikey}`;
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

    const myJson = await response.json();

    return myJson;
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("content").innerHTML = "Error fetching data.";
  }
};

// Convert Kelvin to Celsius, because API returns kelvin for whatever reason
const convertKelvinToCelsius = (kelvin) => {
  return Math.round(kelvin - 273.15);
};


// the actual function that gets the data and updates the DOM
const waitForData = async () => {
  const data = await userAction();
  document.getElementById("location").innerHTML = data.name;
  var temps = String(convertKelvinToCelsius(data.main.temp));
  document.getElementById("temp").innerHTML = temps + " &deg;C";
  // remove the skeleton block when the data is loaded
  document.getElementById("body").classList.remove("skeleton-block");
  document.getElementById("humidity").innerHTML = data.main.humidity + "%";
  document.getElementById("wind").innerHTML = data.wind.speed + " m/s";
  document.getElementById("feelslike").innerHTML =
    "Feels like : " +
    String(convertKelvinToCelsius(data.main.feels_like)) +
    " &deg;C";
  document.getElementById("content").innerHTML = data.weather[0].description;

  // set the weather image, provided by the API's icon code
  document.getElementById(
    "weather_image"
  ).src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  chrome.action.setIcon({
    path: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
  });
  // set the background image based on the weather, using the weather's id
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundImage =
    "url(https://images.unsplash.com/photo-1433863448220-78aaa064ff47)";
  if (data.weather[0].id > 800) {
    document.body.style.backgroundImage =
      "url(https://images.unsplash.com/photo-1511796638626-185958765b0f)";
  } else if (data.weather[0].id == 800) {
    document.body.style.backgroundImage =
      "url(https://images.unsplash.com/photo-1724337133759-79872a17ad3a)";
  } else if (data.weather[0].id >= 700) {
    document.body.style.backgroundImage =
      "url(https://images.unsplash.com/photo-1522163723043-478ef79a5bb4)";
  } else if (data.weather[0].id >= 600) {
    document.body.style.backgroundImage =
      "https://images.unsplash.com/photo-1482386308359-4d3ec385e0f7";
  } else if (data.weather[0].id >= 500) {
    document.body.style.backgroundImage =
      "url(https://images.unsplash.com/photo-1527766833261-b09c3163a791)";
  } else if (data.weather[0].id >= 300) {
    document.body.style.backgroundImage =
      "url(https://images.unsplash.com/photo-1493314894560-5c412a56c17c)";
  } else if (data.weather[0].id >= 200) {
    document.body.style.backgroundImage =
      "url(https://images.unsplash.com/photo-1457528877294-b48235bdaa68)";
  }
  // console.log(data);
  // remove the skeleton lines when the data is loaded
  document.querySelectorAll("div").forEach((item) => {
    item.classList.remove("skeleton-lines");
  });
};

// makes the clock work and updates every second using the set interval of 1000 miliseconds
//  clock is formatted to locale of Indonesia, 24 hour format
// TODO: Localize the clock to the user's location
function updateClock() {
  const now = new Date();
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  const timeString = now.toLocaleString("ud-ID", options);
  document.getElementById("time").textContent = timeString;
}

// For the timer
var setTime;
// set the timer using the timerBtn component
document.getElementById("timerBtn").addEventListener("click", setTimer);

// check if there is a timer set
function checkTimer(){
  
  if(setTime){  
    document.getElementById("jamMasuk").classList.add("d-none");
    document.getElementById("jamKeluar").classList.remove("d-none");
    document.getElementById("jamKeluar").classList.add("d-block");
  }else{
    try{
      chrome.storage.local.get("timer", function(data){
        setTime = data.timer;
        console.log(setTime);
        if(setTime){
          // console.log("timer set");
          runTimer();
        }else{
          // console.log("no timer set");
        }
      });
    }catch(e){
      console.log("error getting timer");
    }
    document.getElementById("jamKeluar").classList.add("d-none");
    document.getElementById("jamMasuk").classList.remove("d-none");
    document.getElementById("jamMasuk").classList.add("d-block");
  }
}

// update the timer based on the time set, using differences and modulus
function updateTimer(){
  if(setTime){
    var now = new Date();
    var diff = setTime - now;
    if(diff < 0){
      setTime = null;
      checkTimer();
      clearTimer();
    }else{
      var hours = Math.floor(diff / 1000 / 60 / 60);
      var minutes = Math.floor(diff / 1000 / 60) % 60;
      var seconds = Math.floor(diff / 1000) % 60;
      // console.log(hours, minutes, seconds);
      document.getElementById("timer").innerHTML = `${hours}:${minutes}:${seconds}`;
    }
  }
}
// add hours to date, used to set timer with hours and minutes
Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}
// add minutes to date
Date.prototype.addMinutes = function(mins) {
  this.setTime(this.getTime() + (mins*60*1000));
  return this;
}

// set the timer by taking the value of the input form 
//then setting the timer by adding hours and minutes that have been set in the input form
function setTimer() {
  event.preventDefault();
  var time = document.getElementById("masuk").value;
  time = time.split(":");
  var date = new Date();
  date.addHours(Number(time[0]));
  date.addMinutes(Number(time[1]));
  setTime = date;
  try{
    chrome.storage.local.set({"timer": setTime.getTime()}, function(){
      // console.log("timer set");
    });
    // run the timer down every second
    runTimer();
  }catch(e){
    console.log("error setting timer");
  }
  console.log(setTime);
  checkTimer();
}
// reset the timer
document.getElementById("endTimer").addEventListener("click", clearTimer);
function clearTimer() {
  setTime = null;
  try{
    chrome.storage.local.remove("timer", function(){
      // console.log("timer cleared");
    });
  }catch(e){
    console.log("error clearing timer");
  }
  checkTimer();
}

const runTimer = () => {
  setInterval(updateTimer, 1000);
  updateTimer();
  checkTimer();
}

checkTimer();
// update the clock every second
setInterval(updateClock, 1000);
updateClock();

// wait for the data to load from the API
waitForData();
