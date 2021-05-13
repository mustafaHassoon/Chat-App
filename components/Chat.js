import React, { Component } from 'react';
//requiring firebase 
const firebase = require('firebase').default;
require('firebase/firestore');
//importing gifted liberary
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { StyleSheet, ImageBackground, Text, Button, View, Platform, KeyboardAvoidingView } from 'react-native';


export default class Chat extends React.Component {
  constructor() {
    super();
    // connect to firestore
    this.state = {
      messages: [],
      user: {
        _id: "",
        name: "",
        avatar: ""
      },
      uid: 0
    };
    const firebaseConfig = {
      apiKey: "AIzaSyCQA3Q7BXb6NZnLP0Q9a5oTpnnT1YnXovA",
      authDomain: "chat-app-ac3b6.firebaseapp.com",
      projectId: "chat-app-ac3b6",
      storageBucket: "chat-app-ac3b6.appspot.com",
      messagingSenderId: "672022278979",
      appId: "1:672022278979:web:86e60448285ec9f42f75f6",
      measurementId: "G-TH67RL21GV"
    }
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    //referance the user
    this.referenceChatUser = null;
    // reference to messages collection
    this.referenceMessages = firebase.firestore().collection("messages");
  }

  componentDidMount() {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        user = await firebase.auth().signInAnonymously();
      }
      let uid = user.uid
      this.setState({
        uid: uid,
        user: {
          _id: uid,
          name: this.props.route.params.name,
        },
        loggedInText: "Hello there"
      });
      this.referenceChatUser = firebase.firestore()
        .collection('messages')
        .orderBy('createdAt', 'desc').where("uid", "==", this.state.uid)
      this.unsubscribeChatUser = this.referenceChatUser.onSnapshot(this.onCollectionUpdate);
    });
    this.setState({
      messages: [
        {
          _id: 2,
          text: this.props.route.params.name + " entered the chat",
          createdAt: new Date(),
          system: true
        }
      ]

    });
  }

  componentWillUnmount() {
    this.unsubscribeChatUser();
    this.unsubscribe();
  }

  onCollectionUpdate = querySnapshot => {
    const messages = [];
    querySnapshot.forEach(doc => {
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text.toString(),
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        }
      });
    });
    this.setState({
      messages
    });
  };

  addMessages() {
    this.referenceMessages.add({
      _id: this.state.messages[0]._id,
      text: this.state.messages[0].text,
      createdAt: this.state.messages[0].createdAt,
      user: this.state.messages[0].user,
      uid: this.state.uid
    });
  }

  onSend(messages = []) {
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }),
      () => {
        this.addMessages();
      }
    );
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
  // putting the users name in navigation bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name,
    };
  };

  render() {

    let name = this.props.route.params.name;
    let color = this.props.route.params.color;

    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{
        flex: 1, backgroundColor: color
      }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
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
  userName: {
    fontSize: 10,
    color: "#fff",
    alignSelf: "center",
    opacity: 0.5,
    marginTop: 25
  }

});