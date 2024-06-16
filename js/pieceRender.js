
function BlackPawn ( id, img,pieceId )
{
    return {
        currentPosition: id,
        img,
        type:"black",
    pieceId,

    }
}
function WhitePawn ( id, img,pieceId )
{
    return {
        currentPosition: id,
        img,
        type:"white",
    pieceId,

    }
}
function BlackRook ( id, img,pieceId )
{
    return {
        currentPosition: id,
        img,
        type:"black",
        pieceId
    }
}
function WhiteRook ( id, img,pieceId )
{
    return {
        currentPosition: id,
        img,
        type:"white",
        pieceId
    }
}
function BlackKnight ( id, img,pieceId )
{
    return {
        currentPosition: id,
        img,
        type:"black",
        pieceId
    }
}
function WhiteKnight ( id, img,pieceId )
{
    return {
        currentPosition: id,
        img,
        type:"white",
        pieceId
    }
}
function BlackBishop ( id, img,pieceId )
{
    return {
        currentPosition: id,
        img,
        type:"black",
        pieceId
    }
}
function WhiteBishop ( id, img ,pieceId)
{
    return {
        currentPosition: id,
        img,
        type:"white",
        pieceId
    }
}
function BlackQueen ( id, img,pieceId )
{
    return {
        currentPosition: id,
        img,
         type:"black",
         pieceId
    }
}
function WhiteQueen ( id, img ,pieceId)
{
    return {
        currentPosition: id,
        img,
        type:"white",
        pieceId
    }
}
function BlackKing ( id, img , pieceId)
{
    return {
        currentPosition: id,
        img,
        type:"black",
        pieceId
    }
}
function WhiteKing ( id, img, pieceId )
{
    return {
        currentPosition: id,
        img,
        type:"white",
        pieceId
    }
}


export { BlackPawn, WhitePawn,BlackRook,WhiteRook,BlackKnight,WhiteKnight,BlackBishop,WhiteBishop,BlackKing,WhiteKing, BlackQueen,WhiteQueen}

//
// if ( square.id === abcd[ index ] + 7 )
//     {
//         const img = document.createElement( "img" );
//         img.id = abcd[ index ] + 7
//         square.pieceId = img.id
//         square.piece = "/images/pieces/black/pawn.png"
//         img.srcset = square.piece;
//         squareBox.appendChild( img );
//     } else if ( square.id === abcd[ index ] + 2 )
//     {
//         const img = document.createElement( "img" );
//         img.id = abcd[ index ] + 2
//         square.pieceId = img.id
//         square.piece = "/images/pieces/white/pawn.png"
//         img.srcset = square.piece;

//         squareBox.appendChild( img );
//     } else if ( square.id === "a8" || square.id === "h8" )
//     {
//         const img = document.createElement( "img" );
//         img.id = square.id
//         square.pieceId = img.id
//         square.piece = "/images/pieces/black/rook.png"
//         img.srcset = square.piece;

//         squareBox.appendChild( img );
//     } else if ( square.id === "a1" || square.id === "h1" )
//     {
//         const img = document.createElement( "img" );
//         img.id = square.id
//         square.pieceId = img.id
//         square.piece = "/images/pieces/white/rook.png"
//         img.srcset = square.piece;
//         squareBox.appendChild( img );
//     } else if ( square.id === "b8" || square.id === "g8" )
//     {
//         const img = document.createElement( "img" );
//         img.id = square.id
//         square.pieceId = img.id
//         square.piece = "/images/pieces/black/knight.png";
//         img.srcset = square.piece;
//         squareBox.appendChild( img );
//     } else if ( square.id === "b1" || square.id === "g1" )
//     {
//         const img = document.createElement( "img" );
//         img.id = square.id
//         square.pieceId = img.id
//         square.piece = "/images/pieces/white/knight.png";
//         img.srcset = square.piece;
//         squareBox.appendChild( img );
//     } else if ( square.id === "c8" || square.id === "f8" )
//     {
//         const img = document.createElement( "img" );
//         img.id = square.id
//         square.pieceId = img.id
//         square.piece = "/images/pieces/black/bishop.png";
//         img.srcset = square.piece;
//         squareBox.appendChild( img );
//     } else if ( square.id === "c1" || square.id === "f1" )
//     {
//         const img = document.createElement( "img" );
//         img.id = square.id
//         square.pieceId = img.id
//         square.piece = "/images/pieces/white/bishop.png";
//         img.srcset = square.piece;
//         squareBox.appendChild( img );
//     } else if ( square.id === "d8" )
//     {
//         const img = document.createElement( "img" );
//         img.id = square.id
//         square.pieceId = img.id
//         square.piece = "/images/pieces/black/queen.png";
//         img.srcset = square.piece;
//         squareBox.appendChild( img );
//     } else if ( square.id === "d1" )
//     {
//         const img = document.createElement( "img" );
//         img.id = square.id
//         square.pieceId = img.id
//         square.piece = "/images/pieces/white/queen.png";
//         img.srcset = square.piece;
//         squareBox.appendChild( img );
//     } else if ( square.id === "e8" )
//     {
//         const img = document.createElement( "img" );
//         img.id = square.id
//         square.pieceId = img.id
//         square.piece = "/images/pieces/black/king.png";
//         img.srcset = square.piece;
//         squareBox.appendChild( img );
//     } else if ( square.id === "e1" )
//     {
//         const img = document.createElement( "img" );
//         img.id = square.id
//         square.pieceId = img.id
//         square.piece = "/images/pieces/white/king.png";
//         img.srcset = square.piece;
//         squareBox.appendChild( img );
//     }