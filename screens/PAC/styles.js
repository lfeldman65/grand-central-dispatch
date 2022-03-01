import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      height: '100%'
    },
    bottomContainer: {
      backgroundColor: '#1A6295',
      height: 60,
    },
    ideasButton: {
      marginTop: 5,
      backgroundColor: '#1A6295',
      paddingTop: 10,
      borderColor: 'white',
      borderWidth: 2,
      borderRadius: 10,
      height: 50,
      width: '95%',
      alignSelf: 'center'
    },
    ideasText: {
      textAlign: 'center',
      color: 'white',
      fontSize: 20,
      justifyContent: 'center'
    },
    complete: {
      width: 200,
      color: 'orange',
      fontSize: 20,
      fontSize: 16
    },
    completeView: {
      backgroundColor: 'green',
      fontSize: 20,
      alignContent: "center",
      justifyContent: "center",
      flex: 1,
      paddingLeft: 20
    },
    postponeView: {
      backgroundColor: 'orange',
      fontSize: 20,
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingRight: 20
    },
    postpone: {
      width: 200,
      color: 'white',
      fontSize: 20,
      textAlign: "left",
      marginLeft: 10,
      fontSize: 16
    },
    row: {
      paddingTop: 10,
      backgroundColor: 'white',
      borderColor: 'lightgray',
      borderWidth: .5,
      paddingBottom: 10
    },
    tabButtonRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      height: 40,
      alignItems: 'center',
    },
    unselected: {
      color: 'lightgray',
      textAlign: 'center',
      fontSize: 16,
      height: '100%',
      backgroundColor: '#09334a',
      flex: 1,
      paddingTop: 10
    },
    selected: {
      color: 'white',
      textAlign: 'center',
      fontSize: 16,
      height: '100%',
      backgroundColor: '#04121b',
      flex: 1,
      paddingTop: 10,
      borderColor: 'lightblue',
      borderWidth: 2
    },
    progress: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginLeft: 10,
      marginRight: 10,
      marginBottom: 10
    },
    notes: {
      width: 200,
      color: '#1A6295',
      fontSize: 20,
      textAlign: "left",
      marginLeft: 10,
      fontSize: 16
    },
    personName: {
      width: 400,
      height: 32,
      color: 'black',
      fontSize: 18,
      textAlign: "left",
      marginLeft: 10
    },
    leftSwipeItem: {
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingRight: 20
    },
    rightSwipeItem: {
      flex: 1,
      justifyContent: 'center',
      paddingLeft: 20
    },
  
  });