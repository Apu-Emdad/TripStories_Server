const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://TripStoires_admin:6BqFJWDLaY8q72c9@cluster0.1ikru.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("found client");

    const database = client.db("TripStories");
    const blogCollection = database.collection("Blogs");

    app.get("/blogs", async (req, res) => {
      const blogs = blogCollection.find({ status: "approved" });

      const result = await blogs.toArray();
      res.send(result);
    });

    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id), status: "approved" };
      const blog = await blogCollection.findOne(filter);
      res.send(blog);
    });
  } finally {
    //   await client.close()
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello from my first ever node");
});

app.listen(port, () => {
  console.log("listening to port", port);
});
