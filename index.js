const express = require("express");
const mysql = require('mysql');


// Set your app credentials
const credentials = {
  apiKey: '4b70baaac52b643ce672febd698d82118a52ebe2ac75d7799a935aba64d2fb68',
  username: 'Bloomrydes'
}
const AfricasTalking = require('africastalking')(credentials);

const voice = AfricasTalking.VOICE;

const app = express();
const bodyparser = require("body-parser");

const port = process.env.PORT || 3200;

// middleware

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: false
}));

var connection = mysql.createPool({
  host: "bloomrydes1.mysql.database.azure.com",
    user: "bloomrydes@bloomrydes1", 
    password:"%M#{rav#i)gs", 
    database:"bloomrydes", 
    port: 3306,
});

//connection.connect();

app.post("/voice/token", async (req, res) => {

  var user = req.body.phone;


  var options = {
    // Set your Africa's Talking phone number in international format
    callFrom: '+23417006114',
    // Set the numbers you want to call to in a comma-separated list
    callTo: `${user}`
  }

  await voice.call(options)
    .then((response) => {

      var phone = response.entries[0].phoneNumber
      let query = "SELECT * FROM `tokens` WHERE phone = '" + phone + "'" + "ORDER BY ID DESC LIMIT 1 ";
      connection.query(query, (err, result) => {
        if (err) return res.status(500).send(err);
        var text = `Your Bloom ride token is ${result[0]['token']},Thank you`;
        res.set('Content-Type', 'application/xml');
        res.send(
          `
              
              <?xml version="1.0" encoding="UTF-8"?>
                   <Response>
                     <Say voice="man" playBeep="false">'${text}'</Say>
                     <Say voice="man" playBeep="false">'${text}'</Say>
                     <Reject/>
                   </Response>
                `
        );
      });
      
    })
    .catch(console.log);
     
});
 

app.listen(port, () => {
  console.log(`running at port ${port}`);
});