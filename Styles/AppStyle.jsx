import { StyleSheet } from "react-native";

export default StyleSheet.create({
    menuBar:{
        flexDirection : "row",
        justifyContent : "space-between",
        alignItems : "center",
        padding : 5,
        marginBottom:10
    },
    Image:{
        height : 30,
        width : 30,
        tintColor : "#C5C5C5"
    },
    titleBar:{
        alignItems:"center",
        paddingTop:10
    },
    bold:{
        fontFamily:"bold"
    },
    large:{
        fontSize:40,
        fontFamily:"regular"
    },
    medium:{
        fontSize:26,
        fontFamily:"regular"
    },
    small:{
        fontSize:16,
        fontFamily:"regular"
    },
    input:{
        borderBottomColor:"#00000050",
        borderBottomWidth:2
    },
    button:{
        borderRadius:10,
        alignItems:"center",
        borderWidth:1,
        padding:10
    },
    habitsContainer:{
        padding:10,
        justifyContent:"space-between"
    },
    habitsScroll:{
        marginTop:10
    }
})
