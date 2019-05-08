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
  priority: String,//Change back to number when properly converted
  dueDate: String, //Use JavaScript Date Object. Change back  to number when properly converted
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
    responseState(error, response, 200);
  });
});
//A post handler for reading notes from the and sending them to the front end
app.post('/readNotes',(request,response) => {
  //Searches the MongoDB database and gets all the notes
  toDoModel.find({}, (error, results) => {
    responseState(error, response, {notes: results});
  });
});

app.post('/deleteNote',(request, response) =>{
  //Searches the mongodb by an id and deletes this document.
  toDoModel.findByIdAndDelete(request.body._id, (error,results)=>{
    responseState(error, response, {deleted: results})
  });
});

app.post('/updateNode',(request,response) =>{

  let.propertiesToUpdate = {
    username: request.body.username,
    title: request.body.title,
    description: request.body.description,
    priority: request.body.priority,
    dueDate: request.body.dueDate,
    status: request.body.status,
    list: null
  }

  toDoModel.findByIdAndUpdate(request.body._id, propertiesToUpdate, (error,results) => {
    responseState(error, response, {updated: results});
  });
});




function responseState(error,response,send){
  if(error){
    console.log('Something happened with mongoose: ', error);
    response.sendStatus(500);
  }else{
    if(typeof send == 'number'){
      console.log('response:', send);
      response.sendStatus(send)
    } else if(typeof send == 'object'){
      response.send(send)
    }
  }
}
