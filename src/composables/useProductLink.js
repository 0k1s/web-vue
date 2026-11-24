import { useRoute, useRouter } from 'vue-router';

// Переход на страницу товара, который помнит, откуда пришли.
// В state истории браузера кладём { backTo, backSteps }:
//   backTo    — адрес списка (каталог с фильтрами, корзина, избранное…);
//   backSteps — сколько шагов назад до него (растёт, если переходить по «Похожим товарам»).
// Кнопка «Назад» на странице товара делает router.go(-backSteps) и попадает ровно туда же,
// а scrollBehavior в роутере возвращает прокрутку.
export function useProductLink() {
  const router = useRouter();
  const route = useRoute();

  function openProduct(id) {
    const current = window.history.state ?? {};
    const state =
      route.name === 'product' && current.backSteps
        ? { backTo: current.backTo, backSteps: current.backSteps + 1 }
        : { backTo: route.fullPath, backSteps: 1 };
    router.push({ name: 'product', params: { id }, state });
  }

  return { openProduct };
}
