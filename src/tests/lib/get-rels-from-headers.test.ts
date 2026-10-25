import assert from 'node:assert/strict'
import test from 'node:test'
import { getRelsFromHeaders, parseLinkHeaderString } from '../../lib/get-rels-from-headers'
import { headersObject, headersString } from '../data'

test('parse link header string', async () => {
  const res = parseLinkHeaderString(headersString, 'https://example.com')
  assert.deepEqual(res, headersObject)
})

test('parse bad link header string', async () => {
  const res = parseLinkHeaderString('bad string', 'https://example.com')
  assert.deepEqual(res, {})
})

test('empty headers', async () => {
  const res = await getRelsFromHeaders({}, 'https://example.com')
  assert.deepEqual(res, {})
})

test('lowercase link', async () => {
  const res = await getRelsFromHeaders({ link: headersString }, 'https://example.com')
  assert.deepEqual(res, headersObject)
})

test('titlecase link', async () => {
  const res = await getRelsFromHeaders({ Link: headersString }, 'https://example.com')
  assert.deepEqual(res, headersObject)
})
