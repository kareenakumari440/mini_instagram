require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static("images"));
app.use(express.static(__dirname));

const client = new MongoClient(process.env.atlas_URL);


let db;

client.connect()
  .then(() => {
    db = client.db("socialApp");
    console.log("MongoDB connected");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
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