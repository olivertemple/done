import { StyleSheet } from "react-native";
export default StyleSheet.create({
    container:{
        padding:10,
        borderRadius:5, 
        margin:5
    },
    main:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    },
    innerMain:{
        flexDirection:"row",
        alignItems:"center"
    },
    colour:{
        height:10,
        width:10,
        borderRadius:100
    },
    arrow:{
        marginLeft: 10,
        height: 10,
        width: 10,
        marginRight: 5,
        marginTop: 2.5
    },
    colourContainer:{
        flexDirection:"row",
        alignItems:"center",
        margin:10
    }
})