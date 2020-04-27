// const http = require('http');
// const fs = require('fs');
import * as http from "http";
import { promises as fs, readFileSync } from "fs";
import { Collection } from "./collection.js";
import { parse } from "querystring";

import Mustache from "mustache";

const templates = {
  list: readFileSync("./templates/list.html", "utf8"),
  homework: readFileSync("./templates/homework.html", "utf8"),
  css: readFileSync("./public/style.css", "utf8"),
  funcJs: readFileSync("./public/funcToEvent.js", "utf8"),
  addHw: readFileSync("./templates/addHw.html", "utf8"),
};

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
async function requestHandler(req, res) {
  let lessons = [];
  let oneLesson;

  if (req.url === "/homeworks" || req.url === "/homeworks/") {
    const lessons = await collection.list();
    res.writeHead(200);
    res.write(Mustache.render(templates.list, { rows: lessons }));
    res.end();
    return;
  }

  // if (req.url.startsWith("/homeworks") && req.method == "DELETE") {
  //   const id = req.url.slice(11);
  //   const item = await collection.deleteOneHw(id);
  //   res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  //   console.log("OK");
  //   res.statusCode = 200;
  //   res.end();
  //   return;
  // }

  // if (req.url.startsWith("/homeworks") && req.method == "GET") {
  //   const id = req.url.slice(11);
  //   const item = await collection.getOneHw(id);
  //   res.writeHead(200);
  //   res.write(Mustache.render(templates.homework, item));
  //   res.end();
  //   return;
  // }

  if (req.url.startsWith("/homeworks")) {
    const id = req.url.slice(11);
    if (req.method == "DELETE") {
      const item = await collection.deleteOneHw(id);
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      console.log("OK");
      res.statusCode = 200;
      res.end();
    }
    if (req.url === "/homeworks/new" && req.method === "POST") {
      let body = "";
          req.on("data", (data) => {
            body = body + data.toString("utf8");
          });
          req.on("end", async () => {
            const updateData = parse(body);
            await collection.insertOne(updateData);
            res.writeHead(302, { Location: "/homeworks" });
            res.end();
          });
      res.writeHead(302, { Location: "/homeworks" });
      res.end();
    }
    if (req.url === "/homeworks/new" && req.method === "GET") {
      res.writeHead(200);
      res.write(Mustache.render(templates.addHw));
      res.end();
    }
     else {
      const item = await collection.getOneHw(id);
      switch (req.method) {
        case "GET":
          res.writeHead(200);
          res.write(Mustache.render(templates.homework, item));
          res.end();
          break;
        case "POST":
          let body = "";
          req.on("data", (data) => {
            body = body + data.toString("utf8");
          });
          req.on("end", async () => {
            const updateData = parse(body);
            const updateBody = Object.assign({}, item, updateData);
            await collection.updateOne(item.id, updateBody);
            res.writeHead(302, { Location: "/homeworks" });
            res.end();
          });
          break;
        default:
      }
    }
    return;
  }

  if (req.url === "/style.css" && req.method === "GET") {
    res.writeHead(200);
    res.write(templates.css);
    res.end();
  }
  if (req.url === "/funcToEvent.js" && req.method === "GET") {
    res.writeHead(200);
    res.write(templates.funcJs);
    res.end();
  }
}

const collection = new Collection("homeworks.json");
const server = http.createServer(requestHandler);
const PORT = process.env.PORT || 5000;
server.listen(PORT);
