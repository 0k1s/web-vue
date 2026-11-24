# Чайная лавка на Vue (SPA «Интернет-магазин»)

Тот же магазин, что в ЛР №1 на React, переписанный на **Vue 3**. По заданию добавлены **Избранное** и **подсказки с 5 последними поисковыми запросами**.

Стек: Vue 3 (Composition API, `<script setup>`), Vue Router, Tailwind CSS v4 + БЭМ, lucide-vue-next (иконки), Vite.

```bash
npm install      # скачать зависимости
npm run dev      # http://localhost:5173
npm run build    # собрать сайт в папку dist
npm run preview  # посмотреть собранный сайт
```

## Структура

```
src/
├── main.js              точка входа: createApp(App).use(router).mount('#app')
├── App.vue              каркас: шапка, RouterView, подвал, чат, быстрый просмотр, уведомления
├── router/index.js      маршруты, hash-история, scrollBehavior
├── pages/               страницы (по одной на маршрут)
│   ├── HomePage.vue        главная: карусель, категории, параллакс, новинки
│   ├── CatalogPage.vue     каталог: категории, поиск, сортировка, вид, пагинация
│   ├── ProductPage.vue     карточка товара + похожие
│   ├── FavoritesPage.vue   Избранное
│   ├── CartPage.vue        корзина
│   ├── CheckoutPage.vue    оформление заказа
│   ├── AboutPage.vue, NotFoundPage.vue
├── components/          переиспользуемые компоненты
│   ├── AppHeader.vue, MobileNav.vue, AppFooter.vue, AppBreadcrumbs.vue, navLinks.js
│   ├── ProductCard.vue, ProductImage.vue, ProductLink.vue, AddToCart.vue, QtyControl.vue
│   ├── FavoriteButton.vue  сердечко «Избранное»
│   ├── SearchBox.vue       поиск с подсказками «Вы искали» и «Товары»
│   ├── AppModal.vue + QuickView.vue   быстрый просмотр
│   ├── AppPagination.vue, ViewSwitcher.vue
│   ├── AppCarousel.vue, ParallaxSection.vue, ChatBot.vue, ScrollTopButton.vue, AppToaster.vue
│   └── CategoryIcon.vue, TeapotIcon.vue
├── stores/              общее состояние (аналог сервисов в Angular)
│   ├── cart.js             корзина
│   ├── favorites.js        Избранное
│   ├── searchHistory.js    5 последних запросов
│   └── ui.js               быстрый просмотр, уведомления
├── composables/         переиспользуемая логика (функции use…)
│   ├── useShopActions.js   «в избранное» + уведомление, «всё в корзину»
│   ├── useProductLink.js   переход на товар с запоминанием, откуда пришли
│   └── useMediaQuery.js
├── data/products.js     категории, 26 товаров, поиск matchesQuery
├── utils/               storage.js (localStorage с try/catch), format.js (цена, склонения)
└── styles/index.css     Tailwind + БЭМ-блоки
```

## Требования задания → где сделано

| # | Требование | Где |
|---|---|---|
| 1 | SPA интернет-магазина | `main.js`, `App.vue`, `router/index.js`. Переходы без перезагрузки, адреса вида `#/catalog` |
| 2 | Пользователь — гость: каталог и Избранное | входа нет, данные гостя в localStorage |
| 3 | Меню, подвал, навигация | `AppHeader.vue`, `MobileNav.vue` (нижняя панель на телефоне), `AppFooter.vue`, `AppBreadcrumbs.vue`, кнопка «Назад» в `ProductPage.vue` |
| 4 | Поиск по ключевым словам | `matchesQuery` в `data/products.js` (название + описание + категория, все слова запроса), `CatalogPage.vue` (`filtered`), поиск в шапке |
| 5 | 5 последних запросов, подсказки | `stores/searchHistory.js`, `components/SearchBox.vue` |
| 6 | Карточки товаров с описанием | `ProductCard.vue`, `ProductPage.vue` |
| 7 | Динамическая пагинация | `AppPagination.vue` + `totalPages`/`page`/`visible` в `CatalogPage.vue` |
| 8 | Предварительный просмотр | `QuickView.vue` + `AppModal.vue` (Teleport, слот) |
| 9 | Избранное: добавить/убрать, просмотр, LocalStorage | `stores/favorites.js`, `FavoriteButton.vue` (карточка, быстрый просмотр, страница товара, корзина), `FavoritesPage.vue`, счётчики в `AppHeader.vue` и `MobileNav.vue` |
| 10 | Использовать Vue | всё: `.vue`-файлы, Composition API, Vue Router |

Из ЛР №1 сохранено: корзина с пересчётом и доставкой, оформление заказа с проверкой формы, чат-бот, карусель, параллакс, кнопка «наверх», переключатель вида каталога (список / 2 / 4 колонки), адаптивность.

## Что из Vue где используется

| Возможность | Где |
|---|---|
| `ref`, `reactive` | `stores/*.js`, форма в `CheckoutPage.vue`, локальные состояния (`open`, `confirmClear`) |
| `computed` (в т.ч. с get/set) | `filtered`, `totalPages`, `visible` в каталоге; `lines`, `total` в корзине; `qty` в `AddToCart.vue` |
| `watch` | сохранение в localStorage (`stores`), поле поиска ↔ адрес (`CatalogPage.vue`), таймер карусели |
| `props` / `emit` / `v-model` на своём компоненте | `ProductCard` (props), `AppPagination` (emit `change`), `QtyControl`, `ViewSwitcher`, `SearchBox` (v-model) |
| Директивы | `v-if/v-else`, `v-for` + `:key`, `v-model`, `:class`, `:style`, `@click`, `@submit.prevent`, `@click.stop`, `@mousedown.prevent` |
| Слоты | `AppModal` (обычный), `AppCarousel` (слот с данными: `#default="{ item }"`), `ParallaxSection`, `RouterView v-slot`, `RouterLink custom v-slot` |
| Хуки `onMounted` / `onBeforeUnmount` | `AppModal`, `ScrollTopButton`, `ParallaxSection`, `AppCarousel`, `useMediaQuery` |
| `Teleport` | `AppModal.vue` |
| `TransitionGroup` | `FavoritesPage.vue` (карточки плавно исчезают и съезжают), `AppToaster.vue` |
| `component :is` | `App.vue` (страница из роутера), `CategoryIcon.vue`, `ViewSwitcher.vue`, `MobileNav.vue` |
| Vue Router | параметры `:id`, `:category`, query (`?q=&sort=&size=&page=`), `scrollBehavior`, state истории |
| Composables | `useShopActions`, `useProductLink`, `useMediaQuery` |

## Ключи в localStorage

| Ключ | Что хранится |
|---|---|
| `tea-shop-favorites` | id товаров в Избранном, `[3, 1]` |
| `tea-shop-search-history` | 5 последних запросов |
| `tea-shop-cart` | корзина `{ id: количество }` |
| `tea-shop-catalog-view` | вид каталога |
| `tea-shop-orders` | оформленные заказы |

## Как показать на защите

1. **Избранное.** Нажать сердечко на 2–3 карточках: сердце закрашивается, всплывает уведомление, счётчик у сердечка в шапке растёт. Открыть «Избранное», убрать один товар (карточка плавно исчезнет), нажать «Всё в корзину». Перезагрузить страницу (F5): всё на месте. В DevTools → Application → Local Storage виден ключ `tea-shop-favorites`.
2. **5 запросов.** В каталоге поискать «улун», «Япония», «без кофеина», «пуэр», «чайник», «матча» (Enter). Кликнуть в пустое поле: в «Вы искали» 5 последних, самый первый вытеснен. Начать печатать «пу»: остаются подходящие запросы, ниже — товары. Работают стрелки ↑↓, Enter, Esc, крестик у запроса и «Очистить».
3. **Пагинация.** Выбрать «по 8»: страниц 4. Выбрать категорию или ввести поиск: число страниц пересчитывается само.
4. **Быстрый просмотр.** Кнопка «Быстрый просмотр» на карточке; закрывается по Esc, клику по фону, крестику.
5. **Назад.** Отфильтровать каталог, прокрутить вниз, открыть товар, оттуда похожий товар, нажать «Назад к каталогу»: вернёт тот же адрес с фильтрами и ту же прокрутку.

## Вопросы на защите

**Почему сердечко везде меняется одновременно?**
Все компоненты берут один и тот же `ref ids` из `stores/favorites.js`. Модуль выполняется один раз при первом импорте, поэтому список общий. Поменяли его — Vue перерисовал всех, кто его читает.

**Как Избранное переживает перезагрузку?**
`watch(ids, …, { deep: true })` при каждом изменении пишет список в localStorage, а при старте `load()` читает его обратно и выкидывает несуществующие id и повторы.

**Как сделаны 5 последних запросов?**
`remember()` в `stores/searchHistory.js`: убирает пробелы, не запоминает одну букву, удаляет такой же старый запрос (без учёта регистра), ставит новый первым и обрезает до 5 (`slice(0, 5)`).

**Почему пагинация «динамическая»?**
`totalPages = Math.ceil(найдено / на странице)` — это `computed`. Сменили категорию, поиск или «по N» — пересчиталось само. Номер страницы ограничивается диапазоном: `?page=999` откроет последнюю.

**Чем ref отличается от reactive?**
`ref` — обёртка для одного значения, в скрипте читается через `.value`, в шаблоне без `.value`. `reactive` делает реактивным объект целиком, `.value` не нужен (корзина, форма заказа).

**Зачем Teleport?**
Переносит окно быстрого просмотра в конец `body`, чтобы его не обрезали `overflow` и `z-index` родителей.

**Как компонент передаёт данные родителю?**
Через `emit`. `v-model="qty"` на компоненте — это `:model-value="qty"` + `@update:model-value="qty = $event"` (`QtyControl`, `SearchBox`, `ViewSwitcher`).

**Почему не Pinia?**
Модуля с `ref`/`reactive` для учебного проекта хватает — в документации Vue это «управление состоянием через Reactivity API». Pinia даёт то же плюс devtools и плагины.

**Чем отличается от React-версии?**
Вместо `useState`/`useContext` — `ref`/`reactive` и модули-хранилища; вместо `useMemo` — `computed`; вместо `useEffect` — `watch` и хуки `onMounted`/`onBeforeUnmount`; вместо JSX — шаблоны с директивами; двусторонняя привязка `v-model` вместо `value` + `onChange`.

## Фото товаров

PNG без фона лежат в `public/img/products/`. Источники — Wikimedia Commons, авторы и лицензии в `public/img/products/CREDITS.md`.
