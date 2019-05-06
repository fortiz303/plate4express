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
  title: String,
  priority: Number,
  dueDate: Number, //Use JavaScript Date Object
  deleted: Boolean
});
