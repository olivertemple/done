import React from 'react';
import { Component } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ScrollView, UIManager, LayoutAnimation, Platform, TouchableWithoutFeedbackBase } from 'react-native';
import Add from './components/Add';
import { StatusBar } from 'expo-status-bar';
import Button from "./components/Button";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListItem from './components/items/ListItem';
import ConfettiCannon from 'react-native-confetti-cannon';
import Settings from './components/Settings';
import * as Font from 'expo-font';
import AppLoading from "expo-app-loading";

let customFonts = {
  "regular":require("./assets/fonts/BalsamiqSans-Regular.ttf"),
  "bold":require("./assets/fonts/BalsamiqSans-Bold.ttf")
}

if (Platform.OS === 'android') {  
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);  
  }
}

export default class App extends Component{
  constructor(props){
    super(props)
    this.state = {
      name:null,
      habits:null,
      screen:null,
      edit:false,
      list:true,
      confetti:false,
      animations:true,
      paused:null,
      fontsLoaded:false
    }


    this.updateName = this.updateName.bind(this);
    this.setName = this.setName.bind(this);
    this.getName = this.getName.bind(this);
    this.add = this.add.bind(this);
    this.renderScreens = this.renderScreens.bind(this);
    this.addHabit = this.addHabit.bind(this);
    this.menuBar = this.menuBar.bind(this);
    this.edit = this.edit.bind(this);
    this.titleBar = this.titleBar.bind(this);
    this.delete = this.delete.bind(this);
    this.updateHabits = this.updateHabits.bind(this);
    this.showConfetti = this.showConfetti.bind(this);
    this.confetti = this.confetti.bind(this);
    this.toggleGrid = this.toggleGrid.bind(this);
    this.pauseHabit = this.pauseHabit.bind(this);
    this.play = this.play.bind(this);

    this.getName().then(name => {
      if (name){
        this.setState({
          name:name
        })
      }
    })
    AsyncStorage.getItem("animations").then(res => {
      if (res !== null){
        this.setState({animations:res})
      }
    })
    AsyncStorage.getItem("list").then(res => {
      if (res!==null){
        this.setState({list:eval(res)})
      }
    })

    AsyncStorage.getItem("paused").then(res => {
      if (res!==null){
        this.setState({paused: JSON.parse(res)})
      }
    })

    this.updateHabits();
  }

  async _loadFontsAsync(){
    await Font.loadAsync(customFonts);
    this.setState({fontsLoaded:true})
  }

  componentDidMount(){
    this._loadFontsAsync();
  }

  showConfetti(){
    console.log(this.state)
    if (this.state.animations){
      this.setState({
        confetti:true
      })
    }
    
  }

  updateHabits(){
    this.getHabits().then(habits => {
      this.setState({
        habits:JSON.parse(habits)
      })
    })
  }

 

  updateName(name){
    this.state.name = name;
  }

  async setName(){
    AsyncStorage.setItem(
      "name",
      this.state.name
    ).then(() => {
      this.setState({name:this.state.name})
    })
  }

  async getName(){
    let name = await AsyncStorage.getItem("name");
    return name
  }

  async getHabits(){
    let habits = await AsyncStorage.getItem("habits");
    return habits;
  }

  add(){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({
      screen:"add"
    })
  }

  edit(){
    this.setState({
      edit:true
    })
  }

  pauseHabit(name){
    console.log(name)
    let state = this.state;
    let habit = state.habits[name]
    delete state.habits[name]
    if (state.paused){ 
      state.paused[name] = habit
    }else{
      state.paused = {}
      state.paused[name] = habit
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState(state)

    AsyncStorage.setItem("habits", JSON.stringify(state.habits))
    AsyncStorage.setItem("paused", JSON.stringify(state.paused))

  }

  play(name){
    let state = this.state;
    let habit = state.paused[name]
    delete state.paused[name]
    if (state.habits){ 
      state.habits[name] = habit
    }else{
      state.habits = {}
      state.habits[name] = habit
    }
    state.habits[name].last = + new Date()
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState(state)

    AsyncStorage.setItem("habits", JSON.stringify(state.habits))
    AsyncStorage.setItem("paused", JSON.stringify(state.paused))

  }

  addHabit(data){
    let state = this.state;
    if (state.habits){
      state.habits[data.title] = data;
      state.screen = null;
    }else{
      let title = data.title;
      state.habits = {}
      state.habits[title] = data;
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState(state);
    AsyncStorage.setItem("habits", JSON.stringify(state.habits))
  }

  toggleGrid(){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    AsyncStorage.setItem("list",JSON.stringify(!this.state.list))
    this.setState({list:!this.state.list})
  }

  menuBar(){
    if (!this.state.edit){
      return(
        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
          <TouchableOpacity onPress={() => {LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); this.setState({screen:"settings"})}}>
            <Image source={require("./assets/settings.png")} style={{height:25, width:25, tintColor:"#C5C5C5"}}></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.add}>
            <Image source={require("./assets/add(1).png")} style={{width:20, height:20, tintColor:"#C5C5C5"}}></Image>
          </TouchableOpacity>
    
          <TouchableOpacity onPress = {this.toggleGrid}>
            <Image source={this.state.list ? require("./assets/visualization.png") : require("./assets/list.png")} style={{width:20, height:20, tintColor:"#C5C5C5"}}></Image>
          </TouchableOpacity>
        </View>
      )
    }else{
      return(
        <View style={{flexDirection:"row", justifyContent:"center", padding:10}}>
          <TouchableOpacity onPress={() => {LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); this.setState({edit:false})}}>
            <Image source={require("./assets/check.png")} style={{width:30, height:30}}></Image>
          </TouchableOpacity>
        </View>
      )
    }
    
  }

  titleBar(){
    if (!this.state.edit){
      let time = new Date().getHours();
      let text;
      if (time < 12){
        text = "Good morning"
      }else if (time >=12 && time < 17){
        text = "Good afternoon"
      }else{
        text = "Good evening"
      }
      /*
      return(
        <View style={{flexDirection:"row", justifyContent:"space-between"}}>
          <View>
            <Text style={{fontSize:26, fontWeight:"bold"}}>{text},</Text>
            <Text style={{fontSize:26, fontWeight:"bold"}}>{this.state.name}</Text>
          </View>
        </View>

      )*/
      return(
        <View style={{alignItems:"center"}}>
          <View style={{alignItems:"center"}}>
            <Text style={{fontSize:40, fontFamily:"bold"}}>Done</Text>
          </View>
        </View>
      )
    }else{
      return(
        <View>
          <Text style={styles.text1}>Edit</Text>
          <Text style={[styles.text1], {fontWeight:"normal", fontSize:26}}>Current</Text>
        </View>
      )
    }
    
  }

  delete(data){
    let state = this.state
    delete state.habits[data.title]
    delete state.paused[data.title]
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState(state)

    AsyncStorage.setItem("habits",JSON.stringify(state.habits))
    AsyncStorage.setItem("paused", JSON.stringify(state.paused))
  }

  renderScreens(){
    if (!this.state.screen){
      if (!this.state.name){
        return (
          <View style={styles.container}>
            <View style={styles.innerContainer}>
            <View>
              <Text style={styles.text1}>Done.</Text>
              <Text style={styles.text2}>The place to track all of your habits</Text>
            </View>
              <View>
                <Text style={styles.text2}>What is your name?</Text>
                <TextInput placeholder="name" style={[styles.input, styles.text2]} onChangeText = {(text) => {this.updateName(text)}}></TextInput>
              </View>
            </View>
            <Button image={require("./assets/right-arrow.png")} onPress={this.setName} style={styles.button} imageStyle={styles.image}></Button>
          </View>
        );
      }else if (this.state.habits){
        return(
          <View style={{padding:10, justifyContent:"space-between", height:Dimensions.get("window").height}}>
            <View>
              <this.titleBar />
              <ScrollView style={{height:Dimensions.get("window").height - 150, marginTop:10}}>
                <View style={{flexDirection:this.state.list ? "column" : "row", flexWrap:"wrap"}}>
                  {Object.keys(this.state.habits).map(key => {
                    return(
                      <ListItem key={key} data={this.state.habits[key]} edit={this.state.edit} delete={this.delete} updateHabits={this.updateHabits} showConfetti={this.showConfetti} pause={this.pauseHabit} list={this.state.list}></ListItem>
                    )
                  })}
                </View>
                {(Object.keys(this.state.paused).length > 0) ? (
                    <View>
                        <Text style={{fontSize:26}}>Paused</Text>
                        {Object.keys(this.state.paused).map(key => {
                          return(
                            <ListItem key={key} data={this.state.paused[key]} edit={this.state.edit} delete={this.delete} updateHabits={this.updateHabits} showConfetti={this.showConfetti} paused={true} pause={this.play} list={this.state.list}></ListItem>
                          )
                        })}
                    </View>
                ) : null}
              </ScrollView>
            </View>
            <this.menuBar />
          </View>
        )
      }else{
        return(
          <View style={{padding:10, justifyContent:"space-between", height:Dimensions.get("window").height}}>
            <View style={{gap:10}}>
              <this.titleBar />
              <Text style={{fontSize:20}}>
                Add some habits to get started
              </Text>
            </View>
            <this.menuBar />
          </View>
        )
      }
    }else if (this.state.screen === "add"){
      return(
        <View style={{height:Dimensions.get("window").height}}>
          <Add cancel={() => {LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); this.setState({screen:null})}} addHabit={this.addHabit}></Add>
        </View>
      )
    }else if (this.state.screen === "settings"){
      return(
        <Settings updateName={(name) => {this.setState({name:name})}} updateAnimations={(animations) => {this.setState({animations:eval(animations)})}} exit={() =>{this.setState({screen:null})}}></Settings>
      )
    }
    
    
  }

  confetti(){
    if (this.state.confetti){
      return(
        <ConfettiCannon count={200} origin={{x: -10, y: 0}} onAnimationEnd={() => {this.setState({confetti:false})}}/>
      )
    }else{
      return null
    }
  }
  render(){
    if (this.state.fontsLoaded){
      return(
        <View style={{marginTop:30}}>
            <StatusBar style="auto" />
            <this.confetti />
            <this.renderScreens />
        </View>
      )
    }else{
      return <AppLoading />
    }
    
  } 
}

const styles = StyleSheet.create({
  container: {
    padding:20,
    justifyContent:"space-between",
    height:Dimensions.get("window").height
  },
  innerContainer:{
  },
  input:{
    borderBottomColor:"#00000050",
    borderBottomWidth:2
  },
  text1:{
    fontSize:26,
    fontFamily:"bold"
  },
  text2:{
    fontSize:16,
    fontFamily:"regular"
  },
  button:{
    borderRadius:10,
    alignItems:"center",
    borderColor:"black",
    borderWidth:1,
    padding:10
  },
  image:{
    height:30,
    width:30
  }
});

