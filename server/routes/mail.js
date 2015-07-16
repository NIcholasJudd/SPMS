/**
 * Created by nicholasjudd on 16/07/15.
 */
var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:"spmsfounders@gmail.com",
        pass: "SPMSspms"
    }
});
transporter.sendMail({
    from: "SPMS founders <spmsfounders@gmail.com",
    to: "nicholas_o_judd@hotmail.com",
    subject: "Test nodemailer email",
    text: "Node.js New world for me",
    html: "<b>Node.js New world for me</b>"
});




/*//Email support functions
var smtpTransport = mailer.createTransport("SMTP",{
    service: "GMAIL",
    auth: {
        user:"spmsfounders@gmail.com",
        pass: "SPMSspms"
    }
});

var mail = {
    from: "SPMS founders <spmsfounders@gmail.com",
    to: "nicholas_o_judd@hotmail.com",
    subject: "Test nodemailer email",
    text: "Node.js New world for me",
    html: "<b>Node.js New world for me</b>"
}

smtpTransport.sendMail(mail, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("message sent: " + response.message);
    }
    smtpTransport.close();
})*/