import { promises as fs } from "fs";
import { join } from "path";

export class Collection {
  constructor(data) {
    this.data = join(process.cwd(), "data", data);
  }

  async readData() {
    const fileData = await fs.readFile(this.data, "utf-8");
    return JSON.parse(fileData);
  }

  list() {
    return this.readData();
  }

  async getOneHw(id) {
    const fileData = await this.readData();
    return fileData.find(item => item.id === id);
  }
  async deleteOneHw(id) {
    const fileData = await this.readData();
    const NewFileData = JSON.stringify(fileData.filter(item => item.id != id))
    return await fs.writeFile(this.data, NewFileData);
  }
  async updateOne(id, newBody) {
    const fileData = await this.readData();
    const updateBody = fileData.map((homework) => (homework.id === id) ? newBody : homework);
    return await fs.writeFile(this.data, JSON.stringify(updateBody));
  }
  async insertOne(addBody) {
    const fileData = await this.readData();
    addBody.id = Math.random().toString(16).slice(-12) + Math.random().toString(16).slice(-12);
    fileData.push(addBody);
    return await fs.writeFile(this.data, JSON.stringify(fileData));
  }
}
