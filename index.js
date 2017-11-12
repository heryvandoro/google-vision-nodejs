var express = require("express");
var app = express();
var bodyParser = require('body-parser');

const port = 80;
app.use(express.static(__dirname + '/view'));
app.use(express.static(__dirname + '/assets'));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, ()=>{
    console.log("Running server on port "+port);
})

var vision = require('@google-cloud/vision')({
    projectId: 'utopian-river-177800',
    keyFilename: 'key.json'
});

function getFeatures(data){
    var result = [];
    data.forEach((x)=>{
        result.push({"type":x})
    })
    return result;
};

app.get("/", (req, res)=>{
    res.render("index.html")
});

app.post("/proceed", (req, res)=>{
    vision.annotateImage({
        image : {
            source: { imageUri: req.body.image_url }
        },
        features : getFeatures(req.body.features)
    }).then(response => {
        var result = {};
        result.features = req.body.features;
        result.body = response[0];
        return res.send(result);
    });
});