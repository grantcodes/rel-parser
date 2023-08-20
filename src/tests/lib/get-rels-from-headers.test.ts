import test from 'ava'
import { getRelsFromHeaders, parseLinkHeaderString } from '../../lib/get-rels-from-headers'
import { headersObject, headersString } from '../data'

test('parse link header string', async (t) => {
  const res = parseLinkHeaderString(headersString, 'https://example.com')
  t.deepEqual(res, headersObject)
})

test('parse bad link header string', async (t) => {
  const res = parseLinkHeaderString('bad string', 'https://example.com')
  t.deepEqual(res, {})
})

test('empty headers', async (t) => {
  const res = await getRelsFromHeaders({}, 'https://example.com')
  t.deepEqual(res, {})
})

test('lowercase link', async (t) => {
  const res = await getRelsFromHeaders({ link: headersString }, 'https://example.com')
  t.deepEqual(res, headersObject)
})

test('titlecase link', async (t) => {
  const res = await getRelsFromHeaders({ Link: headersString }, 'https://example.com')
  t.deepEqual(res, headersObject)
})
