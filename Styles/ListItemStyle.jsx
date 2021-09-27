import { StyleSheet } from "react-native";

export default StyleSheet.create({
    image:{
        height:20,
        width:20
    },
    swipe:{
        justifyContent:"center",
        alignItems:"center",
        margin:30
    },
    container:{
        marginTop:10,
        borderRadius:10,
        flex:1
    },
    contentContainer:{
        justifyContent:"space-between",
        padding:10,
        borderRadius:10,
        flexDirection:"column",
        maxHeight:2000,
        minHeight:76.1
    },
    innerContentContainer:{
        flexDirection:"column",
        justifyContent:"center"
    },
    colorContainer:{
        flexDirection:"row",
        position:"absolute",
        borderRadius:10,
        height:"100%"
    },
    colorItem:{
        zIndex:0,
        borderTopLeftRadius:10,
        borderBottomLeftRadius:10,
    }

})