const express = require("express");
const connect = require('axios');


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


app.post("/voice/token", async (req, res) => {

  var user = req.body.phone;
  var data = {
    "phone": user
  }
  var options = {
    // Set your Africa's Talking phone number in international format
    callFrom: '+23417006114',
    // Set the numbers you want to call to in a comma-separated list
    callTo: `${user}`
  }

  await axios.post('https://bloomrydes.azurewebsites.net/public/api/get-token', data)
    .then(function (response) {
      // handle success
      if (response.body.token) {
        await voice.call(options)
          .then(console.log)
          .catch(console.log);

        var text = `Your Bloom ride token is ${response.body.token},Thank you`;

        res.set('Content-Type', 'application/xml');
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
         <Response>
           <Say voice="man" playBeep="false">'${text}'</Say>
           <Say voice="man" playBeep="false">'${text}'</Say>
           <Reject/>
         </Response>
      `);
      } else {

      }

      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })






});
// voice.call(options)
//      .then(console.log)
//          .catch(console.log);

//       var text  = `Hello Your Bloomrides  token is ${result[0]['token']},Thank you`;

//        res.set('Content-Type', 'application/xml');
//        res.send(
//          `<?xml version="1.0" encoding="UTF-8"?>
//           <Response>
//             <Say voice="man" playBeep="false">'${text}'</Say>
//             <Say voice="man" playBeep="false">'${text}'</Say>
//             <Say voice="man" playBeep="false">'${text}'</Say>
//           </Response>
//        `);




app.listen(port, () => {
  console.log(`running at port ${port}`);
});