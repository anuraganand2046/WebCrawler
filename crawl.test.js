const {normalizeURL, getURLsFromHTML} = require('./crawl.js');
const {test, expect} = require('@jest/globals');

test('normailzeUrl strip protocol', ()=>{
    const input = 'https://blog.boot.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected);
})

test('normailzeUrl strip slash', ()=>{
    const input = 'https://blog.boot.dev/path/';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected);
})

test('normailzeUrl capitals', ()=>{
    const input = 'https://BLOG.boot.dev/path';
    const actual = normalizeURL(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected);
})

test('getURLsFromHTML absolute', ()=>{
    const inputHtmlBody = `
        <html>
        <body>
            <a href = "https://blog.boot.dev/path/">
                Boot.dev Blog
            </a>
        </body>
        </html>
    `
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHtmlBody, inputBaseURL);
    const expected = ["https://blog.boot.dev/path/"];
    expect(actual).toEqual(expected);
})

test('getURLsFromHTML relative', ()=>{
    const inputHtmlBody = `
        <html>
        <body>
            <a href = "/path/">
                Boot.dev Blog
            </a>
        </body>
        </html>
    `
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHtmlBody, inputBaseURL);
    const expected = ["https://blog.boot.dev/path/"];
    expect(actual).toEqual(expected);
})

test('getURLsFromHTML both', ()=>{
    const inputHtmlBody = `
        <html>
        <body>
            <a href = "https://blog.boot.dev/path1/">
                Boot.dev Blog 1
            </a>
            <a href = "/path2/">
                Boot.dev Blog 2
            </a>
        </body>
        </html>
    `
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHtmlBody, inputBaseURL);
    const expected = ["https://blog.boot.dev/path1/", "https://blog.boot.dev/path2/"];
    expect(actual).toEqual(expected);
})

test('getURLsFromHTML invalid', ()=>{
    const inputHtmlBody = `
        <html>
        <body>
            <a href = "invalid">
                Boot.dev Blog 2
            </a>
        </body>
        </html>
    `
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHtmlBody, inputBaseURL);
    const expected = [];
    expect(actual).toEqual(expected);
})