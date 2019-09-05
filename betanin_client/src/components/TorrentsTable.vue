<template lang="pug">
  div
    slot
    b-table#torrents(
      :data="torrents"
      :loading="loading"
      paginated
      backend-pagination
      :total="total"
      :per-page="perPage"
      @page-change="changePage"
      detailed
      detail-key='id'
      :opened-detailed='openedDetails'
    )
      template(slot-scope='props')
        b-table-column(label='name') {{ props.row.name }}
        b-table-column.controls(label='status' :numeric='true')
          span.status-group(:style='{ color: statusStyle(props.row.status).colour }')
            b-icon(:icon='statusStyle(props.row.status).icon' size='is-small')
            |  {{ statusStyle(props.row.status).text }}
          router-link.status-group.link(
            v-show='props.row.has_lines'
            :to='consoleRoute(props.row.id)'
          )
            b-icon(icon='console' size='is-small')
            |  view
          span.status-group(v-show='["FAILED", "COMPLETED"].includes(props.row.status)')
            span.link(title='remove torrent' @click='deleteTorrent(props.row.id)')
              b-icon.link(icon='close' size='is-small')
            | &nbsp;
            span.link(title='retry import' @click='retryTorrent(props.row.id)')
              b-icon.link(title='retry import' icon='loop' size='is-small')
      template(slot-scope='props' slot='detail')
        #row-status
          p <strong>id</strong> {{ props.row.id }}
          p <strong>status</strong> {{ props.row.status | lower }}
          p <strong>created</strong> {{ props.row.created }}
          p <strong>updated</strong> {{ props.row.updated }}
    router-view(name='modal')
</template>

<script>
// imports
import store from '@/store/main'
import backend from '@/backend'

// help
const statusMap = {
  // prettier-ignore
  ENQUEUED: { text: 'enqueued', icon: 'clock-outline', colour: 'hsl(36, 99%, 65%)' }, // orange
  PROCESSING: {
    text: 'processing',
    icon: 'clock-fast',
    colour: 'hsl(48, 98%, 52%'
  }, // yellow
  NEEDS_INPUT: {
    text: 'needs input',
    icon: 'alert',
    colour: 'hsl(48, 98%, 52%)'
  }, // yellow-orange
  FAILED: { text: 'failed', icon: 'close', colour: 'hsl(349, 58%, 57%)' }, // angry red
  COMPLETED: { text: 'completed', icon: 'check', colour: 'hsl(141, 71%, 48%)' } // green
}
// export
export default {
  props: ['type'],
  methods: {
    consoleRoute(torrentID) {
      return {
        name: `${this.type}/console`,
        params: { torrentID }
      }
    },
    retryTorrent(torrentID) {
      if (confirm('do you want to retry this?')) {
        store.dispatch('torrents/doRetryOne', torrentID)
        this.$router.push(this.consoleRoute(torrentID))
      }
    },
    deleteTorrent(torrentID) {
      if (confirm('do you want to remove this from betanin?')) {
        store.dispatch('torrents/doDeleteOne', torrentID)
      }
    },
    statusStyle(status) {
      return statusMap[status]
    },
    async getTorrents() {
      this.loading = true
      try {
        const response = await backend.secureAxios.get('torrents/', {
          params: {
            status: this.type,
            page: this.page,
            per_page: this.perPage
          }
        })
        this.torrents = response.data.torrents
        this.total = response.data.total
        this.loading = false
      } catch (e) {
        this.torrents = []
        this.total = 0
        this.loading = false
        throw e
      }
    },
    changePage(page) {
      this.page = page
      this.getTorrents()
    }
  },
  data() {
    return {
      page: 1,
      perPage: 20,
      torrents: [],
      openedDetails: [],
      total: 0,
      loading: false
    }
  },
  mounted() {
    this.getTorrents()
  }
}
</script>

<style lang="scss" scoped>
#torrents /deep/ td {
  vertical-align: middle;
}
#row-status {
  text-align: right;
  word-break: break-all;
}
.link {
  cursor: pointer;
}
.status-group ~ .status-group::before {
  content: '｜';
  display: inline-block;
  margin: 0 0.1rem;
  opacity: 0.15;
}
.controls {
  white-space: nowrap;
}
a {
  color: unset;
}
</style>
