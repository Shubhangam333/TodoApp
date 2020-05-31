const express=require('express');
const path = require('path');
const bodyParser = require('body-parser');

//Port
const port=3000;
//Init App
const app = express();

//MongoClient
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const url ='mongodb://localhost:27017/todoapp';

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static((path.join(__dirname,'public'))));

//View Engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'ejs');

//Connect to mongodb
MongoClient.connect(url,(err,database)=>{
 console.log('MongoDB Connected...');
 if(err) throw err;

 db = database.db('todoapp');
 Todos = db.collection('todos');

 app.listen(port,()=>{
    console.log('Server is running on port'+port);
});
 
});

app.get('/',(req,res,next)=>{
    Todos.find({}).toArray((err,todos)=>{
        if(err){
            return console.log(err);
        }
    
        res.render('index',{
            todos:todos
        });
    })
})
app.post('/todo/add',(req,res,next)=>{
    // create todo
    const todo={
        text:req.body.text,
        body:req.body.body
    }
    //insert todo
    Todos.insert(todo,(err,result)=>{
        if(err){
            return console.log(err);
        }
        console.log('Todo Added....');
        res.redirect('/');
    });
});

app.delete('/todo/delete/:id',(req,res,next)=>{
  const query ={_id:ObjectID(req.params.id)}
  Todos.deleteOne(query,(err,response)=>{
      if(err){
          return console.log(err);
      }
      console.log('Todo Removed');
      res.send(200);
  })
})

app.get('/todo/edit/:id',(req,res,next)=>{
    const query ={_id:ObjectID(req.params.id)}
    Todos.find(query).next((err,todo)=>{
        if(err){
            return console.log(err);
        }
    
        res.render('edit',{
            todo:todo
        });
    })
})

app.post('/todo/edit/:id',(req,res,next)=>{
    const query ={_id:ObjectID(req.params.id)}
    // create todo
    const todo={
        text:req.body.text,
        body:req.body.body
    }
    //insert todo
    Todos.updateOne(query,{$set:todo},(err,result)=>{
        if(err){
            return console.log(err);
        }
        console.log('Todo Updated....');
        res.redirect('/');
    });
});



