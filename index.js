const server = require('./src/server')

server.listen(25, () => {
    console.log('smtp server is running at port 25...')
})
