const express = require("express");
const mongooseConnectDB = require("./config/mongoose.config");

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
mongooseConnectDB();

//routes
const todoRoutes = require("./routers/todo-router");
app.use("/todo", todoRoutes);

app.use("*", (req, res) => {
    res.json({
        message: "routes available at /todo",
    });
});

app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Listening on PORT ${port} => http://localhost:${port}`);
});
