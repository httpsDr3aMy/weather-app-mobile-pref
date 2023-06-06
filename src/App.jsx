    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import './App.css';
    import { Swiper, SwiperSlide } from 'swiper/react';
    import 'swiper/swiper.min.css';
    import { LineChart, Line, XAxis, YAxis,  Tooltip, Legend } from 'recharts';



    import SwiperCore, { Navigation, Pagination } from 'swiper/core';

    SwiperCore.use([Navigation, Pagination]);

    const App = () => {

      const [hideWelcomePage, setHideWelcomePage] = useState(false);
      const [showMainView, setShowMainView] = useState(false);
      const [currentDay, setCurrentDay] = useState('');
      const [weatherData, setWeatherData] = useState(null);
      const [selectedDay, setSelectedDay] = useState('today');
      const [selectedDayName, setSelectedDayName] = useState('');

      const [latitude, setLatitude] = useState(null);
      const [longitude, setLongitude] = useState(null);

      const [next7DaysNames, setNext7DaysNames] = useState([]);





      const sliderSettings = {
        slidesPerView: 2,
      };
      useEffect(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];
        const date = new Date();
        const dayOfWeek = days[date.getDay()];
        const dayOfMonth = date.getDate() + '.';
        const month = months[date.getMonth()];
        setCurrentDay(`${dayOfWeek} ${dayOfMonth} ${month}`);
      }, []);

      useEffect(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];
        const date = new Date();
        const dayOfWeek = days[date.getDay()];
        const dayOfMonth = date.getDate() + '.';
        const month = months[date.getMonth()];
        setCurrentDay(`${dayOfWeek} ${dayOfMonth} ${month}`);
      }, []);

      const getLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
        } else {
          alert(
            'Twoja przeglądarka nie obsługuje pobierania geolokalizacji! Spróbuj skorzystać z manualnego wpisywania wybranej przez ciebie miejscowości.'
          );
        }
      };

      const showPosition = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setLatitude(latitude);
        setLongitude(longitude);
        const API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=0daa6992d1b28fbe8dd299ab79c66e40&units=metric`;
        getWeather(API_URL);
      };

      const getWeather = (API_URL) => {
        axios
          .get(API_URL)
          .then((res) => {
            console.log(res.data);
            const cityName = res.data.city.name;
            const temperature = Math.round(res.data.list[0].main.temp);
            document.getElementById('location').textContent = cityName;
            document.getElementById('temperature').textContent = temperature;
            setWeatherData(res.data);
          })
          .catch((error) => {
            console.log(error);
          });
      };

      const renderDay = (dayData, index) => {
        const date = dayData.dt_txt.substring(10, 16);
        const selectedDayName = selectedDay === 'next-7-days' ? next7DaysNames[index] : '';
        return (
          <div key={dayData.dt} className="hour-day-box">
            <div className="weather-icon-image">
              <img src="/sun.png" alt="sun" className="weather-icon" />
            </div>
            <div className="weather-icon-info">
              <p className="hour-wi">{date}</p>
              <p className="temperature-wi">
                <span className="temperature-number">{Math.round(dayData.main.temp)}</span>
                <span className="unit-tempereture">°C</span>
              </p>
              {selectedDayName && <p className="day-name">{selectedDayName}</p>}
            </div>
          </div>
        );
      };
      
      

      const handleTodayClick = () => {
        setSelectedDay('today');
        setSelectedDayName('');
      };

      const handleTomorrowClick = () => {
        setSelectedDay('tomorrow');
        const tomorrowDate = new Date();
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        setSelectedDayName(dayOfWeek[tomorrowDate.getDay()]);
      };

      const handleNext7DaysClick = () => {
        setSelectedDay('next-7-days');
        const currentDate = new Date().toISOString().substring(0, 10);
        const API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=0daa6992d1b28fbe8dd299ab79c66e40&units=metric`;
      
        axios
          .get(API_URL)
          .then((res) => {
            const next7DaysData = res.data.list.filter(
              (dayData) =>
                dayData.dt_txt.startsWith(currentDate) && dayData.dt_txt.endsWith('12:00:00')
            );
            if (next7DaysData.length > 0) {
              const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              const next7DaysNames = next7DaysData.map((dayData) =>
                dayOfWeek[new Date(dayData.dt_txt).getDay()]
              );
              setSelectedDayName(next7DaysNames.join(', '));
              setNext7DaysNames(next7DaysNames);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      };
      
      
    
      

      const showMain = () => {
        setHideWelcomePage(true);
        setShowMainView(true);
        getLocation();
      };

      const renderChanceOfRainChart = () => {
        if (weatherData && weatherData.list) {
          const currentDate = new Date().toISOString().substring(0, 10); // Bieżąca data w formacie "YYYY-MM-DD"
          
          const chartData = weatherData.list
            .filter(dayData => dayData.dt_txt.startsWith(currentDate)) // Filtruj dane, które mają datę dzisiejszą
            .map(dayData => ({
              name: dayData.dt_txt.substring(11, 16),
              chanceOfRain: dayData.rain && dayData.rain['3h'] ? dayData.rain['3h'] : 0,
            }));
      
          return (
            <div className="chart-container">
              <div>
                <LineChart width={350} height={200} data={chartData} className="chart">
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="chanceOfRain" stroke="#8884d8" />
                </LineChart>
              </div>
            </div>
          );
        }
      
        return null;
      };

      return (
        <div className="App">
          <div className={`welcome-page ${hideWelcomePage ? 'hide' : ''}`}>
            <img src="/main-icon.png" alt="main icon/logo" className="main-icon" />
            <h1>
              Weather <span className="yellow-h1">News & Feed</span>
            </h1>
            <p className="description">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus quibusdam ut ipsa,
              totam quae corporis natus, sint pariatur.
            </p>
            <button id="get-start-btn" onClick={showMain}>
              Get start
            </button>
          </div>
          <div className={`main-view ${showMainView ? 'show animation-of-ejecting' : ''}`}>
            <div className="row">
              <i className="fa-solid fa-sliders"></i>
              <h5>Weather Forecast</h5>
            </div>
            <div className="today-box">
              <div className="row">
                <h4>Today</h4>
                <p id="current-day">{currentDay}</p>
              </div>
              <div className="row">
                <p className="temperature">
                  <span id="temperature"></span>
                  <span id="scale-of-temperature">&deg;C</span>
                </p>
                <img src="/sun.png" alt="sun" className="sun" />
              </div>
              <div className="row">
                <i className="fa-solid fa-location-dot"></i>
                <p id="location"></p>
              </div>
            </div>
            <div className="choose-day-row">
              <button
                id="today"
                className={selectedDay === 'today' ? 'selected-day' : ''}
                onClick={handleTodayClick}
              >
                Today
              </button>
              <button
                id="tomorrow"
                className={selectedDay === 'tomorrow' ? 'selected-day' : ''}
                onClick={handleTomorrowClick}
              >
                Tomorrow
              </button>
              <button
                id="next-7-days"
                className={selectedDay === 'next-7-days' ? 'selected-day' : ''}
                onClick={handleNext7DaysClick}
              >
                Next 7 Days
              </button>
            </div>
            <div className="weather-of-the-day">
              {weatherData && weatherData.list && (
                <Swiper {...sliderSettings}>
                  {weatherData.list
                    .filter((dayData) => {
                      if (selectedDay === 'today') {
                        // Filtruj tylko dane z dzisiejszego dnia
                        const currentDate = new Date();
                        const day = currentDate.getDate();
                        const month = currentDate.getMonth();
                        const year = currentDate.getFullYear();
                        const dayDataDate = new Date(dayData.dt_txt);
                        return (
                          dayDataDate.getDate() === day &&
                          dayDataDate.getMonth() === month &&
                          dayDataDate.getFullYear() === year
                        );
                      } else if (selectedDay === 'tomorrow') {
                        // Filtruj tylko dane z jutrzejszego dnia
                        const tomorrowDate = new Date();
                        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
                        const day = tomorrowDate.getDate();
                        const month = tomorrowDate.getMonth();
                        const year = tomorrowDate.getFullYear();
                        const dayDataDate = new Date(dayData.dt_txt);
                        return (
                          dayDataDate.getDate() === day &&
                          dayDataDate.getMonth() === month &&
                          dayDataDate.getFullYear() === year
                        );
                      } else if (selectedDay === 'next-7-days') {
                        // Filtruj dane z kolejnych 7 dni
                        const currentDate = new Date();
                        const endDate = new Date();
                        endDate.setDate(currentDate.getDate() + 7);
                        const day = dayData.dt_txt.substring(8, 10);
                        const month = dayData.dt_txt.substring(5, 7);
                        const year = dayData.dt_txt.substring(0, 4);
                        const dayDataDate = new Date(`${year}-${month}-${day}`);
                        return dayDataDate >= currentDate && dayDataDate <= endDate;
                      }
                      return true;
                    })
                    .map((dayData) => (
                      <SwiperSlide key={dayData.dt} className="row-weather">
                        {renderDay(dayData)}
                      </SwiperSlide>
                    ))}
                </Swiper>
              )}
            </div>
            <div className="charts-box">
              <p className="charts-title">Chance of rain</p>
              {renderChanceOfRainChart()}
            </div>
          </div>
        </div>
      );
    };

    export default App;