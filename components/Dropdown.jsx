import React, { Component } from "react";
import { Text, TouchableHighlight, View } from "react-native";

export default class Dropdown extends Component{
    constructor(props){
        super(props);
        this.state = {
            dropdownStyle:{
                display:"none"
            }
        }
    }
    render(){
        return(
            <View>
                <TouchableHighlight>
                    <Text>{this.props.value}</Text>
                </TouchableHighlight>
                <View style={this.state.drowdownStyle}>
                    {this.props.items.map(value => {
                        return(
                            <View>
                                <Text>{value.value}</Text>
                            </View>
                        )
                    })}
                </View>
            </View>
        )
    }
}  