const express = require('express');
const router  = express.Router();
const VISIT = require('../models/visits');

router.get('/getVisitsInfo', (req,res)=>{
    VISIT.find().exec(function(err,visits){
        if (err) {
            res.json({ success:false, message:'DB Error : ' + err });
        } else {
            if (!visits){
                res.json({ success:false, message:'Visits Not Found.' });
            } else {
                res.json({ success:true, visits});
            }
        }
    });
});
router.get('/getBinDateInfo', (req,res)=>{
    VISIT.find({type:3}).exec(function(err,visits){
        if (err) {
            res.json({ success:false, message:'DB Error : ' + err });
        } else {
            if (!visits){
                res.json({ success:false, message:'Visits Not Found.' });
            } else {
                res.json({ success:true, visits});
            }
        }
    });
});
router.post('/saveNewVisits', (req,res)=>{
    if(!req.body.date){
        res.json({ success:false, message: 'No Date Supplied' });
    } else if(!req.body.type){
        res.json({ success:false, message: 'No Type Supplied' });
    } else {
        var visit = new VISIT({
            date    : req.body.date,
            type    : req.body.type,
            home    : { by      : req.body.person || 'n/a',
                        checks  : { water   : req.body.water || false,
                                    windows : req.body.windows || false,
                                    doors   : req.body.doors || false },
                        comments: req.body.comments || 'n/a' },
            agent   : { time    : req.body.time || 'n/a',
                        name    : req.body.name || 'n/a',
                        feedback: req.body.feedback || 'n/a' },
            bins    : { type    : req.body.bins || 'n/a',
                        used    : req.body.binsUsed || true }
        })
        visit.save((err)=>{
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                res.json({ success:true, message :'New visit Created ......', visit });
            }
        });
    }
});

module.exports = router;