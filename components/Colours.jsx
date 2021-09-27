import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    UIManager,
    LayoutAnimation,
    Platform,
    Animated,
} from "react-native";
import AppStyle from "../Styles/AppStyle";
import ColoursStyle from "../Styles/ColoursStyle";

export default class Colours extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            rotateAnimation: new Animated.Value(0),
            colour: null,
            animations: true,
            selectedColour: null,
        };

        this.colours = [
            { name: "Cyan", code: "#E0FEFE" },
            { name: "Pastel purple", code: "#C7CEEA" },
            { name: "Light orange", code: "#FFDAC1" },
            { name: "Salmon", code: "#FF9AA2" },
            { name: "Light yellow", code: "#FFFFD8" },
            { name: "Mint", code: "#B5EAD7" },
            { name: "Blue", code: "#266EF6" },
            { name: "Purple", code: "#DF00FF" },
            { name: "Orange", code: "#FF8B00" },
            { name: "Red", code: "#C60404" },
            { name: "Yellow", code: "#FFD300" },
            { name: "Green", code: "#35B535" },
        ];
        this.toggleExpanded = this.toggleExpanded.bind(this);
        this.handleRotation = this.handleRotation.bind(this);

        AsyncStorage.getItem("animations").then((res) => {
            if (res) {
                this.state.animations = eval(res);
            }
        });

        this.interpolateRotating = this.state.rotateAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: ["90deg", "-90deg"],
        });
        this.animatedStyle = {
            transform: [{ rotate: this.interpolateRotating }],
        };
    }

    toggleExpanded() {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({ expanded: !this.state.expanded });
    }

    handleRotation() {
        this.props.key1.current.blur();
        this.props.key2.current.blur();
        Animated.timing(this.state.rotateAnimation, {
            toValue: !this.state.expanded ? 1 : 0,
            duration: this.state.animations ? 200 : 0,
            useNativeDriver: true,
        }).start(() => {
            this.state.rotateAnimation.setValue(!this.state.expanded ? 1 : 0);
            LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut
            );
            this.setState({ expanded: !this.state.expanded });
        });
    }

    setColour(value) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        this.setState({
            colour: value.name,
            expanded: !this.state.expanded,
            selectedColour: value.code,
        });
        this.props.setColour(value);
    }

    render() {
        let backgroundColor = this.props.theme === "light" ? "#E3E3E3" : "#282828"
        let color = this.props.theme === "light" ? "black" : "#E3E3E3"
        return (
            <View
                style={[ColoursStyle.container, {
                    backgroundColor:backgroundColor
                }]}
            >
                <View>
                    <TouchableOpacity onPress={this.handleRotation}>
                        <View
                            style={ColoursStyle.main}
                        >
                            <View
                                style={ColoursStyle.innerMain}
                            >
                                <View
                                    style={[ColoursStyle.colour, {
                                        backgroundColor:
                                            this.state.selectedColour,
                                    }]}
                                ></View>
                                <Text
                                    style={[AppStyle.small, {
                                        marginLeft: 5,
                                        color:color
                                    }]}
                                >
                                    {this.state.colour
                                        ? this.state.colour
                                        : "select"}
                                </Text>
                            </View>
                            <Animated.Image
                                source={require("../assets/arrow.png")}
                                style={[ColoursStyle.arrow, {
                                    tintColor:
                                        this.props.theme === "light"
                                            ? "black"
                                            : "#E3E3E3",
                                    transform: [
                                        { rotate: this.interpolateRotating },
                                    ],
                                }]}
                            ></Animated.Image>
                        </View>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    style={{
                        display: this.state.expanded ? "flex" : "none",
                        maxHeight: 300,
                    }}
                >
                    {this.colours.map((value) => {
                        return (
                            <TouchableOpacity
                                key={value.name}
                                onPress={() => {
                                    this.setColour(value);
                                }}
                            >
                                <View
                                    style={ColoursStyle.colourContainer}
                                >
                                    <View
                                        style={[ColoursStyle.colour, {    
                                            backgroundColor: value.code,
                                        }]}
                                    ></View>
                                    <Text
                                        style={[AppStyle.small, {
                                            marginLeft: 5,
                                            color:
                                                this.props.theme === "light"
                                                    ? "black"
                                                    : "#E3E3E3",
                                        }]}
                                    >
                                        {value.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        );
    }
}
