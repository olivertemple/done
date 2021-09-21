import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import { View, Text, Dimensions, TouchableOpacity, Image, TextInput, Linking} from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { Switch } from "react-native-paper";

export default class Settings extends Component{
    constructor(props){
        super(props);
        this.state = {
            name:null,
            animations:null
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
            <View style={{padding:20, justifyContent:"space-between", height:Dimensions.get("window").height}}>
                <View>
                    <View>
                        <Text style={{fontSize:26, fontWeight:"bold"}}>Settings</Text>
                    </View>
                    <View style={{gap:20, marginTop:10}}>
                        <View>
                            <Text style={{fontSize:20}}>Name:</Text>
                            <TextInput placeholder={this.state.name} style={{fontSize:16, borderColor:"black", borderWidth:1, padding:10, borderRadius:5}} onChangeText={(text) => this.updateName(text)}></TextInput>
                        </View>
                        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                            <Text style={{fontSize:20}}>Reduce animations:</Text>
                            <Switch value={this.state.animations} onValueChange={this.animationSwitch}></Switch>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => {Linking.openURL("https://www.buymeacoffee.com/olivertemple")}}>
                                <Image source={{uri: "https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" }} alt="Buy Me A Coffee" style={{height: (Dimensions.get("window").width - 40)*(60/217), width: Dimensions.get("window").width - 40}} />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => {Linking.openURL("https://github.com/olivertemple")}}>
                                <View style={{backgroundColor:"#171516", padding:10, borderRadius:10, flexDirection:"row", gap:10, alignItems:"center"}}>
                                    <Image source={require("../assets/GitHub-Mark-Light-64px.png")} style={{width:50, height:50}}></Image>
                                    <Text style={{fontSize:26, color:"white", fontWeight:"bold"}}>GitHub</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{flexDirection:"row", justifyContent:"space-evenly", padding:10, alignItems:"center"}}>
                    <TouchableOpacity onPress={this.props.exit}>
                        <Image source={require("../assets/check.png")} style={{width:30, height:30}}></Image>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

//<a href="https://www.buymeacoffee.com/olivertemple" target="_blank">
//60/217