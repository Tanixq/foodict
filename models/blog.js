const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
    name: String,
    description: String,
    img: String
});

module.exports = mongoose.model("Blog", blogSchema);