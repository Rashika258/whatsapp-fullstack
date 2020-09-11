 //importing
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors'


//app config
const app = express();
const port = process.env.PORT || 9000

//config for real time functionality
const pusher = new Pusher({
    appId: '1069998',
    key: 'f4d2b6d4728b5e1a1696',
    secret: '7d4a0ee22665105956e5',
    cluster: 'ap2',
    encrypted: true
  });
  


//middleware
app.use(express.json());
app.use(cors())

// app.use((req,res,next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Headers", "*");
//     next();
// })

//DB config
const connection_url = 'mongodb+srv://admin:BlTa82PEUcY5kzkM@cluster0.cmbsj.mongodb.net/whatsappDB?retryWrites=true&w=majority'
mongoose.connect(connection_url,{
    useCreateIndex: true,
    useNewUrlParser:true,
    useUnifiedTopology:true
})


const db = mongoose.connection;

db.once("open", () => {
    console.log("DB connected")

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    //when something change happens
    changeStream.on('change', (change) =>{
        console.log("change")

        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages' , 'inserted', {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received
                }
            );
        } else {
            console.log("Error triggering pusher")
        }
    })
})

//api routes
app.get('/' , (req, res) => res.status(200).send ("hello world"))

app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})


app.post('/messages/new', (req, res) => {
    const dbMessage = req.body


    Messages.create(dbMessage, (err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

//listen
app.listen(port, ()=> console.log(`Listening on localhost: ${port}`))