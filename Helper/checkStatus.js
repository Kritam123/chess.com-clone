import { keySquareMapper } from "../js/index.js";

function checkDiagonalForKingCheck ( globalCurrentSquare, capturePlace,square )
{
    let diagonalSquare = [];
    if ( globalCurrentSquare.piece.type === "white" )
    {
        const nextSibling =
            document.getElementById( capturePlace.id ).nextSibling?.id;
        const previousSibling =
            document.getElementById( capturePlace.id ).previousSibling?.id;
        nextSibling !== undefined &&
            diagonalSquare.push(
                `${ nextSibling[ 0 ] }${ Number( nextSibling[ 1 ] ) + 1 }`
            );
        previousSibling !== undefined &&
            diagonalSquare.push(
                `${ previousSibling[ 0 ] }${ Number( previousSibling[ 1 ] ) + 1 }`
            );
    }
    else
    {
        const nextSibling =
            document.getElementById( capturePlace.id ).nextSibling?.id;
        const previousSibling =
            document.getElementById( capturePlace.id ).previousSibling?.id;
        nextSibling !== undefined &&
            diagonalSquare.push(
                `${ nextSibling[ 0 ] }${ Number( nextSibling[ 1 ] ) - 1 }`
            );
        previousSibling !== undefined &&
            diagonalSquare.push(
                `${ previousSibling[ 0 ] }${ Number( previousSibling[ 1 ] ) - 1 }`
            );
    }

    diagonalSquare?.forEach( ( e ) =>
    {
        const diagSquare = keySquareMapper[ e ];
        if ( diagSquare?.piece )
        {
            if (
                diagSquare.piece.pieceId === "King" &&
                square.piece.type !== diagSquare?.piece.type
            )
            {
                console.log( "King check" );
            } else
            {
                return;
            }
        }

    } );
}


export { checkDiagonalForKingCheck };