const express = require("express");
const mysql = require("mysql");

let instance = null;

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "rootr00t",
    database: "jsmysql",
});

db.connect((error) => {
    if(error) {
        throw(error);
    }
   
});

class Db {
    static getDbInstance() {
        return instance ? instance: new Db();
    }
    getConnection() {
        return db;
    }

    async insertOrder(name, surname, email, contact, deliver, latitude, longitude, items, subtotal, tax, totals, stripeTokenId ) {
        console.log(name, surname, email, contact, deliver, latitude)
        try {
        
        const created_at = new Date();
        const updated_at = new Date();
            const insertId = await new Promise((resolve, reject) => {
            const query = `INSERT INTO orders  (customer_name, customer_surname, 
                customer_email,phone_number, delivery, address_latitude, address_longitude,
                total_items, subtotal_price, taxtotal_price, total_price, stripe_token, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
            db.query(query, [name, surname, email, contact, deliver, latitude, longitude, items, subtotal, tax, totals, stripeTokenId, created_at, updated_at], (err, result) => {
            if(err) reject(new Error(err.message));
                resolve(result);
            })
        });
        console.log(insertId);
        // return response;
        } catch (error) {
            console.log(error);
        }

    }
}

module.exports = Db;