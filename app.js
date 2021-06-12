const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/date.js");

const app = express();

//mongoose.connect("mongodb://localhost:27017/todoListDB", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

mongoose.connect("mongodb+srv://suchitra_13:Test123@cluster0.qqfg6.mongodb.net/todoListDB", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);

const food = new Item({
    name: "Make food"
});
const bath = new Item({
    name: "take bath"
});
const dance = new Item({
    name: "Dance"
});

const defaultItem = [food, bath, dance];

//create shecma for customeList page
const listSchema = {
    name: String,
    items: [itemSchema]
};

// customList model
const List = mongoose.model("List", listSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//get method
app.get("/", function (req, res) {

    // let day = date.getDate();

    Item.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItem, (err) => {
                if (err) {
                    console.log("error!");
                } else {
                    console.log("Successfully saved default items to DB!");
                }
            });
            res.redirect("/");
        }
        else {
            res.render("list", {
                ListTitle: "Today",
                newListItems: foundItems
            });
        }
    });

});

//get method for customList
app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);
    console.log(customListName);
    List.findOne({ name: customListName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItem
                });
                list.save();
                res.redirect("/" + customListName);
                console.log("List not found!");
            } else {
                console.log("List found!");
                res.render("list", { ListTitle: foundList.name, newListItems: foundList.items });
            }
        }
    });


});

app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, (err, foundList) => {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});

app.post("/delete", (req, res) => {

    const checkedItem = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItem, (err) => {
            if (err)
                console.log("error");
            else {
                console.log("Successfully deleted checked item!");
            }
        });
        res.redirect("/");
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItem } } }, (err, foundList) => {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }

});

app.listen(3000, function () {
    console.log("Server started on port 3000");
}
);
