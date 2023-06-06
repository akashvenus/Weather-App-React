import React from 'react';

export default function WeatherCard ({weatherDetails}){

    return (
        <div className='card'>
            <div className='weather_icon'>
                <img src={`https://openweathermap.org/img/wn/${weatherDetails.icon}@2x.png`} alt="weather_icon"/>
            </div>
            <div className='margin_top'>
                <h3 className='location'>{weatherDetails.place}</h3>
                <p className='bold description'>{weatherDetails.description}</p>
            </div>
            <h3 className='margin_top temperature'>{weatherDetails.temp} °C</h3>
            <p className='margin_top bold feels'>Feels like: {weatherDetails.feels_like} °C</p>
            <p className='margin_top bold humidity'>Humidity {weatherDetails.humidity}%</p>
        </div>
    )
}