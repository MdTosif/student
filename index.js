const express = require('express');
const { addStudent, userRegToday, studentAbove15 } = require('./models/student');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/student', async (req, res, next) => {
  try {
    const student = req.body;
    const result = await addStudent(student);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

app.get('/aggregrate1', async (req, res, next) => {
  try {
    const result = await userRegToday();
    res.json(result);
  } catch (e) {
    next(e);
  }
});

app.get('/aggregrate2', async (req, res, next) => {
  try {
    const result = await studentAbove15();
    res.jsonp(result);
  } catch (e) {
    next(e);
  }
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log(err);
  res.status(400).json({ error: err.message });
});

app.listen(3000);
