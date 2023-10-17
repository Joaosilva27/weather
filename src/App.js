import "./App.css";
import React, { PureComponent } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";
import SearchIcon from "./images/search.png";
import cloudyWeatherIcon from "./images/cloudy.png";
import cloudyAndSunnyIcon from "./images/cloudAndsunny.png";
import rainyWeatherIcon from "./images/rainy.png";
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
  const [sunsetData, setSunsetData] = useState([]);
  const [searchCity, setSearchCity] = useState("");
  const [searchedCities, setSearchedCities] = useState([]);
  const [currentCity, setCurrentCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState("");
  const [currentSunrise, setCurrentSunrise] = useState("");
  const [currentSunset, setCurrentSunset] = useState("");
  const [currentLengthOfDay, setCurrentLengthOfDay] = useState("");
  const [currentDaylight, setCurrentDaylight] = useState("");
  const [currentTimezone, setCurrentTimezone] = useState("");
  const [currentHumidity, setCurrentHumidity] = useState("");
  const [currentRain, setCurrentRain] = useState("");
  const [currentSnow, setCurrentSnow] = useState("");
  const [currentWindSpeed, setCurrentWindSpeed] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");
  const [isNoCitySearched, setIsNoCitySearched] = useState(true);
  const [isSearchBarClicked, setIsSearchBarClicked] = useState(false);
  const [showList, setShowList] = useState(false);

  const onSearchCity = e => {
    e.preventDefault();

    if (searchCity) {
      setSearchedCities([...searchedCities, searchCity]);
    }

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

        const timezoneOffsetSeconds = response.data.timezone;

        const utcTime = new Date();

        const localTime = new Date(utcTime.getTime() + timezoneOffsetSeconds * 1000);

        const adjustedLocalTime = new Date(localTime.getTime() - 7200 * 1000);

        const formattedTime = adjustedLocalTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const sunriseTimestamp = response.data.sys.sunrise * 1000;
        const localSunriseTime = new Date(sunriseTimestamp + timezoneOffsetSeconds * 1000);

        localSunriseTime.setTime(localSunriseTime.getTime() - 7200 * 1000);

        const formattedTimeSunrise = localSunriseTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const sunsetTimestamp = response.data.sys.sunset * 1000;
        const localSunsetTime = new Date(sunsetTimestamp + timezoneOffsetSeconds * 1000);

        // Adjust sunset by subtracting 2 hours (converting it to local time)
        localSunsetTime.setTime(localSunsetTime.getTime() - 7200 * 1000);

        const formattedTimeSunset = localSunsetTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        setCurrentCity(response.data.name);
        setCurrentWeather(Math.round(response.data.main.temp));
        setCurrentTimezone(formattedTime);
        setCurrentSunrise(formattedTimeSunrise);
        setCurrentSunset(formattedTimeSunset);
        setCurrentRain(response.data.rain);
        setCurrentSnow(response.data.snow);
        setCurrentWindSpeed(response.data.wind.speed);
        setCurrentHumidity(response.data.main.humidity);
        setIsNoCitySearched(false);
        setShowList(false);

        const lengthOfDay = sunsetTimestamp - sunriseTimestamp;

        const now = new Date().getTime();
        const remainingDaylight = sunsetTimestamp - now;

        const lengthOfDayHours = Math.floor(lengthOfDay / (60 * 60 * 1000));
        const lengthOfDayMinutes = Math.floor((lengthOfDay % (60 * 60 * 1000)) / (60 * 1000));

        const remainingDaylightHours = Math.floor(remainingDaylight / (60 * 60 * 1000));
        const remainingDaylightMinutes = Math.floor(remainingDaylight % (60 * 60 * 1000)) / (60 * 1000);

        const totalRemainingMinutes = Math.round(remainingDaylightHours * 60 + remainingDaylightMinutes);
        const remainingHours = Math.floor(totalRemainingMinutes / 60);
        const remainingMinutes = totalRemainingMinutes % 60;

        setCurrentDaylight(`${remainingHours > 0 ? remainingHours + "h" : ""} ${remainingMinutes > 0 ? remainingMinutes + "m" : "none"}`);
        setCurrentLengthOfDay(`${lengthOfDayHours > 0 ? lengthOfDayHours + "h" : ""} ${lengthOfDayMinutes > 0 ? lengthOfDayMinutes + "m" : ""}`);

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

  useEffect(() => {
    setSunsetData([
      {
        name: "Sunrise",
        uv: 0,
        pv: 2400,
        amt: 2400,
      },
      {
        name: "",
        uv: 1,
        pv: 1398,
        amt: 2210,
      },
      {
        name: "Sunset",
        uv: 0,
        pv: 9800,
        amt: 2290,
      },
    ]);
  }, []);

  console.log(sunsetData);

  const getCityNameFontSizeClass = () => {
    const lineThreshold = 10;
    return currentCity.length > lineThreshold ? "text-2xl" : "text-4xl";
  };

  const SunriseAndSunsetGraph = ({ sunsetData }) => {
    return (
      <ResponsiveContainer width='100%' height={100}>
        <AreaChart
          width={500}
          height={400}
          data={sunsetData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' horizontal={false} />
          <XAxis dataKey='name' />
          <YAxis tick={{ display: "none" }} tickLine={false} axisLine={false} width={40} />
          <Area type='monotone' dataKey='uv' stroke='#7cc9f2' fill='#7cc9f2' />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div>
      <div>
        <div style={{ backgroundColor: "#FAFAFA" }} className='h-12 w-full rounded-xl flex items-center justify-center'>
          <form onSubmit={onSearchCity} className='h-12 w-full rounded-xl flex items-center justify-center'>
            <input
              value={searchCity}
              onClick={() => {
                setIsSearchBarClicked(true);
                setShowList(!showList);
              }}
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

        {searchedCities.length > 1 && showList && (
          <div id='searchbox-list' className='h-screen'>
            <h1>List of Searched Cities:</h1>
            <ul>
              {searchedCities.map((city, index) => (
                <li key={index}>{city}</li>
              ))}
            </ul>
          </div> // prototype //
          // length more than 1 means that from home page we can search one city and
          //the ui will not appear instantly. this means we can render the list on
          // the searchbar only after getting the city info, and not beforehand

          // make it a function and add onclick to input (maybe not, just showlist true and false)
          // make it so showlist is true when it clicks and its false when not on searchbar
        )}

        {isNoCitySearched ? (
          <div style={{ height: "80vh" }} className='flex justify-center items-center'>
            <img className='h-20 rotate' src={sunnyWeatherIcon} />
            <span style={{ color: "#9A9A9A" }} className='font-medium'>
              Please type in the name of a city <span className='animated-dots'></span>
            </span>
          </div>
        ) : (
          <div>
            <div>
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
                <div style={{ backgroundColor: "#FAFAFA" }} className='flex flex-col w-full justify-between rounded-xl mt-4 pt-2 pb-2 pl-5 pr-5'>
                  <span style={{ color: "#C4C4C4" }} className='text-sm mb-8'>
                    SUNRISE & SUNSET
                  </span>
                  <div className='w-full flex justify-between items-center pl-5 pr-3.5 '>
                    <span style={{ color: "#9A9A9A" }} className='font-medium'>
                      {currentSunrise}
                    </span>
                    <img src={weatherIcon} className='h-4 relative top-5 right-2 z-10' />
                    <span style={{ color: "#9A9A9A" }} className='font-medium'>
                      {currentSunset}
                    </span>
                  </div>
                  <SunriseAndSunsetGraph sunsetData={sunsetData} />
                  <div className='mt-3 flex flex-col'>
                    <span className='font-medium text-sm'>
                      <span style={{ color: "#9A9A9A" }}>Length of day:</span> {currentLengthOfDay}
                    </span>
                    <span className='font-medium text-sm mt-1'>
                      <span style={{ color: "#9A9A9A" }}>Remaining daylight:</span> {currentDaylight}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
