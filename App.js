import React from 'react';
import { Component } from 'react';
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ScrollView, UIManager, LayoutAnimation, Platform, BackHandler } from 'react-native';
import Add from './components/Add';
import { StatusBar } from 'expo-status-bar';
import Button from "./components/Button";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListItem from './components/items/ListItem';
import ConfettiCannon from 'react-native-confetti-cannon';
import Settings from './components/Settings';
import * as Font from 'expo-font';
import { Appearance, AppearanceProvider} from 'react-native-appearance';
import Styles from "./Styles/AppStyle";

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
      fontsLoaded:false,
      theme:Appearance.getColorScheme(),
      themeSetting:"system",
      height:Dimensions.get("window").height,
      backgroundColor:Appearance.getColorScheme() === "dark" ? "#141414" : "white",
      color:Appearance.getColorScheme() === "dark" ? "#E0E0E0" : "black"
    }    

    Dimensions.addEventListener("change", () => {
      this.setState({
        height:Dimensions.get("window").height
      })
    })

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
    this.handelBackButton = this.handelBackButton.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);

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

    AsyncStorage.getItem("themeSetting").then(res => {
      if (res!==null && res!=="system"){
        this.setState({
          theme:res,
          themeSetting:res
        })
      }else{
        let colourScheme = Appearance.getColorScheme();
        this.setState({
          theme:colourScheme ? colourScheme : "light",
          themeSetting:"system"
        })
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
    BackHandler.addEventListener("hardwareBackPress", this.handelBackButton)
    console.log(Appearance.getColorScheme())
  }

  componentWillUnmount(){
    BackHandler.removeEventListener("hardwareBackPress", this.handelBackButton)
  }

  toggleTheme(theme){
    if (theme === "system"){
      AsyncStorage.removeItem("theme")
      AsyncStorage.setItem("themeSetting", "system")
      this.state.themeSetting = "system"
      this.setState({
        theme:Appearance.getColorScheme(),
        backgroundColor:Appearance.getColorScheme() === "dark" ? "#141414" : "white",
        color:Appearance.getColorScheme() === "dark" ? "#E0E0E0" : "black"
      })
    }else{
      AsyncStorage.setItem("theme",theme)
      AsyncStorage.setItem("themeSetting",theme)
      this.state.themeSetting = theme
      this.setState({
        theme:theme,
        backgroundColor:theme === "dark" ? "#141414" : "white",
        color:theme === "dark" ? "#E0E0E0" : "black"
      })
    }
    
  }

  handelBackButton(){
    if (this.state.screen !== null){
      this.setState({
        screen:null
      })
    }
    return true
  }

  showConfetti(){
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
    let state = this.state;
    let habit = state.habits[name];
    delete state.habits[name];
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
    return(
      <View style={Styles.menuBar}>
        <TouchableOpacity onPress={() => {LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); this.setState({screen:"settings"})}}>
          <Image source={require("./assets/settings.png")} style={Styles.Image}></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.add}>
          <Image source={require("./assets/add(1).png")} style={Styles.Image}></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress = {this.toggleGrid}>
          <Image source={this.state.list ? require("./assets/visualization.png") : require("./assets/list.png")} style={Styles.Image}></Image>
        </TouchableOpacity>
      </View>
    )
  }
    


  titleBar(){
    return(
      <View style={Styles.titleBar}>
          <Text style={[Styles.large, Styles.bold, {color:this.state.color}]}>Done</Text>
      </View>
    )
    
    
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
          <View style={[Styles.medium, Styles.bold]}>
            <View>
            <View>
              <Text style={[Styles.medium, Styles.bold]}>Done.</Text>
              <Text style={[Styles.small]}>The place to track all of your habits</Text>
            </View>
              <View>
                <Text style={[Styles.small]}>What is your name?</Text>
                <TextInput placeholder="name" style={[Styles.input, Styles.small]} onChangeText = {(text) => {this.updateName(text)}}></TextInput>
              </View>
            </View>
            <Button image={require("./assets/right-arrow.png")} onPress={this.setName} style={Styles.button} imageStyle={Styles.image}></Button>
          </View>
        );
      }else if (this.state.habits){
        return(
          <View style={[Styles.habitsContainer, {height:this.state.height}]}>
            <View>
              <this.titleBar />
              <ScrollView style={[Styles.habitsScroll, {height:this.state.height - 150}]}>
                <View style={{flexDirection:this.state.list ? "column" : "row", flexWrap:"wrap"}}>
                  {Object.keys(this.state.habits).map(key => {
                    return(
                      <ListItem key={key} data={this.state.habits[key]} edit={this.state.edit} delete={this.delete} updateHabits={this.updateHabits} showConfetti={this.showConfetti} pause={this.pauseHabit} list={this.state.list} theme={this.state.theme}></ListItem>
                    )
                  })}
                </View>
                {this.state.paused ? (Object.keys(this.state.paused).length > 0) ? (
                    <View>
                        <Text style={[Styles.medium, {color:this.state.color}]}>Paused</Text>
                        <View style={{flexDirection:this.state.list ? "column" : "row", flexWrap:"wrap"}}>
                          {Object.keys(this.state.paused).map(key => {
                            return(
                              <ListItem key={key} data={this.state.paused[key]} edit={this.state.edit} delete={this.delete} updateHabits={this.updateHabits} showConfetti={this.showConfetti} paused={true} pause={this.play} list={this.state.list} theme={this.state.theme}></ListItem>
                            )
                          })}
                        </View>
                    </View>
                ) : null
                : null}
                
              </ScrollView>
            </View>
            <this.menuBar />
          </View>
        )
      }else{
        return(
          null
        )
      }
    }else if (this.state.screen === "add"){
      return(
        <View style={{height:this.state.height}}>
          <Add cancel={() => {LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); this.setState({screen:null})}} addHabit={this.addHabit} theme={this.state.theme}></Add>
        </View>
      )
    }else if (this.state.screen === "settings"){
      return(
        <Settings updateName={(name) => {this.setState({name:name})}} updateAnimations={(animations) => {this.setState({animations:eval(animations)})}} exit={() =>{this.setState({screen:null})}} theme={this.state.theme} toggleTheme={this.toggleTheme} themeSetting={this.state.themeSetting}></Settings>
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
        <AppearanceProvider>
          <View style={{backgroundColor:this.state.backgroundColor}}>
              <this.confetti />
              <this.renderScreens />
              <StatusBar translucent={false} backgroundColor={this.state.backgroundColor} style={this.state.theme==="dark" ? "light" : "dark"} />
          </View>
        </AppearanceProvider>
      )
    }else{
      return null
    }
    
  } 
}