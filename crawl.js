const {JSDOM} = require('jsdom');

async function crawlPage(baseURL, currentURL, pages)
{
    
    const baseURLObject = new URL(baseURL)
    const currentURLObject = new URL(currentURL)
    if(baseURLObject.hostname !== currentURLObject.hostname)
    {
        return pages
    }
    const normalizedCurrentURL = normalizeURL(currentURL)
    if(pages[normalizedCurrentURL] > 0)
    {
        pages[normalizedCurrentURL]++
        return pages
    }
    pages[normalizedCurrentURL]=1
    console.log(`actively crawling ${currentURL}`)
    try {
        const response = await fetch(currentURL)
        if(response.status > 399)
        {
            console.log(`Error in fetch with status code : ${response.status} on page ${currentURL}`)
            return pages
        }
        const contentType = response.headers.get("content-type")
        if(!contentType.includes("text/html"))
        {
            console.log(`Non html response content-type: ${contentType} on page ${currentURL}`)
            return pages
        }
        const htmlBody = await response.text()
        const nextURLs = getURLsFromHTML(htmlBody, baseURL)
        for(const nextURL of nextURLs)
        {
            pages = await crawlPage(baseURL, nextURL, pages)
        }
    } catch (error) {
        console.log(`Error in fetch ${error.message} on page ${currentURL}`)
    }
    return pages
    
}

function getURLsFromHTML(htmlBody, baseURL)
{
    const urls = []
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a')
    for(const links of linkElements)
    {
        if(links.href[0] === '/')
        {
            try {
                const urlObj = new URL(`${baseURL}${links.href}`)
                urls.push(urlObj.href)
            } catch (error) {
                console.log("Invalid relative URL");
            }
        }
        else
        {
            try {
                const urlObj = new URL(links.href)
                urls.push(urlObj.href)
            } catch (error) {
                console.log("Invalid absolute URL");
            }
        }
    }
    return urls
}

function normalizeURL(urlString)
{
    const urlObject = new URL(urlString);
    const hostPath = `${urlObject.hostname}${urlObject.pathname}`
    if(hostPath.length > 0 && hostPath.slice(-1) === '/')
    {
        return hostPath.slice(0, -1)
    }
    return hostPath
}
module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}