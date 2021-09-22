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
            animations:null,
            pp:false
        }
        AsyncStorage.getItem("name").then(name => {
            this.setState({name:name})
        })
        AsyncStorage.getItem("animations").then(res => {
            this.setState({animations:eval(res)})
        })
        this.updateName = this.updateName.bind(this);
        this.animationSwitch = this.animationSwitch.bind(this);
    }

    updateName(name){
        AsyncStorage.setItem("name",name)
        this.props.updateName(name)
    }

    animationSwitch(){
        AsyncStorage.setItem("animations", !this.state.animations)
        this.props.updateAnimations(!this.state.animations)
        this.setState({animations:!this.state.animations})
    }
    
    render(){
        return(
            <View style={{padding:20, justifyContent:"space-between", height:Dimensions.get("window").height, elevation:0}} >
                <View>
                    <View>
                        <Text style={{fontSize:26, fontWeight:"bold"}}>Settings</Text>
                    </View>
                    <View style={{gap:20, marginTop:10}}>
                        {this.state.pp ? <PP cancel={() => {LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);this.setState({pp:false})}}/> : null}
                        <View>
                            <Text style={{fontSize:20}}>Name:</Text>
                            <TextInput placeholder={this.state.name} style={{fontSize:16, borderColor:"black", borderWidth:1, padding:10, borderRadius:5}} onChangeText={(text) => this.updateName(text)}></TextInput>
                        </View>
                        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                            <Text style={{fontSize:20}}>Reduce animations:</Text>
                            <Switch value={this.state.animations} onValueChange={this.animationSwitch}></Switch>
                        </View>
                        <ScrollView>
                            <View style={{marginTop:10}}>
                                <TouchableOpacity onPress={() => {Linking.openURL("https://github.com/olivertemple/done")}}>
                                    <View style={{borderWidth:2, borderColor:"#171516", padding:10, borderRadius:10, flexDirection:"row", gap:10, alignItems:"center"}}>
                                        <Image source={require("../assets/GitHub-Mark-Light-64px.png")} style={{width:50, height:50, tintColor:"black"}}></Image>
                                        <Text style={{fontSize:26, fontWeight:"bold"}}>GitHub</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginTop:10}}>
                                <TouchableOpacity onPress={() => {Linking.openURL("https://github.com/olivertemple/done/issues/new")}}>
                                    <View style={{borderWidth:2, borderColor:"black", padding:10, borderRadius:10, flexDirection:"row", gap:10, alignItems:"center"}}>
                                        <Image source={require("../assets/bug.png")} style={{width:50, height:50, tintColor:"red"}}></Image>
                                        <Text style={{fontSize:26, fontWeight:"bold"}}>Report a bug</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginTop:10}}>
                                <TouchableOpacity onPress={() => {Linking.openURL("mailto:oliver.temple.dev@gmail.com")}}>
                                    <View style={{borderWidth:2, borderColor:"black", padding:10, borderRadius:10, flexDirection:"row", gap:10, alignItems:"center"}}>
                                        <Image source={require("../assets/email.png")} style={{width:50, height:50}}></Image>
                                        <Text style={{fontSize:26, fontWeight:"bold"}}>Send me an email</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginTop:10}}>
                                <TouchableOpacity onPress={() => {LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);this.setState({pp:true})}}>
                                    <View style={{borderWidth:2, borderColor:"black", padding:10, borderRadius:10, flexDirection:"row", gap:10, alignItems:"center"}}>
                                        <Image source={require("../assets/shield-with-lock.png")} style={{width:50, height:50}}></Image>
                                        <Text style={{fontSize:26, fontWeight:"bold"}}>Privacy policy</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginTop:10}}>
                                <TouchableOpacity onPress={() => {Linking.openURL("https://www.buymeacoffee.com/olivertemple")}}>
                                    <Image source={require("../assets/bmc-full_logo.png")} style={{height: (Dimensions.get("window").width - 40)*(60/217), width: Dimensions.get("window").width - 40,borderWidth:2, borderColor:"black", borderRadius:10}} />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
                <View style={{flexDirection:"row", justifyContent:"space-evenly", padding:10, alignItems:"center"}}>
                    <TouchableOpacity onPress={this.props.exit}>
                        <Image source={require("../assets/cancel.png")} style={{width:25, height:25}}></Image>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

//https://github.com/olivertemple/done/issues/new