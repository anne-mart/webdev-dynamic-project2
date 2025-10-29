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


app.get('/years', (req, res) => {
  const sql = `SELECT DISTINCT CAST(year AS INTEGER) AS year
    FROM births_table ORDER BY year ASC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).send('SQL error');
    }
    res.status(200).json(rows.map(row => row.year));
  });
});

// dont think i need this but keeping just in case
// births per month / homePage.html
// app.get('/birth_months', (req, res) => {
//   const sql = `SELECT month, SUM(CAST(births AS INTEGER)) AS total_births
//     FROM births_table GROUP BY month ORDER BY CAST(month AS INTEGER) ASC`; // sorting in ascending order

//   db.all(sql,[],(err, rows) => {
//     if (err) {
//       return res.status(500).send('SQL error');
//     }
//     res.status(200).json(rows);
//   });
// });

app.get('/year/:year', (req, res) => {
  //fs.readFile(path.join(template,'homepage.html'),'utf8', (err, template) => {
  fs.readFile(path.join(template, 'homePage.html'), {encoding: 'utf8'}, (err, template) => {
    if (err) {
      return res.status(500).type('txt').send("Template error -- cannot load homePage.html");
    }
    let sql = `SELECT month, SUM(CAST(births AS INTEGER)) AS total_births
      FROM births_table WHERE year == ? GROUP BY month ORDER BY CAST(month AS INTEGER) ASC`;

    db.all(sql,[req.params.year],(err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).type('txt').send("SQL error");
      }
      let monthListHTML = '<ul>';
      rows.forEach(row => {
        monthListHTML += `<li>${row.month}: ${row.total_births} births</li>`;
      });
      monthListHTML += '</ul>';
      const htmlResponse1 = template.replace('$$$YEAR$$$', req.params.year);
      const htmlResponse = htmlResponse1.replace('$$$MONTH_BIRTHS_LIST$$$', monthListHTML);
      res.status(200).type('html').send(htmlResponse);
    });
  });
});

app.get('/data/year/:year', (req, res) => {
  const sql = `SELECT month, SUM(CAST(births AS INTEGER)) AS total_births
    FROM births_table WHERE year == ? GROUP BY month ORDER BY CAST(month AS INTEGER) ASC`;

  db.all(sql, [req.params.year], (err, rows) => {
    if (err) {
      return res.status(500).send('SQL error');
    }
    res.status(200).json(rows);
  });
});

app.get('/', (req, res) => {
  //fs.readFile(path.join(template,'homepage.html'),'utf8', (err, template) => {
  fs.readFile(path.join(template, 'homePage.html'), {encoding: 'utf8'}, (err, template) => {
    if (err) {
      return res.status(500).type('txt').send("Template error -- cannot load homePage.html");
    }
    let sql = `SELECT month, SUM(CAST(births AS INTEGER)) AS total_births
      FROM births_table WHERE year == 2000 GROUP BY month ORDER BY CAST(month AS INTEGER) ASC`;

    db.all(sql,[],(err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).type('txt').send("SQL error");
      }
      let monthListHTML = '<ul>';
      rows.forEach(row => {
        monthListHTML += `<li>${row.month}: ${row.total_births} births</li>`;
      });
      monthListHTML += '</ul>';
      const htmlResponse1 = template.replace('$$$YEAR$$$', "2000");
      const htmlResponse = htmlResponse1.replace('$$$MONTH_BIRTHS_LIST$$$', monthListHTML);
      res.status(200).type('html').send(htmlResponse);
    });
  });
});


//Births per year - ada
app.get('/page2', (req, res) => {
  res.redirect('/page2/2000');   
});

app.get('/page2/:year', (req, res) => {
  const y = Number(req.params.year);
  const sql = `SELECT SUM(CAST(births AS INTEGER)) AS total_births
               FROM births_table WHERE year = ?`;

  fs.readFile(path.join(template, 'page2.html'), 'utf8', (err, tpl) => {
    if (err) return res.status(500).type('txt').send('Template error -- cannot load page2.html');

    db.get(sql, [y], (e, row) => {
      if (e)   return res.status(500).type('txt').send('SQL error');
      if (!row || row.total_births == null)
        return res.status(404).type('txt').send(`No data for year ${y}.`);

      const html = tpl
        .replace(/\$\$\$YEAR\$\$\$/g, String(y))
        .replace('$$$BIRTHS_PER_YEAR_LIST$$$', '') 
        .replace('$$$TOTAL_BIRTHS$$$', Number(row.total_births).toLocaleString());

      res.status(200).type('html').send(html);
    });
  });
});
app.get('/birth_year/:year', (req, res) => {
  const y = Number(req.params.year);
  const sql = `SELECT SUM(CAST(births AS INTEGER)) AS total_births
               FROM births_table WHERE year = ?`;
  db.get(sql, [y], (err, row) => {
    if (err) return res.status(500).send('SQL error');
    if (!row || row.total_births == null) return res.status(404).send(`No data for year ${y}.`);
    res.json({ year: y, total_births: row.total_births });
  });
});

// page 3 -- Vincent
//the fetch
app.get("/birth_day/:year", (req,res) =>{
    let sql = "SELECT day_of_week AS day, SUM(births) AS total ";
    sql += "FROM births_table WHERE year == ? GROUP BY day_of_week ORDER BY day_of_week";
    db.all(sql,[req.params.year],(err,rows) => {
        if(err){
          console.log(err);
          res.status(500).type('txt').send("SQL error");
        }else{
          res.status(200).type("json").send(rows);
        }
    });
});
//page with certain years 
app.get("/page3/:year", (req,res) =>{
  let sql = "SELECT DISTINCT year FROM births_table ORDER BY year";
  db.all(sql,[],(err,rows) => {
    if(err){
      res.status(500).type('txt').send("SQL error");
    }else{
      fs.readFile(path.join(template, "page3.html"), {encoding: "utf8"}, (err,data) => {
        let currentYear = parseInt(req.params.year,10);
        let year_list = '';
        if(err){
          res.status(500).type('txt').send("Template error");
        }else{
          for ( let i = 0; i < rows.length; i ++){
            year_list += "<li>";
            let year_num = parseInt(rows[i].year,10);
            if (year_num != currentYear){
              year_list += '<a href="/page3/' + year_num + '">' + year_num + "</a>";
            }
            year_list += "</li>";
          }
          let htmlPage3 = data.replace("$$$YEAR$$$", req.params.year).replace("$$$YEAR_LIST$$$", year_list);
          res.status(200).type("html").send(htmlPage3);
        }
      })
    }
  })
});
//defualt page
app.get("/page3", (req,res) =>{
  res.redirect("/page3/2000");
});
app.listen(port, () => {
    console.log('Now listening on port ' + port);
});
