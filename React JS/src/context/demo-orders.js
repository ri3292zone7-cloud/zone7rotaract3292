import { CATALOG } from '../data/merch-catalog.js';

export const DEMO_ORDER_KEY = 'z7-demo-orders-v1';
export const DEMO_DELIVERY_FEE = 100;
const statuses = ['awaiting', 'success', 'failed', 'pending'];

export function createOrder(lines, details, id) {
  if (!Array.isArray(lines) || !lines.length) throw new Error('Add an item before continuing.');
  const items = lines.map((line) => {
    const product = CATALOG.find((p) => p.id === line.id);
    if (!product || !Number.isInteger(line.qty) || line.qty < 1 || line.qty > 99) throw new Error('Choose a quantity between 1 and 99 for each item.');
    if (product.sizes.length && !product.sizes.includes(line.size)) throw new Error(`Choose a size for ${product.name}.`);
    return { id: product.id, name: product.name, price: product.price, size: product.sizes.length ? line.size : '', qty: line.qty };
  });
  const name = details.name?.trim();
  const phone = details.phone?.trim();
  if (!name || name.length > 80) throw new Error('Enter a name (up to 80 characters).');
  if (!phone || !/^[+\d][\d ()-]{6,24}$/.test(phone) || phone.replace(/\D/g, '').length < 7) throw new Error('Enter a valid demo phone number.');
  if (!['pickup', 'delivery'].includes(details.fulfillment)) throw new Error('Choose pickup or demo delivery.');
  const address = details.fulfillment === 'delivery' ? details.address?.trim() : '';
  if (details.fulfillment === 'delivery' && (!address || address.length > 240)) throw new Error('Enter a demo delivery address (up to 240 characters).');
  const fee = details.fulfillment === 'delivery' ? DEMO_DELIVERY_FEE : 0;
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const createdAt = new Date().toISOString();
  return { id, version: 1, items, customer: { name, phone }, fulfillment: details.fulfillment, address, fee, subtotal, total: subtotal + fee, status: 'awaiting', createdAt, history: [{ status: 'awaiting', at: createdAt }] };
}

export function loadOrders(storage) {
  const raw = storage.getItem(DEMO_ORDER_KEY);
  if (!raw) return [];
  const orders = JSON.parse(raw);
  if (!Array.isArray(orders) || orders.some((order) => !order || order.version !== 1 || typeof order.id !== 'string' || !statuses.includes(order.status) || !Array.isArray(order.items) || !order.items.length || order.items.some((item) => !item || typeof item.name !== 'string' || !Number.isFinite(item.price) || !Number.isInteger(item.qty) || item.qty < 1 || item.qty > 99) || !order.customer || typeof order.customer.name !== 'string' || typeof order.customer.phone !== 'string' || !['pickup', 'delivery'].includes(order.fulfillment) || !Number.isFinite(order.total) || !Number.isFinite(order.subtotal) || !Number.isFinite(order.fee) || !Array.isArray(order.history) || order.history.some((entry) => !entry || !statuses.includes(entry.status) || !Number.isFinite(Date.parse(entry.at))) || !Number.isFinite(Date.parse(order.createdAt)))) {
    throw new Error('Saved demo orders could not be read.');
  }
  return orders;
}

export function saveOrder(storage, order) {
  const orders = loadOrders(storage);
  const existing = orders.find((item) => item.id === order.id);
  if (existing) return existing;
  storage.setItem(DEMO_ORDER_KEY, JSON.stringify([order, ...orders]));
  return order;
}

export function setOrderStatus(storage, id, status) {
  if (!['success', 'failed', 'pending', 'awaiting'].includes(status)) throw new Error('Choose a simulated outcome.');
  const orders = loadOrders(storage);
  const order = orders.find((item) => item.id === id);
  if (!order) throw new Error('This demo order is no longer saved on this device.');
  if (order.status === 'success' || order.status === status) return order;
  const next = { ...order, status, history: [...order.history, { status, at: new Date().toISOString() }] };
  storage.setItem(DEMO_ORDER_KEY, JSON.stringify(orders.map((item) => item.id === id ? next : item)));
  return next;
}
