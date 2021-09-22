import { TouchableHighlight, Image  } from "react-native";
import React from 'react';

export default function Button(props){
    return(
        <TouchableHighlight onPress={props.onPress} style={props.style}>
            <Image source={props.image} style={props.imageStyle}></Image>
        </TouchableHighlight>
    )

    
}