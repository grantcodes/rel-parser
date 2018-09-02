const li = require("li");
const axios = require("axios");

/**
 * Fetches the given url and gets rel links from the html and headers.
 *
 * @param {string} providedUrl The url to scrape
 * @param {string} providedHtml Optional html string if you have already requested the url
 * @param {object} providedHeaders Optional object with the response headers. If it includes a `link` or `Link` property it will be parsed.
 * @returns {Promise} Promise that resolves with an object with all the found rels. Rel keys are lower case and values are always an array
 */
const relScraper = (providedUrl, providedHtml = null, providedHeaders = null) =>
  new Promise((resolve, reject) => {
    // Assign some variables
    let rels = {};
    let baseUrl = providedUrl;
    let doc = null;
    const isNode = typeof module !== "undefined" && module.exports;

    // Load node dependencies
    if (isNode) {
      const { DOMParser } = require("jsdom/lib/jsdom/living");
      const { URL } = require("url");
      global.DOMParser = DOMParser;
      global.URL = URL;
    }

    // Function to get the html if it is not provided
    const getData = () =>
      providedHtml || providedHeaders
        ? Promise.resolve({ html: providedHtml, headers: providedHeaders })
        : new Promise((resolveHtml, rejectHtml) => {
            axios({ url: baseUrl, method: "get", responseType: "text" })
              .then(res => {
                if (
                  res.request &&
                  res.request.res &&
                  res.request.res.responseUrl
                ) {
                  providedUrl = res.request.res.responseUrl;
                  baseUrl = res.request.res.responseUrl;
                }
                resolveHtml({ html: res.data, headers: res.headers });
              })
              .catch(err => {
                console.log("Error fetching url", err);
                rejectHtml(err);
              });
          });

    // Start by getting the html
    getData()
      .then(({ html, headers }) => {
        // Parse the page first
        if (html) {
          doc = new DOMParser().parseFromString(html, "text/html");

          const baseEl = doc.querySelector("base[href]");
          const relEls = doc.querySelectorAll("[rel][href]");

          // Take a base element into account
          if (baseEl) {
            const value = baseEl.getAttribute("href");
            const urlObj = new URL(value, baseUrl);
            baseUrl = urlObj.toString();
          }

          if (relEls.length) {
            relEls.forEach(relEl => {
              const names = relEl
                .getAttribute("rel")
                .toLowerCase()
                .split(/(\s+)/)
                .filter(key => key.trim());
              const value = relEl.getAttribute("href");
              if (names.length && value !== null) {
                names.forEach(name => {
                  if (!rels[name]) {
                    rels[name] = [];
                  }
                  const url = new URL(value, baseUrl).toString();
                  if (rels[name].indexOf(url) === -1) {
                    rels[name].push(url);
                  }
                });
              }
            });
          }
        }

        // If there are headers they should overwrite the html rels
        if (headers && (headers.link || headers.Link)) {
          const links = li.parse(headers.link || headers.Link);
          for (const key in links) {
            if (links.hasOwnProperty(key)) {
              let value = links[key];
              if (!Array.isArray(value)) {
                value = [value];
              }
              // Make possible relative urls absolute based on the url requested
              value = value.map(link => new URL(link, providedUrl).toString());
              rels[key] = value;
            }
          }
        }

        resolve(rels);
      })
      .catch(err => {
        reject(err);
      });
  });

module.exports = relScraper;
