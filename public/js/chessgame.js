// const { Chess } = require("chess.js");

const socket=io();//server is connected to our frontend

// socket.emit("churan")//sending churan to backend

// socket.on("churan papdi",function(){
//     console.log("churan papdi received")
// })
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");
let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = ()=>{
    const board=chess.board();
    boardElement.innerHTML="";
    // console.log(board);
    board.forEach((row,rowindex)=> {
        row.forEach((square,sqareIndex)=>{
            // console.log(square);//getting the squares in each row
            const squareElement = document.createElement("div");//creating squares
            squareElement.classList.add("square",
                (rowindex+sqareIndex)%2 === 0?"light":"dark" //creating checked pattern
            );

            squareElement.dataset.row=rowindex;
            squareElement.dataset.col =sqareIndex;

            if(square) //those squares which are not null
            {
                const pieceElement = document.createElement("div");//creating pieces
                pieceElement.classList.add
                ("piece",square.color==='w'?"white":"black")
            
            pieceElement.innerText="";
            pieceElement.draggable = playerRole === square.color;

            pieceElement.addEventListener("dragstart",(e)=>{
                if(pieceElement.draggable)
                {
                    draggedPiece=pieceElement;
                    sourceSquare={row:rowindex,col:sqareIndex};
                    e.dataTransfer.setData("text/plain","");//for smooth dragging
                }
            });

            pieceElement.addEventListener("dragend",()=>{
                draggedPiece=null;
                sourceSquare=null;
            });
            squareElement.appendChild(pieceElement);//attaching the piece to the square
        }
        squareElement.addEventListener("dragover",function(e){
            e.preventDefault();
            
        });
        squareElement.addEventListener("drop",function(e) //after dropping to square
       {
        e.preventDefault();
        if(draggedPiece)
        {
            const targetSource = {
                row:parseInt(squareElement.dataset.row),
                col:parseInt(squareElement.dataset.col)
            };

            handleMove(sourceSquare,targetSource);

        }

       })
       boardElement.appendChild(squareElement);
    });
        
    });
    
};

const handleMove = ()=>{};

const getPieceUnicode = ()=>{};
renderBoard();