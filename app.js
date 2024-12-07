const express = require("express")
const socket = require("socket.io")
const http = require("http");
const {Chess}= require("chess.js");
const path = require("path");
const { title } = require("process");

const app=express();

//setting up socket.io
//socket needs an http server and then it links with
//the express server
const server=http.createServer(app);
const io=socket(server);

const chess=new Chess();
let players={};
let currentPlayer='w';

app.set("view engine","ejs");//Sets EJS as the templating engine
app.use(express.static(path.join(__dirname,"public")));//serve files like images from public dir

app.get("/",(req,res)=>{
    res.render("index",{title:"Chess game"});
})
//io has all functionalities of the socket so we need to on the io
io.on("connection",function(uniquesocket)
{
    console.log("connected");
    // uniquesocket.on("churan",function () {//when churan event comes from the frontend we want this function to run
    //     io.emit("churan papdi");//it emits churan papdi to frontend
    // })
    // uniquesocket.on("disconnect",function(){
    //     console.log("disconnected")
    // })
    if(!players.white)
    {
        //i got my response in backend
        players.white = uniquesocket.id;
        uniquesocket.emit("playerRole","w");
    }
    else if(!players.black)
    {
        players.black = uniquesocket.id;
        uniquesocket.emit("playerRole","b");
    }
    else{
        uniquesocket.emit("spectatorRole");
    }

    uniquesocket.on("disconnect",function(){
        if(uniquesocket.id === players.black)
        {
            delete players.black;
        }
        else if(uniquesocket.id === players.white)
        {
            delete players.white;
        }

    });
    uniquesocket.on("move",(move)=>{
    try {
        //if now its white turn to play but my id is not white then I cannot play I need to be white to play
        if(chess.turn() === "w" && uniquesocket.id!=players.white)
            return;
        if(chess.turn()==="b" && uniquesocket.id!=players.black)
            return;
        const result = chess.move(move);//result will store if my chess move is valid or not
        if(result){
            currentPlayer=chess.turn();
        }

        
    } catch (error) {
        
    }
    })

})


server.listen(3000,function(){
    console.log("server is running on 3000");
    
});