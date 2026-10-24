import test from 'node:test';
import assert from 'node:assert/strict';
import { widgetId } from '../services/reviews.js';

test('Elfsight identifiers accept plain IDs and the embed class prefix', () => {
  const id = 'abcdef12-3456-4789-abcd-123456789abc';
  assert.equal(widgetId(id), id);
  assert.equal(widgetId('  elfsight-app-' + id.toUpperCase() + '  '), id);
});

test('widget identifiers reject HTML, paths, scripts, extra classes and malformed input', () => {
  for (const value of ['', '<script>alert(1)</script>', 'javascript:alert(1)', 'https://elfsightcdn.com/id', 'abcdef12-3456-4789-abcd-123456789abc onclick=alert(1)', '<div class="elfsight-app-abcdef12-3456-4789-abcd-123456789abc"></div>', 'not-a-widget']) {
    assert.equal(widgetId(value), '');
  }
});
