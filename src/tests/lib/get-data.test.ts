import assert from 'node:assert/strict'
import test, { mock } from 'node:test'
import { getData } from '../../lib/get-data'
import { basicHtml } from '../data'

test('get html & headers from url', async () => {
  mock.method(global, 'fetch', () => ({
    text: () => basicHtml,
    status: 200,
    headers: new Headers({
      example: 'Example header'
    })
  }))

  const res = await getData('https://example.com')
  assert.deepEqual(res, {
    html: basicHtml,
    headers: new Headers({ example: 'Example header' }),
    baseUrl: 'https://example.com'
  })
  mock.reset()
})

test('handle error getting html', async () => {
  mock.method(global, 'fetch', () => {
    throw new TypeError('Mock error in fetch')
  })
  await assert.rejects(async () => await getData('https://example.com'), {
    name: 'TypeError',
    message: 'Mock error in fetch'
  })
  mock.reset()
})
