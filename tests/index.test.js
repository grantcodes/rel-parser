const axios = require("axios");
const relParser = require("../index");

jest.mock("axios");

const defaultRels = {
  absolutesingle: ["https://example.com"],
  absolutemultiple: [
    "https://example.com/1",
    "https://example.com/2",
    "https://example.com/3",
  ],
  relativesingle: ["/relative"],
  relativemultiple: ["/relative-1", "/relative-2", "/relative-3"],
};

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
`;

const baseElHtml = basicHtml.replace(
  "</head>",
  '<base href="https://example2.com" /></head>'
);

const brokenHtml = basicHtml.replace("</p>", "</div");

const absoluteDefaultRels = {
  absolutesingle: ["https://example.com/"],
  absolutemultiple: [
    "https://example.com/1",
    "https://example.com/2",
    "https://example.com/3",
  ],
  relativesingle: ["https://example.com/relative"],
  relativemultiple: [
    "https://example.com/relative-1",
    "https://example.com/relative-2",
    "https://example.com/relative-3",
  ],
};

const absoluteBaseElRels = {
  absolutesingle: ["https://example.com/"],
  absolutemultiple: [
    "https://example.com/1",
    "https://example.com/2",
    "https://example.com/3",
  ],
  relativesingle: ["https://example2.com/relative"],
  relativemultiple: [
    "https://example2.com/relative-1",
    "https://example2.com/relative-2",
    "https://example2.com/relative-3",
  ],
};

test("requires input", async () => {
  expect(async () => await relParser()).rejects.toEqual(
    "Must provide URL as first parameter"
  );
});

test("basic html", async () => {
  const res = await relParser("https://example.com", basicHtml);
  expect(res).toEqual(absoluteDefaultRels);
});

test("html with base element", async () => {
  const res = await relParser("https://example.com", baseElHtml);
  expect(res).toEqual(absoluteBaseElRels);
});

test("works with broken html", async () => {
  const res = await relParser("https://example.com", brokenHtml);
  expect(res).toEqual(absoluteDefaultRels);
});

test("html request basic", async () => {
  axios.mockResolvedValue({ status: 200, data: basicHtml });
  const res = await relParser("https://example.com");
  expect(res).toEqual(absoluteDefaultRels);
});

test("html request error", async () => {
  axios.mockRejectedValue({ status: 500, data: basicHtml });
  expect(async () => await relParser("https://example.com")).rejects.toThrow(
    "html request error"
  );
});
