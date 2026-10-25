import assert from 'node:assert/strict'
import test, { mock } from 'node:test'
import { relParser } from '../../lib/rel-parser'
import {
  absoluteBaseElRels,
  absoluteDefaultRels,
  baseElHtml,
  basicHtml,
  brokenHtml,
  headersObject,
  headersString
} from '../data'

test('requires input', async () => {
  await assert.rejects(async () => await relParser(''), {
    name: 'TypeError',
    message: 'Must provide URL as first parameter'
  })
})

test('basic html', async () => {
  const res = await relParser('https://example.com', basicHtml)
  assert.deepEqual(res, absoluteDefaultRels)
})

test('html with base element', async () => {
  const res = await relParser('https://example.com', baseElHtml)
  assert.deepEqual(res, absoluteBaseElRels)
})

test('works with broken html', async () => {
  const res = await relParser('https://example.com', brokenHtml)
  assert.deepEqual(res, absoluteDefaultRels)
})

test('headers no html', async () => {
  const res = await relParser('https://example.com', '', { link: headersString })
  assert.deepEqual(res, headersObject)
})

test('html request basic', async () => {
  mock.method(global, 'fetch', () => ({
    text: () => basicHtml,
    status: 200,
    headers: new Headers()
  }))
  const res = await relParser('https://example.com')
  assert.deepEqual(res, absoluteDefaultRels)
  mock.reset()
})

test('html request error', async () => {
  mock.method(global, 'fetch', () => {
    throw new TypeError('Mock error in fetch')
  })
  await assert.rejects(async () => await relParser('https://example.com'), {
    name: 'TypeError',
    message: 'Mock error in fetch'
  })
  mock.reset()
})
