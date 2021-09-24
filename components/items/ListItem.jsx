import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component, createRef } from "react";
import { Image, View, StyleSheet, Text, TouchableOpacity, Dimensions, LayoutAnimation } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

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
        this.renderLeft = this.renderLeft.bind(this);
        this.renderRight = this.renderRight.bind(this);
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
                    <Text style={{fontSize:26, fontFamily:"regular"}}>{this.state.streak}</Text>
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

    renderLeft(){
        return(
            <View style={{justifyContent:"center", alignItems:"center", margin:30}}>
                <Image source={this.props.paused ? require("../../assets/play.png") : require("../../assets/pause.png")} style={{height:20, width:20}}></Image>
            </View>
        )
    }

    renderRight(){
        return(
            <View style={{justifyContent:"center", alignItems:"center", margin:30}}>
                <Image source={require("../../assets/trash.png")} style={{height:20, width:20, alignSelf:"flex-start"}}></Image>
            </View>
        )
    }

    render(){
        this.ref = createRef(null)
        return(
            <Swipeable ref={this.ref} renderLeftActions={this.renderLeft} renderRightActions={this.renderRight} onSwipeableRightOpen={() => {this.props.delete(this.state)}} onSwipeableLeftOpen={() => {this.props.pause(this.state.title)}}>
                <TouchableOpacity onPress = {this.increaseToday} style={{marginTop:10, marginLeft:this.props.list ? 0 : 5, marginRight:this.props.list ? 0 : 5, borderRadius:10,flex:1}}>
                    <View style={{flexDirection:"column", maxHeight:2000, minHeight:76.1}}>
                        <View style={[styles.container, this.props.list ? {zIndex:1,flexDirection: this.props.list ? "row" : "column"} : {zIndex:1, width:((Dimensions.get("window").width/2) - 20), alignItems:"center"}]}>
                            <View style={{flexDirection:"row", alignItems:"center", maxWidth:this.props.list ? ((Dimensions.get("window").width) - 80) :((Dimensions.get("window").width/2) - 20) }}>
                                <View style={[styles.main, this.props.list ? {} : {alignItems:"center"}]}>
                                    <Text style={{fontSize:26, fontFamily:"regular"}}>{this.state.title}</Text>
                                    <Text style={{fontSize:16, fontFamily:"regular"}}>{this.state.progress}</Text>
                                </View>
                            </View>
                            <this.right />
                        </View>
                        <View style={{flexDirection:"row", position:"absolute", borderRadius:10, height:"100%"}}>
                                <View style={[{}, this.props.list ? {
                                backgroundColor:this.state.scaleFactor > 0 ? this.state.color : "#00000000",
                                width:((Dimensions.get("window").width - 20)*this.state.scaleFactor)+0.1,
                                zIndex:0,
                                borderTopLeftRadius:10,
                                borderBottomLeftRadius:10,
                                borderRadius: (this.state.today==this.state.daily) ? 10 :0}
                                :
                                {backgroundColor:this.state.color,
                                width:((Dimensions.get("window").width/2) - 20)*this.state.scaleFactor,
                                zIndex:0,
                                borderTopLeftRadius:10,
                                borderBottomLeftRadius:10,
                                borderRadius: (this.state.today==this.state.daily) ? 10 : 0}]}>
                                </View>

                                <View style={[{backgroundColor:this.state.theme === "light" ? "#E8E8E8" : "#E8E8E8", borderRadius:this.state.scaleFactor > 0 ? 0 : 10, borderTopRightRadius:10, borderBottomRightRadius:10},this.props.list ? {
                                width:(Dimensions.get("window").width - 20) - (((Dimensions.get("window").width - 20)*this.state.scaleFactor)+0.1)
                            } : {
                                width: (Dimensions.get("window").width/2 - 20) - (((Dimensions.get("window").width/2) - 20)*this.state.scaleFactor)
                            }]}></View>
                        </View>

                        
                    </View>
                </TouchableOpacity>
            </Swipeable>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        justifyContent:"space-between",
        padding:10,
        borderRadius:10,
        width:(Dimensions.get("window").width - 20),
        borderWidth:0,
        borderColor:"black",
    },
    main:{
        flexDirection:"column",
        justifyContent:"center"
    }
})  

/*

*/