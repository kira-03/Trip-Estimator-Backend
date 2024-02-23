const {db} =  require("../connection")
const fs = require('fs');
module.exports={
    test : async(req,res) =>{
        return res.status(200).send({"Message":"ok"})
    },
    registerData : async(req,res)=>{
        try {
            let db_connection = await db.promise().getConnection();
            
            let insertStatement = `INSERT INTO sample (name, age) VALUES `;
            let insertValues = [req.body.name, req.body.age];



            // Write the insert statement to a file
            fs.appendFile('insert_logs.txt', `${insertStatement} ( "${insertValues[0]}",${insertValues[1]});\n`, (err) => {
                if (err) {
                    console.error("Error writing to file:", err);
                }
            });


            await db_connection.query(`INSERT INTO sample (name, age) VALUES (?, ?)`, [req.body.name, req.body.age]);
            db_connection.release(); // Release the connection back to the pool
            return res.status(200).send({"Message": "Got your Message buddy"});
        } catch (error) {
            console.error("Error executing query:", error);
            return res.status(500).send("Internal Server Error");
        }
    },
    getRegisterData: async(req,res)=>{
        try {
            let db_connection = await db.promise().getConnection();
            let data = await db_connection.query('SELECT * FROM sample;');
            db_connection.release(); // Release the connection back to the pool
            console.log(data);
            return res.status(200).send(data[0]); // Assuming you want to send the rows
        } catch (error) {
            console.error("Error retrieving data from the database:", error);
            return res.status(500).send("Internal Server Error");
        }
    }
}