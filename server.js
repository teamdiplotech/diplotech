require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');
const emailjs = require('@emailjs/nodejs');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const emailJsUserId = process.env.EMAILJS_USER_ID;
const emailJsPrivateId = process.env.EMAILJS_PRIVATE_ID;
const emailJsServiceId = process.env.EMAILJS_SERVICE_ID;
const emailJsTemplateId = process.env.EMAILJS_TEMPLATE_ID;
const number = process.env.NUMBER;

const client = new twilio(accountSid, authToken);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post('/send-whatsapp', (req, res) => {
  const { to, body } = req.body;
  client.messages.create({
    body: body,
    to: number,
    from: process.env.TWILIO_PHONE_NUMBER
  })
  .then(message => res.status(200).send({ success: true, messageSid: message.sid }))
  .catch(error => res.status(500).send({ success: false, error: error.message }));
});

app.post('/send-email', (req, res) => {
    const { to_name, to_mail } = req.body;
  
    const templateParams = {
        to_name: to_name,
        to_mail: to_mail
      };

      emailjs
      .send(emailJsServiceId, emailJsTemplateId, templateParams, {
        publicKey: emailJsUserId,
        privateKey: emailJsPrivateId,
      })
      .then(response => {
        console.log('Correo electrónico enviado:', response);
        res.status(200).send({ success: true, status: response.status, text: response.text });
      })
      .catch(error => {
        console.error('Error al enviar correo electrónico:', error);
        res.status(500).send({ success: false, error: error.message });
      });
  });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});