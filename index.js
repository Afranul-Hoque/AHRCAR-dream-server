const express = require('express')
const app = express()
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bldso.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });





async function run() {
    try {
        await client.connect();
        const database = client.db('AhrCar');
        const carsCollection = database.collection('cars');
        const reviewCollection = database.collection('reviews');
        const clientCollection = database.collection('clients');

        const userCollection = database.collection('users');

        console.log('database connected');



        app.post('/cars', async (req, res) => {
            const car = req.body;
            const result = await carsCollection.insertOne(car);
            res.json(result)
        })

        app.get('/cars', async (req, res) => {

            const cursor = carsCollection.find({});
            const cars = await cursor.toArray();
            res.send(cars);
        })



        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id;
            console.log('hit him', id);
            const query = { _id: ObjectId(id) };
            const service = await carsCollection.findOne(query);
            res.json(service);
        })


        // review collection

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        })

        app.get('/reviews', async (req, res) => {

            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })



        // client order information

        app.post('/clients', async (req, res) => {
            const client = req.body;
            const result = await clientCollection.insertOne(client);
            res.json(result);
        })


        app.get('/clients', async (req, res) => {

            const cursor = clientCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });


        app.get('/clients', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = clientCollection.find(query);
            const client = await cursor.toArray();
            res.json(client);
        })


        // user information
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            console.log(result);
            res.json(result);
        })



        // make admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } }
            const result = await userCollection.updateOne(filter, updateDoc);
            res.json(result)
        })


        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })


    } finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello world');
})
app.listen(port, () => {
    console.log('running server');
})
