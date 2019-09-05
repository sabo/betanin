<template lang="pug">
  div
    manual-import
    br
    b-table#torrents(
      :data='torrents'
      :opened-detailed='openedDetails'
      detailed
      detail-key='id'
      :loading="loading"
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
import backend from '@/backend'
export default {
  mixins: [torrentTable],
  components: {
    ManualImport
  },
  data() {
    return {
      torrents: [],
      loading: false
    }
  },
  methods: {
    consoleRoute(torrentID) {
      return {
        name: `active/console`,
        params: { torrentID }
      }
    }
  },
  async mounted() {
    this.loading = true
    const response = await backend.secureAxios.get('torrents/', {
      params: { status: 'active' }
    })
    this.loading = false
    if (!response.data.torrents) {
      return
    }
    this.torrents = response.data.torrents
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
