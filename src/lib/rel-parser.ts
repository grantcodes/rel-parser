import { getData } from './get-data'
import { getRelsFromHtml } from './get-rels-from-html'
import { getRelsFromHeaders } from './get-rels-from-headers'
import type { relParserProvidedHeadersStrings, relParserResponse } from '../types'

/**
 * Fetches the given url and gets rel links from the html and headers.
 *
 * @param {string} providedUrl The url to scrape
 * @param {string} providedHtml Optional html string if you have already requested the url
 * @param {object} providedHeaders Optional object with the response headers. If it includes a `link` or `Link` property it will be parsed.
 * @returns {Promise} Promise that resolves with an object with all the found rels. Rel keys are lower case and values are always an array
 * @throws {TypeError} If error with the provided url or fetch request.
 */
const relParser = async (
  providedUrl: string,
  providedHtml?: string,
  providedHeaders?: relParserProvidedHeadersStrings
): Promise<relParserResponse> => {
  if (providedUrl === '') {
    throw new TypeError('Must provide URL as first parameter')
  }

  // Assign some variables
  let rels = {}
  let html = providedHtml
  let headers = providedHeaders
  let baseUrl = providedUrl

  // Function to get the html if it is not provided
  if (typeof html === 'undefined' || typeof html === 'undefined') {
    const data = await getData(providedUrl)
    html = data.html
    headers = Object.fromEntries(data.headers) // Convert headers to object
    baseUrl = data.baseUrl
  }

  // Parse the page first
  if (typeof html !== 'undefined') {
    rels = { ...rels, ...getRelsFromHtml(html, baseUrl) }
  }

  // Parse the headers
  if (typeof headers !== 'undefined') {
    rels = { ...rels, ...getRelsFromHeaders(headers, providedUrl) }
  }

  return rels
}

export { relParser }
