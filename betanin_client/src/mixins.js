// prettier-ignore
const statusMap = {
  ENQUEUED: { text: 'enqueued', icon: 'clock-outline', colour: 'hsl(36, 99%, 65%)' }, // orange
  PROCESSING: { text: 'processing', icon: 'clock-fast', colour: 'hsl(48, 98%, 52%' }, // yellow
  NEEDS_INPUT: { text: 'needs input', icon: 'alert', colour: 'hsl(48, 98%, 52%)' }, // yellow-orange
  FAILED: { text: 'failed', icon: 'close', colour: 'hsl(349, 58%, 57%)' }, // angry red
  COMPLETED: { text: 'completed', icon: 'check', colour: 'hsl(141, 71%, 48%)' } // green
}

export const torrentTable = {
  data() {
    return {
      openedDetails: [],
      loading: false
    }
  },
  methods: {
    statusStyle(status) {
      return statusMap[status]
    }
  }
}
