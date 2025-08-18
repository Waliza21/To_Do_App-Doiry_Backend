const Task=require('./models/Task');
require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');

const app=express();
app.use(cors());
app.use(express.json());
const PORT=process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log('Connected to MongoDB');
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));
})
.catch(err=>{console.error('MongoDB connection error:',err);
});

// app.get('/',(req,res)=>{
//     res.send('To-Do backend is running');

// });


//to get all of the tasks
app.get('/tasks',async(req,res)=>{
    const tasks=await Task.find({});
    res.json(tasks);
});

//to post a task
app.post('/tasks',async(req,res)=>{

    try{
        const {text}=req.body;
        const task=new Task({text});
        const savedTask= await task.save();
        res.status(201).json(savedTask);
    }catch(error){
       res.status(500).json({error:error.message});
    }
});

//toggle a task
app.put('/tasks/:id',async(req,res)=>{
    try{
const id=req.params.id;
    const {isDone} =req.body;
    if(typeof isDone==='undefined'){
        return res.status(400).json({error:'isDone is required in body'});
        
    }
    const task=await Task.findByIdAndUpdate(req.params.id,{
        isDone},{new:true},
    );
    if(!task){
        return res.status(404).json({error:'Task not found'});
    }
    res.json(task);
    }catch(error){
        res.status(500).json({error:error.message});
    }
});

//delete task
app.delete('/tasks/:id',async(req,res)=>{
    await Task.findByIdAndDelete(req.params.id);
    res.json({success:true});
});

