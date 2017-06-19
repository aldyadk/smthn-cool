<template>
  <div >
    <h2>Chat as your fav SW character (or anonymously)</h2>
    <div id="thebox" style="border:solid;height:350px;overflow:scroll;padding:2%" >
      <div v-for="msg in messages" align="left" style="padding-top:5px">
        <b>{{msg.user}}</b> : {{msg.msg}} ({{msg.time}})
      </div>
    </div>
    <div v-if="user">
      <button type="button" v-on:click="logout">Log Out</button><br>
      <font size="4">You are currently logged as {{user}} </font><br><br>
      <form>
        <input type="text" v-model="userInput" placeholder="feel free to write here"><br>
        <input type="button" value="submit" v-on:click="submitChat"><br>
      </form>
    </div>
    <div v-if="!user">
      <form>
        <label>Enter desired username here</label><br>
        <input type="text" v-model="nameSugestion"><br>
        <input type="button" value="start chatting" v-on:click="login"><br>
      </form>
      <!-- <h3>Enter desired username here</h3> -->
    </div>
    <!-- <div v-for="name in names" align="left">
      <b>{{name.name}}</b>
    </div> -->
  </div>
</template>
<!-- <script src="https://www.gstatic.com/firebasejs/4.1.2/firebase.js"></script> -->
<script>
import axios from 'axios'
import * as firebase from 'firebase'
var config = {
  apiKey: 'AIzaSyCmL3K7uTQaJlGLq6G_FTas-NelzH_1JqA',
  authDomain: 'smthn-cool-chat-app.firebaseapp.com',
  databaseURL: 'https://smthn-cool-chat-app.firebaseio.com',
  projectId: 'smthn-cool-chat-app',
  storageBucket: 'smthn-cool-chat-app.appspot.com',
  messagingSenderId: '729885705901'
}
firebase.initializeApp(config)
export default {
  name: 'Chatbox',
  data () {
    return {
      messages: [],
      userInput: '',
      user: '',
      nameSugestion: '',
      names: []
    }
  },
  methods: {
    getMessages: function () {
      var self = this
      firebase.database().ref('/messages').on('value', (data) => {
        self.messages = data.val()
        window.setTimeout(function () {
          var elem = document.getElementById('thebox')
          elem.scrollTop = elem.scrollHeight
        }, 500)
      })
    },
    submitChat: function () {
      var self = this
      var hour = new Date().getHours()
      var minute = new Date().getMinutes()
      if (minute < 10) {
        minute = `0${minute}`
      }
      var time = `${hour}:${minute}`
      if (self.userInput.length) {
        var newPostKey = firebase.database().ref().child('messages').push().key
        var updates = {}
        updates['/messages/' + newPostKey] = {user: self.user, msg: self.userInput, time: time}
        firebase.database().ref().once('value')
        .then(function (data) {
          firebase.database().ref().update(updates)
        })
        .catch(function () {
          firebase.database('/messages').ref().set({user: self.user, msg: self.userInput, time: time})
        })
        this.userInput = ''
        window.setTimeout(function () {
          var elem = document.getElementById('thebox')
          elem.scrollTop = elem.scrollHeight
        }, 500)
      }
    },
    login: function () {
      if (this.nameSugestion) {
        this.user = this.nameSugestion
        this.nameSugestion = ''
      }
    },
    logout: function () {
      this.user = ''
      this.fillRandomNames()
    },
    fillRandomNames: function () {
      var self = this
      axios.get('http://swapi.co/api/people')
      .then(res => {
        self.names = res.data.results
        var randomizer = Math.floor(Math.random() * self.names.length)
        self.nameSugestion = self.names[randomizer].name
      })
    }
  },
  created: function () {
    this.getMessages()
    this.fillRandomNames()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
