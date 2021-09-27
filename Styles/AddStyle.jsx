import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container:{
        padding:20,
        justifyContent:"space-between"
    },
    title:{
        fontSize:20,
        fontFamily:"regular"
    },
    textInput:{
        fontSize: 16,
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#E8E8E8",
        marginTop: 5,
        fontFamily: "regular",
    },
    warning:{
        fontSize:10,
        fontFamily:"regular"
    },
    themeContainer:{
        flexDirection:"row",
        marginTop:5
    },
    countContainer:{
        flexDirection:"row",
        alignItems:"center",
        marginTop:5
    },
    countInnerContainer:{
        flexDirection:"row",
        alignItems:"center",
        paddingRight:10,
        borderRadius:5
    },
    closeContainer:{
        flexDirection:"row",
        justifyContent:"space-evenly",
        padding:10,
        alignItems:"center"
    },
    image:{
        width:30,
        height:30,
        tintColor:"#C5C5C5"
    }

})