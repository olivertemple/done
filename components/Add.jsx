import React, { Component, useState } from "react";
import { View, Text, Image, Dimensions } from "react-native";
import { RadioButton } from 'react-native-paper';
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Add extends Component{
    constructor(props){
        super(props)
        this.state = {
            timeFrame:"daily",
            color:"red",
            title:null,
            times:1,
            emoji:null,
            titleWarning:"#00000000"
        }

        this.setTimeFrameValue = this.setTimeFrameValue.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.add = this.add.bind(this);
        this.habitTitles = null
        AsyncStorage.getItem("habits").then(res => {
            if (res){
                res = JSON.parse(res)
                this.habitTitles = Object.keys(res)
            }else{
                this.habitTitles = []
            }
            
        })

    }

    setTimeFrameValue(value){
        this.setState({
            timeFrame:value
        })
    }

    handleColorChange(color){
        this.setState({color:color})
    }

    add(){
        if (this.state.title && !this.habitTitles.includes(this.state.title)){
            let data={
                last: + new Date(),
                today:0,
                daily:this.state.times,
                streak:0,
                timeFrame:this.state.timeFrame,
                icon:"icon",
                color:this.state.color,
                title:this.state.title
            }
            this.props.addHabit(data)
        }
        
    }

    async updateTitle(text){
        this.state.title = text
        if (!this.habitTitles.includes(text)){
            this.setState({
                titleWarning:"#00000000"
            })
        }else{
            this.setState({
                titleWarning:"red"
            })
        }
    }

    render(){
        return(
            <View style={{padding:20, justifyContent:"space-between", height:Dimensions.get("window").height}}>
                <View>
                    <View>
                        <Text style={{fontSize:26, fontWeight:"bold"}}>Add</Text>
                    </View>
                    <View style={{gap:20}}>
                        <View>
                            <Text style={{fontSize:20}}>Goal title:</Text>
                            <TextInput placeholder="title" style={{fontSize:16, borderColor:"black", borderWidth:1, padding:10, borderRadius:5}} onChangeText={text => {this.updateTitle(text)}}></TextInput>
                            <Text style={{color:this.state.titleWarning, fontSize:10}}>Title already exists</Text>
                        </View>
                        <View>
                            <Text style={{fontSize:20}}>Timeframe:</Text>
                            <RadioButton.Group value={this.state.timeFrame} onValueChange={(value) => this.setTimeFrameValue(value)}>
                                <RadioButton.Item style={{padding:5, fontSize:16, marginTop:-10}}label="daily" value="daily"></RadioButton.Item>
                                <RadioButton.Item style={{padding:5, fontSize:16, marginTop:-10}} label="weekly" value="weekly"></RadioButton.Item>
                            </RadioButton.Group>
                            
                        </View>
                        <View>
                            <Text style={{fontSize:20}}>Times:</Text>
                            <TextInput autoCompleteType="cc-number" placeholder="1" style={{fontSize:16, borderColor:"black", borderWidth:1, padding:10, borderRadius:5}} onChangeText={text =>{this.state.times = text}}></TextInput>
                        </View>
                        <View>
                            <Text>Colour</Text>
                            <TextInput placeholder="red" style={{fontSize:16, borderColor:"black", borderWidth:1, padding:10, borderRadius:5}} onChangeText={text =>{this.state.color = text}}></TextInput>

                        </View>
                    </View>
                </View>
                <View style={{flexDirection:"row", justifyContent:"space-evenly", padding:10, alignItems:"center"}}>
                    <TouchableOpacity onPress={this.add}>
                        <Image source={require("../assets/check.png")} style={{width:30, height:30}}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {this.props.cancel()}}>
                        <Image source={require("../assets/cancel.png")} style={{width:25, height:25}}></Image>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

/*
<View>
    <Text style={{fontSize:20}}>Emoji:</Text>
    <TextInput placeholder="emoji" style={{fontSize:16, borderColor:"black", borderWidth:1, padding:10, borderRadius:5}} maxLength={1} onChangeText={text => {this.state.emoji = text}}></TextInput>
</View>

*/