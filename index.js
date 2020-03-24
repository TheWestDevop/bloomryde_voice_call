const express = require("express");
var res_xml = require('object-to-xml');
const mysql      = require('mysql');

// Set your app credentials
const credentials = {
    apiKey: '4b70baaac52b643ce672febd698d82118a52ebe2ac75d7799a935aba64d2fb68',
    username: 'Bloomrydes'
}
const AfricasTalking = require('africastalking')(credentials);
const db = "bloomrydes";
const connection = mysql.createPool({
    host: "bloomrydes1.mysql.database.azure.com",
    user: "bloomrydes@bloomrydes1", 
    password:"%M#{rav#i)gs", 
    database:db, 
    port: 3306, 
 });

const voice = AfricasTalking.VOICE;

const app = express();

const port = process.env.PORT || 3200;



app.get("/voice", (req, res) => {
   let query = "SELECT * FROM `tokens` WHERE phone = +2349021235354 ORDER BY ID DESC LIMIT 1 ";
        connection.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.set('Content-Type', 'text/xml');
               res.send(res_xml({
                   '?xml version="1.0" encoding="utf-8"?' : null,
                   Response:{Say:"Hello Bloomryder voice user " + result[0]['token']}
               }));
            // res.status(200).json({
            //   message: 
            // });
        });
  });

app.post("/voice/token", (req, res) => {
    const user = req.body;
    var statement;

    var options = {
      // Set your Africa's Talking phone number in international format
      callFrom: '+23417006114',
      // Set the numbers you want to call to in a comma-separated list
      callTo: [user.phone]
    }
        let query = "SELECT * FROM `tokens` WHERE phone = '" + user.phone + "'"+"ORDER BY ID DESC LIMIT 1 ";
          connection.query(query, (err, result) => {
              if (err) return res.status(500).send(err);
              statement = "Hello From Bloomrydes Your token is "+result[0]['token']+" Thank you";
              voice.call(options)
             .then(console.log)
                 .catch(console.log);

               // var response  = '<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="man" playBeep="false">'+text+'</Say></Response>';
               res.set('Content-Type', 'text/xml');
               res.send(res_xml({
                   '?xml version="1.0" encoding="utf-8"?' : null,
                   Response:{Say:statement}
               }));
           });
  
  });

app.listen(port, () => {
  console.log(`running at port ${port}`);
});

