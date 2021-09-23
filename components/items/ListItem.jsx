import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import { Image, View, StyleSheet, Text, TouchableOpacity, Dimensions, LayoutAnimation } from "react-native";

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
        if(!this.props.paused){
            this.checkStats();
        }else{
            this.updateProgress();
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
                <View style={{flexDirection:"row", alignItems:"center", gap:10}}>
                    <TouchableOpacity onPress={this.pause}>
                        <Image source={this.props.paused ? require("../../assets/play.png") : require("../../assets/pause.png")} style={{width:25, height:25}}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => (this.props.delete(this.state))}>
                        <Image source={require("../../assets/trash.png")} style={{width:30, height:30}}></Image>
                    </TouchableOpacity>
                </View>
            )
        }
        
    }

    render(){
        return(
            <TouchableOpacity onPress = {this.increaseToday} style={{marginTop:10, marginLeft:this.props.list ? 0 : 5, marginRight:this.props.list ? 0 : 5}}>
                <View>
                    <View style={this.props.list ? {backgroundColor:this.state.scaleFactor > 0 ? this.state.color : "#00000000", width:((Dimensions.get("window").width - 20)*this.state.scaleFactor)+0.1, height:76.1, zIndex:0, borderTopLeftRadius:10, borderBottomLeftRadius:10, borderRadius: (this.state.today==this.state.daily) ? 10 : 0} : {backgroundColor:this.state.color, width:((Dimensions.get("window").width/2) - 20)*this.state.scaleFactor, height:this.props.edit ? 120 : 120, zIndex:0, borderTopLeftRadius:10, borderBottomLeftRadius:10, borderRadius: (this.state.today==this.state.daily) ? 10 : 0}}></View>
                    <View style={[styles.container, this.props.list ? {zIndex:1, marginTop:-76,flexDirection: this.props.list ? "row" : "column"} : {zIndex:1, marginTop:this.props.edit ? -120 : -120, width:((Dimensions.get("window").width/2) - 20), height:this.props.edit ? 120 : 120, alignItems:"center"}]}>
                        <View style={{flexDirection:"row", alignItems:"center"}}>
                            
                            <View style={[styles.main, this.props.list ? {} : {alignItems:"center"}]}>
                                <Text style={{fontSize:26}}>{this.state.title}</Text>
                                <Text style={{fontSize:16}}>{this.state.progress}</Text>
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
        justifyContent:"space-between",
        padding:10,
        borderRadius:10,
        width:(Dimensions.get("window").width - 20),
        borderWidth:2,
        borderColor:"black",
        height:76.1
    },
    main:{
        flexDirection:"column",
        justifyContent:"center"
    }
})  

/*<Image source={this.state.icon} style={{height:35, width:35}}></Image>*/