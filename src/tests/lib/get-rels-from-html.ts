import test from 'ava'
import { getRelsFromHtml } from '../../lib/get-rels-from-html'
import { absoluteBaseElRels, absoluteDefaultRels, baseElHtml, basicHtml, brokenHtml } from '../data'

test('basic html', async (t) => {
  const res = await getRelsFromHtml(basicHtml, 'https://example.com')
  t.deepEqual(res, absoluteDefaultRels)
})

test('html with base element', async (t) => {
  const res = await getRelsFromHtml(baseElHtml, 'https://example.com')
  t.deepEqual(res, absoluteBaseElRels)
})

test('works with broken html', async (t) => {
  const res = await getRelsFromHtml(brokenHtml, 'https://example.com')
  t.deepEqual(res, absoluteDefaultRels)
})
