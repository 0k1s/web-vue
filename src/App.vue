<script setup>
import AppBreadcrumbs from './components/AppBreadcrumbs.vue';
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import AppToaster from './components/AppToaster.vue';
import ChatBot from './components/ChatBot.vue';
import MobileNav from './components/MobileNav.vue';
import QuickView from './components/QuickView.vue';
import ScrollTopButton from './components/ScrollTopButton.vue';
</script>

<template>
  <!-- Общий каркас: шапка и подвал на месте, меняется только середина -->
  <div class="page">
    <AppHeader />
    <main class="page__main">
      <AppBreadcrumbs />
      <!-- RouterView через слот отдаёт компонент текущей страницы.
           :key="route.path" — для нового адреса страница создаётся заново;
           при смене только фильтров (?q=…) путь тот же, и каталог не пересоздаётся -->
      <RouterView v-slot="{ Component, route }">
        <component :is="Component" :key="route.path" />
      </RouterView>
    </main>
    <AppFooter />
    <ScrollTopButton />
    <ChatBot />
    <MobileNav />
    <QuickView />
    <AppToaster />
  </div>
</template>
