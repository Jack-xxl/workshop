import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Faq from './pages/Faq.vue'
import Courses from './pages/Courses.vue'
import Showcase from './pages/Showcase.vue'
import Incubation from './pages/Incubation.vue'
import Signup from './pages/Signup.vue'
import Trial from './pages/Trial.vue'
import About from './pages/About.vue'
import AskAi from './pages/AskAi.vue' // 新增这一行！

const routes = [
  { path: '/', component: Home },
  { path: '/faq', component: Faq },
  { path: '/courses', component: Courses },
  { path: '/showcase', component: Showcase },
  { path: '/incubation', component: Incubation },
  { path: '/signup', component: Signup },
  { path: '/trial', component: Trial },
  { path: '/about', component: About },
  { path: '/ai-ask', component: AskAi } // 新增这一行！
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
