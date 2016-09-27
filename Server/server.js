process.on('uncaughtException', function(err) {
    // Qwiery generic handler removed, please use your own here
    console.log(err);
})


//<editor-fold desc="References">
var express = require('express'),
    path = require('path'),
    qwiery = require("qwiery"),
    fs = require('fs-extra'),
    utils = require('./utils'),
    security = require('./Security'),
    multer = require('multer'),
    bodyParser = require('body-parser');

//</editor-fold>

// <editor-fold desc="Data dirs">
// checking some dirs which have to be present for proper functioning
var dirsToBePresent = ["/../Babble/Uploads", "/../Babble/temp"];
for(var i = 0; i < dirsToBePresent.length; i++) {
    var dirPath = __dirname + dirsToBePresent[i];
    fs.ensureDirSync(dirPath, function(err) {
        console.error(err);
    });

    fs.emptyDirSync(dirPath, function(err) {
        console.error(err);
    });

}

// these images mimic uploads, just to make sure you don't start with a fully empty state
var copyImages = ["Spheres.jpg",
    "Connected.jpg",
    "cogs.png",
    "GarashCake.jpg",
    "AppleCake.jpg",
    "GreenTea.jpg",
    "ImpressionFlowers.jpg"];
// all was well, put back a few images that are linked
for(var i = 0; i < copyImages.length; i++) {
    var filename = copyImages[i];
    fs.copy(path.join(__dirname, '/../Babble/images', filename), path.join(__dirname, '/../Babble/Uploads', filename), {replace: false}, function(err) {
        if(err) {
            throw err;
        }
    });
}
// </editor-fold>

// <editor-fold desc="Express">
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var PORT = 4789, HOST = 'localhost';
app.listen(process.env.PORT | PORT);
console.log('+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+');
console.log('HTTP Server listening @ http://%s:%s', HOST, PORT);
console.log('+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+');


app.get('/Dashboard/doc/:name', function(req, res) {
    var name = req.params.name;

    var config = require("./config");
    var filePath = path.join(__dirname, "../docs", name + ".md");
    if(fs.existsSync(filePath)) {
        res.send(fs.readFileSync(filePath, 'utf8'));
    }
    else {
        res.status(404).send("Document does not exist.");
    }
});
app.use("*", function(req, res) {
    var file;
    if(req.params[0] === "/") {
        res.sendFile(path.join(__dirname, "../Babble/Views/index.test.html"));
        return;
    }
    else if(req.params[0] === "/Babble" || req.params[0] === "/Babble/") {
        file = "Babble/Views/index.test.html";
    }
    else {
        file = req.params[0];
    }
    var filePath = path.join(__dirname, "../", file);
    fs.exists(filePath, function(exists) {
        if(exists) {
            res.sendFile(filePath);
        } else {
            res.status(404).send("The file or service '" + file + "'does not exist.");
        }
    })
});
// </editor-fold>

//<editor-fold desc="File upload">
// the multer upload needs to be before the other handlers, doesnt work otherwise for some reason
var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + '/../uploads');
    },
    filename: function(req, file, callback) {
        var extension = path.extname(file.originalname).toLowerCase();
        callback(null, utils.randomId() + extension);
    }
});
var upload = multer({storage: storage});

app.post('/files/upload', upload.single("dropContainer"), function(req, res, next) {
    var ctx;
    try {
        ctx = security.getUserContext(req);
        req.ctx = ctx;
    } catch(e) {
        res.status(401).send(e);
    }
    var extension = path.extname(req.file.filename);
    var dataType = "Document";
    switch(extension.toLowerCase()) {
        case ".jpg":
        case ".png":
            dataType = "Image";
            break;
        case ".mpg":
        case ".mov":
            dataType = "Video";
            break;
        case ".mp3":
        case ".wav":
            dataType = "Music";
            break;
    }
    var fileEntityId = qwiery.upsertEntity({
        Title: req.file.originalname,
        Description: "",
        DataType: dataType,
        Source: req.file.filename,
        "UserId": ctx.userId
    }, ctx);
    var sourceId = req.headers.targetid;
    var targetId = fileEntityId;
    if(utils.isDefined(sourceId)) {
        qwiery.connect(sourceId, targetId, "has image", ctx);
    }
    res.end(fileEntityId);
});
//</editor-fold>

// <editor-fold desc="Error handler">
// development error handler
// will print stacktrace
if(app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500).send(err.message);
    });
}
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500).send(err.message);
});
// </editor-fold>

// <editor-fold desc="Cloud mechanics">
if(process.env.Platform === "Azure") {
    var http = require('http');
    app.set('port', process.env.PORT || 3000);
    http.createServer(app).listen(app.get('port'), function() {
        console.log("Express server listening on port " + app.get('port'));
    });
}
// </editor-fold>