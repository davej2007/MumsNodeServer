const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auctionSchema = new Schema({
    status              : Number,
    category            : {type:Number, default:1},
    auction : {
        dateListed      : [Number],
        description     : String,
        initialPrice    : Number,
        postage         : Number,
        weight          : { type : Number, default : 0 }
    },
    sold : {
        dateSold        : { type : Number, default: 0 },
        auctionNo       : { type : String, default:null },
        price           : { type : Number, default: 0 },
        buyer           : { userName : { type : String, default : null },
                            name : { type : String, default : null },
                            postCode:{ type : String, default : null }
                        }
    },
    paid : {
        paidBy          : { type : String, default : null },
        postage         : { type : Number, default : 0    },
        transactionNo   : { type : String, default : null },
        completed       : { type : Boolean, default: false}
    },
    fee : {
        finalFee        : { cost  : { type : Number, default : null },
                            promo : { type : Boolean, default : false },
                            set   : { type : Boolean, default : false },
                            completed : { type : Boolean, default: false }},
        postageFee      : { cost  : { type : Number, default : null },
                            set   : { type : Boolean, default : false },
                            completed : { type : Boolean, default: false }},
        paypalFee       : { cost  : { type : Number, default : null },
                            set   : { type : Boolean, default : false },
                            completed : { type : Boolean, default: false }}
    },
    courier : {
        company         : { type : String, default : null },
        trackingNo      : { type : String, default : null },
        cost            : { type : Number, default : 0 },
        delivered       : { type : Number, default : null }
    },
    archive             : { type : Boolean, default: false }
});
module.exports = mongoose.model('Auction',auctionSchema);