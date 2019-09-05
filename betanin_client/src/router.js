import Vue from 'vue'
import Router from 'vue-router'
import authUtils from '@/authentication_utilities'

// views
import Betanin from '@/views/Betanin.vue'
import Login from '@/views/Login.vue'

// components
import ConfigEditor from '@/components/ConfigEditor.vue'
import ModalConsole from '@/components/ModalConsole.vue'
import NotificationEditor from '@/components/NotificationEditor.vue'
import Settings from '@/components/Settings.vue'
import TorrentClients from '@/components/TorrentClients.vue'
import TorrentsActive from '@/components/TorrentsActive.vue'
import TorrentsComplete from '@/components/TorrentsComplete.vue'

Vue.use(Router)

const requireAuth = (to, from, next) => {
  if (authUtils.isLoggedIn()) {
    next()
    return
  }
  next({
    name: 'login',
    query: { redirect: to.fullPath }
  })
}

const modalConsoleChild = {
  path: 'console/:torrentID',
  components: { modal: ModalConsole },
  meta: { modalIsOpen: true }
}

const pages = [
  {
    path: 'active',
    name: 'active',
    component: TorrentsActive,
    children: [{ ...modalConsoleChild, name: 'active/console' }]
  },
  {
    path: 'complete',
    name: 'complete',
    component: TorrentsComplete,
    children: [{ ...modalConsoleChild, name: 'complete/console' }]
  },
  {
    path: 'settings',
    component: Settings,
    children: [
      {
        path: 'clients',
        component: TorrentClients
      },
      {
        path: 'notifications',
        component: NotificationEditor
      },
      {
        path: 'beets',
        component: ConfigEditor
      },
      {
        name: 'settings',
        path: '',
        redirect: 'clients'
      }
    ]
  }
]

const screens = [
  {
    name: 'login',
    path: '/login',
    component: Login
  },
  {
    name: 'betanin',
    path: '/',
    redirect: { name: 'active' },
    component: Betanin,
    children: pages,
    beforeEnter: requireAuth
  },
  {
    path: '*',
    redirect: '/'
  }
]

export default new Router({
  linkActiveClass: 'is-active',
  routes: screens
})
