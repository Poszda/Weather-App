import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native';

export default function Day({data,getCorrectIcon}) {
    console.log(data)
    const realData = {
        time:data.dt_txt.substring(11,16),
        date:data.dt_txt.substring(0,10),
        temp: Math.round(data.main.temp),
        tempMin:Math.round(data.main.temp_min),
        tempMax:Math.round(data.main.temp_max),
        weatherName:data.weather[0].main,
        weatherReq:getCorrectIcon(data.weather[0].main)
    }
    /*     {
        temp:'unu',
        tempMin:'doi',
        tempMax:'trei',
        weatherType:'patru'
    } */
    return (
        <View style={styles.box}>
            <Text>{realData.time}</Text>
            <Image style={styles.img} source={realData.weatherReq} />
            <Text>{realData.temp}°</Text>
            <Text>{realData.weatherName}</Text>
            <Text>{realData.date}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    box: {
        width: 150,
        height: 150,
        backgroundColor: 'white',
        marginLeft: 10,
        display:'flex',
        alignItems:'center',
        borderRadius:10
    },
    img: {
        width: 60,
        height: 60,
        resizeMode: 'contain'
    },
}
)