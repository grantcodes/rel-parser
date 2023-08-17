const getRelsFromHtml = (html: string, baseUrl: string): relParserResponse => {
  const rels = {}

  const doc = new DOMParser().parseFromString(html, 'text/html')

  const baseEl = doc.querySelector('base[href]')
  const relEls = doc.querySelectorAll('[rel][href]')

  // Take a base element into account
  if ((baseEl != null) && doc.baseURI) {
    const value = doc.baseURI
    const urlObj = new URL(value, baseUrl)
    baseUrl = urlObj.toString()
  }

  if (relEls.length) {
    for (const relEl of relEls) {
      const names = relEl
        ?.getAttribute('rel')
        ?.toLowerCase()
        ?.split(/(\s+)/)
        ?.filter((key) => key.trim()) ?? []
      const value = relEl.getAttribute('href')

      if ((names.length > 0) && value !== null) {
        for (const name of names) {
          if (!rels[name]) {
            rels[name] = []
          }
          const url = new URL(value, baseUrl).toString()
          if (rels[name].indexOf(url) === -1) {
            rels[name].push(url)
          }
        }
      }
    }
  }

  return rels
}

export { getRelsFromHtml }
