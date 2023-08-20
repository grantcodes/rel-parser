import test from 'ava'
import { mock } from 'node:test'
import { relParser } from '../../lib/rel-parser'
import { absoluteBaseElRels, absoluteDefaultRels, baseElHtml, basicHtml, brokenHtml, headersObject, headersString } from '../data'

test('requires input', async (t) => {
  await t.throwsAsync(async () => await relParser(''), {
    instanceOf: TypeError,
    message: 'Must provide URL as first parameter'
  })
})

test('basic html', async (t) => {
  const res = await relParser('https://example.com', basicHtml)
  t.deepEqual(res, absoluteDefaultRels)
})

test('html with base element', async (t) => {
  const res = await relParser('https://example.com', baseElHtml)
  t.deepEqual(res, absoluteBaseElRels)
})

test('works with broken html', async (t) => {
  const res = await relParser('https://example.com', brokenHtml)
  t.deepEqual(res, absoluteDefaultRels)
})

test('headers no html', async (t) => {
  const res = await relParser('https://example.com', '', { link: headersString })
  t.deepEqual(res, headersObject)
})

test('html request basic', async (t) => {
  mock.method(global, 'fetch', () => ({
    text: () => basicHtml,
    status: 200,
    headers: new Headers()
  }))
  const res = await relParser('https://example.com')
  t.deepEqual(res, absoluteDefaultRels)
  mock.reset()
})

test('html request error', async (t) => {
  mock.method(global, 'fetch', () => {
    throw new TypeError('Mock error in fetch')
  })
  await t.throwsAsync(async () => await relParser('https://example.com'), {
    instanceOf: TypeError,
    message: 'Mock error in fetch'
  })
  mock.reset()
})
