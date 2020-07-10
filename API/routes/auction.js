const express = require('express');
const router  = express.Router();
const AUCTION = require('../models/auctions');
const fs = require('fs')
router.get('/getAuctionInfo', (req,res)=>{
    AUCTION.find().exec(function(err,auctions){
        if (err) {
            res.json({ success:false, message:'DB Error : ' + err });
        } else {
            if (!auctions){
                res.json({ success:false, message:'Auctions Not Found.' });
            } else {
                res.json({ success:true, auctions});
            }
        }
    });
});
router.get('/getSoldAuctionInfo', (req,res)=>{
    AUCTION.find({status: { $gte: 2 }}).exec(function(err,auctions){
        if (err) {
            res.json({ success:false, message:'DB Error : ' + err });
        } else {
            if (!auctions){
                res.json({ success:false, message:'Auctions Not Found.' });
            } else {
                res.json({ success:true, auctions});
            }
        }
    });
});
  
router.get('/getUnDeliveredInfo', (req,res)=>{
  AUCTION.find({ "courier.delivered": null, status: { $gte: 2 }}).exec(function(err,auctions){
        if (err) {
            res.json({ success:false, message:'DB Error : ' + err });
        } else {
            if (!auctions){
                res.json({ success:false, message:'Auctions Not Found.' });
            } else {
                res.json({ success:true, auctions});
            }
        }
    });
});
router.post('/getAuctionByID', (req,res)=>{
    if(req.body.id == undefined){
        res.json({ success:false, message: 'No ID Supplied' });
    } else {
        AUCTION.findById(req.body.id).exec(function(err,auction){
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                if (!auction){
                    res.json({ success:false, message:'Auctions Not Found.' });
                } else {
                    res.json({ success:true, auction});
                }
            }
        });
    }
});
router.post('/updateReListByID', (req,res)=>{
    if(req.body.id == undefined){
        res.json({ success:false, message: 'No ID Supplied' });
    } else {
        AUCTION.findById(req.body.id).exec(function(err,auction){
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                if (!auction){
                    res.json({ success:false, message:'Auctions Not Found.' });
                } else {
                    if (req.body.date===null || req.body.date === undefined){
                        auction.status = 0;
                    } else {
                        auction.status = 1;
                        auction.auction.dateListed.push(req.body.date)
                    }
                    auction.save((err)=>{
                        if (err) {
                            res.status(401).send({ message: 'DB Error : ' + err });
                        } else {
                            res.json({ success:true, message :'Auction Updated ......', auction });
                        }
                    });
                }
            }
        });
    }
});
router.post('/updateSoldByID', (req,res)=>{
    if(req.body.id == undefined){
        res.json({ success:false, message: 'No ID Supplied' });
    } else {
        AUCTION.findById(req.body.id).exec(function(err,auction){
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                if (!auction){
                    res.json({ success:false, message:'Auctions Not Found.' });
                } else {
                    // update auction.sale
                    auction.status = 2;
                    auction.sold = {
                        dateSold:req.body.dateSold,
                        price : req.body.price,
                        buyer : {userName:req.body.userName, postCode:req.body.postCode}
                    }
                    if(!req.body.private) {
                        auction.sold.auctionNo = req.body.auction
                        auction.fee.finalFee.set = true;
                        auction.fee.finalFee.completed = false;
                        auction.fee.postageFee.set = true;
                        auction.fee.postageFee.completed = false;
                    } else {
                        auction.sold.auctionNo = 'Private Sale';
                        auction.fee.finalFee.set = false;
                        auction.fee.finalFee.completed = true;
                        auction.fee.postageFee.set = false;
                        auction.fee.postageFee.completed = true;
                    }
                    auction.save((err)=>{
                        if (err) {
                            res.status(401).send({ message: 'DB Error : ' + err });
                        } else {
                            res.json({ success:true, message :'Auction Updated ......', auction });
                        }
                    });
                }
            }
        });
    }
});
router.post('/updatePaidByID', (req,res)=>{
    if(req.body.id == undefined){
        res.json({ success:false, message: 'No ID Supplied' });
    } else {
        AUCTION.findById(req.body.id).exec(function(err,auction){
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                if (!auction){
                    res.json({ success:false, message:'Auctions Not Found.' });
                } else {
                    // update auction.sale
                    auction.status = 3;
                    auction.paid = {
                        paidBy          : req.body.paidBy,
                        transactionNo   : req.body.paypalTransaction,
                        postage         : req.body.postagePaid
                    };
                    auction.courier.company = req.body.company;
                    if (req.body.company == 'Collect') {
                        auction.fee.postageFee.set = false;
                        auction.fee.postageFee.completed = true;}
                    if (req.body.paidBy == 'PayPal' ) {
                        auction.fee.paypalFee.set = true;
                        auction.fee.paypalFee.completed = false;
                    } else {
                        auction.fee.paypalFee.set = false;
                        auction.fee.paypalFee.completed = true;
                    }
                    if (req.body.buyerName != null ) auction.sold.buyer.name = req.body.buyerName;
                    if (req.body.buyerPostCode != null )auction.sold.buyer.postCode = req.body.buyerPostCode
                    auction.save((err)=>{
                        if (err) {
                            res.status(401).send({ message: 'DB Error : ' + err });
                        } else {
                            res.json({ success:true, message :'Auction Updated ......', auction });
                        }
                    });
                }
            }
        });
    }
});
router.post('/updatePostByID', (req,res)=>{
    if(req.body.id == undefined){
        res.json({ success:false, message: 'No ID Supplied' });
    } else {
        AUCTION.findById(req.body.id).exec(function(err,auction){
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                if (!auction){
                    res.json({ success:false, message:'Auctions Not Found.' });
                } else {
                    // update auction.courier
                    auction.status = 4;
                    auction.courier = {
                        company         : req.body.company,
                        trackingNo      : req.body.trackingNo,
                        cost            : req.body.courierCost
                    }
                    auction.sold.buyer.name = req.body.name;
                    auction.sold.buyer.postCode = req.body.postCode
                    auction.save((err)=>{
                        if (err) {
                            res.status(401).send({ message: 'DB Error : ' + err });
                        } else {
                            res.json({ success:true, message :'Auction Updated ......', auction });
                        }
                    });
                }
            }
        });
    }
});
router.post('/updateDeliveryByID', (req,res)=>{
    if(req.body.id == undefined){
        res.json({ success:false, message: 'No ID Supplied' });
    } else {
        AUCTION.findById(req.body.id).exec(function(err,auction){
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                if (!auction){
                    res.json({ success:false, message:'Auctions Not Found.' });
                } else {
                    // update auction.courier
                    auction.status = 5;
                    auction.courier.delivered = req.body.date
                    auction.save((err)=>{
                        if (err) {
                            res.status(401).send({ message: 'DB Error : ' + err });
                        } else {
                            res.json({ success:true, message :'Auction Updated ......', auction });
                        }
                    });
                }
            }
        });
    }
});
router.post('/updateFeesByID', (req,res)=>{
    if(req.body.id == undefined){
        res.json({ success:false, message: 'No ID Supplied' });
    } else {
        AUCTION.findById(req.body.id).exec(function(err,auction){
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                if (!auction){
                    res.json({ success:false, message:'Auctions Not Found.' });
                } else {
                    // update auction.fees
                    console.log(req.body)
                    if(req.body.finalFee.set != undefined ) auction.fee.finalFee = req.body.finalFee;
                    if(req.body.postageFee.set != undefined ) auction.fee.postageFee = req.body.postageFee;
                    if(req.body.paypalFee.set != undefined ) auction.fee.paypalFee = req.body.paypalFee;
                    auction.save((err)=>{
                        if (err) {
                            res.status(401).send({ message: 'DB Error : ' + err });
                        } else {
                            res.json({ success:true, message :'Auction Updated ......', auction });
                        }
                    });
                }
            }
        });
    }
});
router.post('/updateAuctionbyID', (req,res)=>{
    if(req.body.auction._id == undefined){
        res.json({ success:false, message: 'No ID Supplied' });
    } else {
        AUCTION.findById(req.body.auction._id).exec(function(err,auction){
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                if (!auction){
                    res.json({ success:false, message:'Auctions Not Found.' });
                } else {
                    // update auction
                    console.log(req.body.auction)
                    auction.status = req.body.auction.status;
                    auction.category = req.body.auction.category;
                    auction.auction = req.body.auction.auction;
                    auction.sold = req.body.auction.sold;
                    auction.paid = req.body.auction.paid;
                    auction.fee = req.body.auction.fee;
                    auction.courier = req.body.auction.courier;
                    auction.archive = req.body.auction.archive;
                    auction.save((err)=>{
                        if (err) {
                            res.status(401).send({ message: 'DB Error : ' + err });
                        } else {
                            res.json({ success:true, message :'Auction Updated ......', auction });
                        }
                    });
                }
            }
        });
    }
});
router.post('/findEbayAuction', (req,res)=>{
    if(req.body.auction == undefined){
        res.json({ success:false, message: 'No Auction Number Supplied' });
    } else {
        AUCTION.findOne({'sold.auctionNo' : req.body.auction}).exec(function(err,auction){
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                if (!auction){
                    res.json({ success:false, message:'Auctions Number Not Found.' });
                } else {
                    res.json({ success:true, message:'Auctions Found.', auction });
                }
            }
        })
    }
});
router.post('/findPaypalTransaction', (req,res)=>{
    if(req.body.auction == undefined){
        res.json({ success:false, message: 'No Auction Number Supplied' });
    } else {
        AUCTION.findOne({'paid.transactionNo' : req.body.auction}).exec(function(err,auction){
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                if (!auction){
                    res.json({ success:false, message:'Auctions Number Not Found.' });
                } else {
                    res.json({ success:true, message:'Auctions Found.', auction });
                }
            }
        })
    }
});
router.post('/saveNewAuction', (req,res)=>{
    if(!req.body.dateListed){
        res.json({ success:false, message: 'No Date Listed Supplied' });
    } else if(!req.body.description){
        res.json({ success:false, message: 'No Description Supplied' });
    } else if(!req.body.initialPrice){
        res.json({ success:false, message: 'No Initial Price Supplied' });
    } else if(req.body.postagePaid == undefined){
        res.json({ success:false, message: 'No Postage Paid Supplied' });
    } else if(req.body.category == undefined){
        res.json({ success:false, message: 'No Category Supplied' });
    } else {
        var auction = new AUCTION({
            status : 1,
            category : req.body.category,
            auction : {
                dateListed : [req.body.dateListed],
                description : req.body.description,
                initialPrice : req.body.initialPrice,
                postage : req.body.postagePaid,
                weight : req.body.weight
            }
        })
        auction.save((err)=>{
            if (err) {
                res.status(401).send({ message: 'DB Error : ' + err });
            } else {
                res.json({ success:true, message :'New Auction Created ......', auction });
            }
        });
    }
});
router.get('/convertToCSV',(req,res)=>{
    console.log('In Convert')
    AUCTION.find().exec(function(err,auctions){
        if(err){
            console.log(err)
        } else {
            fs.writeFile("auctions.json", JSON.stringify(auctions), err => { 
                if (err) {
                    console.log(err)
                } else {
                    console.log("Done writing"); // Success 
                }                
            }); 
        }
    })
})
router.get('/saveBackToMongo', (req,res)=>{
    fs.readFile("auctions.json", function(err, data) { 
        if (err) {
            console.log(err)
        } else {
            const auctions = JSON.parse(data);
            auctions.forEach(element => {
                var auction = new AUCTION({
                    auction: {
                      dateListed: element.auction.dateListed,
                      weight: element.auction.weight,
                      description: element.auction.description,
                      initialPrice: element.auction.initialPrice,
                      postage: element.auction.postage
                    },
                    sold: {
                      buyer: {
                        userName: element.sold.buyer.userName,
                        name: element.sold.buyer.name,
                        postCode: element.sold.buyer.postCode
                      },
                      dateSold: element.sold.dateSold,
                      auctionNo: element.sold.auctionNo,
                      price: element.sold.price
                    },
                    paid: {
                      paidBy: element.paid.paidBy,
                      postage: element.paid.postage,
                      transactionNo: element.paid.transactionNo,
                      completed: element.paid.completed
                    },
                    fee: {
                      finalFee:   { cost: element.fee.finalFee.cost, promo: element.fee.finalFee.promo, set: element.fee.finalFee.set, completed: element.fee.finalFee.completed },
                      postageFee: { cost: element.fee.postageFee.cost, set: element.fee.postageFee.set, completed: element.fee.postageFee.completed },
                      paypalFee:  { cost: element.fee.paypalFee.cost, set: element.fee.paypalFee.set, completed: element.fee.paypalFee.completed }
                    },
                    courier: {
                      company: element.courier.company,
                      trackingNo: element.courier.trackingNo,
                      cost: element.courier.cost,
                      delivered: element.courier.delivered
                    },
                    category: element.category,
                    archive: element.archive,
                    status: element.status
                  }) 
                auction.save((err)=>{
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(auction.auction.description)
                    }
                });
            });
                
                
            // });
        }
    });
})

module.exports = router;