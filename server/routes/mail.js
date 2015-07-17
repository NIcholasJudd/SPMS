/**
 * Created by nicholasjudd on 16/07/15.
 */
var promise = require('promise'),
    //db = require('../models/database'),
    nodemailer = require("nodemailer");
var transporter = {
    email : function () {
        console.log("TEST");
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: "spmsfounders@gmail.com",
                pass: "SPMSspms"
            }
        });
        var mailOptions = {
            from: "spmsfounders@gmail.com",
            to: "nicholas_o_judd@hotmail.com",
            subject: "Hey dude",
            text: "Hope this works",
            html: "<b>Node.js New world for me</b>"
        };
        transporter.sendMail(mailOptions, function (error, responseStatus) {
            console.log("TEST");
            if (!error) {
                console.log(responseStatus.message); // response from the server
                console.log(responseStatus.messageId); // Message-ID value used
                return responseStatus.messageId;
            } else {
                return error;
            }
        });
    }
};
module.exports = transporter;