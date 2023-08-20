interface GetOptionsResponse {
  html: string
  headers: Headers
  baseUrl: string
}

/**
 * Fetches the given url and gets rel links from the html and headers.
 */
const getData = async (url: string): Promise<GetOptionsResponse> => {
  const res = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      accept: 'text/html,application/xhtml+xml'
    }
  })

  const html = await res.text()

  return {
    html,
    headers: res.headers,
    baseUrl: res?.url ?? url
  }
}

export { getData }
