// **** Node JS Server.
const http = require('http');

const express = require ('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./API/config/database'); 
// const jwt = require('jsonwebtoken');
const app = express();
const server = http.createServer(app);

// **** Port Variables
const hostname = 'localhost';
const PORT = 3000;
const dbURI = process.env.dbUri || config.mlab;
// **** API Routes
const authRoute = require('./API/routes/auth');
const auctionRoute = require('./API/routes/auction');

// **** Database Connection

mongoose.connect(dbURI, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    if (err){
        console.log('DataBase Connection Error :', err);
    } else {
        console.log('Successfully Connected to Database : ',dbURI);
    }
});


// **** Middleware 
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
// **** Router routes
app.use('/api/auth', authRoute);
app.use('/api/auctions', auctionRoute);
// **** Main routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// **** Start Server
server.listen(PORT, hostname, () => {
  console.log(`Server running at http://${hostname}:${PORT}/`);
});