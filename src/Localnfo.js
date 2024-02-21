import React, { useState } from "react";
import Logo from "./Logo.js";

const Localnfo = () => {
  const apiKey = "API_KEY";
  const [aqiData, setAqiData] = useState({});
  const [weatherData, setWeatherData] = useState({});
  const [cityData, setCityData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [cityName, setCityName] = useState("City");

  const showData = (n) => {
    switch (n) {
      case 1:
        function getAQIRange(aqi) {
          if (aqi >= 0 && aqi <= 50) {
            return "Good";
          } else if (aqi >= 51 && aqi <= 100) {
            return "Moderate";
          } else if (aqi >= 101 && aqi <= 150) {
            return "Unhealthy for sensitive groups";
          } else if (aqi >= 151 && aqi <= 200) {
            return "Unhealthy";
          } else if (aqi >= 201 && aqi <= 300) {
            return "Very unhealthy";
          } else {
            return "Hazardous";
          }
        }
        let overallAQI = aqiData["overall_aqi"];
        let coConcentration = aqiData.CO.concentration;
        let o3Concentration = aqiData.O3.concentration;
        let range = getAQIRange(overallAQI);
        let s =
          "AQI range is: " +
          range +
          "\n" +
          "AQI is : " +
          overallAQI +
          "\n" +
          "CO concentration: " +
          coConcentration +
          " µg/m³\n" +
          "O3 concentration: " +
          o3Concentration +
          " µg/m³\n";
        document.getElementById("LocalnfoData").innerText = s;
        console.log(1);
        break;
      case 2:
        console.log(2);
        let cityInfo = cityData[0];
        let locationName = cityInfo.name;
        let latitude = cityInfo.latitude;
        let longitude = cityInfo.longitude;
        let country = cityInfo.country;
        let population = cityInfo.population;
        let isCapital = cityInfo.is_capital;
        let locationInfo =
          "Location: " +
          locationName +
          "\n" +
          "Latitude: " +
          latitude +
          "\n" +
          "Longitude: " +
          longitude +
          "\n" +
          "Country: " +
          country +
          "\n" +
          "Population: " +
          population +
          "\n" +
          "Is Capital: " +
          (isCapital ? "Yes" : "No") +
          "\n";
        document.getElementById("LocalnfoData").innerText = locationInfo;
        break;
      case 3:
        console.log(3);
        function formatTime(timestamp) {
          let date = new Date(timestamp * 1000);

          let hours = date.getHours();
          let minutes = "0" + date.getMinutes();
          let seconds = "0" + date.getSeconds();

          let formattedTime =
            hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

          return formattedTime;
        }

        let cloudPercentage = weatherData.cloud_pct;
        let temperature = weatherData.temp;
        let feelsLike = weatherData.feels_like;
        let humidity = weatherData.humidity;
        let minTemperature = weatherData.min_temp;
        let maxTemperature = weatherData.max_temp;
        let windSpeed = weatherData.wind_speed;
        let windDegrees = weatherData.wind_degrees;
        let sunriseTime = formatTime(weatherData.sunrise);
        let sunsetTime = formatTime(weatherData.sunset);

        let weatherInfo =
          "Cloud Percentage: " +
          cloudPercentage +
          "%\n" +
          "Temperature: " +
          temperature +
          "°C\n" +
          "Feels Like: " +
          feelsLike +
          "°C\n" +
          "Humidity: " +
          humidity +
          "%\n" +
          "Min Temperature: " +
          minTemperature +
          "°C\n" +
          "Max Temperature: " +
          maxTemperature +
          "°C\n" +
          "Wind Speed: " +
          windSpeed +
          " m/s\n" +
          "Wind Degrees: " +
          windDegrees +
          "°\n" +
          "Sunrise Time: " +
          sunriseTime +
          "\n" +
          "Sunset Time: " +
          sunsetTime +
          "\n";
        document.getElementById("LocalnfoData").innerText = weatherInfo;
        break;
      default:
        break;
    }
  };

  const fetchdata = async (city) => {
    setIsLoading(true);
    try {
      const weatherResponse = await fetch(
        `https://api.api-ninjas.com/v1/weather?city=${city}`,
        {
          headers: {
            "X-Api-Key": apiKey,
          },
        }
      );
      if (!weatherResponse.ok) {
        throw new Error(`HTTP error! Status: ${weatherResponse.status}`);
      }
      const weatherData = await weatherResponse.json();
      console.log(weatherData);
      setWeatherData(weatherData);

      const cityResponse = await fetch(
        `https://api.api-ninjas.com/v1/city?name=${city}`,
        {
          headers: {
            "X-Api-Key": apiKey,
          },
        }
      );
      if (!cityResponse.ok) {
        throw new Error(`HTTP error! Status: ${cityResponse.status}`);
      }
      const cityData = await cityResponse.json();
      console.log(cityData);
      setCityData(cityData);

      const aqiResponse = await fetch(
        `https://api.api-ninjas.com/v1/airquality?city=${city}`,
        {
          headers: {
            "X-Api-Key": apiKey,
          },
        }
      );
      if (!aqiResponse.ok) {
        throw new Error(`HTTP error! Status: ${aqiResponse.status}`);
      }
      const aqiData = await aqiResponse.json();
      console.log(aqiData);
      setAqiData(aqiData);
      setCityName(city);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setCityName(city);

      setIsLoading(false);
    }
  };

  const renderdata = () => {
    var city = document.getElementById("SearchBar").value;
    window.scrollTo({
      top: 100,
      left: 100,
      behavior: "smooth",
    });
    setCityName(city);

    fetchdata(city);
  };

  return (
    <>
      <div className="NavBar">
        <Logo />
        <div className="SearchBox">
          <input id="SearchBar" type="text" placeholder="SEARCH HERE"></input>
          <button id="SearchButton" onClick={() => renderdata()}>
            Search
          </button>
        </div>
      </div>
      <div className="BodyBox">
        {isLoading ? (
          <p className="Loading transbox">Loading...</p>
        ) : (
          <>
            <div className="CityNameDiv">
              <p id="CityName" className="transbox">
                {cityName}
              </p>
            </div>
            <div className="InfoOptionsDiv">
              <p className="InfoOptions transbox" onClick={() => showData(1)}>
                Air
              </p>
              <p className="InfoOptions transbox" onClick={() => showData(2)}>
                Info
              </p>
              <p className="InfoOptions transbox" onClick={() => showData(3)}>
                Weather
              </p>
              <p className="InfoOptions transbox">Map</p>
              <p className="InfoOptions transbox">Places to visit</p>
              <p className="InfoOptions transbox">Medical Facilities</p>
            </div>
            <div className="Info transbox">
              <p id="LocalnfoData" className="transbox LocalnfoData">
                hello
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Localnfo;
