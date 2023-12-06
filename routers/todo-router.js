const express = require("express");

const todoController = require("../controllers/todo-controller");

let router = express.Router();

router.post("/create", todoController.create);

router.use("*", (req, res) => {
    res.json({
        message: "invalid path",
    });
});

module.exports = router;
