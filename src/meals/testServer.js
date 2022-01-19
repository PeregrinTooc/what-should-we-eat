const http = require('http')
const fs = require('fs')
const { Buffer } = require('buffer');


const host = 'localhost'
const port = 8000

const testFile = fs.readFileSync('src/meals/resources/meals.test.json')

const requestListener = function (req, res) {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200)
    let responsePayload = { content: Buffer.from(testFile).toString('base64') }
    res.end(JSON.stringify(responsePayload))
}

const server = http.createServer(requestListener)
const start = function () {
    server.listen(port, host, () => { })
}

async function stop() { await server.close() }

module.exports = { start, stop }

