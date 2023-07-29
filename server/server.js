const express = require("express");
require("dotenv").config();
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

let transport = nodemailer.createTransport({
  service: "Gmail",
  port: 587,
  secure: true,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.post("/send-resume-email", async (req, res) => {
  const mailOptions = {
    from: req.body.studentEmail,
    to: req.body.businessEmail,
    subject: "New Resume Submission for: " + req.body.roleTitle + "!",
    text: `Student Email: ${req.body.studentEmail}
    Student Phone Number: ${req.body.phoneNumber}
    Student Resume: Attached Below `,
    attachments: [
      {
        filename: "resume.pdf",
        path: req.body.resume,
      },
    ],
  };
  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent: " + info.response);
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
