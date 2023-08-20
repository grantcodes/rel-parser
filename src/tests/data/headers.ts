import { relParserResponse } from '../../types'

const headersData = [
  {
    rel: 'micropub',
    url: 'https://example.com/micropub'
  },
  {
    rel: 'microsub',
    url: 'https://microsub.example.com/'
  },
  {
    rel: 'preconnect',
    url: 'https://example.com/pre1'
  },
  {
    rel: 'preconnect',
    url: 'https://example.com/pre2'
  },
  {
    rel: 'preconnect',
    url: 'https://example.com/pre3'
  }
]

const headersString = headersData.map((header) => `<${header.url}>; rel="${header.rel}"`).join(', ')

const headersObject: relParserResponse = {}
for (const header of headersData) {
  if (!Object.keys(headersObject).includes(header.rel)) {
    headersObject[header.rel] = []
  }
  headersObject[header.rel].push(header.url)
}

export {
  headersString,
  headersObject
}
