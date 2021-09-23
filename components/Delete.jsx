import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import { Dimensions, Text, TextInput, TouchableOpacity, View, Image, ScrollView, LayoutAnimation, Linking } from 'react-native';

export default class Delete extends Component{
    render(){
        return(
            <View style={{position:"absolute", backgroundColor:"white", borderRadius:10, borderWidth:2, borderColor:"black", padding:10, zIndex:5, elevation:1, shadowColor:"#000", shadowOffset:{
                width:0, height:5
            }, shadowOpacity:0.7, shadowRadius:20}}>
                
                <Text>Are you sure you want to delete {this.props.title}</Text>
            </View>
        )
    }
}

