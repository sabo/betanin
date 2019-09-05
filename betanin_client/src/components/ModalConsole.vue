<template lang="pug">
  b-modal(
    :width='640'
    scroll='keep'
    :active='$route.meta.modalIsOpen'
    :onCancel='close'
  )
    .modal-card
      header.modal-card-head
        p.modal-card-title {{ torrent.name }}
      #console
        pre(v-chat-scroll)
          p(
            v-for='line in getByID[torrentID]'
            :key='line.index'
            v-html='colorLine(line.data)'
          )
        #live-box(v-show='isLive')
          span#fade &#x25A0
          span#text live
      footer.modal-card-foot
        #send-input
          input.input.is-small(
            @keyup.enter='sendStdin'
            type='text'
            :disabled='!isLive'
            :placeholder='isLive ? "send to beets" : "beets has quit"'
            v-model='stdin'
            v-focus
          )
        #send-button
          button.button.is-small(
            @click='sendStdin'
            :disabled='!isLive'
          ) send
</template>

<script>
import Convert from 'ansi-to-html'
import backend from '@/backend'
const converter = new Convert()
export default {
  data () {
    return {
      stdin: ''
    }
  },
  computed: {
    torrentID () {
      return this.$route.params.torrentID
    },
    torrent () {
      return { status: 'PROCESSING' }
    },
    isLive () {
      const { status } = this.torrent
      return ['PROCESSING', 'NEEDS_INPUT'].includes(status)
    }
  },
  methods: {
    colorLine(line) {
      return converter.toHtml(line)
    },
    close() {
      // not using .go(-1) here just in case there is no history
      const routeParts = this.$route.path.split('/')
      const routeNoConsoleParts = routeParts.slice(0, routeParts.length - 2)
      const routeNew = routeNoConsoleParts.join('/')
      this.$router.push(routeNew)
    },
    sendStdin(event) {
      backend.secureAxios.post(
        `torrents/${this.torrentID}/console/stdin`, {
          text: this.stdin
        })
      this.stdin = ''
    }
  },
  directives: {
    focus: {
      inserted (el) {
        el.focus()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
  pre {
    background-color: #404040;
    padding: 0.75rem;
    height: 50vh;
    position: relative;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  p {
    font-size: 11px;
    color: white;
  }
  .modal-card-title {
    font-size: 1rem;
  }
  .modal-card-head, .modal-card-foot {
    padding: 0.75rem 0.75rem;
  }
  #send-input {
    flex-grow: 1;
    margin-right: 0.75rem;
  }
  #send-button {
    flex-basis: 4rem;
    flex-shrink: 0;
    button {
      width: 100%;
    }
  }
  #console {
    position: relative;
  }
  #live-box {
    position: absolute;
    top: 0px;
    right: 0px;
    /* scrollbar is 17px */
    margin: 0.75rem calc(0.75rem + 17px);
    font-size: 14px;
    font-family: monospace;
    padding: 0 0.5rem;
    border-radius: 2px;
    background-color: rgba(255, 255, 255, 0.1);
    #fade {
      color: red;
      animation: fadeinout 2s;
      animation-iteration-count: infinite;
      margin-right: 4px;
      font-size: 18px;
    }
    #text {
      color: white;
    }
  }
  @keyframes fadeinout {
    0%, 60%, 100% { opacity: 1; }
    80%           { opacity: 0; }
  }
</style>
