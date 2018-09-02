# Rel Scraper

This is just a simple function to scrape relationships from a url. Both via link headers and html tags.

You can provide just a url or optionally add a html string or headers object to prevent making unneeded http requests.

## Usage

Running the rel scraper function returns a promise which will resolve with an object containing keys and arrays of values of found rels.

The returned object will look something like this:

```
{
  me: [
    'https://twitter.com/grantcodes',
    'https://facebook.com/grantcodes'
  ],
  micropub: ['https://grant.codes/micropub']
}
```

All keys will be lowercase and all urls will be absolute.

### Basic url

```
relScraper('https://grant.codes')
  .then(rels => {
    console.log('grant.codes rels', rels)
  })
  .catch(err => console.log('Rel scraper error', err));
```

### With html string

```
relScraper('https://grant.codes', '<a href="https://www.twitter.com/grantcodes/" rel="me">Twitter</a>')
  .then(rels => {
    console.log('Me', rels.me)
  })
  .catch(err => console.log('Rel scraper error', err));
```

### With http link header parsing

```
const headers = {
  link: '<https://grant.codes/micropub>; rel="micropub"'
};

relScraper('https://grant.codes', null, headers)
  .then(rels => {
    console.log('Micropub', rels.micropub)
  })
  .catch(err => console.log('Rel scraper error', err));
```
