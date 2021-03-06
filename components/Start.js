import React, { Component } from 'react';
import { StyleSheet, ImageBackground, Text, TextInput, Alert, TouchableOpacity, Button, View } from 'react-native';

export default class Start extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      color: ''
    }
  }

  render() {
    return (
      <ImageBackground source={require('../assets/BackgroundImage.png')} style={styles.backImage}>
        <Text style={styles.title}>Chat App</Text>
        <View style={styles.container}>
          <TextInput style={styles.nameBox}
            onChangeText={(name) => this.setState({ name })}
            value={this.state.name}
            placeholder='Enter Your Name'
          />
          <Text style={styles.text}>
            Choose Background Color:
          </Text>
          <View style={styles.colorSelection}>
            <TouchableOpacity
              onPress={() => this.setState({ color: '#090C08' })}
              style={[styles.colorButton, styles.color1]}
            />
            <TouchableOpacity
              onPress={() => this.setState({ color: '#474056' })}
              style={[styles.colorButton, styles.color2]}
            />
            <TouchableOpacity
              onPress={() => this.setState({ color: '#8A95A5' })}
              style={[styles.colorButton, styles.color3]}
            />
            <TouchableOpacity
              onPress={() => this.setState({ color: '#B9C6AE' })}
              style={[styles.colorButton, styles.color4]}
            />
          </View>
          <Button
            style={styles.button}
            title="Start Chatting"
            onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: '44%',
    width: '88%',
    marginBottom: 20
  },
  backImage: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%'
  },
  nameBox: {
    fontSize: 16,
    fontWeight: "600",
    color: '#000000',
    borderWidth: 1,
    borderColor: 'grey',
    marginBottom: 30,
    marginTop: 30,
    width: '88%'
  },
  text: {
    fontSize: 16,
    fontWeight: "300",
    color: '#757083'
  },
  title: {
    flex: 1,
    alignItems: 'center',
    fontSize: 45,
    fontWeight: "600",
    color: '#FFFFFF',
    marginTop: 75,
  },
  colorSelection: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    margin: 15
  },
  colorButton: {
    height: 35,
    width: 35,
    borderRadius: 70,
    margin: 20
  },
  color1: {
    backgroundColor: '#090C08'
  },
  color2: {
    backgroundColor: '#474056'
  },
  color3: {
    backgroundColor: '#8A95A5'
  },
  color4: {
    backgroundColor: '#B9C6AE'
  },
  button: {
    fontSize: 16,
    fontWeight: "600",
    color: '#FFFFFF',
    backgroundColor: '#757083',
    width: '88%',
    marginBottom: 30
  }
});