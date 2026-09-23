export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0);
};

export const calculateCartTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Number((subtotal * 0.08).toFixed(2)); // 8% sales tax estimate
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 10; // Free shipping over $50
  const total = Number((subtotal + tax + shipping).toFixed(2));

  return { subtotal, tax, shipping, total };
};
