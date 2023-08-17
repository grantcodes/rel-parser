import { basicHtml } from './basic-html'

const baseElHtml = basicHtml.replace(
  '</head>',
  '<base href="https://example2.com" /></head>'
)

export { baseElHtml }
