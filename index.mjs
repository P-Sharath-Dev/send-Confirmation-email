import http from "http";
import fs from "fs";
import EventEmitter from "events";
import nodemailer from "nodemailer";

class CustomEvent extends EventEmitter{
    mailSent(email){
        this.emit('mailSent',email);
    }
}
const customEvent = new CustomEvent();

const server = http.createServer((req, res)=>{
    let transporter = nodemailer.createTransport({
        service : 'gmail',
        auth : {
            user: "codingninjas2k16@gmail.com",
            pass: "slwvvlczduktvhdj",
        },
    });

    if(req.method === "POST"){
        let data = '';

        req.on('data',(dataChunk)=>{
            data += dataChunk;
        });

        req.on('end',()=>{
            const {name, email, message} = JSON.parse(data);
            const queryString = `Name : ${name} \nEmail : ${email} \nMessage : ${message}`;

            //append query in query.txt
            fs.appendFileSync('query.txt', queryString);

            //reading data in query.txt
            const userData = fs.readFileSync('query.txt', {encoding : 'utf8'});
            console.log(`userName : ${name} \nQuery : ${message}`);

            //nodemailer mailOptions
            const mailOptions = {
                from: "codingninjas2k16@gmail.com",
                to: email,
                subject: "Query received",
                text: "We have received your query and will get back to you soon.",
            }

            //nodemailer to send confirmation mail
            transporter.sendMail(mailOptions,(error)=>{
                if(error){
                    console.log(error);
                }
            });

            //emit mailSent
            customEvent.emit('mailSent',email);
            res.end("query received");

        });
    } else {
        res.end('send your query');
    }
});


const solution = ()=>{
    customEvent.addListener('mailSent',(email)=>{
        console.log("custom event 'mailSent' emmited");
        console.log(`confirming that the email has been sent successfully to ${email}`);
    });
};

export default server;
export {server, CustomEvent, solution};