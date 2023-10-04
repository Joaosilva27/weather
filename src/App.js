import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import SearchIcon from "./images/search.png";
import cloudyWeatherIcon from "./images/cloudy.png";
import cloudyAndSunnyIcon from "./images/cloudAndsunny.png";
import rainyWeatherIcon from "./images/rainy.jpg";
import sunnyWeatherIcon from "./images/sunny.png";

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
        console.log(response.data);
        setCurrentCity(response.data.name);
        setCurrentWeather(Math.round(response.data.main.temp));
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
          setCurrentCity(response.data.name);
          setCurrentWeather(Math.round(response.data.main.temp));
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
      <div className='mt-20 flex justify-center flex-col items-center'>
        <div>
          <img className='h-36' src={weatherIcon} />
        </div>
        <h1 className='font-semibold text-4xl mb-4'>{currentCity}</h1>
        <div className='flex'>
          <p className='font-semibold text-7xl'>{currentWeather}</p>
          {currentCity && <span className='text-2xl ml-2 mb-2'>º</span>}
        </div>
      </div>
    </div>
  );
};

export default App;
