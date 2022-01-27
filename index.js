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

    //all blogs
    app.get("/blogs", async (req, res) => {
      console.log(req.query);
      const blogs = blogCollection.find({ status: "approved" });
      const domesticBlogs = blogCollection.find({
        category: "domestic",
        status: "approved",
      });

      // console.log(domesticBlogs);

      const page = req.query.page;
      const size = parseInt(req.query.size);
      const filter = req.query.filter;
      let result;
      const count = await blogs.count();

      if (page && filter === "blogs") {
        result = await blogs
          .skip(page * size)
          .limit(size)
          .toArray();
      } else if (page && filter === "domestic") {
        result = await domesticBlogs
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        result = await blogs.toArray();
      }

      res.send({ count, blogs: result });
    });

    //single blog
    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id), status: "approved" };
      const blog = await blogCollection.findOne(filter);
      res.send(blog);
    });

    // domestic blog
    app.get("/domestic", async (req, res) => {
      const filter = { category: "domestic", status: "approved" };
      const blogs = blogCollection.find(filter);
      const result = await blogs.toArray();
      res.send(result);
    });

    // International blog
    app.get("/international", async (req, res) => {
      const filter = { category: "International", status: "approved" };
      const blogs = blogCollection.find(filter);
      const result = await blogs.toArray();
      res.send(result);
    });

    //road blogs
    app.get("/road", async (req, res) => {
      const filter = { transportation: "Road", status: "approved" };
      const blogs = blogCollection.find(filter);
      const result = await blogs.toArray();
      res.send(result);
    });

    //cruise blogs
    app.get("/cruise", async (req, res) => {
      const filter = { transportation: "Cruise", status: "approved" };
      const blogs = blogCollection.find(filter);
      const result = await blogs.toArray();
      res.send(result);
    });

    //air blogs
    app.get("/air", async (req, res) => {
      const filter = { transportation: "air", status: "approved" };
      const blogs = blogCollection.find(filter);
      const result = await blogs.toArray();
      res.send(result);
    });

    //my blogs
    app.get("/myBlogs/:email", async (req, res) => {
      const result = await blogCollection
        .find({ email: req.params.email })
        .toArray();

      res.send(result);
    });

    //post blog
    app.post("/blogs", async (req, res) => {
      const blog = req.body;
      // console.log(blog);
      const result = await blogCollection.insertOne(blog);
      res.json(result);
    });

    //pending to approve

    app.delete("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await blogCollection.deleteOne(filter);
      res.json(result);
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
