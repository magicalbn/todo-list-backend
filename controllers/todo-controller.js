const TodoSchema = require("../models/todo-list-model");
const { validationResult } = require("express-validator");

const createTodo = async (req, res) => {
    try {
        const validationErros = validationResult(req);
        if (!validationErros.isEmpty()) {
            return res.status(400).send({ error: validationErros.array() });
        }
        const { title, description } = req.body;

        await TodoSchema.create({ title, description });
        res.json({
            result: "success",
            data: "resource created",
        });
    } catch (e) {
        console.log("error", e);
        res.status(501).send(e?.message);
    }
};

const getToDos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const totalTodos = await TodoSchema.countDocuments();
        const totalPages = Math.ceil(totalTodos / limit);

        const data = await TodoSchema.find()
            .select("-__v")
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });

        res.json({
            result: "success",
            pagination: {
                page: page,
                limit: limit,
                total: totalTodos,
                pages: totalPages,
            },
            data: data,
        });
    } catch (e) {
        console.log("error", e);
        res.status(501).send(e?.message);
    }
};

const deleteTodo = async (req, res) => {
    try {
        const validationErros = validationResult(req);
        if (!validationErros.isEmpty()) {
            return res.status(400).send({ error: validationErros.array() });
        }
        const { id } = req.body;

        const data = await TodoSchema.findByIdAndDelete(id);

        if (data) {
            res.json({
                result: "success",
                data: "resource deleted",
            });
        } else {
            res.status(404).json({
                result: "error",
                data: "resource not found",
            });
        }
    } catch (e) {
        console.log("error", e);
        res.status(501).send(e?.message);
    }
};

exports.getToDos = getToDos;
exports.createTodo = createTodo;
exports.deleteTodo = deleteTodo;
