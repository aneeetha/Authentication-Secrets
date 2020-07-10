//jshint esversion:6
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err) {
        if (err) {
            res.send(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res) {
    User.findOne({ email: req.body.username }, function(err, foundUser) {
        if (err) {
            res.send(err);
        } else {
            if (foundUser) {
                if (foundUser.password === req.body.password) {
                    res.render("secrets");
                } else {
                    console.log("Wrong password!");
                }
            } else {
                console.log("No such user");
            }
        }
    });
});

app.listen(3000, function() {
    console.log("Listening on port 3000");
});