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
  Button,
} from 'react-native';

import { getWeather, predict } from './utils/api';
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
      predictedTemp: '',
      predictedHum: '',
    };

  }


  // Ham load trong react
  componentDidMount = () => {

    this.setState({ loading: true }, async () => {
      try {
        const resp = await getWeather();
        const pre = await predict(parseFloat(resp.temperature), parseFloat(resp.humidity));
        this.setState({
          loading: false,
          error: false,
          humidity: resp.humidity,
          temperature: resp.temperature,
          created: resp.time,
          predictedTemp: pre.temperature,
          predictedHum: pre.humidity
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
    const { loading, error, humidity, temperature, created, predictedTemp, predictedHum } = this.state;

    // Activity
    return (
      <KeyboardAvoidingView style={styles.container} >

        <StatusBar barStyle="light-content" />

        <ImageBackground
          source={getImageForWeather(formatAMPM())}
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
                      Tp. Hồ Chí Minh <Text style={[styles.largeText, styles.textStyle]}>
                                      {getIconForWeather(setIconHumid(humidity))}
                                       </Text>
                    </Text>
                    
                    <Text style={[styles.normalText, styles.textStyle]}>
                      Độ ẩm: {parseInt(humidity) + '%'}  
                    </Text>
                    <Text style={[styles.normalText, styles.textStyle]}>
                      Nhiệt độ: {`${Math.round(parseFloat(temperature) * 10) / 10}°`} - {`${Math.round(parseFloat(temperature) *33.8* 10) / 10}°F`}
                    </Text>
                    <Text style={[styles.normalText, styles.textStyle]}>
                      Cập nhật lần cuối: {timeConverter(created)}{"\n\n\n"}
                    </Text>
                  
                    <Text h1 style={[styles.largeText, styles.textStyle]}>
                      Dự báo một giờ tới <Text style={[styles.largeText, styles.textStyle]}>
                                      {getIconForWeather(setIconHumid(predictedHum))}
                                       </Text>
                    </Text>
                    <Text style={[styles.normalText, styles.textStyle]}>
                      Độ ẩm: {parseInt(predictedHum) + '%'}
                    </Text>
                    <Text style={[styles.normalText, styles.textStyle]}>
                      Nhiệt độ: {`${Math.round(parseFloat(predictedTemp) * 10) / 10}°`}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}
function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  // var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  var time = hour + ':' + min + ':' + sec;

  return time;
}

// Xu ly background theo gio he thong.
function formatAMPM() {
  var a = new Date();
  var hours = a.getHours();
  var minutes = a.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  if(strTime.includes("am")) {
    return 'Morning';
  }else{
    return 'Night';
  }
}


function setIconHumid(humidity){
  var a=parseFloat(humidity);
  //duoi 30 thi nang
  if(a<=30){
    return 'Clear';
  }
  //tren 30 thi am uot
  else if(a<90){
    return 'Light Rain';
  }
  // tren 90 thi mua
  else{
    return 'Heavy Rain';
  }
}
/* StyleSheet */
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    // justifyContent: 'center',
    // backgroundColor: 'rgba(0,0,0,0.2)',
    // paddingHorizontal: 5,
  },
  textStyle: {
    textAlign: 'left',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
  },
  largeText: {
    fontSize: 40,
    fontWeight:"bold"
  },
  smallText: {
    fontSize: 18,
  },
  normalText: {
    fontSize: 26,
    padding:15
  },
});