import test from 'node:test';
import assert from 'node:assert/strict';
import * as demo from './demo-orders.js';

const details = { name: 'Demo Member', phone: '9800000000', fulfillment: 'pickup', address: '' };
const lines = [{ id: 'tee-black', size: 'M', qty: 2 }];
const storage = () => {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
};

test('requires explicit valid sizes and whole quantities from 1 to 99', () => {
  assert.equal(typeof demo.createOrder, 'function');
  for (const line of [{ id: 'tee-black', qty: 1 }, { id: 'cap-navy', size: '', qty: 1 }, { ...lines[0], qty: 0 }, { ...lines[0], qty: 1.5 }, { ...lines[0], qty: 100 }, { id: 'unknown', qty: 1 }]) {
    assert.throws(() => demo.createOrder([line], details, 'demo-one'));
  }
});

test('snapshots catalog prices and pickup or explicit demo delivery fee', () => {
  assert.equal(typeof demo.createOrder, 'function');
  const pickup = demo.createOrder(lines, details, 'demo-one');
  assert.equal(pickup.total, 1600);
  assert.equal(pickup.fee, 0);
  assert.equal(pickup.status, 'awaiting');
  const delivery = demo.createOrder(lines, { ...details, fulfillment: 'delivery', address: 'Demo street' }, 'demo-two');
  assert.equal(delivery.fee, 100);
  assert.equal(delivery.total, 1700);
  assert.equal(lines[0].price, undefined);
});

test('rejects empty contact, invalid phone and missing delivery address', () => {
  assert.equal(typeof demo.createOrder, 'function');
  for (const change of [{ name: ' ' }, { phone: 'abc' }, { fulfillment: 'other' }, { fulfillment: 'delivery', address: ' ' }]) {
    assert.throws(() => demo.createOrder(lines, { ...details, ...change }, 'demo-one'));
  }
});

test('creation and failed/pending retries keep one order and success is terminal', () => {
  assert.equal(typeof demo.saveOrder, 'function');
  const store = storage();
  const order = demo.createOrder(lines, details, 'demo-one');
  demo.saveOrder(store, order);
  demo.saveOrder(store, order);
  for (const status of ['failed', 'pending', 'success', 'failed']) demo.setOrderStatus(store, order.id, status);
  const orders = demo.loadOrders(store);
  assert.equal(orders.length, 1);
  assert.equal(orders[0].status, 'success');
  assert.equal(orders[0].history.length, 4);
  assert.equal(orders[0].id, order.id);
});

test('retry resets failed demo orders to awaiting; success stays terminal', () => {
  const store = storage();
  const order = demo.createOrder(lines, details, 'demo-retry');
  demo.saveOrder(store, order);
  demo.setOrderStatus(store, order.id, 'failed');
  assert.equal(demo.setOrderStatus(store, order.id, 'awaiting').status, 'awaiting');
  demo.setOrderStatus(store, order.id, 'success');
  assert.equal(demo.setOrderStatus(store, order.id, 'awaiting').status, 'success');
  const orders = demo.loadOrders(store);
  assert.equal(orders.length, 1);
  assert.equal(orders[0].history.length, 4);
});

test('round-trips saved details and pending status after reload', () => {
  assert.equal(typeof demo.loadOrders, 'function');
  const store = storage();
  const order = demo.createOrder(lines, details, 'demo-one');
  demo.saveOrder(store, order);
  demo.setOrderStatus(store, order.id, 'pending');
  const restored = demo.loadOrders(store)[0];
  assert.equal(restored.customer.name, details.name);
  assert.equal(restored.items[0].size, 'M');
  assert.equal(restored.status, 'pending');
});

test('corrupt or unavailable storage produces an error rather than false confirmation', () => {
  assert.equal(typeof demo.loadOrders, 'function');
  assert.deepEqual(demo.loadOrders(storage()), []);
  assert.throws(() => demo.loadOrders({ getItem: () => '{' }));
  assert.throws(() => demo.loadOrders({ getItem: () => '[{"id":"broken"}]' }));
  assert.throws(() => demo.saveOrder({ getItem: () => null, setItem: () => { throw new Error('quota'); } }, demo.createOrder(lines, details, 'demo-one')));
  assert.throws(() => demo.setOrderStatus(storage(), 'missing', 'success'));
});
