// Пункты меню — массив: добавить пункт = добавить объект.
// match — при каких адресах пункт подсвечен
export const navLinks = [
  { to: '/', label: 'Главная', match: (path) => path === '/' },
  { to: '/catalog', label: 'Каталог', match: (path) => path.startsWith('/catalog') || path.startsWith('/product') },
  { to: '/about', label: 'О нас', match: (path) => path === '/about' },
];
