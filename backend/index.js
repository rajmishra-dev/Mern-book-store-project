import express, { response } from "express";
import mongoose from "mongoose";
import { PORT, mongoDBURL } from "./config.js";
import { Book } from "./models/bookModel.js";

const app = express();

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  return res.status(200).send("Welcome to MERN project!");
});

// Route for Save a new Book
app.post("/books", async (request, response) => {
  try {
    if (
      !request.body.title ||
      !request.body.author ||
      !request.body.publishYear
    ) {
      return response.status(400).send({
        message: "Send all required fields: title, author, publishYear",
      });
    }

    // ✅ Fixed: Correct way to access body data
   const newBook = new Book({
  title: request.body.title,
  author: request.body.author,
  publishYear: request.body.publishYear,
});


    // ✅ Fixed: Save model instance correctly
    const book = await newBook.save();

    return response.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// ✅ Added: GET route to show all books
app.get("/books", async (request, response) => {
  try {
    const books = await Book.find({});
    return response.status(200).json(books);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Database connection
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("✅ Connection to MongoDB is successful");
    app.listen(PORT, () => {
      console.log(`🚀 App is listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error.message);
  });
