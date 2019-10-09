import React, {Component} from 'react';
import './App.css';
import Weather from './components/weather';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'weather-icons/css/weather-icons.css';
import Form from './components/form';

//api call : api.openweathermap.org/data/2.5/weather?q=London,uk;
const API_KEY = "d4d0d338d1c7df0306c26d770e******";

class App extends Component {
  constructor() {
    super();
    this.state = {
      city : undefined,
      country : undefined,
      icon : undefined,
      main : undefined,
      celsius : undefined,
      temp_max : undefined,
      temp_min : undefined,
      description : "",
      error : false,
      notFound : false
    };

    this.weatherIcon = {
      Thunderstorm : "wi-thunderstorm",
      Drizzle : "wi-sleet",
      Rain : "wi-storm-showers",
      Snow : "wi-snow",
      Atmosphere : "wi-fog",
      Clear : "wi-day-sunny",
      Clouds : "wi-day-fog"
    }
  }

  calculateCelsius(temp) {
    let cell = Math.floor(temp - 273.15);
    return cell;
  }

  getWeatherIcon(icon, rangeId) {
    switch(true) {
      case rangeId>=200 && rangeId<=232 :
        this.setState({icon:this.weatherIcon.Thunderstorm})
        break;
      
      case rangeId>=300 && rangeId<=321 :
        this.setState({icon:this.weatherIcon.Drizzle});
        break;

      case rangeId>=500 && rangeId<=531 :
          this.setState({icon:this.weatherIcon.Rain});
          break;    
      
      case rangeId>=600 && rangeId<=622 :
        this.setState({icon:this.weatherIcon.Snow});
        break;

      case rangeId == 800:
          this.setState({icon:this.weatherIcon.Clear});
          break;

      case rangeId>=801 && rangeId<=804 :
          this.setState({icon:this.weatherIcon.Clouds});
          break;

          default:
              this.setState({icon:this.weatherIcon.Clouds});
    }
  }


  getWeather = async(e) => {
    e.preventDefault();

    var city = e.target.elements.city.value;
    var country = e.target.elements.country.value;

    //console.log(response);

    if(city && country) {

      const api_call = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}`);
      //console.log(api_call);

      if(api_call.status == 404) {
        console.log('status 404 found..');
        city="Islamabad";
        country="Pakistan";

        const api_call = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}`);
        const response = await api_call.json();

        this.setState({
          notFound: true
        });
      }

      else {
        const response = await api_call.json();
        console.log(response);
        this.setState({
          city : `${response.name}, ${response.sys.country}`,
          celsius : this.calculateCelsius(response.main.temp),
          temp_max : this.calculateCelsius(response.main.temp_max),
          temp_min : this.calculateCelsius(response.main.temp_min),
          description : response.weather[0].description,
          icon : this.weatherIcon.Thunderstorm,
          error : false,
          notFound: false
        });

          this.getWeatherIcon(this.weatherIcon, response.weather[0].id);
        }

    }

    else {
      this.setState({error:true});
    }
  }


  render() { 
    return ( 
      <div className="App">
        <Form loadweather = {this.getWeather} error={this.state.error} notFound={this.state.notFound}/>
        <Weather 
          city={this.state.city} 
          country={this.state.country} 
          temp_celsius={this.state.celsius}
          temp_max={this.state.temp_max}
          temp_min={this.state.temp_min} 
          description={this.state.description}
          weatherIcon={this.state.icon}
        />
      </div> 
    );
  }
}

export default App;
