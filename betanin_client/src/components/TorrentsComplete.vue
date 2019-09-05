<template lang="pug">
  div
    torrents-table(type="complete")
      #no-torrents-hint
        .title.is-6
          b-icon(icon='alert')
          | &nbsp; there are no imported torrents yet
</template>

<script>
import TorrentsTable from '@/components/TorrentsTable.vue'

export default {
  components: {
    TorrentsTable
  }
}
</script>
