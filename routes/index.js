var express = require('express');
var router = express.Router();
var multiparty = require('connect-multiparty');
var middleWare = multiparty();
var path = require('path');
var fs = require('fs');
var mongojs = require('mongojs');
var db=mongojs("localhost/mongoDb");
var nodemailer = require('nodemailer');



var userDetails={};
var newPath;

//creating a smtp transpoter
/*
nodemailer.SMTP = {
    host: 'smtp.gmail.com',
    port:587,
    use_authentication: true,
    user: '14m21a0519@lords.ac.in',
    pass: '18523.Sp'
};
*/


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');

});

//recieving file
router.post('/uploadResume', middleWare, function(req, res){
    var file = req.files.file;
    console.log(req.files.file.type); // form files
    var ext = file.type.split('/')[1];
    if(ext == "vnd.openxmlformats-officedocument.wordprocessingml.document" || ext == "msword"){
        ext = "docx";
    }
    newPath='uploads/'+userDetails.firstName+userDetails.lastName+userDetails.phoneNumber+'.'+ext;
    // Read the file
    changeFileDir(file.path,newPath,ext);
    emailFile(newPath, ext);
    res.status(204).send('File Emailed');
});

//get userdtails as a json
router.post('/registerDetails',function (req, res, next) {
   console.log(req.body);
   userDetails = req.body;
   storeDetailsInDb(req.body);
   res.send("json recieved");
});





//for storing user Details to DB
function storeDetailsInDb(obj) {
    db.customers.update({phoneNumber:obj.phoneNumber}, {$set: { name : obj.firstName+" "+obj.lastName,email:obj.email,phoneNumber:obj.phoneNumber,currentCity:obj.currentCity,prefferdJobLocation:obj.jobLocation }}, {upsert: true}, function (err) {
        // the update is complete
        if(err) throw err
        console.log("inside update")
    })
}

//function for renaming the file
function changeFileDir(oldPath,newPath,ext) {
    fs.readFile(oldPath,function (err,data) {
        if(err) throw err
        fs.writeFile(newPath,data,function (err) {
            if(err) throw err
        })
    });
    fs.unlink(oldPath,function (err) {
        if(err) throw err;
    })
}

//function for handling email forwarding

function emailFile(filepath, ext){

// Generate SMTP service account from ethereal.email


    // Create a SMTP transporter object
    var transporter = nodemailer.createTransport({
        service:'Zoho',
        host: this.service,
        port:587,
        secure: false,
        auth: {
            user: "support@jobseffect.in",
            pass: "18523.Sp"
        }
    });

    // Message object
    var message = {
        from: 'Parvez <support@jobseffect.in>',
        to: 'resume@jobseffect.in',
        subject: 'New Client '+userDetails.firstName+" "+userDetails.lastName,
        text: "Name : \t\t\t\t"+userDetails.firstName+" "+userDetails.lastName+",\n\nPhone Number : \t\t"+userDetails.phoneNumber+",\n\nEmail : \t\t\t\t"+
        userDetails.email+",\n\nCurrent City : \t\t\t"+userDetails.currentCity+",\n\n\nPreffered Job Location : \t"+userDetails.jobLocation,

        attachments:[

            {path:filepath}
        ]



    };

    transporter.sendMail(message,function(err, info) {
        if (err) {
            console.log('Error occurred. ' + err.message);
            return process.exit(1);
        }

        console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
});

}


module.exports = router;