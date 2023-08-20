import { parseDocument, DomUtils } from 'htmlparser2'
import type { relParserResponse } from '../types'

const getRelsFromHtml = (html: string, baseUrl: string): relParserResponse => {
  const rels: relParserResponse = {}

  const doc = parseDocument(html)

  const baseEl = DomUtils.findOne((el) => (el.name === 'base' && el?.attribs?.href !== null), doc.children)
  const relEls = DomUtils.findAll((el) => (el?.attribs?.href !== null && el?.attribs?.rel !== null), doc.children)

  // Take a base element into account
  if ((baseEl != null)) {
    const value = baseEl.attribs.href
    const urlObj = new URL(value, baseUrl)
    baseUrl = urlObj.toString()
  }

  if (relEls.length > 0) {
    for (const relEl of relEls) {
      const names = relEl.attribs.rel
        ?.toLowerCase()
        ?.split(/(\s+)/)
        ?.filter((key) => key.trim()) ?? []
      const value = relEl.attribs.href

      if ((names.length > 0) && typeof value !== 'undefined' && value !== null) {
        for (const name of names) {
          if (typeof rels[name] === 'undefined') {
            rels[name] = []
          }
          const url = new URL(value, baseUrl).toString()
          if (!rels[name].includes(url)) {
            rels[name].push(url)
          }
        }
      }
    }
  }

  return rels
}

export { getRelsFromHtml }
