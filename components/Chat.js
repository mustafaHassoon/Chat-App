import React, { Component } from 'react';
//requiring firebase 
const firebase = require('firebase');
require('firebase/firestore');
//importing gifted liberary
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import { Alert, StyleSheet, ImageBackground, Text, Button, View, Platform, KeyboardAvoidingView } from 'react-native';
//importing asyncstorage
import AsyncStorage from '@react-native-community/async-storage';

import NetInfo from "@react-native-community/netinfo";

// const NetInfo = require("@react-native-community/netinfo");

export default class Chat extends React.Component {
  constructor() {
    super();
    // connect to firestore
    this.state = {
      messages: [],
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      uid: '',
      isConnected: false
    };

    const firebaseConfig = {
      apiKey: "AIzaSyCQA3Q7BXb6NZnLP0Q9a5oTpnnT1YnXovA",
      authDomain: "chat-app-ac3b6.firebaseapp.com",
      projectId: "chat-app-ac3b6",
      storageBucket: "chat-app-ac3b6.appspot.com",
      messagingSenderId: "672022278979",
      appId: "1:672022278979:web:86e60448285ec9f42f75f6",
      measurementId: "G-TH67RL21GV"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  componentDidMount() {

    //checks user's connection
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        console.log('online');

        //reference to load messages via firebase
        this.referenceChatMessages = firebase.firestore().collection('messages');
        this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate);

        //authenticates user via firesbase
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            firebase.auth().signInAnonymously();
          }
          //updates state with current user data
          this.setState({
            isConnected: true,
            user: {
              _id: user.uid,
              name: this.props.route.params.name,
              avatar: 'http://placeimg.com/140/140/any'
            },
            messages: [],
          });
          this.unsubscribe = this.referenceChatMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
        });

        this.setState({
          user: this.props.route.params.name,
        })

      } else {
        console.log("offline");
        Alert.alert('No internet connection, unable to send messages');
        this.setState({
          isConnected: false,
        });
        this.getMessages();
      }
    });

    /* 
    let { name } = this.props.route.params;
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
          text: `${name} has entered the chat`,
          createdAt: new Date(),
          system: true,
        },
      ],
    }) */
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }

  //Updates the messages in the state every time they change on the firestore
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      //get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user
      });
    });
    this.setState({ messages });
  }

  // Adds messages to the current chat log through GiftedChat; state remains unaffected
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      () => {
        this.addMessage();
        this.saveMessages();

      });
  }

  //Adds messages to the firebase.
  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  }

  //gets messages from asyncStorage (native local storage) to display previous messages while offline
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  //adds messages to asyncStorage
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  //deletes messages from asyncStorage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  //changes text bubble color for users (targeted using 'right'; 'left' would be used to target received messages)
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

  //if user is offline input for writing new messages will not appear
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  render() {
    //gets name prop from start screen text input and displays name at top of chat
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
    //defines background color prop user selected on start screen
    let color = this.props.route.params.color;

    return (
      <View
        style={{ flex: 1, backgroundColor: color }}
      >
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          style={{ backgroundColor: color }}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          placeholder={this.state.isConnected ? 'Type a message...' : 'No internet connection'}
          user={{
            _id: this.state.user._id,
            avatar: this.state.user.avatar,
            name: { name },
          }}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}