import weatherLogo from './assets/weatherLogo.jpg'
import './App.css'
import WeatherCard from './components/WeatherCard'
import cities from './assets/city.list.json'
import { useEffect,useState } from 'react'

function App() {
  const [filteredCities,setFilteredCities] = useState([]);
  const [searchKey,setSearchKey] = useState("");
  const [prevKey,setPrevKey] = useState("");
  const [isLoading,setIsLoading] = useState(true);
  const [selectedCityId,setSelectedCityId] = useState(0);
  const [fourDayWeather,setFourDayWeather] = useState(() => {
    const localData = localStorage.getItem("fourDayWeather");
    return localData ? JSON.parse(localData) : []
  });
  const [cityWeather,setCityWeather] = useState(() => {
    const localData = localStorage.getItem("weatherData");
    return localData ? JSON.parse(localData) : {
      temp: 0.0,
      humidity: 0,
      feels_like: 0.0,
      description: '',
      icon: '',
      place: ''
      }
    });

  useEffect(() => {
    setIsLoading(false);
  },[]);  

  const weatherapiKey = import.meta.env.VITE_API_KEY;  

  //Filter out searchbox
  const searchCity = (e) => {
    const filterKey = e.target.value;
    const filtered = cities.filter(city => city.name.toLowerCase().includes(filterKey.toLowerCase()));
    if(filterKey === ""){
      setFilteredCities([]);
    }
    else{
      setFilteredCities(filtered);
    }
    setPrevKey(filterKey);
  }

  //sets selected place from searchbox
  const setSearchValue = (place) => {
    setSearchKey(place);
    setPrevKey(place);
    setSelectedCityId(filteredCities[0].id);
    setFilteredCities([]);
  }

  //fetched weather details
  const fetchWeatherDetails = async (e) => {
    e.preventDefault();
    if(searchKey === "" || prevKey !== searchKey){
        alert("No place like this exists. Please select from the given options");
        return;
    } 
    setIsLoading(true);

    try{ 
       const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${selectedCityId}&appid=${weatherapiKey}`);

       if(!response.ok){
          throw new Error(`Error status: ${response.status}`);
       }

       const result = await response.json();

       setCityWeather({...cityWeather,
          temp: (parseFloat(result.main.temp) - 273.15).toFixed(2),
          humidity: parseInt(result.main.humidity),
          feels_like: (parseFloat(result.main.feels_like) - 273.15).toFixed(2),
          description: result.weather[0].main,
          icon: result.weather[0].icon,
          place: searchKey
        });
        setSearchKey(""); 
        setPrevKey("");

        const response2 = await fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${selectedCityId}&appid=${weatherapiKey}`);

        if(!response2.ok){
          throw new Error(`Error status: ${response.status}`);
        }

        const result2 = await response2.json();
        const tempArr = [];

        for(let it = 10; it < result2.list.length; it += 8){
          if(it === 34){
            tempArr.push(result2.list[it]);
            tempArr.push(result2.list[it + 5]);
            continue;
          }
          else tempArr.push(result2.list[it]);
        }

        setFourDayWeather([...tempArr]);
      }
       catch (err){
         alert(err.message);
      }
      finally{
        setIsLoading(false);
      } 
  }

  localStorage.setItem("weatherData",JSON.stringify(cityWeather)); 
  localStorage.setItem("fourDayWeather",JSON.stringify(fourDayWeather));

  return (
    <>
    {isLoading ? (<div className="lds-dual-ring"></div>) :
      (
        <>
        <header className='header'>
        <div className='container header_container'>
          <img src={weatherLogo} alt="logo"/>
          <h2 className='main_title'>Weather app</h2>
        </div>
      </header>
      <section className='hero' style={fourDayWeather.length === 0 ? {height: '90vh'} : {}}>
        <div className='container'>
          <form className='form'>
            <div className='search'>
              <div className='searchLabel'>
                <label className='labelSearch' htmlFor="place">Track weather here</label>
              </div>
              <div className='inputBox'>
                <input id="place" type='text' value={prevKey} autoComplete="off" placeholder='Enter place' onChange={searchCity}></input>
                <a href='#' className='addBtn' onClick={fetchWeatherDetails}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                </svg>
                </a>
              </div>
              {filteredCities.length != 0 && (
                <div className='searchResults'>
                    {filteredCities.slice(0,5).map(city => {
                      return <div key={city.id} className="result_item" onClick={(e) => setSearchValue(e.target.textContent)}>{city.name} , {city.state ? city.state + " ," : ""} {city.country}</div>
                    })}
                </div>
              )}
            </div>
          </form>
          {fourDayWeather.length != 0 && <WeatherCard weatherDetails={cityWeather}/>}
          {fourDayWeather.length != 0 && <div className='four_day_title'>
            <h2 className='f4_title'>{`Next 5 day forecast in ${cityWeather.place}`}</h2>
          </div>}
          {fourDayWeather.length != 0 && <div className='four_day_container'>
            {fourDayWeather.map(day => {
              const tempObj = {};
              tempObj.temp = (parseFloat(day.main.temp) - 273.15).toFixed(2);
              tempObj.humidity = parseInt(day.main.humidity);
              tempObj.feels_like = (parseFloat(day.main.feels_like) - 273.15).toFixed(2);
              tempObj.description = day.weather[0].main;
              tempObj.icon = day.weather[0].icon;
              return <WeatherCard key={Math.random() * 10000} weatherDetails={tempObj}/>
            })}
          </div>}
        </div>
      </section>
      </>
      )
    }
    </>
  )
}

export default App
