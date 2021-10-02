import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import {
    Dimensions,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    ScrollView,
    LayoutAnimation,
    Linking,
} from "react-native";
import { Switch } from "react-native-paper";
import PP from "./PP";
import AppStyle from "../Styles/AppStyle";
import SettingsStyle from "../Styles/SettingsStyle";

export default class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            animations: true,
            pp: false,
            height: Dimensions.get("window").height,
            width: Dimensions.get("window").height
        };

        Dimensions.addEventListener("change", () => {
            this.setState({
                height:Dimensions.get("window").height,
                width:Dimensions.get("window").width
            })
        })

        AsyncStorage.getItem("name").then((name) => {
            this.setState({ name: name });
        });

        AsyncStorage.getItem("animations").then((res) => {
            if (res !== null) {
                this.setState({ animations: eval(res) });
            }
        });

        this.updateName = this.updateName.bind(this);
        this.animationSwitch = this.animationSwitch.bind(this);
    }

    updateName(name) {
        AsyncStorage.setItem("name", name);
        this.props.updateName(name);
    }

    animationSwitch() {
        AsyncStorage.setItem(
            "animations",
            JSON.stringify(!this.state.animations)
        );
        this.props.updateAnimations(!this.state.animations);
        this.setState({ animations: !this.state.animations });
    }

    render() {
        let backgroundColor =
            this.props.theme === "light" ? "white" : "#141414";
        let color = this.props.theme === "light" ? "black" : "#E1E1E1";
        let inputBackgroundColor =
            this.props.theme === "light" ? "#E8E8E8" : "#282828";
        let placeHolderColor =
            this.props.theme === "light" ? "grey" : "#E3E3E3";
        let buttonBackground =
            this.props.theme === "light" ? "#E8E8E8" : "#282828";
        let tintColor = this.props.theme === "light" ? "black" : "#E3E3E3";
        return (
            <View>
                <ScrollView
                    style={[
                        SettingsStyle.container,
                        {
                            backgroundColor: backgroundColor,
                            height:this.state.height
                        },
                    ]}
                >
                    <View style={{marginBottom:100}}>
                        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                            <Text
                                style={[
                                    AppStyle.medium,
                                    AppStyle.bold,
                                    { color: color },
                                ]}
                            >
                                Settings
                            </Text>
                        </View>

                        <View style={{ marginTop: 10 }}>
                            {this.state.pp ? (
                                <PP
                                    cancel={() => {
                                        LayoutAnimation.configureNext(
                                            LayoutAnimation.Presets.easeInEaseOut
                                        );
                                        this.setState({ pp: false });
                                    }}
                                />
                            ) : null}
                            <View style={{ marginTop: 20 }}>
                                <Text
                                    style={[SettingsStyle.title, { color: color }]}
                                >
                                    Name:
                                </Text>
                                <TextInput
                                    placeholder={this.state.name}
                                    style={[
                                        SettingsStyle.input,
                                        { backgroundColor: inputBackgroundColor },
                                    ]}
                                    onChangeText={(text) => this.updateName(text)}
                                    placeholderTextColor={placeHolderColor}
                                ></TextInput>
                            </View>

                            <View style={SettingsStyle.switchView}>
                                <Text
                                    style={[
                                        SettingsStyle.regular,
                                        { color: color },
                                    ]}
                                >
                                    Reduce animations:
                                </Text>
                                <Switch
                                    value={!this.state.animations}
                                    onValueChange={this.animationSwitch}
                                ></Switch>
                            </View>

                            <View style={{ marginTop: 20 }}>
                                <Text
                                    style={[SettingsStyle.title, { color: color }]}
                                >
                                    Theme:
                                </Text>

                                <View style={SettingsStyle.themes}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.toggleTheme("dark");
                                        }}
                                        style={[
                                            SettingsStyle.themeButton,
                                            {
                                                backgroundColor:
                                                    this.props.themeSetting ===
                                                        "dark"
                                                        ? this.props.theme ===
                                                            "light"
                                                            ? "#E3E3E3"
                                                            : "#282828"
                                                        : this.props.theme ===
                                                            "light"
                                                            ? "white"
                                                            : "black",
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                SettingsStyle.themeText,
                                                { color: color },
                                            ]}
                                        >
                                            Dark
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.toggleTheme("light");
                                        }}
                                        style={[
                                            SettingsStyle.themeButton,
                                            {
                                                backgroundColor:
                                                    this.props.themeSetting ===
                                                        "light"
                                                        ? this.props.theme ===
                                                            "light"
                                                            ? "#E3E3E3"
                                                            : "#282828"
                                                        : this.props.theme ===
                                                            "light"
                                                            ? "white"
                                                            : "black",
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                SettingsStyle.themeText,
                                                { color: color },
                                            ]}
                                        >
                                            Light
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.toggleTheme("system");
                                        }}
                                        style={[
                                            SettingsStyle.themeButton,
                                            {
                                                backgroundColor:
                                                    this.props.themeSetting ===
                                                        "system"
                                                        ? this.props.theme ===
                                                            "light"
                                                            ? "#E3E3E3"
                                                            : "#282828"
                                                        : this.props.theme ===
                                                            "light"
                                                            ? "white"
                                                            : "black",
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                SettingsStyle.themeText,
                                                { color: color },
                                            ]}
                                        >
                                            System
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{ marginTop: 10}}>
                                <View style={{ marginTop: 10}}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            Linking.openURL(
                                                "https://github.com/olivertemple/done"
                                            );
                                        }}
                                    >
                                        <View
                                            style={[
                                                SettingsStyle.button,
                                                {
                                                    backgroundColor:
                                                        buttonBackground,
                                                },
                                            ]}
                                        >
                                            <Image
                                                source={require("../assets/GitHub-Mark-Light-64px.png")}
                                                style={[
                                                    SettingsStyle.buttonImage,
                                                    { tintColor: tintColor },
                                                ]}
                                            ></Image>
                                            <Text
                                                style={[
                                                    AppStyle.medium,
                                                    AppStyle.bold,
                                                    {
                                                        marginLeft: 10,
                                                        color: color,
                                                    },
                                                ]}
                                            >
                                                GitHub
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            Linking.openURL(
                                                "https://github.com/olivertemple/done/issues/new"
                                            );
                                        }}
                                    >
                                        <View
                                            style={[
                                                SettingsStyle.button,
                                                {
                                                    backgroundColor:
                                                        buttonBackground,
                                                },
                                            ]}
                                        >
                                            <Image
                                                source={require("../assets/bug.png")}
                                                style={[
                                                    SettingsStyle.buttonImage,
                                                    { tintColor: "red" },
                                                ]}
                                            ></Image>
                                            <Text
                                                style={[
                                                    AppStyle.medium,
                                                    AppStyle.bold,
                                                    {
                                                        marginLeft: 10,
                                                        color: color,
                                                    },
                                                ]}
                                            >
                                                Report a bug
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            Linking.openURL(
                                                "mailto:oliver.temple.dev@gmail.com"
                                            );
                                        }}
                                    >
                                        <View
                                            style={[
                                                SettingsStyle.button,
                                                {
                                                    backgroundColor:
                                                        buttonBackground,
                                                },
                                            ]}
                                        >
                                            <Image
                                                source={require("../assets/email.png")}
                                                style={[
                                                    SettingsStyle.buttonImage,
                                                    { tintColor: tintColor },
                                                ]}
                                            ></Image>
                                            <Text
                                                style={[
                                                    AppStyle.medium,
                                                    AppStyle.bold,
                                                    {
                                                        marginLeft: 10,
                                                        color: color,
                                                    },
                                                ]}
                                            >
                                                Send me an email
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            LayoutAnimation.configureNext(
                                                LayoutAnimation.Presets
                                                    .easeInEaseOut
                                            );
                                            this.setState({ pp: true });
                                        }}
                                    >
                                        <View
                                            style={[
                                                SettingsStyle.button,
                                                {
                                                    backgroundColor:
                                                        buttonBackground,
                                                },
                                            ]}
                                        >
                                            <Image
                                                source={require("../assets/shield-with-lock.png")}
                                                style={[
                                                    SettingsStyle.buttonImage,
                                                    { tintColor: tintColor },
                                                ]}
                                            ></Image>
                                            <Text
                                                style={[
                                                    AppStyle.medium,
                                                    AppStyle.bold,
                                                    {
                                                        marginLeft: 10,
                                                        color: color,
                                                    },
                                                ]}
                                            >
                                                Privacy policy
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 10 }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            Linking.openURL(
                                                "https://www.buymeacoffee.com/olivertemple"
                                            );
                                        }}
                                    >
                                        <View
                                            style={[
                                                SettingsStyle.button,
                                                {
                                                    backgroundColor:
                                                        buttonBackground,
                                                },
                                            ]}
                                        >
                                            <Image
                                                source={require("../assets/bmc-logo.png")}
                                                style={[SettingsStyle.buttonImage]}
                                            ></Image>
                                            <Text
                                                style={[
                                                    AppStyle.medium,
                                                    AppStyle.bold,
                                                    {
                                                        marginLeft: 10,
                                                        color: color,
                                                    },
                                                ]}
                                            >
                                                Buy me a coffee
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={SettingsStyle.menuBar}>
                            <TouchableOpacity onPress={this.props.exit}>
                                <Image
                                    source={require("../assets/cancel.png")}
                                    style={{
                                        width: 25,
                                        height: 25,
                                        tintColor: "#C5C5C5",
                                    }}
                                ></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                </ScrollView>
            </View>
        );
    }
}

//https://github.com/olivertemple/done/issues/new
