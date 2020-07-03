/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  ImageBackground, 
  KeyboardAvoidingView,
  Platform, 
  View,
  Text,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import {  getWeather } from './utils/api';
import getImageForWeather from './utils/getImageForWeather';
import getIconForWeather from './utils/getIconForWeather';



export default class App extends React.Component {
  constructor(props) {
    super(props);
   
    // STATE
    this.state = {
      loading: false,
      error: false,
      temperature: '',
      humidity: '',
      created: '',
    };

  }


  // Ham load trong react
  componentDidMount = () => {

    this.setState({ loading: true }, async () => {
      try {
        const resp = await getWeather();
        this.setState({
          loading: false,
          error: false,
          humidity:resp.humidity,
          temperature:resp.temperature,
          created:resp.time,
        });

      } catch (e) {
        this.setState({
          loading: false,
          error: true,
        });

      }
    });
  };

  // RENDERING
  render() {
    // GET values of state
    const { loading, error, humidity, temperature, created } = this.state;

    // Activity
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">

        <StatusBar barStyle="light-content" />

        <ImageBackground
          source={getImageForWeather(humidity)}
          style={styles.imageContainer}
          imageStyle={styles.image}
        >

          <View style={styles.detailsContainer} >

            <ActivityIndicator animating={loading} color="white" size="large" />

            {!loading && (
              <View>
                {!error && (
                  <View>
                    <Text h1 style={[styles.largeText, styles.textStyle]}>
                    Dự báo nhiệt độ, độ ẩm 
                    Hồ Chí Minh
                    </Text>
                    <Text style={[styles.largeText, styles.textStyle]}>
                      {getIconForWeather(humidity)} 
                    </Text>
                    <Text style={[styles.normalText, styles.textStyle]}>
                     Độ ẩm: {humidity}
                    </Text>
                    <Text style={[styles.normalText, styles.textStyle]}>
                    Nhiệt độ: {`${Math.round(parseFloat(temperature) * 10) / 10}°`}
                    </Text>
                  </View>
                )}
                {!error && (
                  <Text style={[styles.smallText, styles.textStyle]}>
                   Cập nhật lần cuối: {timeConverter(created)}
                  </Text>
                )}
              </View>
            )}
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}
function timeConverter(UNIX_timestamp){
  var a = new Date((parseFloat(UNIX_timestamp) - 5*60)*1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var date=a.getDate();
  var month=a.getMonth();
  var year=a.getFullYear();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  // var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  var time =    date + ' ' + month + ' ' + year+' ' + hour + ':' + min + ':' + sec ;
  // var aestTime = new Date().toLocaleString("en-US", {timeZone: "Etc/GMT-7"});
  // time = new Date(aestTime).toISOString()
  return time;
}

/* StyleSheet */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
  },
  largeText: {
    fontSize: 43,
  },
  smallText: {
    fontSize: 18,
  },
  normalText: {
    fontSize: 26,
  },
});