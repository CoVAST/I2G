var fs = require('fs'),
    path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);

var port = process.env.PORT || 8080,
    host = process.env.HOST || "localhost";
require('amdefine/intercept');
console.log("initializing server ");

// Static files
app.use(express.static('ui'));
app.use("/data", express.static('data'));
app.use("/npm", express.static('node_modules'));
app.use("/i2g", express.static('i2g'));

// ivastack libs
var srcDir = {
    davi: './davi/src',
    i2v: '../ivastack/i2v/src',
    p4: '../p4/src',
    // p4: './node_modules/p4.js/src',
}

let dataPath = process.env.COVA_DATASRC || 'selection.js';
app.get("/selection", (req, res) => {
    res.sendFile(__dirname + '/ui/' + dataPath);
})
app.get("/data/:dataSrc", (req, res) => {
    if (req.params.dataSrc === 'chinavis') {
        dataPath = 'selection-chinavis.js';
    } else {
        dataPath = 'selection.js';
    }
    res.redirect('/');
})

app.use("/vastui", express.static(srcDir.davi));
app.use("/semantic", express.static('./davi/semantic'));
app.use("/i2v", express.static(srcDir.i2v));
app.use("/p4",  express.static(srcDir.p4));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var provenance = [];
var mergeRecords = [];
var provID = 0;

var users = {};
var largeDisplay = null;

var userIdDict = {};

io.on('connection', function (socket) {
    socket.on('add user', function (userInfo) {
        socket.user = userInfo;
        if(!userIdDict[userInfo.name]){
            users[userInfo.name] = socket.user;
            userIdDict[userInfo.name] = Object.keys(userIdDict).length + 1;
        }
        socket.emit('login', {
            numUsers: Object.keys(users).length
        });
        console.log(users);
    });

    socket.on('large display', function(displayInfo) {
        largeDisplay = socket;
        largeDisplay.emit('update', {
            logs: provenance,
         });
        console.log('Large Display connected');
    });

    socket.on('mergeRequest', () => {
        console.log("mergeRequest");
        let ret = [];
        let removeNodes = [];
        let removeLinks = [];
        for(var i = provenance.length - 1; i >= 0; i--){
            for(var j = provenance[i].increments.length - 1; j >= 0; j--){
                let curNode = provenance[i].increments[j];
                if(curNode.action === "Remove node"){
                    removeNodes.push(curNode.nodename);
                }else if(curNode.action === "Remove link"){
                    removeLinks.push(curNode.nodename);
                }else if(curNode.action === "Add node"){
                    let temp = removeNodes.indexOf(curNode.nodename);
                    if(temp > -1){
                        removeNodes.splice(temp, 1);
                    }else{
                        ret.push(curNode);
                    }
                }else if(curNode.action === "Add link"){
                    let temp = removeNodes.indexOf(curNode.nodename);
                    if(temp > -1){
                        removeLinks.splice(temp, 1);
                    }else{
                        ret.push(curNode);
                    }
                }else{
                    console.log("Undefined action: " + curNode.action);
                }
            }
        }
        console.log("Reply: ");
        console.log(ret);
        socket.emit('mergeReply', {
            master: ret,
        });
    });  //A nodes&links should be saved for collaboration view

    socket.on('push', function(data) {
        if(largeDisplay !== null) {
            let userId = userIdDict[socket.user.name];
            // var log = {
            //     pullNodename: data.pullNodename,
            //     userId: userId,
            //     commitReason: data.note,
            //     increments: data.increments,
            //     datetime: new Date(),
            //     waitMore: false,
            // };

            let curIdx = provenance.length;
            let tlog = null;
            for(var i = 0; i < data.increments.length; i++){
                let pullNodeServerId = data.pullNodeServerId;
                if(i === 0){
                    if(typeof data.pullNodeServerId === 'undefined'){
                        pullNodeServerId = -1; //Stand for Root
                    }
                }
                else{
                    pullNodeServerId = tlog.serverId;
                }
                tlog = {
                    pullNodeServerId: pullNodeServerId,
                    userId: userId,
                    commitReason: data.note,
                    increments: [data.increments[i]],
                    datetime: new Date(),
                    waitMore: (i === data.increments.length - 1) ? false : true,
                    serverId: provID,
                }
                provenance.push(tlog);
                provID++;
            }
            console.log(provenance);
            console.log("Update");
            largeDisplay.emit('update', {
                logs: provenance.slice(curIdx),
                isPush: true,
            });
        }
    });

//belongTo ancestor to purge not ancestor branches
//Merge: provide last node needed

    socket.on('pullRequest', function(node){
        let todoList = node.fathers;
        let allAncestors = [];
        for(var i = 0; i < todoList.length; i++){
            allAncestors.push(todoList);
            if(todoList[i].fathers){
                todoList.concat(todoList[i].fathers);
            }
        }
        console.log(allAncestors);

        console.log("_____________");
        console.log(node);
        console.log(provenance);
        let ret = [];
        if(node.type === "Merge"){
            for(var i = 0; i < provenance.length; i++){
                ret.push(provenance[i]);
                if(provenance[i].increments[0] && provenance[i].increments[0].serverId === node.lastNode.serverId){
                    break;
                }
            }
        }else{
            let curSeeking = node.serverId;
            let maxIdx = 0;
            console.log(curSeeking);
            for(var i = 0; i < provenance.length; i++){
                if(provenance[i] && provenance[i].serverId === curSeeking){
                    maxIdx = i;
                    break;
                }
            }
            console.log(maxIdx);
            for(; maxIdx >= 0; maxIdx--){
                if(typeof curSeeking === "undefined" || (curSeeking.indexOf && curSeeking.indexOf("_") > -1)){
                    ret.push(provenance[maxIdx]);
                    continue;
                }
                if(provenance[maxIdx].serverId === curSeeking){
                    ret.push(provenance[maxIdx]);
                    curSeeking = provenance[maxIdx].pullNodeServerId;
                    console.log(curSeeking);
                }
            }
            ret.reverse();
            console.log(provenance);
        }

        socket.emit('pullRespond', ret);
        console.log(ret);
        console.log("_____________");

    })

    // socket.broadcast.emit('bcast msg', {
    //     title: 'new user joined',
    //     username: socket.username,
    // });
});


var nodeDsv = require('../p4/src/io/node-dsv'),
    p4 = require('../p4/src/core/pipeline');

var data = [],
    attributes = {
        "iyear" : "numeric",
        "imonth": "numeric",
        "iday": "numeric",
        "country": "categorical",
        "region": "categorical",
        "latitude": "numeric",
        "longitude": "numeric",
        "success": "numeric",
        "suicide": "numeric",
        "attacktype": "categorical",
        "targtype": "categorical",
        "gname": "categorical",
        "weaptype" :"categorical",
        "nkill": "numeric",
        "nwound": "numeric"
};

var readValue = {
    categorical: function(d) { return d},
    numeric: parseFloat
}

nodeDsv.read({
    filepath: './data/terrorists.csv',
    delimiter: ';',
    skip: 1,
    onload: function(rows) {
        rows.forEach(function(row){
            var rec = {};
            Object.keys(attributes).forEach(function(attr, i) {
                rec[attr] = readValue[attributes[attr]](row[i]);
            });
            data.push(rec);
        })
    },
    oncomplete: function() {
        data = data.filter(d=>d.iyear > 1999);
        data.forEach(function(d){ d.date = new Date([d.iyear, d.imonth, d.iday].join('-'))});
        console.log('total records: ', data.length);
    }
})

app.get('/terrorists', (req, res) => {
    res.send(data);
});

require('./dataroutes.js').setupRoutes(app);

server.listen(port, host, function(){
    console.log("server started, listening", host, port);
});