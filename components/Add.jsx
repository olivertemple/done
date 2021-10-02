import React, { Component, createRef, useRef, useState } from "react";
import { View, Text, Image, Dimensions, Touchable } from "react-native";
import { RadioButton } from "react-native-paper";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colours from "./Colours";
import AddStyle from "../Styles/AddStyle";
import AppStyle from "../Styles/AppStyle";

export default class Add extends Component {
	constructor(props) {
		super(props);
		this.state = {
			timeFrame: "daily",
			color: null,
			title: null,
			times: 1,
			emoji: null,
			titleWarning: "#00000000",
			showCross: false,
			height: Dimensions.get("window").height,
		};

		this.setTimeFrameValue = this.setTimeFrameValue.bind(this);
		this.handleColorChange = this.handleColorChange.bind(this);
		this.setColour = this.setColour.bind(this);
		this.add = this.add.bind(this);
		this.habitTitles = null;

		Dimensions.addEventListener("change", () => {
			this.setState({
				height:Dimensions.get("window").height
			})
		})
		AsyncStorage.getItem("habits").then((res) => {
			if (res) {
				res = JSON.parse(res);
				this.habitTitles = Object.keys(res);
			} else {
				this.habitTitles = [];
			}
		});
	}

	setTimeFrameValue(value) {
		this.setState({
			timeFrame: value,
		});
	}

	handleColorChange(color) {
		this.setState({ color: color });
	}

	add() {
		if (
			this.state.title &&
			!this.habitTitles.includes(this.state.title) &&
			this.state.color
		) {
			let data = {
				last: +new Date(),
				today: 0,
				daily: this.state.times,
				streak: 0,
				timeFrame: this.state.timeFrame,
				icon: "icon",
				color: this.state.color.code,
				colorName: this.state.color.name,
				title: this.state.title,
				paused: false,
			};
			this.props.addHabit(data);
		}
	}

	async updateTitle(text) {
		this.state.title = text;
		if (!this.habitTitles.includes(text)) {
			this.setState({
				titleWarning: "#00000000",
			});
		} else {
			this.setState({
				titleWarning: "red",
			});
		}
	}

	setColour(value) {
		this.setState({ color: value });
	}

	render() {
		this.key1 = createRef(null);
		this.key2 = createRef(null);
		let color = this.props.theme === "light" ? "black" : "#E3E3E3";
		let backgroundColor =
			this.props.theme === "light" ? "#E8E8E8" : "#282828";

		return (
			<View
				style={[
					AddStyle.container,
					{
						height: this.state.height,
					},
				]}
			>
				<View>
					<View>
						<Text
							style={[
								AppStyle.medium,
								AppStyle.bold,
								{
									color: color,
								},
							]}
						>
							Create
						</Text>
					</View>
					<View>
						<View style={{ marginTop: 20 }}>
							<Text
								style={[
									AddStyle.title,
									{
										color: color,
									},
								]}
							>
								Give your goal a title:
							</Text>
							<TextInput
								ref={this.key1}
								placeholder="Title"
								style={[
									AddStyle.textInput,
									{
										backgroundColor: backgroundColor,
										color: color,
									},
								]}
								onChangeText={(text) => {
									this.updateTitle(text);
								}}
								placeholderTextColor={color}
							></TextInput>
							<Text
								style={[
									AddStyle.warning,
									{
										color: this.state.titleWarning,
									},
								]}
							>
								Title already exists
							</Text>
						</View>
						<View style={{ marginTop: 20 }}>
							<Text
								style={[
									AddStyle.title,
									{
										color: color,
									},
								]}
							>
								Choose a time period:
							</Text>
							<View style={AddStyle.themeContainer}>
								<TouchableOpacity
									onPress={() => {
										this.setTimeFrameValue("daily");
									}}
									style={{
										backgroundColor:
											this.state.timeFrame === "daily"
												? this.props.theme === "light"
													? "#E3E3E3"
													: "#282828"
												: this.props.theme === "light"
												? "white"
												: "#141414",
										borderRadius: 5,
									}}
								>
									<Text
										style={[
											AppStyle.small,
											{
												padding: 10,
												color: color,
											},
										]}
									>
										Daily
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={() => {
										this.setTimeFrameValue("weekly");
									}}
									style={{
										backgroundColor:
											this.state.timeFrame === "weekly"
												? this.props.theme === "light"
													? "#E3E3E3"
													: "#282828"
												: this.props.theme === "light"
												? "white"
												: "#141414",
										borderRadius: 5,
									}}
								>
									<Text
										style={[
											AppStyle.small,
											{
												padding: 10,
												color: color,
											},
										]}
									>
										Weekly
									</Text>
								</TouchableOpacity>
							</View>
						</View>
						<View style={{ marginTop: 20 }}>
							<Text
								style={[
									AddStyle.title,
									{
										color: color,
									},
								]}
							>
								Complete goal:
							</Text>
							<View style={AddStyle.countContainer}>
								<View
									style={[
										AddStyle.countInnerContainer,
										{
											backgroundColor:
												this.props.theme === "light"
													? "#E8E8E8"
													: "#282828",
											color:
												this.props.theme === "light"
													? "black"
													: "#E3E3E3",
										},
									]}
								>
									<TextInput
										keyboardType="numeric"
										placeholder="1"
										style={[
											AddStyle.textInput,
											{
												backgroundColor:
													backgroundColor,
												color: color,
											},
										]}
										onChangeText={(text) => {
											this.setState({ times: text });
										}}
										ref={this.key2}
										onFocus={() => {
											this.setState({ showCross: true });
										}}
										onBlur={() => {
											this.setState({ showCross: false });
										}}
										placeholderTextColor={
											this.props.theme === "dark"
												? "#E3E3E3"
												: "grey"
										}
									>
										{this.state.times === 1
											? null
											: this.state.times}
									</TextInput>
									<TouchableOpacity
										onPress={() => {
											this.setState({ times: 1 });
										}}
										style={{
											padding: 5,
											backgroundColor: this.state
												.showCross
												? this.props.theme === "light"
													? "lightgrey"
													: "black"
												: this.props.theme === "light"
												? "#E8E8E8"
												: "#282828",
											borderRadius: 100,
										}}
									>
										<Image
											style={{
												height: this.state.showCross
													? 10
													: 0,
												width: 10,
												tintColor:
													this.props.theme === "dark"
														? "#E3E3E3"
														: "black",
											}}
											source={require("../assets/cancel.png")}
										></Image>
									</TouchableOpacity>
								</View>
								<Text
									style={[
										AppStyle.small,
										{
											marginLeft: 5,
											color: color,
										},
									]}
								>
									or more times per{" "}
									{this.state.timeFrame == "daily"
										? "day"
										: "week"}
								</Text>
							</View>
						</View>
						<View style={{ marginTop: 20 }}>
							<Text
								style={[
									AddStyle.title,
									{
										color: color,
									},
								]}
							>
								Colour
							</Text>
							<Colours
								setColour={this.setColour}
								key1={this.key1}
								key2={this.key2}
								theme={this.props.theme}
							></Colours>
						</View>
					</View>
				</View>
				<View style={AddStyle.closeContainer}>
					<TouchableOpacity onPress={this.add}>
						<Image
							source={require("../assets/check.png")}
							style={AddStyle.image}
						></Image>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							this.props.cancel();
						}}
					>
						<Image
							source={require("../assets/cancel.png")}
							style={[AddStyle.image, { height: 25, width: 25 }]}
						></Image>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}
