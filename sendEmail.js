"use strict"


// const mailPort = "2525"
// document.getElementById("sendEmail").addEventListener("click", sendEmail())
//  const inputForm = document.getElementById("result_form");
//  inputForm.addEventListener("submit", sendEmail())

function sendEmail() {
    const sendForm = document.getElementById("result_form");

    const mailHost = "smtp.gmail.com"
    const mailUser = "advicesmtp@gmail.com"
    const mailPW = "B887B3C89A5DC6C810F1FF68D65C12C624D8"
    const mailTo = sendForm.email.value
    const mailFrom = "advicesmtp@gmail.com"
    const mailSubject = "Carbon results"
    const mailMessage = sendForm.message.value
    const mailLink = "Link to result: " + sendForm.generatedlink.value
    const mailBody = mailMessage + mailLink
    console.log("mail form activated")
    Email.send({
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