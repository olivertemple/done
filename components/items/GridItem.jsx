import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import { Image, View, StyleSheet, Text, TouchableOpacity, Dimensions,UIManager, LayoutAnimation, Platform } from "react-native";
import Colours from "../Colours";

export default class ListItem extends Component{
    constructor(props){
        super(props)
        this.state = this.props.data
        this.state.progress = null
        this.state.scaleFactor = this.state.today/this.state.daily
        this.increaseToday = this.increaseToday.bind(this);
        this.saveHabit = this.saveHabit.bind(this);
        this.right = this.right.bind(this);
        this.checkStats = this.checkStats.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
        this.pause = this.pause.bind(this);
    }

    componentDidMount(){
        if (!this.props.paused){
            this.checkStats();
        }
    }

   checkStats(){
    let date = new Date(this.state.last);
    let last =date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();

    let today = new Date(+ new Date());
    let todayDate = today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear();
    
    if (this.state.timeFrame === "daily"){
        
        if (last !== todayDate){
            console.log(last)
            console.log(todayDate)
            this.setState({
                today:0
            },()=>{
                this.updateProgress()
                this.saveHabit()
            })
            
            
        }
        if(date.getDate() <= (today.getDate()-2) || date.getMonth() < today.getMonth() || date.getFullYear() < today.getFullYear()){
            this.setState({
                streak:0
            }, () => {
                this.updateProgress()
                this.saveHabit()
            })
        }
    }else{
        if (today.getDay() === 1){
            this.setState({
                today:0
            }, () => {
                this.updateProgress()
                this.saveHabit()
            })
        }
        if(date.getDate() <= (today.getDate()-8) || date.getFullYear() < today.getFullYear()){
            this.setState({
                streak:0
            }, () => {
                this.updateProgress()
                this.saveHabit()
            })
        }
    }
    this.updateProgress()
    

   }
   updateProgress(){
    if (this.state.timeFrame === "daily"){
        this.progress = (this.state.today+"/"+this.state.daily) + " today"
    }else if (this.state.timeFrame === "weekly"){
        this.progress = (this.state.today+"/"+this.state.daily) + " this week"
    }
    let scaleFactor=this.state.today/this.state.daily
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({progress:this.progress, scaleFactor:scaleFactor})
   }
    increaseToday(){
        if (this.state.today < this.state.daily && !this.props.edit){
            let state = this.state;
            this.setState({
                today:state.today+1,
                scaleFactor:(state.today+1)/state.daily,
                streak:(state.today+1==state.daily) ? state.streak+1 : state.streak
            }, () => {
                this.saveHabit()
                this.updateProgress();
            })
            if (state.today+1==state.daily){
                this.props.showConfetti();
            }
        }
        
    }

    async saveHabit(){
        let habits = await AsyncStorage.getItem("habits")
        habits = JSON.parse(habits)
        habits[this.state.title] = {
            streak:this.state.streak,
            last: + new Date(),
            timeFrame:this.state.timeFrame,
            today:this.state.today,
            daily:this.state.daily,
            icon:this.state.icon,
            color:this.state.color,
            title:this.state.title
        }
        AsyncStorage.setItem("habits", JSON.stringify(habits)).then(() => {
            this.props.updateHabits();
        })
    }

    pause(){
        this.props.pause(this.state.title)
    }

    right(){
        if (!this.props.edit){
            return(
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    <Text style={{fontSize:26}}>{this.state.streak}</Text>
                    <Image source={require("../../assets/check.png")} style={{width:20, height:20}}></Image>
                </View>
            )
        }else{
            return(
                <View style={{flexDirection:"row", alignItems:"center",marginTop:5}}>
                    <TouchableOpacity onPress={this.pause}>
                        <Image source={this.props.paused ? require("../../assets/play.png") : require("../../assets/pause.png")} style={{width:25, height:25}}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => (this.props.delete(this.state))} style={{marginLeft:10}}>
                        <Image source={require("../../assets/trash.png")} style={{width:30, height:30}}></Image>
                    </TouchableOpacity>
                </View>
            )
        }
        
    }

    render(){
        if (this.state.timeFrame === "daily"){
            this.progress = (this.state.today+"/"+this.state.daily) + " today"
        }else if (this.state.timeFrame === "weekly"){
            this.progress = (this.state.today+"/"+this.state.daily) + " this week"
        }

        return(
            <TouchableOpacity onPress = {this.increaseToday} style={{marginRight:10, marginTop:10}}>
                <View>
                    <View style={{backgroundColor:this.state.color, width:((Dimensions.get("window").width/2) - 20)*this.state.scaleFactor, height:this.props.edit ? 120 : 120, zIndex:0, borderTopLeftRadius:10, borderBottomLeftRadius:10, borderRadius: (this.state.today==this.state.daily) ? 10 : 0}}></View>
                    <View style={[styles.container, {zIndex:1, marginTop:this.props.edit ? -120 : -120, width:((Dimensions.get("window").width/2) - 20), height:this.props.edit ? 120 : 120}]}>
                        <View style={{flexDirection:"row", alignItems:"center"}}>
                            <View style={styles.main}>
                                <Text style={{fontSize:26}}>{this.state.title}</Text>
                                <Text style={{fontSize:16}}>{this.progress}</Text>
                            </View>
                        </View>
                        <this.right />
                        
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flexDirection: "column",
        justifyContent:"space-between",
        padding:10,
        borderRadius:10,
        alignItems:"center",
        borderWidth:2,
        borderColor:"black",
    },
    main:{
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center"
    }
})  

/*<Image source={this.state.icon} style={{height:35, width:35}}></Image>*/