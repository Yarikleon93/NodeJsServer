// const http = require('http');
// const fs = require('fs');
import * as http from "http";
import * as fs from "fs";
import { Collection } from "./collection.js";

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function requestHandler(req, res) {
  let lessons = [];
  let oneLesson;

  if (req.url === "/homeworks" || req.url === "/homeworks/") {
    collection.list()
        .then((lessons) => {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
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

      Array.prototype.forEach.call(lessons, (lesson) => {
        res.write(`<tr><td>${lesson.number}</td><td><a href="/homeworks/${lesson.id}">${lesson.title}</a></td><td><button name = '${lesson.id}' onclick = buttonClick()>X</button></td></tr>`);
      });

      res.write(`</table>
                    </body>
                </html>`);
      res.end();
    });
    return;
  }

  if (req.url.startsWith("/homeworks/") && req.method == "DELETE") {
    const id = req.url.slice(11);
    collection.deleteOneHw(id)
      .then(item => {
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          console.log('OK');
          res.statusCode = 200;
          res.end();
      })
    return;
  }

  if (req.url.startsWith("/homeworks/") && req.method == "GET") {
    const id = req.url.slice(11);
    collection.getOneHw(id)
      .then(item => {
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          res.write(JSON.stringify(item));
          res.end();
      })
    return;
  }
}

const collection = new Collection("homeworks.json");
const server = http.createServer(requestHandler);
const PORT = process.env.PORT || 5000;
server.listen(PORT);
