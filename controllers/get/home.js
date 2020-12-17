const { find } = require("../../models/user");

const Product = require(__dirname+"../model/product")
module.exports = (req, res, next) => {
    Product.find({}, (err, result) => {
      if (err) {
        console.log(err);
        res.redirect("/");
      }else{
        res.render("home", {products: result});
        console.log(products);
      }
    })
  }