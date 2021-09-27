import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component, createRef } from "react";
import { Image, View, StyleSheet, Text, TouchableOpacity, Dimensions, LayoutAnimation } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import AppStyle from "../../Styles/AppStyle";
import ListItemStyle from "../../Styles/ListItemStyle";

export default class ListItem extends Component{
    constructor(props){
        super(props)
        this.state = this.props.data
        this.state.progress = null
        this.state.width = Dimensions.get("window").width;
        this.state.scaleFactor = this.state.today/this.state.daily
        this.increaseToday = this.increaseToday.bind(this);
        this.saveHabit = this.saveHabit.bind(this);
        this.right = this.right.bind(this);
        this.checkStats = this.checkStats.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
        this.pause = this.pause.bind(this);
        this.renderLeft = this.renderLeft.bind(this);
        this.renderRight = this.renderRight.bind(this);

        Dimensions.addEventListener("change", () => {
            this.setState({
                width:Dimensions.get("window").width
            })
        })
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
        return(
            <View style={{flexDirection:"row", alignItems:"center"}}>
                <Text style={AppStyle.medium}>{this.state.streak}</Text>
                <Image source={require("../../assets/check.png")} style={ListItemStyle.image}></Image>
            </View>
        )
    }

    renderLeft(){
        return(
            <View style={ListItemStyle.swipe}>
                <Image source={this.props.paused ? require("../../assets/play.png") : require("../../assets/pause.png")} style={[ListItemStyle.image, {tintColor:this.props.theme==="dark" ? "white" : "black"}]}></Image>
            </View>
        )
    }

    renderRight(){
        return(
            <View style={ListItemStyle.swipe}>
                <Image source={require("../../assets/trash.png")} style={[ListItemStyle.image, {tintColor:this.props.theme==="dark" ? "white" : "black"}]}></Image>
            </View>
        )
    }

    render(){
        console.log(this.state)
        this.ref = createRef(null)
        return(
            <Swipeable
                ref={this.ref} 
                renderLeftActions={this.renderLeft}
                renderRightActions={this.renderRight}
                onSwipeableRightOpen={() => {this.props.delete(this.state)}} onSwipeableLeftOpen={() => {this.props.pause(this.state.title)}}>

                <TouchableOpacity
                    onPress = {this.increaseToday}
                    style={[ListItemStyle.container,{marginLeft:this.props.list ? 0 : 5, marginRight:this.props.list ? 0 : 5}]}>

                        <View
                            style={[ListItemStyle.contentContainer,{width:this.state.width - 20}, this.props.list ? {zIndex:1,flexDirection: this.props.list ? "row" : "column"} : {zIndex:1, width:this.state.width/2 - 20.5, alignItems:"center"}]}>

                            <View
                                style={{flexDirection:"row", alignItems:"center", maxWidth:this.props.list ? (this.state.width - 80) : this.state.width/2 - 20}}>

                                <View
                                    style={[ListItemStyle.innerContentContainer, this.props.list ? {} : {alignItems:"center"}]}>

                                    <Text style={AppStyle.medium}>{this.state.title}</Text>
                                    <Text style={AppStyle.small}>{this.state.progress}</Text>

                                </View>
                            </View>
                            <this.right />
                        </View>

                        <View style={ListItemStyle.colorContainer}>
                                <View
                                    style={[ListItemStyle.colorItem,{
                                    borderRadius: (this.state.today==this.state.daily) ? 10 :0}, this.props.list ? {
                                    backgroundColor:this.state.color,
                                    width:((this.state.width-20)*this.state.scaleFactor)+0.1}
                                    :
                                    {backgroundColor:this.state.color,
                                    width:(((this.state.width/2) - 20)*this.state.scaleFactor)-0.5}]}>
                                </View>

                                <View
                                    style={[{backgroundColor:"#E3E3E3", borderRadius:this.state.scaleFactor > 0 ? 0 : 10, borderTopRightRadius:10, borderBottomRightRadius:10},this.props.list ? {width:this.state.width-20 - (((this.state.width-20)*this.state.scaleFactor)+0.1)}
                                    :
                                    {
                                    width: (this.state.width/2 - 20) - ((this.state.width/2 - 20)*this.state.scaleFactor)}]}>
                                </View>
                        </View>
                </TouchableOpacity>
            </Swipeable>
        )
    }
}

