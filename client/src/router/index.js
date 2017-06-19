import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import ChatBox from '@/components/ChatBox'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/chatbox',
      name: 'Chat Box',
      component: ChatBox
    }
  ]
})
