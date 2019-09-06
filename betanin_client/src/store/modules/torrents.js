import Vue from 'vue'
import backend from '@/backend'
import keyBy from 'lodash.keyby'
import {
  TORRENTS_ALL_CREATE,
  TORRENTS_ONE_UPDATE,
  TORRENTS_ONE_DELETE
} from '../mutation-types'

const state = {
  torrents: [],
  page: 1,
  perPage: 20,
  total: 0
}

const getters = {
  getTorrents: state => state.torrents,
  getCountActive: state =>
    state.torrents.filter(item => item.status !== 'COMPLETED'),
  getCountComplete: state => state.total,
  getByID: state => keyBy(state.torrents, 'id')
}

const actions = {
  async doFetchAll({ commit, state }) {
    const result = await backend.secureAxios.get('torrents/', { params: {
      page: state.pagination.page,
      per_page: state.pagination.perPage
    })
    commit(TORRENTS_ALL_CREATE, result.data)
  },
  doDeleteOne({ commit }, torrentID) {
    backend.secureAxios.delete(`torrents/${torrentID}`)
    commit(TORRENTS_ONE_DELETE, torrentID)
  },
  doRetryOne(context, torrentID) {
    backend.secureAxios.put(`torrents/${torrentID}`)
  },
  doSocket__newTorrent: ({ commit }, torrent) => {
    commit(TORRENTS_ONE_UPDATE, torrent)
  }
}

const mutations = {
  [TORRENTS_ALL_CREATE](state, data) {
    Vue.set(state, 'torrents', data.torrents)
    Vue.set(state.pagination, 'total', data.total)
  },
  [TORRENTS_ONE_UPDATE](state, torrent) {
    const i = state.torrents.findIndex(item => item.id === torrent.id)
    if (i > -1) {
      Vue.set(state.torrents, i, torrent)
      return
    }
    state.torrents.unshift(torrent)
  },
  [TORRENTS_ONE_DELETE](state, torrentID) {
    state.torrents.splice(
      state.torrents.findIndex(torrent => torrent.id === torrentID),
      1
    )
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
}
