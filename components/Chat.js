import React, { Component } from 'react';
import { StyleSheet, ImageBackground, Text, Button, View } from 'react-native';

export default class Chat extends React.Component {

  // constructor() {
  //   super();

  // }


  // pulling in information from Start.js name/color
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     name: navigation.state.params.name,
  //     color: navigation.state.params.color,
  //   };
  // };
  render() {

    let name = this.props.route.params.name;
    let color = this.props.route.params.color;

    this.props.navigation.setOptions({ title: name });

    return (
      <View style={[styles.container, { backgroundColor: color }]}>
        <Text style={{ color: '#FFFFFF' }}>This is your chat screen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});