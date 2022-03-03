
import { useState } from "react";
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Dimensions, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Analytics, PageHit, Event } from 'expo-analytics';
import { useNavigation } from '@react-navigation/native';

let deviceWidth = Dimensions.get('window').width;


function SavePressed() {
    console.log('Save Press');
    // analytics.event(new Event('Login', 'Forgot Password Button Pressed', 0))
}

export default function PACCompleteScreen() {

    return (
        <View style={styles.container}>

            <View style={styles.inputView}>
                <TextInput
                    style={styles.textInput}
                    placeholder='Type Here'
                    placeholderTextColor='#AFB9C2'
                    color='black'
                    textAlign='left'
                    //   fontSize={18}
                />
            </View>

            <TouchableOpacity onPress={SavePressed}>
                <Text style={styles.loginText}>Save</Text>
            </TouchableOpacity>

            <StatusBar style="auto" />
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#004F89',
        alignItems: 'center',
    },
    logo: {
        width: 173,
        height: 242,
        marginBottom: 20,
        marginTop: 40,
    },
    inputView: {
        marginTop: 40,
        backgroundColor: 'white',
        width: '90%',
        height: '50%',
        marginBottom: 2,
      //  alignItems: "baseline",
      //  justifyContent: "center",
        paddingLeft: 10,
        fontSize: 29,
    },
    loginText: {
        width: 100,
        height: 32,
        marginTop: 25,
        color: "#37C0FF",
        fontSize: 25,
        textAlign: "center",
    },
    textInput: {
        fontSize: 18
    }
});
