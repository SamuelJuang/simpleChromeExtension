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

// Make a GET request
const userAction = async () => {
  try {
    const { latitude, longitude } = await getCurrentLocation();
    const formatting = `lat=${latitude}&lon=${longitude}&`;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?${formatting}${apikey}`;
    console.log(apiUrl);
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
  document.getElementById("location").innerHTML = data.name;
  var temps = String(convertKelvinToCelsius(data.main.temp));
  document.getElementById("temp").innerHTML = temps + " &deg;C";
  document.getElementById("body").classList.remove("skeleton-block");
  document.getElementById("humidity").innerHTML = data.main.humidity + "%";
  document.getElementById("wind").innerHTML = data.wind.speed + " m/s";
  document.getElementById("feelslike").innerHTML =
    "Feels like : " +
    String(convertKelvinToCelsius(data.main.feels_like)) +
    " &deg;C";
  document.getElementById("content").innerHTML = data.weather[0].description;
  document.getElementById(
    "weather_image"
  ).src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  chrome.action.setIcon({
    path: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
  });
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
  console.log(data);
  document.querySelectorAll("div").forEach((item) => {
    item.classList.remove("skeleton-lines");
  });
};

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

var setTime;

document.getElementById("timerBtn").addEventListener("click", setTimer);

function checkTimer(){
  if(setTime){  
    document.getElementById("jamMasuk").classList.add("d-none");
    document.getElementById("jamKeluar").classList.remove("d-none");
    document.getElementById("jamKeluar").classList.add("d-block");
  }else{
    console.log("no timer set");
    document.getElementById("jamKeluar").classList.add("d-none");
    document.getElementById("jamMasuk").classList.remove("d-none");
    document.getElementById("jamMasuk").classList.add("d-block");
  }
}

function updateTimer(){
  if(setTime){
    var now = new Date();
    var diff = setTime - now;
    if(diff < 0){
      setTime = null;
      checkTimer();
    }else{
      var hours = Math.floor(diff / 1000 / 60 / 60);
      var minutes = Math.floor(diff / 1000 / 60) % 60;
      var seconds = Math.floor(diff / 1000) % 60;
      // console.log(hours, minutes, seconds);
      document.getElementById("timer").innerHTML = `${hours}:${minutes}:${seconds}`;
    }
  }
}

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}

Date.prototype.addMinutes = function(mins) {
  this.setTime(this.getTime() + (mins*60*1000));
  return this;
}

function setTimer() {
  event.preventDefault();
  var time = document.getElementById("masuk").value;
  time = time.split(":");
  var date = new Date();
  date.addHours(Number(time[0]));
  date.addMinutes(Number(time[1]));
  setTime = date;
  try{
    chrome.storage.sync.set({"timer": setTime.getTime()}, function(){
      console.log("timer set");
    });
    setInterval(updateTimer, 1000);
    updateTimer();
    checkTimer();
  }catch(e){
    console.log("error setting timer");
  }
  console.log(setTime);
  checkTimer();
}
document.getElementById("endTimer").addEventListener("click", clearTimer);
function clearTimer() {
  setTime = null;
  checkTimer();
}
setInterval(updateClock, 1000);
updateClock();

waitForData();
