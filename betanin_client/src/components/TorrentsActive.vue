<template lang="pug">
  div
    slot
    b-table#torrents(
      :data="torrents"
      :loading="loading"
      paginated
      backend-pagination
      :total="total"
      :per-page="getPerPage"
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
import ManualImport from '@/components/ManualImport.vue'
import { torrentTable } from '@/mixins'
import { mapGetters } from 'vuex'
import store from '@/store/main'
export default {
  mixins: [torrentTable],
  components: {
    ManualImport
  },
  data () {
    return {
      page: 1
    }
  },
  computed: mapGetters('torrents', [
    'getTorrents',
    'getPerPage',
    'getCountComplete',
  ]),
  methods: {
    changePage(page) {
      this.page = page
      store.dispatch('torrents/doFetchPage', page)
    },
    retryTorrent (torrentID) {
      if (confirm('do you want to retry this?')) {
        store.dispatch('torrents/doRetryOne', torrentID)
        this.$router.push({
          name: 'modal console', params: { torrentID }
        })
      }
    },
    deleteTorrent (torrentID) {
      if (confirm('do you want to remove this from betanin?')) {
        store.dispatch('torrents/doDeleteOne', torrentID)
      }
    }
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
