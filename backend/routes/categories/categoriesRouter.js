const express = require("express");
const {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} = require("../../controllers/categories/categoriesCtrl");
const isLogin = require("../../middlewares/isLogin");

const categoriesRouter = express.Router();

//create
categoriesRouter.post("/", isLogin, createCategory);
//?all
categoriesRouter.get("/", getCategories);
// ! delete
categoriesRouter.delete("/:id", isLogin, deleteCategory);
// * Update
categoriesRouter.put("/:id", isLogin, updateCategory);

module.exports = categoriesRouter;
