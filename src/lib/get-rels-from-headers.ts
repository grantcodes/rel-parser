import { parse } from 'li'

const getRelsFromHeaders = (headers: any, baseUrl: string): relParserResponse => {
  let rels: relParserResponse = {}
  if ((headers.link || headers.Link)) {
    const links = parse(headers.link || headers.Link)
    for (const key in links) {
      if (links.hasOwnProperty(key)) {
        let value = links[key]
        if (!Array.isArray(value)) {
          value = [value]
        }
        // Make possible relative urls absolute based on the url requested
        value = value.map((link) => new URL(link, baseUrl).toString())
        rels[key] = value
      }
    }
  }
  return rels
}

export { getRelsFromHeaders }