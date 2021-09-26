import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: "space-between",
        elevation: 0,
    },
    title: {
        fontSize: 20,
        fontFamily: "regular",
    },
    input: {
        fontSize: 16,
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        fontFamily: "regular",
    },
    switchView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
    },
    themes: {
        flexDirection: "row",
        marginTop: 5,
    },
    themeButton: {
        margin: 5,
        borderRadius: 5,
    },
    themeText: {
        padding: 10,
        fontSize: 16,
        fontFamily: "regular",
    },
    button: {
        padding: 10,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    buttonImage: {
        width: 50,
        height: 50,
    },
    menuBar: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        padding: 10,
        alignItems: "center",
    },
});
