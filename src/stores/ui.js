import { reactive } from 'vue';

// Состояние интерфейса, общее для всего сайта
export const ui = reactive({
  quickViewId: null, // какой товар открыт в быстром просмотре (null — окно закрыто)
  toasts: [], // всплывающие уведомления
});

export const openQuickView = (id) => {
  ui.quickViewId = id;
};
export const closeQuickView = () => {
  ui.quickViewId = null;
};

let nextId = 1;
// показать уведомление на 3 секунды; одновременно не больше трёх
export function notify(text, icon = 'check') {
  const id = nextId++;
  ui.toasts.push({ id, text, icon });
  if (ui.toasts.length > 3) ui.toasts.shift();
  setTimeout(() => {
    const i = ui.toasts.findIndex((t) => t.id === id);
    if (i !== -1) ui.toasts.splice(i, 1);
  }, 3000);
}
