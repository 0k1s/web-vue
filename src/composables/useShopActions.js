import { useCart } from '../stores/cart';
import { useFavorites } from '../stores/favorites';
import { notify } from '../stores/ui';

// Действия с товаром + всплывающее уведомление.
// Нужны в карточке, быстром просмотре, на странице товара и в Избранном — поэтому в одном месте.
export function useShopActions() {
  const cart = useCart();
  const favorites = useFavorites();

  function toggleFavorite(product) {
    const added = favorites.toggle(product.id);
    notify(added ? `«${product.name}» в избранном` : `«${product.name}» убран из избранного`, added ? 'heart' : 'x');
  }

  // положить в корзину всё из списка, чего там ещё нет; вернёт, сколько добавили
  function addAllToCart(products) {
    const fresh = products.filter((p) => !cart.qtyOf(p.id));
    fresh.forEach((p) => cart.add(p.id));
    return fresh.length;
  }

  return { toggleFavorite, addAllToCart };
}
