import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import { Dimensions, Text, TextInput, TouchableOpacity, View, Image, ScrollView, LayoutAnimation, Linking } from 'react-native';

export default class PP extends Component{
    render(){
        return(
            <View style={{position:"absolute", backgroundColor:"white", borderRadius:10, borderWidth:2, borderColor:"black", padding:10, zIndex:5, elevation:1, shadowColor:"#000", shadowOffset:{
                width:0, height:5
            }, shadowOpacity:0.7, shadowRadius:20}}>
                <Text style={{fontSize:26, fontWeight:"bold"}}>
                    Privacy Policy
                </Text>
                <View style={{marginTop:10}}>
                    <Text style={{fontSize:16}}>
                        The only data stored is your name and the data relating to different habits. We only store this data on your device, and we never store it on an external server. This data stored includes:
                    </Text>
                    <View>
                        <Text style={{fontSize:16}}>
                            {'\u2022'} Your name
                        </Text>
                        <Text style={{fontSize:16}}>
                            {'\u2022'} Habit name
                        </Text>
                        <Text style={{fontSize:16}}>
                            {'\u2022'} Timestamp for when habits were last completed
                        </Text>
                        <Text style={{fontSize:16}}>
                            {'\u2022'} Streak
                        </Text>
                        <Text style={{fontSize:16}}>
                            {'\u2022'} Weather a habit is a weekly or a daily habit
                        </Text>
                        <Text style={{fontSize:16}}>
                            {'\u2022'} Color of the habit
                        </Text>
                        <Text style={{fontSize:16}}>
                            {'\u2022'} Progress of the habit throughout the time-frame (week or day)
                        </Text>
                    </View>
                    <Text style={{fontSize:16}}>Your data is only used for the functions of the app. When the app is deleted, so is your data.</Text>
                </View>
                <TouchableOpacity onPress={this.props.cancel} style={{marginTop:10}}>
                    <View style={{justifyContent:"center", alignItems:"center"}}>
                        <Image source={require("../assets/cancel.png")} style={{height:25, width:25}}></Image>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

