const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./model');

const app = express();
app.use(cors({ origin: "*" }));

mongoose.connect('mongodb+srv://avinash:avinash1234@cluster.mrlbbrw.mongodb.net/')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


app.get('/', (req, res) => {
  res.send('Hello, World!...');
});

app.get("/getusers", (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ message: err.message }));
});

app.delete("/deleteuser/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json({ message: "User deleted successfully" }))
    .catch(err => res.status(500).json({ message: err.message }));
});

app.put("/updateuser/:id", (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body)
    .then(user => res.json(user))
    .catch(err => res.status(500).json({ message: err.message }));
});

app.get("/getuser/:id", (req, res) => {
  User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(500).json({ message: err.message }));
});

app.post('/adduser', bodyParser.json(), (req, res) => {
  const { name, email, password } = req.body;
  const newUser = new User({ name, email, password });

  newUser.save()
    .then(user => res.json(user))
    .catch(err => res.status(500).json({ message: err.message }));
});



app.listen(5000, () => {
  console.log('Server is running on port 5000');    
});


