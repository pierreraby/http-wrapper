import assert from 'node:assert/strict';
import test, { afterEach } from 'node:test';

import { HttpError, httpDELETE, httpGET, httpPOST } from './http.js';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

test('httpPOST serializes plain objects as JSON', async () => {
  let requestConfig;

  globalThis.fetch = async (_url, config) => {
    requestConfig = config;

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const result = await httpPOST('https://example.com/posts', { title: 'hello' });

  assert.deepEqual(result, { ok: true });
  assert.equal(requestConfig.body, JSON.stringify({ title: 'hello' }));
  assert.equal(new Headers(requestConfig.headers).get('Content-Type'), 'application/json');
});

test('httpPOST keeps FormData untouched and does not force Content-Type', async () => {
  let requestConfig;
  const formData = new FormData();
  formData.set('file', 'content');

  globalThis.fetch = async (_url, config) => {
    requestConfig = config;

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  await httpPOST('https://example.com/upload', formData);

  assert.equal(requestConfig.body, formData);
  assert.equal(new Headers(requestConfig.headers).has('Content-Type'), false);
});

test('httpDELETE returns undefined for 204 responses', async () => {
  globalThis.fetch = async () => new Response(null, { status: 204 });

  const result = await httpDELETE('https://example.com/posts/1');

  assert.equal(result, undefined);
});

test('httpGET throws HttpError with parsed response body', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ message: 'Missing resource' }), {
    status: 404,
    statusText: 'Not Found',
    headers: { 'Content-Type': 'application/json' },
  });

  await assert.rejects(
    () => httpGET('https://example.com/missing'),
    (error) => {
      assert.ok(error instanceof HttpError);
      assert.equal(error.status, 404);
      assert.equal(error.statusText, 'Not Found');
      assert.equal(error.url, 'https://example.com/missing');
      assert.deepEqual(error.body, { message: 'Missing resource' });
      return true;
    },
  );
});