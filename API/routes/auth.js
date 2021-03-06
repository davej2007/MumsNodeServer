const express = require('express');
const router  = express.Router();
const jwt = require('jsonwebtoken');

admin=[];
admin['Dave']='11111';
admin['Jacky']='10111';
admin['Andrew']='10110';
admin['Emily']='00110';
key = require('../config/database').tokenKey;

router.get('/test', (req,res) =>{
    res.json({message:'from API / Auth route'});
});
router.get('/decodeToken', (req,res)=>{
    res.json(req.decoded);
});

router.post('/initilizeLocalTokens', (req,res)=>{
    if(req.body.Initilize == null || req.body.Initilize == undefined){
        res.status(401).json({message:'No Body Selected'});
    } else {
        if(!admin[req.body.Initilize]){
            res.json({success:false, error:'Not Valid User'})
        } else {
            let token = jwt.sign({ user:req.body.Initilize, admin:admin[req.body.Initilize] }, key);
            res.json({success:true, token:token, user:req.body.Initilize})
        }
    }
})

module.exports = router;