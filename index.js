const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'web')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/contact', (req,res)=>{
  console.log(req.body);

  res.send({"message":"success"});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});