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
                ("piece",square.color==='w'?"white":"black");//if you don't know where color came from just console log square
            
            pieceElement.innerText=getPieceUnicode(square);
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
    if(playerRole==='b')
    {
        boardElement.classList.add("flipped")
    }
    else{
        boardElement.classList.remove("flipped")
    }
    
};

const handleMove = (source,target)=>{ //row is in numbers and col is in alphabets
    const move={
        from:`${String.fromCharCode(97+source.col)}${8-source.row}` ,
        to: `${String.fromCharCode(97+target.col)}${8-target.row}`,
        promotion:'q'
    }
    socket.emit("move",move);
};


const getPieceUnicode = (piece)=>{
    const unicodePieces ={
        p:"♙",
        r:"♖",
        n:"♘",
        b:"♗",
        q:"♕",
        k:"♔",
        P:"♙",
        R:"♖",
        N:"♘",
        B:"♗",
        Q:"♕",
        K:"♔"

    };
    return unicodePieces[piece.type]||"";
};
socket.on("playerRole",function(role){
    playerRole=role;
    renderBoard();
});
socket.on("spectatorRole",function(){
    playerRole=null;
    renderBoard();
});
socket.on("boardState",function(fen){
    chess.load(fen);
    renderBoard();
})
socket.on("move",function(move){
    chess.move(move);
    renderBoard();
})
renderBoard();