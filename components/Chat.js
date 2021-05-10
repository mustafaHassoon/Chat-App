import React, { Component } from 'react';

//importing gifted liberary
import { GiftedChat, Bubble } from 'react-native-gifted-chat'


import { StyleSheet, ImageBackground, Text, Button, View, Platform, KeyboardAvoidingView } from 'react-native';

export default class Chat extends React.Component {

  constructor(props) {
    super(props);
  }
  state = {
    messages: [],
  }



  //putting the users name in navigation bar
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     title: navigation.state.params.name,
  //   }
  // }

  componentDidMount() {
    console.log(this.state);
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          // text: this.props.navigation.state.params.name + ' has entered the chat',
          text: ' someone' + ' has entered the chat',
          createdAt: new Date(),
          system: true,
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }
  //changing the sender’s speech bubble 
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }

  render() {

    let name = this.props.route.params.name;
    let color = this.props.route.params.color;

    this.props.navigation.setOptions({ title: name });

    // <View style={[styles.container, { backgroundColor: color }]}>

    return (
      <View style={{ flex: 1, backgroundColor: color }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {/* fixing android keyboard */}
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
        }
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