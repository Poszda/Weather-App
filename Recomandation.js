import React from 'react'
import { StyleSheet, Text, View, Image, ScrollView, ImageBackground } from 'react-native';

export default function Recomandation({text,mTop}) {
    return (
        <View style={styles.recomandationBox}>
            <View style={{width:'10%'}}>
            <Image source={require('./assets/point.png')} style={{ width: 20, height: 20}} />
            </View>
            <View  style={{width:'90%'}}>
            <Text>{text}</Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    recomandationBox: {
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        marginTop:15,
    }
})