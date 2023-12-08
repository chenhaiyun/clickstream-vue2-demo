<template>
  <div class="list row">
    <div class="col-md-8">
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Search by title"
          v-model="title"/>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button"
            @click="searchTitle"
          >
            Search
          </button>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <button @click="simulateCrash">Crash</button>
      <button @click="undefinedProperty">Undefined Property</button>
      <button @click="unsupportedZero">1/0</button>
      <h4>Tutorials List</h4>
      <ul class="list-group">
        <li class="list-group-item"
          :class="{ active: index == currentIndex }"
          v-for="(tutorial, index) in tutorials"
          :key="index"
          @click="setActiveTutorial(tutorial, index)"
        >
          {{ tutorial.title }}
        </li>
      </ul>

      <button class="m-3 btn btn-sm btn-danger" @click="removeAllTutorials">
        Remove All
      </button>
    </div>
    <h1>Vue.js Socket.io Chat</h1>
    <input v-model="message" @keyup.enter="sendMessage">
    <button @click="sendMessage">Send</button>
    <ul>
      <li v-for="msg in messages" :key="msg">{{ msg }}</li>
    </ul>
    <div class="col-md-6">
      <div v-if="currentTutorial">
        <h4>Tutorial</h4>
        <div>
          <label><strong>Title:</strong></label> {{ currentTutorial.title }}
        </div>
        <div>
          <label><strong>Description:</strong></label> {{ currentTutorial.description }}
        </div>
        <div>
          <label><strong>Status:</strong></label> {{ currentTutorial.published ? "Published" : "Pending" }}
        </div>

        <router-link :to="'/tutorials/' + currentTutorial.id" class="badge badge-warning">Edit</router-link>
      </div>
      <div v-else>
        <br />
        <p>Please click on a Tutorial...</p>
      </div>
    </div>
  </div>
</template>

<script>
import TutorialDataService from "../services/TutorialDataService";
import SocketioService from '../socketio';

export default {
  name: "tutorials-list",
  data() {
    return {
      socket: null,
      message: '',
      messages: [],
      tutorials: [],
      currentTutorial: null,
      currentIndex: -1,
      title: ""
    };
  },
  sockets: {
    connect() {
      console.log('Connected to server');
    },
    disconnect() {
      console.log('Disconnected from server');
    },
    'my broadcast'(msg) {
      this.messages.push(msg);
    }
  },
  methods: {
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    },
    sendMessage() {
      if (this.message.trim() !== '') {
        // this.socket.emit('my message', 'Hello there from Vue.');
        // this.socket.emit('chat message', this.message);
        SocketioService.sendMessage(this.message);
        this.message = '';
      }
    },
    unsupportedZero() {
      this.title = 1/0
    },
    simulateCrash() {
      // 故意制造一个错误
      this.undefinedFunction();
    },
    undefinedProperty() {
      // 故意制造一个错误
      this.title = this.abc.undefinedProperty;
    },
    retrieveTutorials() {
      TutorialDataService.getAll()
        .then(response => {
          this.tutorials = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    refreshList() {
      this.retrieveTutorials();
      this.currentTutorial = null;
      this.currentIndex = -1;
    },

    setActiveTutorial(tutorial, index) {
      this.currentTutorial = tutorial;
      this.currentIndex = index;
    },

    removeAllTutorials() {
      TutorialDataService.deleteAll()
        .then(response => {
          console.log(response.data);
          this.refreshList();
        })
        .catch(e => {
          console.log(e);
        });
    },
    
    searchTitle() {
      TutorialDataService.findByTitle(this.title)
        .then(response => {
          this.tutorials = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.retrieveTutorials();
  },
  beforeUnmount() {
    SocketioService.disconnect();
  },
  created() {
    this.socket = SocketioService.setupSocketConnection();
  }
};
</script>

<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
</style>
