import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';
import { default as express } from 'express';
import { default as sqlite3 } from 'sqlite3';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const port = 8080;
const root = path.join(__dirname, 'public');
const template = path.join(__dirname, 'templates');

let app = express();
app.use(express.static(root));
const db = new sqlite3.Database("./births.sqlite3", sqlite3.OPEN_READONLY, (err) => {
  if (err){
    console.log("Error connecting to datebase");
  }else{
    console.log("Successfully conneted to database");
  }
})

app.get("/birth_day", (req,res) =>{
    let sql = "SELECT day_of_week AS day, SUM(births) AS total ";
    sql += "FROM births_table GROUP BY day_of_week ORDER BY day_of_week";
    db.all(sql,[],(err,rows) => {
        if(err){
          res.status(500).type('txt').send("SQL error");
        }else{
          res.status(200).type("json").send(rows);
        }
    });
})
app.get("/page3", (req,res) =>{
      fs.readFile(path.join(template, "page3.html"), {encoding: "utf8"}, (err,data) => {
        if(err){
          res.status(500).type('txt').send("Template error");
        }else{
          res.status(200).type("html").send(data);
        }
      })
});
app.listen(port, () => {
    console.log('Now listening on port ' + port);
});
