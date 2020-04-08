const http = require('http');
const fs = require('fs');

/**
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function requestHandler(req, res) {
    let lessons = [];
    let oneLesson;

    if (req.url === '/homeworks' || req.url === '/homeworks/'){
        fs.readFile('./s20e01.json', (err, data) => {
            res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
            lessons = JSON.parse(data);
            res.write(`
            <!doctype>
                <html>
                    <body>
                    <table>`);

            for (let i = 0; i < lessons.length; i++) {
                res.write(`<tr><td>${lessons[i].number}</td><td><a href="/homeworks/${lessons[i].id}">${lessons[i].title}</a></td></tr>`);
            }
            
            res.write(`</table>
                    </body>
                </html>`);
            res.end();
        })
        return
    };

    if (req.url.startsWith('/homeworks/')) {
        fs.readFile('./s20e01.json', (err, data) => {
            res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
            lesson = JSON.parse(data);
            
            oneLesson = JSON.stringify(lesson.filter((item) => item._id == req.url.slice(11)));
            // res.write(a);
            res.write(oneLesson)
            res.end();
        });
        return
    }
    // res.statusCode = 200;
    // res.write(`My first server : ${req.url}`);

}


const server = http.createServer(requestHandler);
const PORT = process.env.PORT || 5000;
server.listen(PORT);