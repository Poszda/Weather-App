import { StyleSheet, Text, View, Image, ScrollView, ImageBackground } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dimensions } from 'react-native';
import { advices } from './data/advices';

import Recomandation from './Recomandation';
import Day from './Day';

const Tab = createBottomTabNavigator();
export default function App() {

  const [myLocation, setMyLocation] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weather, setWeather] = useState([]);
  const [nextWeather,setNextWeather] = useState([]);
  const [airData, setAirData] = useState(undefined);

  useEffect(() => {
    //getLocation();
    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        return Location.getCurrentPositionAsync({})
      })
      .then(location => {
        setMyLocation(location);
        //set watching location
        return { lat: location.coords.latitude, lon: location.coords.longitude }

      })
      .then(coords => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=9fabda984d765e8902c68cbf1a791b23&units=metric`)
          .then((response) => response.json())
          .then((json) => { setWeather(json); return json })
          .catch(err => console.log(err))

        //celalalt fetch
        fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${coords.lat}&lon=${coords.lon}&appid=9fabda984d765e8902c68cbf1a791b23&units=metric`)
          .then((response) => response.json())
          .then((json) => { setAirData(json.list[0]); return json.list })
          .catch(err => console.log(err))

        //alt fetch
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=9fabda984d765e8902c68cbf1a791b23&units=metric`)
          .then((response) => response.json())
          .then((json) => {setNextWeather(json.list.slice(1,6)); return json.list.slice(1,6)})
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err));

  }, [])

  useEffect(() => {
     console.log(weather);
     /*
    console.log(airData);
    console.log(nextWeather); */
    console.log(weather);
    console.log(nextWeather);
  }, [weather, airData, nextWeather])

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section1}>
        <View style={styles.header}>
          <Text style={{ fontSize: 16, color: 'white', marginBottom: 30 }}>
            <Image source={require('./assets/location.png')} style={{ width: 20, height: 20 }} />
            {weather.name}
          </Text>
          <Image style={styles.image} source={getCorrectIcon(weather.length != 0 ? weather.weather[0].main : "")} />
          <Text style={{ fontSize: 50, marginLeft: 22, color: 'white' }}>{weather.length != 0 ? Math.round(weather.main.temp) : ''}°</Text>
          <Text style={{ color: 'white' }}>{weather.length != 0 ? Math.round(weather.main.temp_max) : ''}°/{weather.length != 0 ? Math.round(weather.main.temp_min) : ''}°</Text>
          <Text style={{ color: 'white' }}>{weather.length != 0 ? weather.weather[0].main : ''}</Text>
        </View>
        <View style={styles.cover}>
          <ScrollView horizontal={true} style={styles.weekdaysContainer}>
            {nextWeather.map((el,index)=>{return <Day key={index} data = {el} getCorrectIcon={getCorrectIcon}/>})}
          </ScrollView >
        </View>
      </View>
      <View style={styles.section2}>
        <Text style={styles.subtitle}>Recomandations</Text>
        <View style={styles.content}>
          {airData !== undefined ? getAirRecomandation(airData.main.aqi) : null}
          {weather.length !== 0 ? getTemperatureRecomandation(weather.main.temp) : null}
          {weather.length !== 0 ? getWindRecomandation(weather.wind.speed) : null}
          {weather.length !== 0 ? getRainRecomandation(weather.rain) : null}
        </View>
      </View>
    </ScrollView>

  );
  // FUNCTIONS

  function getCorrectIcon(weatherName) {
    if (weatherName === "") return undefined
    if (weatherName === 'Clear') return require('./assets/3d_weather_icons/sun/26.png')
    if (weatherName === 'Clouds') return require('./assets/3d_weather_icons/sun/27.png')
    if (weatherName === 'Thunderstorm') return require('./assets/3d_weather_icons/sun/16.png')
    if (weatherName === "Rain" || weatherName === "Drizzle") return require('./assets/3d_weather_icons/sun/8.png')
    return require('./assets/3d_weather_icons/sun/4.png')
  }
  function getAirRecomandation(aqi) {
    return <Recomandation text={advices.air[aqi - 1]} />
  }
  function getTemperatureRecomandation(t) {
    if (t < 15) return <Recomandation text={advices.temperature[0]} />
    if (t >= 15 && t <= 22) return <Recomandation text={advices.temperature[1]} />
    if (t > 22 && t < 28) return <Recomandation text={advices.temperature[2]} />
    if (t >= 28) return <Recomandation text={advices.temperature[3]} />
  }
  function getWindRecomandation(w) {
    if (w < 5.5) return <Recomandation text={advices.wind[0]} />
    if (w >= 5.5 && w <= 9) return <Recomandation text={advices.wind[1]} />
    if (w >= 10 && w <= 14) return <Recomandation text={advices.wind[2]} />
    if (w > 14) return <Recomandation text={advices.wind[3]} />
  }
  function getRainRecomandation(r) {
    if (r === undefined) return <Recomandation text={advices.rain[0]} />
    else return <Recomandation text={advices.rain[2]} />
  }
  /*   async function getData() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setMyLocation(location);
      // return location;
      // console.log(location); 
      // console.log(myLocation);
    } */
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cover: {
/*     backgroundColor: 'purple', */
  },
  section1: {
    backgroundColor: '#6320ee',
    height: Dimensions.get('window').height,
  },
  section2: {
    padding: 20,
  },
  content: {
    marginTop: 10,
    marginBottom: 20
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  weekdaysContainer: {
    width: '100%',
/*     backgroundColor: 'red', */
  },
  header: {
    /* backgroundColor: 'yellow', */
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    paddingTop: 100,
    paddingBottom: 100
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: 'contain'
  },
  /*   bg: {
      display: 'none',
      position: 'absolute',
      top: 0,
      width: "100%",
      height: 1000
    } */
});
