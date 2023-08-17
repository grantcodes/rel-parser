import { defaultRels } from './default-rels'

const basicHtml = `
  <html>
      <head>
      ${Object.keys(defaultRels).map((key) =>
        defaultRels[key].map(
          (value) => `<link rel="${key}" href="${value}" />`
        )
      )}
      </head>
      <body>
          <p>Hello world</p>
      </body>
  </html>
`

export { basicHtml }
