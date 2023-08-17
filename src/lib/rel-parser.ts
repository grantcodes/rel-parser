import { getData } from './get-data'
import { getRelsFromHtml } from './get-rels-from-html'
import { getRelsFromHeaders } from './get-rels-from-headers'

interface relParserProvidedHeadersOption {
  [key: string]: string
}

interface relParserResponse {
  [key: string]: string[]
}

/**
 * Fetches the given url and gets rel links from the html and headers.
 *
 * @param {string} providedUrl The url to scrape
 * @param {string} providedHtml Optional html string if you have already requested the url
 * @param {object} providedHeaders Optional object with the response headers. If it includes a `link` or `Link` property it will be parsed.
 * @returns {Promise} Promise that resolves with an object with all the found rels. Rel keys are lower case and values are always an array
 */
const relParser = async (
  providedUrl: string,
  providedHtml: string,
  providedHeaders: relParserProvidedHeadersOption
): Promise<relParserResponse> => {
  if (!providedUrl) {
    throw new Error('Must provide URL as first parameter')
  }

  // Assign some variables
  const rels = {}
  const isNode =
    typeof module !== 'undefined' &&
    module.exports &&
    process &&
    !process.browser

  // Load node dependencies
  if (isNode) {
    const { JSDOM } = require('jsdom')
    const DOMParser = new JSDOM().window.DOMParser
    const { URL } = require('url')
    global.DOMParser = DOMParser
    global.URL = URL
  }

  // Function to get the html if it is not provided
  let html = providedHtml
  let headers = providedHeaders
  let baseUrl = providedUrl

  if (!html || !headers) {
    try {
      const data = await getData(providedUrl)
      html = data.html
      headers = data.headers
      baseUrl = data.baseUrl
    } catch (err) {
      // Error getting the html
    }
  }

  // Parse the page first
  if (html) {
    rels = { ...rels, ...getRelsFromHtml(html, baseUrl) }
  }

  rels = { ...rels, ...getRelsFromHeaders(headers, providedUrl) }

  return rels
}

export { relParser }
