const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");

const app = express();
let items = ["Make PR for GSSOC", "Complete Gcloud Challange", "Have to parepare for HackWithInfy"];
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    let today = new Date();
    let options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    let day = today.toLocaleDateString("hi-IN", options);

    res.render("lists", {
        kindOfDay: day,
        newListItems: items
    });

});

app.post("/", function (req, res) {
    let item = req.body.newItem;
    items.push(item);
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
}
);

