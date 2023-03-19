<template>
  <v-app>
    <v-app-bar
        app
        color="#202123"
        dark
    >
      <div class="d-flex align-center">
        <h2>ChatGPT SSE</h2>
      </div>
      <v-spacer></v-spacer>
      <v-btn @click="refreshPage" icon>
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <v-list three-line>
              <template v-for="(item, index) in messages">
                <v-subheader
                    v-if="item.header"
                    :key="index"
                    v-text="item.header"
                ></v-subheader>
                <v-divider
                    v-else-if="item.divider"
                    :key="index"
                    :inset="item.inset"
                ></v-divider>
                <v-list-item
                    v-else
                    :key="index"
                >
                  <v-list-item-avatar>
                    <v-img :src="item.avatar"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.username }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.createTime }}</v-list-item-subtitle>
                    <v-list-item-subtitle>
                      <v-textarea
                          filled
                          :height="item.height"
                          :background-color="item.color"
                          :value="item.msg"
                      ></v-textarea>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="mb-4">
            <v-textarea
                append-icon="mdi-refresh"
                append-outer-icon="mdi-send"
                v-model="newMessage"
                label="您的提问："
                filled
                clearable
                auto-grow
                background-color="yellow lighten-5"
                @click:append-outer="sendMessage"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'ChatGPT',

  components: {},

  data: () => ({
    newMessage: '',
    messages: [],
    eventSource: null,
    id: null
  }),

  created() {
  },

  computed: {},

  methods: {
    OnMessage(e) {
      const vm = this
      let messageData = JSON.parse(e.data);
      const currentTime = new Date().toLocaleString();
      if (messageData.role === 'assistant') {
        let msgNew = {
          username: 'CHATGPT',
          avatar: require('./assets/chatgpt.png'),
          color: 'green lighten-5',
          msg: '',
          createTime: currentTime,
          height: 60
        }
        console.log('assistant');
        this.messages.push(msgNew);
        return;
      }
      if (messageData.content === null) {
        return;
      }
      const size = vm.messages.length - 1;
      if (vm.messages[size].msg === '' && messageData.content === "\n\n") {
        return;
      }
      vm.messages[size].msg = vm.messages[size].msg + messageData.content
    },
    uuid() {
      const s = [];
      const hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";
      this.id = s.join("");
      return this.id;
    },
    connectToSse(message) {
      let uid = this.id;
      if (uid == null) {
        uid = this.uuid();
        console.log("uid:" + uid);
      }
      const url = `${this.BASE_WS}/chat?message=` + message + `&uid=` + uid;
      this.eventSource = new EventSource(url);
      this.eventSource.addEventListener("message", event => {
        if (event.data === "[DONE]") {
          this.eventSource.close()
          console.log("done close.....");
        } else {
          this.OnMessage(event);
        }
      });
      this.eventSource.addEventListener('error', (event) => {
        console.error('SSE connection error', event)
        this.eventSource.close()
        const currentTime = new Date().toLocaleString();
        let msgNew = {
          username: 'ERROR',
          avatar: require('./assets/error.png'),
          height: 60,
          color: 'red lighten-5',
          msg: message,
          createTime: currentTime,
        }
        this.messages.push(msgNew)
        console.log("error close.....");
      })
    },
    sendMessage() {
      const message = this.newMessage.trim()
      if (!message) {
        return
      }
      const currentTime = new Date().toLocaleString();
      let msgNew = {
        username: 'YOU',
        avatar: require('./assets/developer.png'),
        color: 'blue lighten-5',
        msg: message,
        createTime: currentTime,
        height: 60,
      }
      this.messages.push(msgNew)

      this.newMessage = ''
      this.connectToSse(message);
    },
    refreshPage() {
      window.location.reload()
    },
  },
};
</script>
