<template lang="pug">
  div
    manual-import
    hr
    torrents-table(type="active")
      #no-torrents-hint
        .title.is-6
          b-icon(icon='alert')
          | &nbsp; there are no torrents being imported at the moment
        .title.is-7.subtitle
          | make sure that you have set your torrent client up correctly
</template>

<script>
import TorrentsTable from '@/components/TorrentsTable.vue'
import ManualImport from '@/components/ManualImport.vue'

export default {
  components: {
    TorrentsTable,
    ManualImport
  }
}
</script>
