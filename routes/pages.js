const express = require("express");
const db = require("../connection");
const router = express.Router();
const orderService = require("../orderService")
var token = process.env.STRIPE_PUBLIC_KEY;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripe = require("stripe")(stripeSecretKey)

router.use(express.urlencoded({ extended: false }));

//middleware
router.use(express.json());


//Get index page
router.get('/', (req, res) => {
    res.render("client")
});
router.get('/complete', (req, res) => {
    res.render("complete")
});
router.get('/checkout', (req, res) => {

    res.render("checkout", {
        stripePublicKey : token
    })
});

router.get("/list", function(request, response) {
    const data = orderService.getOrders();
    data.then(order => response.json(order));
})

router.post("/createOrder", (request, response) => {
    try {
    var reqBody = request.body;
    const created_at = new Date();
    const updated_at = new Date();

    const {name} = reqBody;
    const {surname} = reqBody;
    const {email} = reqBody;
    const {contact} = reqBody;
    const {deliver} = reqBody;
    const {latitude} = reqBody;
    const {longitude}= reqBody;
    const {items} = reqBody;
    const {subtotal} = reqBody;
    const {tax} = reqBody;
    const {total} = reqBody;
    const {totals} = reqBody;
    const {stripeTokenId} = reqBody;
    const {itemesId} = reqBody;

    stripe.charges.create({
        amount: total,
        source: request.body.stripeTokenId,
        currency: "usd"
    }).then(function(){
        console.log("Charge Successful")
        // response.json({massege: "Successfully purchased items"})
    }).catch(function(error){
        console.log(error, "Charge fail")
        response.status(500).end()
    })
    const sql =`INSERT INTO orders  (customer_name, customer_surname, 
        customer_email,phone_number, delivery, address_latitude, address_longitude,
        total_items, subtotal_price, taxtotal_price, total_price, stripe_token, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
     db.query(sql, [name, surname, email, 
                contact, deliver, latitude, 
                longitude, items, subtotal, 
                tax, totals, stripeTokenId, 
                created_at, updated_at], 
                (err, result) => {
        if(err) throw err;
        response.redirect("complete");
        
    });
    } catch (error) {
     console.log(error)   
    }
});

module.exports = router;