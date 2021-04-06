const express=require('express')
const cors=require('cors')
const bodyParser = require('body-parser');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kar2i.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useUnifiedTopology: true }, { useNewUrlParser: true }, { connectTimeoutMS: 30000 }, { keepAlive: 1 });
const port =5000;

const app = express()
app.use(express.json())
app.use(cors())


client.connect(err => {
    const database = client.db("EmaJohn").collection("EmaJohnProduct");
    const cartDatabase=client.db("EmaJohn").collection("EmaJohnCart");
    // perform actions on the collection object
    app.post("/addProduct",(req,res)=>{
        const product=req.body;
        database.insertOne(product)
        .then(result=>{
            res.send(result.insertedCount)
        })
        .catch(error=>{
            console.log(error)
        })
    })
    app.get("/products",(req,res)=>{
        database.find({}).toArray((err,result)=>{
            res.send(result)
        })
    })
    app.get("/product/:key",(req,res)=>{
        database.find({key:req.params.key}).toArray((err,result)=>{
            res.send(result[0])
        })
    })
    app.post("/cartProduct",(req,res)=>{
        const keys=req.body
        database.find({ key: { $in: keys } }).toArray((error,result)=>{
            // res.send(result)
            res.send(result)
        })

    })
    app.post("/addCart",(req,res)=>{
        cartDatabase.insertOne(req.body)
        .then(result=>res.send(result.insertedCount>0))
    })
});

app.get("/",(req,res)=>{
    res.send("Hello Ema Watson")
})



app.listen(process.env.PORT||port)