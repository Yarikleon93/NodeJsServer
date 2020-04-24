import { promises as fs } from "fs";
import { join } from "path";

export class Collection {
  constructor(data) {
    this.data = join(process.cwd(), "data", data);
  }

  readData() {
    return fs.readFile(this.data, "utf-8")
        .then((fileData) => JSON.parse(fileData));
  }

  list() {
    return this.readData();
  }

  getOneHw(id) {
    return this.readData()
        .then(fileData => fileData.find(item => item.id === id));
  }
  deleteOneHw(id) {
    return this.readData()
        .then(fileData => JSON.stringify(fileData.filter(item => item.id != id)))
        .then(NewFileData => fs.writeFile(this.data, NewFileData));
  }
}
