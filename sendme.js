"use strict"

const mailHost = "smtp.elasticemail.com"
const mailUser = "mort108v@stud.kea.dk"
const mailPW = "B887B3C89A5DC6C810F1FF68D65C12C624D8"
const mailTo = document.getElementById("email").value
const mailFrom = "carboncalc@advice.dk"
const mailSubject = "Carbon results"
const mailMessage = document.getElementById("message").value
const mailLink = "Link to result: " + document.getElementById("generatedlink").value
const mailBody = mailMessage + mailLink
const mailPort = "2525"

export function sendEmail() {
    console.log("mail form activated")
    Email.send({
            Port: mailPort,
            Host: mailHost,
            Username: mailUser,
            Password: mailPW,
            To: mailTo,
            From: mailFrom,
            Subject: mailSubject,
            Body: mailBody,
        })
        .then(function(message) {
            alert("mail sent successfully")
        });
}