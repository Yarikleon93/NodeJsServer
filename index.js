const http = require('http');

/**
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function requestHandler(req, res) {
    res.statusCode = 200;
    res.write(`My first server : ${req.url}`);
    res.end();

}

const server = http.createServer(requestHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT);