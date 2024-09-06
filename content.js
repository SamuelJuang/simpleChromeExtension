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
export const waitForData = async () => {
  const data = await userAction();
  console.log(data);
  document.getElementById("location").innerHTML = data.name;
  var temps = String(convertKelvinToCelsius(data.main.temp));
  document.getElementById("temp").innerHTML = temps + " &deg;C";
  document.getElementById("main").classList.remove("skeleton-block");
  document.getElementById("content").innerHTML = data.weather[0].description;
  document.getElementById(
    "weather_image"
  ).src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
};


window.waitForData = waitForData;