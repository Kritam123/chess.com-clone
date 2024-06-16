function pawnPromotion(capturePlace) {
    if (
        ( Number( capturePlace.piece.currentPosition[ 1 ] ) === 8 &&
        capturePlace.piece.pieceId === "WhitePawn" ) ||
        ( Number( capturePlace.piece.currentPosition[ 1 ] ) === 1 &&
        capturePlace.piece.pieceId === "BlackPawn" )
    )
    {
       
        // promotion popup window
        if ( capturePlace.piece.pieceId === "WhitePawn" )
        {
            const fixedClass = document.getElementsByClassName( "fixed" );
            fixedClass[ 0 ].style.display = "flex";
            const whitePieces = document.getElementsByClassName( "whitePieces" );
            whitePieces[ 0 ].style.display = "flex";
        } else
        {
            const fixedClass = document.getElementsByClassName( "fixed" );
            fixedClass[ 0 ].style.display = "flex";
            const blackPieces = document.getElementsByClassName( "blackPieces" );
            blackPieces[ 0 ].style.display = "flex";
        }
    }
}


export {pawnPromotion}