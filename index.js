const express = require("express");
const mongoose = require("mongoose");
const Sample = require("./models/sample");

const app = express();
// Set up middleware
app.set("view engine", "ejs");
app.use(express.static("public"));

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://root:Vnow1C1JVUHuUnKR@unclecluster.wssnng4.mongodb.net/movie-data?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error(err);
  });

// Route to render the movies EJS template
app.get("/", (req, res) => {
  // Find movies with a runtime greater than 120 minutes, limit to 10 documents
  Sample.find({ runtime: { $gt: 120 } })
    .limit(10)
    .then((movies) => {
      res.render("index", { movies: movies });
      console.log(movies);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/search", async (req, res) => {
  console.log(req.query);
  const { query, filter, genres } = req.query;
  // const title = filter;
  let queryObject = {};
  let genreObject = {};
  // bulding query based on different filters
  if (query) {
    if (filter === "runtime") {
      console.log("Runtime query");
      queryObject = { runtime: query };
    } else if (filter === "released") {
      console.log("released query");
      queryObject = { released: query };
    } else if (filter === "title") {
      console.log("Title query");
      queryObject = { title: { $regex: new RegExp(query, "i") } };
    } else if (filter === "imdb") {
      console.log("imdb query");
      queryObject = { "imdb.rating": 5 };
    }
  }
  // Building query based on different genres
  if (genres) {
    if (genres === "") {
      console.log("All Genre Selected");
    } else if (genres === "Drama") {
      console.log("Drama Selected");
      genreObject = { genres: "Drama" };
    } else if (genres === "Horror") {
      console.log("Horror Selected");
      genreObject = { genres: "Horror" };
    } else if (genres === "Action") {
      console.log("Action Selected");
      genreObject = { genres: "Action" };
    } else if (genres === "Comedy") {
      console.log("Comedy Selected");
      genreObject = { genres: "Comedy" };
    } else if (genres === "Western") {
      console.log("western Selected");
      genreObject = { genres: "Comedy" };
    } else if (genres === "Short") {
      console.log("Short Selected");
      genreObject = { genres: "Short" };
    } else if (genres === "History") {
      console.log("History Selected");
      genreObject = { genres: "History" };
    } else if (genres === "Animation") {
      console.log("Animation Selected");
      genreObject = { genres: "animation" };
    } else if (genres === "Fantasy") {
      console.log("Fantasy Selected");
      genreObject = { genres: "Fantasy" };
    } else if (genres === "Romance") {
      console.log("Romance Selected");
      genreObject = { genres: "Romance" };
    }
  }

  //Combining both search queries
  console.log(queryObject, genreObject);
  Sample.find({ $and: [queryObject, genreObject] })
    .limit(10)
    .then((movies) => {
      res.render("index", { movies: movies });
      console.log(movies);
    });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
