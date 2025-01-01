const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const sqlite3 = require('sqlite3').verbose();

let passCode = process.env.PASSCODE || "sumit";


// make a database folder if it doesn't exist
if (!fs.existsSync('./database')) {
  fs.mkdirSync('./database');
}

// make a message.db file if it doesn't exist
if (!fs.existsSync('./database/message.db')) {
  fs.writeFileSync('./database/message.db', '');
}

// connect to the database
let db = new sqlite3.Database('./database/message.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error("failed to connect database");
    console.error(err.message);
  }
});

// Create table
sql = 'CREATE TABLE IF NOT EXISTS message(id INTEGER PRIMARY KEY AUTOINCREMENT, fullname TEXT, email TEXT, message TEXT, timestamp TEXT)';
db.run(sql, (err) => {
  if (err) {
    console.error("failed to create table");
    console.error(err.message);
  }
});

// drop table
// sql = 'DROP TABLE message';
// db.run(sql, (err) => {
//   if (err) {
//     console.error("failed to drop table");
//     console.error(err.message);
//   }
// });


// Insert data
const insertData = (fullname, email, message, timestamp) => {
  let sql = 'INSERT INTO message(fullname, email, message, timestamp) VALUES(?, ?, ?, ?)';
  db.run(sql, [fullname, email, message, timestamp], (err) => {
    if (err) {
      console.error("failed to insert data");
      console.error(err.message);
    }
  });
}

// getData()

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'web')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + 'index.html'));
});

app.get('/verify', (req, res) => {
let {pass} = req.query;
  if(pass === passCode){
    res.send({"message":"success"});
  }
  else{
    res.send({"message":"failed"});
  }
  
});

app.get('/table', (req, res) => {
  console.log("table hit")
  res.sendFile(path.join(__dirname, 'web', 'table.html'));
});

app.get('/tabledata', (req, res) => {
  let sql = 'SELECT * FROM message ORDER BY id DESC';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("failed to get data");
      console.error(err.message);
    }
    res.send(rows);
  });
})


app.post('/contact', (req,res)=>{
  console.log(req.body);
  let {fullname, email, message} = req.body;
  if(fullname && email && message){
    insertData(fullname, email, message, Date.now());
    res.send({"message":"success"});
  }else{
    res.send({"message":"failed"});
  }

})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});