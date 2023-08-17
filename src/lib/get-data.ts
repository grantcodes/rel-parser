import axios from 'axios'

interface relParserProvidedHeadersOption {
  [key: string]: string
}

interface GetOptionsResponse {
  html: string
  headers: relParserProvidedHeadersOption
  baseUrl: string
}

/**
 * Fetches the given url and gets rel links from the html and headers.
 */
const getData = async (url: string): Promise<GetOptionsResponse> => {
  const res = await axios({
    url,
    method: 'get',
    responseType: 'text',
    headers: {
      accept: 'text/html,application/xhtml+xml',
    },
  })

  return {
    html: res.data,
    headers: res.headers,
    baseUrl: res?.request?.res?.responseUrl ?? url,
  }
}

export { getData }
