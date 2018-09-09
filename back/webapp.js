//dependencies
var express = require('express')
var mongoose = require('mongoose');
var cors = require('cors')
var bodyParser = require('body-parser');
var app = express()
var Web3 = require('web3')
var http = require('http')


//middlewares
mongoose.connect('mongodb://localhost/se-hackaton');
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var server = http.createServer(app)
var io = require('socket.io')(server);

//global var
var web3 = new Web3('http://10.10.1.177:8545');
web3.setProvider(new Web3.providers.WebsocketProvider('ws://10.10.1.177:8546'));
//
var Schema = mongoose.Schema;
var sensorSchema = new Schema({ 
                        timeStamp: { type: Date, default: Date.now },
                        value: Number 
                    })
var sensorData = mongoose.model('sensordatas',sensorSchema)

//subscription
var addr = '0x1e04e3e71b859ceae525f174806df1d340ec2575'
var abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"setWhiteListAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"standard","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"mintedAmount","type":"uint256"}],"name":"mintToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"decimalUnits","type":"uint8"},{"name":"tokenSymbol","type":"string"},{"name":"_whitelist","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":false,"stateMutability":"nonpayable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
var contract = new web3.eth.Contract(abi,addr);
contract.events.Transfer({}).on('data',(data)=>{
    io.emit('receive',data)
    // var data = new sensorData({
    //     value: data
    // })
    // data.save()
})

//websocket
io.on('connection', socket => {
    console.log('User connected')
    
    socket.on('disconnect', () => {
      console.log('user disconnected')
    })
})

//api
app.get('/api/meta' , async (req,res) => {
    var bal =  await web3.eth.getBalance('0xb5bcb88faf8ef3a2f828787f89f88b346d7490dc')
    var trans = await web3.eth.getTransactionCount('0xb5bcb88faf8ef3a2f828787f89f88b346d7490dc')
    console.log(bal,trans)
    res.status(200).json({
        balance : bal,
        transactions : trans
    })
    
})

app.post('/api/receivedata', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Successfully receive data",
    });
})

// myContract.events.Transfer().on('data',(event)=>{
//     console.log(event)
// }).on('error', function (transaction) {
//     console.log('pendingTransactions error', transaction)
// })

server.listen(5000, () => console.log(`Listening on port 5000`))