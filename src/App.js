import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import SearchIcon from "./images/search.png";
import cloudyWeatherIcon from "./images/cloudy.png";
import cloudyAndSunnyIcon from "./images/cloudAndsunny.png";
import rainyWeatherIcon from "./images/rainy.jpg";
import sunnyWeatherIcon from "./images/sunny.png";
import locationIcon from "./images/location.png";

const apiKeyWeather = "1bccb948ec59bad9834801d705d72655";
const apiUrlWeather = "https://api.openweathermap.org/data/2.5/weather";

function App() {
  return (
    <div className='app m-8'>
      <SearchBar />
    </div>
  );
}

const SearchBar = () => {
  const [searchCity, setSearchCity] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState("");
  const [currentTimezone, setCurrentTimezone] = useState("");
  const [currentHumidity, setCurrentHumidity] = useState("");
  const [currentRain, setCurrentRain] = useState("");
  const [currentSnow, setCurrentSnow] = useState("");
  const [currentWindSpeed, setCurrentWindSpeed] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");

  const onSearchCity = e => {
    e.preventDefault();

    axios
      .get(apiUrlWeather, {
        params: {
          q: searchCity,
          appid: apiKeyWeather,
          units: "metric",
        },
      })
      .then(response => {
        console.log("API Response Data:", response.data);

        // Get the timezone offset in seconds from the API response
        const timezoneOffsetSeconds = response.data.timezone;

        // Create a Date object for the current UTC time
        const utcTime = new Date();

        // Calculate the local time by adding the timezone offset in milliseconds
        const localTime = new Date(utcTime.getTime() + timezoneOffsetSeconds * 1000); //

        // Format the local time as a string (adjust the options as needed)
        const formattedTime = localTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        });

        setCurrentCity(response.data.name);
        setCurrentWeather(Math.round(response.data.main.temp));
        setCurrentTimezone(formattedTime);
        setCurrentRain(response.data.rain);
        setCurrentSnow(response.data.snow);
        setCurrentWindSpeed(response.data.wind.speed);
        setCurrentHumidity(response.data.main.humidity);

        if (response.data.weather[0].main === "Clear") {
          setWeatherIcon(sunnyWeatherIcon);
        } else if (response.data.weather[0].main === "Rain") {
          setWeatherIcon(rainyWeatherIcon);
        } else if (response.data.weather[0].main === "Clouds") {
          setWeatherIcon(cloudyWeatherIcon);
        } else {
          setWeatherIcon(cloudyAndSunnyIcon);
        }
      })
      .catch(error => {
        console.error("API Error:", error);
        setWeatherIcon("");
      });

    setSearchCity("");
  };

  // Fetch weather data for Amsterdam only when the component mounts
  useEffect(() => {
    if (!searchCity) {
      axios
        .get(apiUrlWeather, {
          params: {
            q: "Amsterdam", // Fetch data for Amsterdam by default
            appid: apiKeyWeather,
            units: "metric",
          },
        })
        .then(response => {
          console.log(response.data);

          // Convert the Unix timestamp to milliseconds and add the timezone offset
          const timestamp = (response.data.dt + response.data.timezone) * 1000;

          // Create a Date object from the adjusted timestamp
          const localTime = new Date(timestamp);

          // Format the local time as a string (adjust the options as needed)
          const formattedTime = localTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          setCurrentCity(response.data.name);
          setCurrentWeather(Math.round(response.data.main.temp));
          setCurrentTimezone(formattedTime);
          setCurrentRain(response.data.rain);
          setCurrentSnow(response.data.snow);
          setCurrentWindSpeed(response.data.wind.speed);
          setCurrentHumidity(response.data.main.humidity);

          if (response.data.weather[0].main === "Clear") {
            setWeatherIcon(sunnyWeatherIcon);
          } else if (response.data.weather[0].main === "Rain") {
            setWeatherIcon(rainyWeatherIcon);
          } else if (response.data.weather[0].main === "Clouds") {
            setWeatherIcon(cloudyWeatherIcon);
          } else {
            setWeatherIcon(cloudyAndSunnyIcon);
          }
        })
        .catch(error => {
          console.error(error);
          setWeatherIcon("");
        });
    }
  }, []);

  const getCityNameFontSizeClass = () => {
    const lineThreshold = 10;
    return currentCity.length > lineThreshold ? "text-2xl" : "text-4xl";
  };

  return (
    <div>
      <div style={{ backgroundColor: "#FAFAFA" }} className='h-12 w-full rounded-xl flex items-center justify-center'>
        <form onSubmit={onSearchCity} className='h-12 w-full rounded-xl flex items-center justify-center'>
          <input
            value={searchCity}
            onChange={e => setSearchCity(e.target.value)}
            placeholder='Search Location'
            style={{ backgroundColor: "#FAFAFA", outline: "none" }}
            className='h-12 w-full rounded-xl pl-4'
          />
          <button type='submit' style={{ backgroundColor: "#FAFAFA", border: "none" }} className='h-12'>
            <img onClick={onSearchCity} className='h-4.5 mr-3' src={SearchIcon} alt='Search Icon' />
          </button>
        </form>
      </div>
      <div className='mt-8 flex justify-center flex-col items-center'>
        <div>
          <img className='h-36' src={weatherIcon} alt='Weather Icon' />
        </div>
        <div className='flex justify-center items-center'>
          <h1 className={`font-semibold ${getCityNameFontSizeClass()}`}>{currentCity}</h1>
          <img className='h-5.5 ml-3' src={locationIcon} alt='Location Icon' />
        </div>
        <div className='flex mt-4 mb-4'>
          <p className='font-semibold text-7xl'>{currentWeather}</p>
          {currentCity && <span className='text-2xl ml-2 mb-2'>º</span>}
        </div>
      </div>
      <div>
        <div style={{ backgroundColor: "#FAFAFA" }} className='flex w-full justify-between rounded-xl pt-2 pb-2 pl-5 pr-5'>
          <div className='flex flex-col justify-center items-center'>
            <span style={{ color: "#C4C4C4" }} className='text-sm mb-0.5'>
              TIME
            </span>
            <span style={{ color: "#9A9A9A" }} className='font-medium'>
              {currentTimezone}
            </span>
          </div>
          <div className='flex flex-col justify-center items-center'>
            <span style={{ color: "#C4C4C4" }} className='text-sm mb-0.5'>
              HUMIDITY
            </span>
            <span style={{ color: "#9A9A9A" }} className='font-medium'>
              {currentHumidity}
            </span>
          </div>
          <div className='flex flex-col justify-center items-center'>
            <span style={{ color: "#C4C4C4" }} className='text-sm mb-0.5'>
              {currentSnow ? <p>% SNOW</p> : <p>% RAIN</p>}
            </span>
            <span style={{ color: "#9A9A9A" }} className='font-medium'>
              {currentSnow ? <p>{currentSnow}</p> : currentRain ? <p>{currentRain}</p> : <p>0</p>}
            </span>
          </div>
          <div className='flex flex-col justify-center items-center'>
            <span style={{ color: "#C4C4C4" }} className='text-sm mb-0.5'>
              WIND
            </span>
            <span style={{ color: "#9A9A9A" }} className='font-medium'>
              {currentWindSpeed} /h
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
