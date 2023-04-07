const { crawlPage } = require("./crawl")
const { printReport } = require("./report")

async function main()
{
    if(process.argv.length < 3)
    {
        console.log("No website provided")
        process.exit(1)
    }
    else if(process.argv.length > 3)
    {
        //remove this condition to allow more than one website
        console.log("Too many websites provided")
        process.exit(1)
    }
    const baseURL = process.argv[2]
    const pages = await crawlPage(baseURL, baseURL, {})
    printReport(pages)
}

main()