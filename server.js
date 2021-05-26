const express = require("express");
const { nanoid } = require("nanoid"); //requires package to generate random id
const fs = require("fs");
const { unlink } = require("fs");
const app = express(); // The app object is the core object of an Express app. app object is instantiated on creation of the Express server
const PORT = process.env.PORT || 3001; //uses either enviroment port(heroku) or our port
const path = require("path");
let notesDb = require("./db/db.json"); //requires the array we are using for our notes

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")); // express.static delivers public folder to user side nav for usage

app.get("/", (request, response) =>
  response.sendFile(path.join(__dirname, "./public/index.html"))
);
app.get("/notes", (request, response) =>
  response.sendFile(path.join(__dirname, "./public/notes.html"))
);

app.get("/api/notes", (request, response) => response.json(notesDb));

// writes new notes and updates on the frontend
app.post("/api/notes", (request, response) => {
  console.log(request.body);
  let savedNote = {
    id: nanoid(10),
    title: request.body.title,
    text: request.body.text,
  };
  console.log(savedNote);
  notesDb.push(savedNote); //<-- updates instance dosnt write
  /*writes the updated notes from json */
  fs.writeFile("./db/db.json", JSON.stringify(notesDb), (error) => {
    if (error) {
      throw error;
    }
    response.json(savedNote);
  });
});

// deletes the notes on frontend
app.delete("/api/notes/${id}");
// (request, response) => {
//   fs.unlink("/api/notes/:id", (error) => {
//     if (error) throw error;
//     console.log("successfully deleted /api/notes/:id");
//   });
//   response.json(savedNote);
// });

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));

//get delete to work
//for delete console log reqest.params.id to get the correct id for
//deploy on heroku