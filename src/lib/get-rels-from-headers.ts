// @ts-expect-error No types for li.
import li from 'li'
import type { relParserResponse } from '../types'

const getRelsFromHeaders = (headers: any, baseUrl: string): relParserResponse => {
  const rels: relParserResponse = {}
  if ((headers?.link as boolean || headers?.Link as boolean)) {
    const passedHeaders: string = headers.link ?? headers.Link ?? ''
    const links = li.parse(passedHeaders)
    for (const key in links) {
      let value = links[key]
      if (!Array.isArray(value)) {
        value = [value]
      }
      // Make possible relative urls absolute based on the url requested
      value = value.map((link: string) => new URL(link, baseUrl).toString())
      rels[key] = value
    }
  }
  return rels
}

export { getRelsFromHeaders }
