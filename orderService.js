//Helper fuction to get the data we need, from database
const { query } = require("express");
const db = require("./db");
async function getOrders (offset)
{
    const limit = 10;
    if(!offset){
        offset=0;
    }

    const dbInstance = db.getDbInstance();
    const connection = dbInstance.getConnection();

    const query = "SELECT * FROM equipments";

    const response = await new Promise((resolve, reject) => {
        connection.query(query, function(error, result) {
            if(error) reject(error);
            resolve(result);
        });
    });
 return response;
}


module.exports = { getOrders };