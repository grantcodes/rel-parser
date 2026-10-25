import assert from 'node:assert/strict'
import test from 'node:test'
import { getRelsFromHtml } from '../../lib/get-rels-from-html'
import { absoluteBaseElRels, absoluteDefaultRels, baseElHtml, basicHtml, brokenHtml } from '../data'

test('basic html', async () => {
  const res = await getRelsFromHtml(basicHtml, 'https://example.com')
  assert.deepEqual(res, absoluteDefaultRels)
})

test('html with base element', async () => {
  const res = await getRelsFromHtml(baseElHtml, 'https://example.com')
  assert.deepEqual(res, absoluteBaseElRels)
})

test('works with broken html', async () => {
  const res = await getRelsFromHtml(brokenHtml, 'https://example.com')
  assert.deepEqual(res, absoluteDefaultRels)
})
