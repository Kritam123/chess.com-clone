// getting root container
import { ROOT_DEV } from "../constants/constantData.js";
import { BlackBishop, BlackKing, BlackKnight, BlackPawn, BlackQueen, BlackRook, WhiteBishop, WhiteKing, WhiteKnight, WhitePawn, WhiteQueen, WhiteRook } from "./pieceRender.js";
// initalizing game or app
function initalPieces ( square )
{
    if ( Number( square.id[ 1 ] ) === 7 )
    {
        square.piece = BlackPawn( square.id, "/images/pieces/black/pawn.png","BlackPawn" )
    }
    else if ( Number( square.id[ 1 ] ) === 2 )
    {

        square.piece = WhitePawn( square.id, "/images/pieces/white/pawn.png" ,"WhitePawn" )


    } else if ( square.id === "a8" || square.id === "h8" )
    {

        square.piece = BlackRook( square.id, "/images/pieces/black/rook.png","BlackRook" );


    } else if ( square.id === "a1" || square.id === "h1" )
    {

        square.piece = WhiteRook( square.id, "/images/pieces/white/rook.png","WhiteRook" );
    } else if ( square.id === "b8" || square.id === "g8" )
    {
        square.piece = BlackKnight( square.id, "/images/pieces/black/knight.png","BlackKnight" );
    } else if ( square.id === "b1" || square.id === "g1" )
    {

        square.piece = WhiteKnight( square.id, "/images/pieces/white/knight.png","WhiteKnight" );
    } else if ( square.id === "c8" || square.id === "f8" )
    {
        square.piece = BlackBishop( square.id, "/images/pieces/black/bishop.png","BlackBishop" );


    } else if ( square.id === "c1" || square.id === "f1" )
    {
        square.piece = WhiteBishop( square.id, "/images/pieces/white/bishop.png","WhiteBishop" );

    } else if ( square.id === "d8" )
    {
        square.piece = BlackQueen( square.id, "/images/pieces/black/queen.png","BlackQueen" );

    } else if ( square.id === "d1" )
    {
        square.piece = WhiteQueen( square.id, "/images/pieces/white/queen.png" ,"WhiteQueen" );

    } else if ( square.id === "e8" )
    {
        square.piece = BlackKing( square.id, "/images/pieces/black/king.png","BlackKing" );
        // square.piece = "/images/pieces/black/king.png";

    } else if ( square.id === "e1" )
    {
        square.piece = WhiteKing( square.id, "/images/pieces/white/king.png","WhiteKing" );

    }

}
// piecesRenderIn Board 
function piecesRender( initData )
{
    initData.forEach( ( row ) =>
    {
        row.forEach( ( square ) =>
            {
            if(square.piece)
            {
                const squareEl = document.getElementById( square?.id);
                const piece = document.createElement('img');
                piece.src= square.piece.img;
            //     // insert piece into square element
                squareEl.appendChild( piece );
            }
        } )
    } )
}
function initGame ( initData )
{ //   initial renders
    initData?.forEach( ( element ) => 
    {
        const squareRow = document.createElement( "div" );
        squareRow.classList.add( "squareRow" );
        element.forEach( ( square ) =>
        {

            const squareBox = document.createElement( "span" );
            squareBox.classList.add( square.color, "square" );
            squareBox.id = square.id;
            //   initial postion of pieces
            initalPieces( square );
            squareRow.appendChild( squareBox );
        } );
        ROOT_DEV.appendChild( squareRow );
    } );
    piecesRender( initData );
}



export { initGame,piecesRender }