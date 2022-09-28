/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.toDateString();

/**
 * Personal API key and URL from OpenWeatherApi
 */
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = "&appid=a37f73bdf576f3b5cfc4c3509b295589&units=metric";

// Server side URL
const serverUrl = "http://localhost:8080";

// Get Dom Element
const dateElement = document.getElementById("date");
const tempElement = document.getElementById("temp");
const contentElement = document.getElementById("content");
const cityNameElement = document.getElementById("cityName");
const bigHolder = document.querySelector(".big-holder");

const error = document.getElementById("error");

// add fuction to existing HTML Dom Element by Event Listener
document.getElementById("generate").addEventListener("click", performAction);

//  Function that called in Event Listener
function performAction(e) {
  // Getting Input values
  const zipCode = document.getElementById("zip").value;
  const feelingsCode = document.getElementById("feelings").value;

  /**
   * make a Promise to get data from getWeather Func
   * and Post this Dato to our Server
   * then call a function to Update the UI Elemet
   */
  getWeather(baseURL, zipCode, apiKey).then((data) => {
    console.log(data);

    // display erro message if zip code is wrong
    if (data.cod != 200) {
      error.style.display = "block";
      error.innerHTML = `${data.message}`;
      setTimeout(() => (error.innerHTML = ""), 2000);
    }
    // Add data to post request
    postData("/postData", {
      temp: data.main.temp,
      date: newDate,
      content: feelingsCode,
      icon: data.weather[0].icon,
      description: data.weather[0].description,
      cityName: data.name,
    });

    updateUI();
  });
}

/* Function to Get Web Api Data by using async await function */
const getWeather = async (baseURL, zip, key) => {
  const result = await fetch(baseURL + zip + key);

  try {
    const data = result.json();
    return data;
  } catch (error) {
    console.log("Error", error);
    // To handle the Error
  }
};

// async Function to Post Data
const postData = async (url = "", data = {}) => {
  // post Data to http:localhost:3080/postData
  const response = await fetch(`${serverUrl}/postData`, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    /* Body data type must match "Content type" Header */
    body: JSON.stringify(data), // Creating Json string from a Js object
  });

  try {
    /* Get data in js object and return it */
    const newData = response.json();
    return newData;
  } catch (error) {
    console.log("error", error);
  }
};

// create div to contain img icon
const imgContainer = document.createElement("div");
imgContainer.setAttribute("id", "imgHolder");

/**
 * Function to Get projectData from
 * server side after post request
 */
const updateUI = async () => {
  // get Data from http:localhost:3080/getAll
  const request = await fetch(`${serverUrl}/getAll`);

  try {
    request.json().then((data) => {
      console.log(data);
      dateElement.innerHTML = `Date: ${data.date}`;
      tempElement.innerHTML = `Temp:${Math.floor(data.temp)}°C`;
      contentElement.innerHTML = `Content: ${data.content}`;
      cityNameElement.innerHTML = `${data.cityName}`;

      imgContainer.innerHTML = `
      <img class='img' src="http://openweathermap.org/img/wn/${data.icon}@2x.png">
      <h2 id="img-desc">${data.description}</h2>
      `;
      bigHolder.appendChild(imgContainer);
    });
  } catch (error) {
    console.log("error", error);
  }
};
