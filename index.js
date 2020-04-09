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
                    <head>
                        <script>
                            function buttonClick() {
                                let xhr = new XMLHttpRequest();
                                xhr.open('DELETE' , '/homeworks/' + event.toElement.name);
                                xhr.send();
                                xhr.onload = () => {
                                    if(xhr.status != 200) {
                                        alert('Ошибка ' + xhr.status + ' ' + xhr.statusText);
                                    }
                                    else {
                                        document.body.innerHTML = xhr.response;
                                        alert("Вы удалили елемент");
                                      }
                                }
                            }
                        </script>
                    </head>
                    <body>
                    <table border="1" width="100%" cellpadding="5"><th>number</th><th>title</th>`);

                    Array.prototype.forEach.call(lessons, (lesson => {
                res.write(`<tr><td>${lesson.number}</td><td><a href="/homeworks/${lesson.id}">${lesson.title}</a></td><td><button name = '${lesson.id}' onclick = buttonClick()>X</button></td></tr>`);
            }))
            
            res.write(`</table>
                    </body>
                </html>`);
            res.end();
        })
        return
    };
    
    if (req.url.startsWith('/homeworks/') && req.method == 'DELETE') {
        let newLessons;
        fs.readFile('./s20e01.json', (err, data) => {
            lessons = JSON.parse(data);
            newLessons = JSON.stringify(lessons.filter((item) => item._id != req.url.slice(11)));
            // res.write(a);
            fs.writeFile('s20e01.json', newLessons, (err) => {
                if (err) throw err;
                fs.readFile('./s20e01.json', (err, data) => {
                    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
                    lessons = JSON.parse(data);
                    res.write(`
                    <!doctype>
                        <html>
                            <head>
                                <script>
                                    function buttonClick() {
                                        let xhr = new XMLHttpRequest();
                                        xhr.open('DELETE' , '/homeworks/' + event.toElement.name);
                                        xhr.send();
                                        xhr.onload = () => {
                                            if(xhr.status != 200) {
                                                alert('Ошибка ' + xhr.status + ' ' + xhr.statusText);
                                            }
                                            else {
                                                document.body.innerHTML = xhr.response;
                                                alert("Вы удалили елемент");
                                              }
                                        }
                                    }
                                </script>
                            </head>
                            <body>
                            <table border="1" width="100%" cellpadding="5"><th>number</th><th>title</th>`);
        
                            Array.prototype.forEach.call(lessons, (lesson => {
                        res.write(`<tr><td>${lesson.number}</td><td><a href="/homeworks/${lesson.id}">${lesson.title}</a></td><td><button name = '${lesson.id}' onclick = buttonClick()>X</button></td></tr>`);
                    }))
                    
                    res.write(`</table>
                            </body>
                        </html>`);
                    res.end();
                })
              });
        });
        return
    }

    if (req.url.startsWith('/homeworks/') && req.method == 'GET') {
        
        fs.readFile('./s20e01.json', (err, data) => {
            res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
            lessons = JSON.parse(data);
            
            oneLesson = JSON.stringify(lessons.filter((item) => item._id == req.url.slice(11)));
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