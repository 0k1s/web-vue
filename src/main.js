import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import './styles/index.css';

createApp(App) // приложение из корневого компонента App.vue
  .use(router) // подключаем роутер: появляются RouterLink, RouterView, useRoute
  .mount('#app'); // рисуем в div#app из index.html
