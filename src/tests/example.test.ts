import test from 'ava'

import { relParser } from '../main'
import { absoluteBaseElRels, absoluteDefaultRels, baseElHtml, basicHtml, brokenHtml, defaultRels } from './data'

test('requires input', async (t) => {
  t.throws(async () => await relParser())
})

test('basic html', async (t) => {
  const res = await relParser('https://example.com', basicHtml)
  t.is(res, absoluteDefaultRels)
})

test('html with base element', async (t) => {
  const res = await relParser('https://example.com', baseElHtml)
  t.is(res, absoluteBaseElRels)
})

test('works with broken html', async (t) => {
  const res = await relParser('https://example.com', brokenHtml)
  t.is(res, absoluteDefaultRels)
})

test('html request basic', async (t) => {
  axios.mockResolvedValue({ status: 200, data: basicHtml })
  const res = await relParser('https://example.com')
  t.is(res, absoluteDefaultRels)
})

test('html request error', async (t) => {
  axios.mockRejectedValue({ status: 500, data: basicHtml })
  t.throws(async () => await relParser('https://example.com'))
})
