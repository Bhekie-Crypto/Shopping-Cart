if (process.env.NODE_ENV !== "production") {
    require ("dotenv").config();
}

const stripePublicKey = process.env.STRIPE_PUBLIC_KEY
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = require("stripe")(stripeSecretKey)

const PORT = 5025;
const express = require("express");
const mysql = require("mysql");
const cors =require("cors");
const Db = require("./db");
const pagesRouter = require("./routes/pages");
const http = require("http");
const orderService = require("./orderService")

const path = require("path");
const { response } = require("express");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//routers
app.use("/", require("./routes/pages"));
app.use("/complete", require("./routes/pages"));

app.get('/checkout', require("./routes/pages"));

app.use("/createOrder", require("./routes/pages"));


app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.static(path.join(__dirname + "/views")));



app.use((req, res, next) => {
    var err = new Error('Page not found.');
    err.status = 404;
    next(err);
});

app.use((err, req,res,next) => {
    res.status(err.status || 500);
    res.send(err.message);
});



app.get("/list", function(request, response) {
    const data = orderService.getOrders();
    data.then(order => response.json(order));
})



app.listen(PORT, () => {
    console.log("Server running on port "+ PORT);
});