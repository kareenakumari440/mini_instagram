const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static("images"));

const client = new MongoClient("mongodb://localhost:27017");
let db;

client.connect().then(()=>{
 db = client.db("socialApp");
 console.log("MongoDB connected");
});

app.get("/requests", async (req,res)=>{
 const data = await db.collection("friendRequests").find().toArray();
 res.json(data);
});

app.post("/requests/accept/:id", async (req,res)=>{
 const id = req.params.id;

 await db.collection("friendRequests").updateOne(
   {_id:new ObjectId(id)},
   {$set:{status:"accepted"}}
 );

 res.json({success:true});
});

app.post("/requests/reject/:id", async (req,res)=>{
 const id = req.params.id;

 await db.collection("friendRequests").updateOne(
   {_id:new ObjectId(id)},
   {$set:{status:"rejected"}}
 );

 res.json({success:true});
});

app.listen(3000,()=>console.log("Server running on 3000"));