import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import { Image, View, StyleSheet, Text, TouchableOpacity, Dimensions} from "react-native";

export default class ListItem extends Component{
    constructor(props){
        super(props)
        this.state = this.props.data
        this.state.scaleFactor = this.state.today/this.state.daily
        this.increaseToday = this.increaseToday.bind(this);
        this.saveHabit = this.saveHabit.bind(this);
        
        console.log(this.state)
        console.log(this.props)

        let date = new Date(this.state.last);
        date=date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();

        let today = new Date(+ new Date());
        today = today.getDate() + "/" + today.getMonth() + "/" + today.getFullYear();

        if (date !== today){
            this.setState({
                streak:0
            }, () => {
                this.saveHabit()
            })
        }

    }

   

    increaseToday(){
        if (this.state.today < this.state.daily){
            if (this.state.today + 1 === this.state.daily){

            }
            let state = this.state;
            this.setState({
                today:state.today+1,
                scaleFactor:(state.today+1)/state.daily,
                streak:(state.today+1==state.daily) ? state.streak+1 : state.streak
            }, () => {
                this.saveHabit()
            })
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
        AsyncStorage.setItem("habits", JSON.stringify(habits))
    }
    render(){
        if (this.state.timeFrame === "daily"){
            this.progress = (this.state.today+"/"+this.state.daily) + " today"
        }else if (this.state.timeFrame === "weekly"){
            this.progress = (this.state.today+"/"+this.state.daily) + " this week"
        }

        return(
            <TouchableOpacity onPress = {this.increaseToday} style={{marginTop:10}}>
                <View>
                    <View style={{backgroundColor:this.state.color, width:(Dimensions.get("window").width - 20)*this.state.scaleFactor, height:76.1, zIndex:0, borderTopLeftRadius:10, borderBottomLeftRadius:10, borderRadius: (this.state.today==this.state.daily) ? 10 : 0}}></View>

                    <View style={[styles.container, {zIndex:1, marginTop:-76}]}>
                        <View style={{flexDirection:"row", alignItems:"center"}}>
                            
                            <View style={styles.main}>
                                <Text style={{fontSize:26}}>{this.state.title}</Text>
                                <Text style={{fontSize:16}}>{this.progress}</Text>
                            </View>
                        </View>
                        
                        <View style={{flexDirection:"row", alignItems:"center"}}>
                            <Text style={{fontSize:26}}>{this.state.streak}</Text>
                            <Image source={require("../../assets/check.png")} style={{width:20, height:20}}></Image>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flexDirection: "row",
        justifyContent:"space-between",
        padding:10,
        borderRadius:10
    },
    main:{
        flexDirection:"column",
        justifyContent:"center"
    }
})  

/*<Image source={this.state.icon} style={{height:35, width:35}}></Image>*/