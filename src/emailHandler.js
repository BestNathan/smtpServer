const cheerio = require('cheerio')
const axios = require('axios')

const getBindUrl = message => {
    let $ = cheerio.load(message)
    let ele = $('.mmsgLetterContent')
        .children('div')
        .toArray()[0]

    ele = $(ele)
        .children('p')
        .toArray()[2]

    return $(ele)
        .find('a')
        .attr('href')
}

const handleBind = message => {
    let url = getBindUrl(message)
    return axios.get(url)
}

module.exports = {
    handleBind
}
