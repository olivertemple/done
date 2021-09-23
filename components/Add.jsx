import React, { Component, createRef, useRef, useState } from "react";
import { View, Text, Image, Dimensions, Touchable } from "react-native";
import { RadioButton } from 'react-native-paper';
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colours from "./Colours";

export default class Add extends Component{
    constructor(props){
        super(props)
        this.state = {
            timeFrame:"daily",
            color:null,
            title:null,
            times:1,
            emoji:null,
            titleWarning:"#00000000",
            showCross:false
        }

        this.setTimeFrameValue = this.setTimeFrameValue.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.setColour = this.setColour.bind(this);
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
        if (this.state.title && !this.habitTitles.includes(this.state.title) && this.state.color){
            let data={
                last: + new Date(),
                today:0,
                daily:this.state.times,
                streak:0,
                timeFrame:this.state.timeFrame,
                icon:"icon",
                color:this.state.color.code,
                colorName:this.state.color.name,
                title:this.state.title,
                paused:false
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

    setColour(value){
        this.setState({color:value})
    }

    render(){
        this.key1 = createRef(null);
        this.key2 = createRef(null);
        return(
            <View style={{padding:20, justifyContent:"space-between", height:Dimensions.get("window").height}}>
                <View>
                    <View>
                        <Text style={{fontSize:26, fontWeight:"bold"}}>Create</Text>
                    </View>
                    <View>
                        <View style={{marginTop:20}}>
                            <Text style={{fontSize:20}}>Give your goal a title:</Text>
                            <TextInput ref={this.key1} placeholder="Title" style={{fontSize:16, padding:10, borderRadius:5, backgroundColor:"#E8E8E8", marginTop:5}} onChangeText={text => {this.updateTitle(text)}}></TextInput>
                            <Text style={{color:this.state.titleWarning, fontSize:10}}>Title already exists</Text>
                        </View>
                        <View style={{marginTop:20}}>
                            <Text style={{fontSize:20}}>Choose a time period:</Text>
                            <View style={{flexDirection:"row",marginTop:5}}>
                                <TouchableOpacity onPress={() => {this.setTimeFrameValue("daily")}} style={{backgroundColor:this.state.timeFrame==="daily" ? "#E3E3E3" : "white", borderRadius:5}} >
                                    <Text style={{padding:10, fontSize:16}}>Daily</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {this.setTimeFrameValue("weekly")}} style={{backgroundColor:this.state.timeFrame==="weekly" ? "#E3E3E3" : "white", borderRadius:5, marginLeft:10}}>
                                    <Text style={{padding:10, fontSize:16}}>Weekly</Text>
                                </TouchableOpacity>
                            </View>
                
                        </View>
                        <View style={{marginTop:20}}>
                            <Text style={{fontSize:20}}>Complete goal:</Text>
                            <View style={{flexDirection:"row", alignItems:"center", marginTop:5}}>
                                <View style={{backgroundColor:"#E8E8E8", flexDirection:"row", alignItems:"center", paddingRight:10,borderRadius:5}}>
                                    <TextInput keyboardType="numeric" placeholder="1" style={{fontSize:16, padding:10, borderRadius:5, alignSelf:"flex-start"}} onChangeText={text =>{this.setState({times:text})}} ref={this.key2} onFocus={() => {this.setState({showCross:true})}} onBlur={() => {this.setState({showCross:false})}}>{this.state.times===1 ? null : this.state.times}</TextInput>
                                    <TouchableOpacity onPress={() => {this.setState({times:1})}} style={{padding:5, backgroundColor:this.state.showCross ? "lightgrey" : "#E8E8E8", borderRadius:100}}>
                                        <Image style={{height:this.state.showCross ? 10 : 0, width:10}} source={require("../assets/cancel.png")}></Image>
                                    </TouchableOpacity>
                                </View>
                                <Text style={{fontSize:16, marginLeft:5}}>or more times per {this.state.timeFrame=="daily" ? "day" : "week"}</Text>
                            </View>
                        </View>
                        <View style={{marginTop:20}}>
                            <Text style={{fontSize:20}}>Colour</Text>
                            <Colours setColour={this.setColour} key1={this.key1}key2={this.key2}></Colours>

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