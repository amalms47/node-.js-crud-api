const joi=require('joi');
const mongo=require('mongoose');
const express=require('express');
const router=express.Router();


const Customerschema=new mongo.Schema({
   
    name:String,
    isGold:{
        type :Boolean
    },
    phone:{
            type:String,
            required:true
    
        },                      // represents array
    date:{
        type:Date,
        default:Date.now
    }
   
})







// Creating models

const Customer=mongo.model('customerlists',Customerschema);  //creating a class called Course









// get all datas


router.get('/',async (req,res)=>{
    const customers=await Customer.find();
    res.send(customers);
});









// get datas by id

router.get('/:id',async (req,res)=>{
    const customers=await Customer.findById(req.params.id);
    if(!customers) return res.status(404).send('Not found');
    res.send(customers);
});







// save data to database


router.post('/',async (req,res)=>{
  
    const {error}=validation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let customers=new Customer({
        name:req.body.name,
        phone:req.body.phone
      });

    customers=await customers.save();

    res.send(customers);
});







// update data to database

router.put('/:id',async(req,res)=>{

    const {error}=validation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customers=await Customer.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        phone:req.body.phone
    },{new:true});

    if(!customers) return res.status(400).send(error.details[0].message);

    res.send(customers);
});








// delete data from database

router.delete('/:id',async(req,res)=>{

    const customers=await Customer.findByIdAndRemove(req.params.id);
    if(!customers) return res.status(404).send('Not found');
    res.send(customers);
});






function validation(val){

	const schema={
        name:joi.string().min(3).max(5).required(),
        phone:joi.string().max(5).required()
	};

	return joi.validate(val,schema);

	
}





module.exports=router;

