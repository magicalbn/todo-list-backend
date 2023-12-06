const express = require("express");
const { body, validationResult } = require("express-validator");

const todoController = require("../controllers/todo-controller");

let router = express.Router();

router.post(
    "/create",
    body("title").isString().trim().notEmpty(),
    body("description").exists(),
    todoController.createTodo
);

router.delete(
    "/delete",
    body("id").isString().notEmpty(),
    todoController.deleteTodo
);

router.get("/list", todoController.getToDos);

router.use("*", (req, res) => {
    res.json({
        message: "invalid path",
    });
});

module.exports = router;
