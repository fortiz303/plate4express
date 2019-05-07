const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

let app = express();
let http = require('http').Server(app);
let dbConnect = 'mongodb+srv://fortiz303:1234@cluster0-5gtof.mongodb.net/test?retryWrites=true';

mongoose.connect(dbConnect, {useNewUrlParser: true}, (error) => {
  if(error){
    console.log('there was an error connecting to MongoDB', error);
  }else{
    console.log('Succesfully connected to MongoDB');
  }
});

mongoose.Promise = global.Promise;

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', express.static('client/'));

const port = 3000;
http.listen(port);

console.log('express is now running on port ' + port)

//End of static code
let Schema= mongoose.Schema;

let toDoSchema = new Schema({
  username: String,
  toDoBody: String,
  description: String,
  title: String,
  priority: Number,//Change back to number when properly converted
  dueDate: Number, //Use JavaScript Date Object. Change back  to number when properly converted
  status: Boolean,
  list: String
});


let toDoModel = new mongoose.model('notes', toDoSchema)

app.post('/createNote',(request,response)=> {
  console.log(request.body);
//Save note to MongoDB
  let newNote = new toDoModel({
    username: request.body.username,
    title: request.body.title,
    description: request.body.description,
    priority: request.body.priority,
    dueDate: request.body.dueDate,
    status: request.body.status,
    list: null
  });

  newNote.save((error)=>{
    if(error){
      console.log('Something happened with mongoose',error);
      //Respond to front end if failed
      response.sendStatus(500);
    } else {
      console.log("Saved mongoose document succesfully");
      //Respond to front end if succesful
      response.send({text: 'Everything good baby'})
    }
  });
});
//A post handler for reading notes from the and sending them to the front end
app.post('/readNotes',(request,response) => {
  //Searches the MongoDB database and gets all the notes
  toDoModel.find({}, (error, results) => {
    if (error) {
      // If there is an error, send to front end code 500
      console.log('Something happened with Mongoose.', error);
      response.sendStatus(500);
    } else {
    //Otherwise send to front end what we got from database
      let dataToSend = {notes: results};
      response.send(dataToSend);
    }
  });
});

app.post('/deleteNote',(request, response) =>{
  //Searches the mongodb by an id and deletes this document.
  toDoModel.findByIdAndDelete(request.body._id,(error, results)=>{
    if (error) {
      //If there is an error, send to front end code 500
      console.log('Something happened with mongoose', error);
      response.sendStatus(500);
    } else {
      //Otherwise, send to front end the item we deleted that is stored in the variable results
      response.send({deleted: results});
    }
  })
});
