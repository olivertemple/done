import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import { Dimensions, Text, TextInput, TouchableOpacity, View, Image, ScrollView, LayoutAnimation, Linking } from 'react-native';
import { Switch } from "react-native-paper";
import PP from "./PP";

export default class Settings extends Component{
    constructor(props){
        super(props);
        this.state = {
            name:null,
            animations:true,
            pp:false
        }
        AsyncStorage.getItem("name").then(name => {
            this.setState({name:name})
        })
        AsyncStorage.getItem("animations").then(res => {
            if (res!==null){
                this.setState({animations:eval(res)})
            }
        })
        this.updateName = this.updateName.bind(this);
        this.animationSwitch = this.animationSwitch.bind(this);
    }

    updateName(name){
        AsyncStorage.setItem("name",name)
        this.props.updateName(name)
    }

    animationSwitch(){
        AsyncStorage.setItem("animations", JSON.stringify(!this.state.animations))
        this.props.updateAnimations(!this.state.animations)
        this.setState({animations:!this.state.animations})
    }
    
    render(){
        return(
            <View style={{padding:20, justifyContent:"space-between", height:Dimensions.get("window").height, elevation:0}} >
                <View>
                    <View>
                        <Text style={{fontSize:26, fontFamily:"bold"}}>Settings</Text>
                    </View>
                    <View style={{gap:20, marginTop:10}}>
                        {this.state.pp ? <PP cancel={() => {LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);this.setState({pp:false})}}/> : null}
                        <View>
                            <Text style={{fontSize:20, fontFamily:"regular"}}>Name:</Text>
                            <TextInput placeholder={this.state.name} style={{fontSize:16, padding:10, borderRadius:5, backgroundColor:"#E8E8E8", marginTop:5, fontFamily:"regular"}} onChangeText={(text) => this.updateName(text)}></TextInput>
                        </View>
                        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginTop:20}}>
                            <Text style={{fontSize:20, fontFamily:"regular"}}>Reduce animations:</Text>
                            <Switch value={!this.state.animations} onValueChange={this.animationSwitch}></Switch>
                        </View>
                        <ScrollView style={{marginTop:10}}>
                            <View style={{marginTop:10}}>
                                <TouchableOpacity onPress={() => {Linking.openURL("https://github.com/olivertemple/done")}}>
                                    <View style={{borderWidth:0, borderColor:"#171516", padding:10, borderRadius:5, flexDirection:"row", gap:10, alignItems:"center", backgroundColor:"#E8E8E8"}}>
                                        <Image source={require("../assets/GitHub-Mark-Light-64px.png")} style={{width:50, height:50, tintColor:"black"}}></Image>
                                        <Text style={{fontSize:26, fontFamily:"bold", marginLeft:10}}>GitHub</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginTop:10}}>
                                <TouchableOpacity onPress={() => {Linking.openURL("https://github.com/olivertemple/done/issues/new")}}>
                                    <View style={{borderWidth:0, borderColor:"#171516", padding:10, borderRadius:5, flexDirection:"row", gap:10, alignItems:"center", backgroundColor:"#E8E8E8"}}>
                                        <Image source={require("../assets/bug.png")} style={{width:50, height:50, tintColor:"red"}}></Image>
                                        <Text style={{fontSize:26, fontFamily:"bold", marginLeft:10}}>Report a bug</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginTop:10}}>
                                <TouchableOpacity onPress={() => {Linking.openURL("mailto:oliver.temple.dev@gmail.com")}}>
                                    <View style={{borderWidth:0, borderColor:"#171516", padding:10, borderRadius:5, flexDirection:"row", gap:10, alignItems:"center", backgroundColor:"#E8E8E8"}}>
                                        <Image source={require("../assets/email.png")} style={{width:50, height:50}}></Image>
                                        <Text style={{fontSize:26, fontFamily:"bold", marginLeft:10}}>Send me an email</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginTop:10}}>
                                <TouchableOpacity onPress={() => {LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);this.setState({pp:true})}}>
                                    <View style={{borderWidth:0, borderColor:"#171516", padding:10, borderRadius:5, flexDirection:"row", gap:10, alignItems:"center", backgroundColor:"#E8E8E8"}}>
                                        <Image source={require("../assets/shield-with-lock.png")} style={{width:50, height:50}}></Image>
                                        <Text style={{fontSize:26, fontFamily:"bold", marginLeft:10}}>Privacy policy</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginTop:10}}>
                                <TouchableOpacity onPress={() => {Linking.openURL("https://www.buymeacoffee.com/olivertemple")}}>
                                <View style={{borderWidth:0, borderColor:"#171516", padding:10, borderRadius:5, flexDirection:"row", gap:10, alignItems:"center", backgroundColor:"#E8E8E8", tintColor:"#E8E8E8"}}>
                                        <Image source={require("../assets/bmc-logo.png")} style={{width:50, height:50}}></Image>
                                        <Text style={{fontSize:26, fontFamily:"bold", marginLeft:10}}>Buy me a coffee</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
                <View style={{flexDirection:"row", justifyContent:"space-evenly", padding:10, alignItems:"center"}}>
                    <TouchableOpacity onPress={this.props.exit}>
                        <Image source={require("../assets/cancel.png")} style={{width:25, height:25, tintColor:"#C5C5C5"}}></Image>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

//https://github.com/olivertemple/done/issues/new