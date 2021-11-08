const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ryo5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {

        await client.connect();
        const database = client.db('doctors-portal');
        const appointmentCollection = database.collection('appointments');
        const usersCollection = database.collection('users');


        //for appointments post
        app.post('/appointments', async (req, res) => {
            const appointment = req.body;
            const result = await appointmentCollection.insertOne(appointment);

            res.json(result)
        })

        //for appointments get
        app.get('/appointments', async (req, res) => {
            const email = req.query.email;
            const date = req.query.date;

            const query = { email: email, data: date }
            console.log(query)
            const cursor = appointmentCollection.find(query);
            const appointments = await cursor.toArray();
            res.json(appointments);
        })

        //for users post
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
            console.log(result);
        })
 //for users put
 app.put('/users', async (req, res) => {
     
 })


    } finally {
        //await client.close();
    }

}

run().catch(console.error);

app.get('/', (req, res) => {
    res.send('Hello Doctors portal')
})

app.listen(port, () => {
    console.log(`listening port: ${port}`)
})