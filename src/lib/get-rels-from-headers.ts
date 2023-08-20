import type { relParserProvidedHeadersStrings, relParserResponse } from '../types'

const parseLinkHeaderString = (linkHeaderString: string, baseUrl: string): relParserResponse => {
  const res: relParserResponse = {}

  const parts = linkHeaderString.split(',')

  const regex = /<(.*)>; rel="(.*)"/

  for (const part of parts) {
    const match = part.match(regex)
    if (match !== null && match.length === 3) {
      // Make possible relative urls absolute based on the url requested
      const url = new URL(match[1], baseUrl).toString()
      const rel = match[2]

      if (typeof res[rel] === 'undefined') {
        res[rel] = []
      }

      res[rel].push(url)
    }
  }

  return res
}

const getRelsFromHeaders = (headers: relParserProvidedHeadersStrings, baseUrl: string): relParserResponse => {
  const headerKeys = Object.keys(headers)

  if (headerKeys.includes('link') || headerKeys.includes('Link')) {
    const passedHeaders: string = headers.link ?? headers.Link ?? ''
    return parseLinkHeaderString(passedHeaders, baseUrl)
  }

  return {}
}

export { parseLinkHeaderString, getRelsFromHeaders }
