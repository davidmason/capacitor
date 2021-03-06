"use strict";

jest.autoMockOff();

describe('Store', function() {
  var ObjectStore = require("../lib/Store.js");
  var objectStore;

  beforeEach(function() {
    objectStore = new ObjectStore({
      foo: 'bar',
      bar: 'foo'
    });
  });

  it('can get a value', function() {
    var foo = objectStore.get('foo');
    expect(foo).toEqual('bar');
  });

  it('can set a value', function() {
    objectStore.set('foo', 'boop');
    var foo = objectStore.get('foo');

    expect(foo).toEqual('boop');
  });

  it('can get several values', function() {
    objectStore.set('baz', 'baz');

    expect(objectStore.getProperties('foo', 'baz')).toEqual({foo: 'bar', baz: 'baz'});
  });

  it('can get all values', function() {
    var all = objectStore.getAll();

    expect(all).toEqual({foo: 'bar', bar: 'foo'});
  });

  it('can set several values', function() {
    objectStore.setProperties({
      foo: 'foo',
      bar: 'bar'
    });

    expect(objectStore.getAll()).toEqual({foo: 'foo', bar: 'bar'});
  });

  it('can set all values', function() {
    objectStore.setAll({
      foo: 'foo',
      baz: 'baz'
    });

    expect(objectStore.getAll()).toEqual({foo: 'foo', bar: 'foo', baz: 'baz'});
  });

  it('emits change event when setting all values', function() {
    var listener = jest.genMockFunction();
    objectStore.on('change', listener);
    objectStore.setAll({foo: 'foo'});

    expect(listener).toBeCalled();
  });

  it('emits change event when setting all values with an empty object', function() {
    var listener = jest.genMockFunction();
    objectStore.on('change', listener);
    objectStore.setAll({});

    expect(listener).toBeCalled();
  });

  it('can iterate over all store items with forEach', function() {
    var all = {};
    objectStore.forEach(function(key, value) {
      all[key] = value;
    });

    expect(all.foo).toEqual('bar');
    expect(all.bar).toEqual('foo');
  });

  it('can reset defaults', function() {
    objectStore.setAll({
      foo: 'boop',
      bar: 'beep'
    });

    objectStore.reset();
    var all = objectStore.getAll();

    expect(all.foo).toEqual('bar');
    expect(all.bar).toEqual('foo');
  });

  it('resets defaults and does not reference _defaults object', function() {
    objectStore.set('foo', 'boop');
    objectStore.reset();

    objectStore.set('foo', 'boop2');
    objectStore.reset();
    var foo = objectStore.get('foo');

    expect(foo).toEqual('bar');
  });

  it('resets defaults and removes items that were not defaults', function() {
    objectStore.set('alt', 'foo');
    objectStore.reset();

    expect(objectStore.getAll()).toEqual({foo: 'bar', bar: 'foo'});
  });

  it('emits change event when value has changed', function() {
    var listener = jest.genMockFunction();
    objectStore.on('change', listener);
    objectStore.set('baz', 'baz');

    expect(listener).toBeCalled();
  });

  it('emits a single change event when multiple values have been changed', function() {
    var listener = jest.genMockFunction();
    objectStore.on('change', listener);
    objectStore.setProperties({
      foo: 'foo',
      bar: 'bar'
    });

    expect(listener.mock.calls.length).toEqual(1);
  });

  it('emits change event for the value changed', function() {
    var listener = jest.genMockFunction();
    objectStore.on('change:foo', listener);
    objectStore.set('foo', 'foo');

    expect(listener).toBeCalledWith('foo', 'bar');
  });

  it('wont emit change event when value has not changed', function() {
    var listener = jest.genMockFunction();
    objectStore.on('change:foo', listener);
    objectStore.set('foo', 'bar');

    expect(listener.mock.calls.length).toEqual(0);
  });
});

