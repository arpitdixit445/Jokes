const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname+"/index.html")
});

app.post("/joke", function(req, res){
    const url = geturl(req.body);
    console.log(url);
    https.get(url, function(response){
        console.log(response.statusCode);
        response.on('data', function(d){
            if(response.statusCode==200){
                const joke = JSON.parse(d).joke;
                const doc = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Your Joke!</title><link rel="stylesheet" href="css/styles.css"></head><body><div class="joke-container"><h1 class="joke">'+joke+'</h1></div><form action="/" method="get"><div class="joke-button-container"> <button class="joke-button" type="submit">Go Home</button></div></form></body></html>'
                res.send(doc);
            }
            else{
                res.send("Something broke");
            }
        });
    });
});


app.listen(process.env.PORT || 3000, function(){
    console.log("listening at port 3000...");
});


function geturl(data){
    let catagories = ""
    if(data.programming == "on"){
        catagories += ",Programming"
    }
    if(data.miscellaneous == "on"){
        catagories += ",Miscellaneous"
    }
    if(data.dark == "on"){
        catagories += ",Dark"
    }
    if(data.pun == "on"){
        catagories += ",Pun"
    }
    if(data.spooky == "on"){
        catagories += ",Spooky"
    }

    if(catagories == ""){
        catagories = "Any";
    }
    else{
        catagories = catagories.slice(1,catagories.length);
    }


    let flags = ""
    if(data.nsfw == "on"){
        flags += ",nsfw"
    }
    if(data.religious == "on"){
        flags += ",religious"
    }
    if(data.political == "on"){
        flags += ",political"
    }
    if(data.racist == "on"){
        flags += ",racist"
    }
    if(data.sexist == "on"){
        flags += ",sexist"
    }
    if(data.explicit == "on"){
        flags += ",explicit"
    }

    if(flags != ""){
        flags = "?blacklistFlags="+flags.slice(1,flags.length)+"&";
    }
    else{
        flags = "?"
    }

    let url = "https://v2.jokeapi.dev/joke/"+catagories+flags+"type=single";
    return url;
}