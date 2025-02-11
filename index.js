import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { JSONFilePreset } from 'lowdb/node';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';
import sendEmail from './controller/sendEmail.js';

dotenv.config();

// Initialize database
const defaultData = { messages: [] };
const db = await JSONFilePreset('db.json', defaultData);

const app = express();
const port = process.env.PORT || 3000;

let passCode = process.env.PASSCODE || "sumit";

app.use(bodyParser.json());

// Resolve __dirname
const __dirname = path.dirname(decodeURIComponent(new URL(import.meta.url).pathname)).replace(/^\/([a-zA-Z]:)/, '$1');

// Serve static files
app.use(express.static(path.join(__dirname, 'web')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

app.get('/verify', (req, res) => {
  const { pass } = req.query;
  if (pass === passCode) {
    res.json({ message: "success" });
  } else {
    res.json({ message: "failed" });
  }
});

app.get('/table', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'table.html'));
});

app.get('/tabledata', (req, res) => {
  try {
    const token = req.header('authToken');

    console.log(token)

    if (atob(token) !== passCode) { return res.json({ message: "failed", status: "failed" }); }
    const { messages } = db.data;
    res.json({ message: messages, status: "success" });
  } catch (error) {
    console.error(error);
    res.json({ message: "failed", status: "failed" });
  }
});


app.post('/contact', async (req, res) => {
  const { fullname, email, message } = req.body;
  if (fullname && email && message) {
    try {

      const id = nanoid();
      db.data.messages.push({ id, fullname, email, message, timestamp: Date.now() });
      db.write();

      res.json({ message: "success", status: "success" });
      await sendEmail(fullname, email, message)
      // console.log("saved successfully ")

    } catch (error) {
      console.log("error " + error)
    }
  } else {
    res.json({ message: "failed", status: "failed" });
  }
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

