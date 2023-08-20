import { defaultRels } from './default-rels'

const links = Object.entries(defaultRels)
  .map(
    ([key, values]: [string, string[]]) =>
      values.map((value: string) => `<link rel="${key}" href="${value}" />`).join('\n')
  )

const basicHtml = `
  <html>
      <head>
        ${links.join('\n')}
      </head>
      <body>
          <p>Hello world</p>
      </body>
  </html>
`

export { basicHtml }
