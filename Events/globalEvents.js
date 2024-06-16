import { keySquareMapper } from "../js/index.js";
import { ROOT_DEV } from "../constants/constantData.js";
import
{
    capturePositionHighlight,
    clearCaptureHighlight,
    clearPreviousHighlight,
    clearPreviousSelfHighlight,
    globalClearHighlight,
    highlightPieces,
    highlightSelf,
} from "../HighlightPieces/highlight.js";
import { pawnPromotion } from "../Helper/pawnPromotion.js";
import { checkDiagonalForKingCheck } from "../Helper/checkStatus.js";
import { BishopNextPostions, KingNextPositions, KnightNextPostions, QueenNextPositions, RookNextPositions } from "../Helper/AvailablePiecePosition.js";
let selfHighlightState = null;
let globalNextPosition = [];
let globalCurrentSquare = null;
let globalCurrentPosition = null;
let globalCapturePosition = [];
let inTurn = "white";
function GlobalEvents ()
{
    ROOT_DEV.addEventListener( "click", ( e ) =>
    {
        let nextPosition = [];
        function changeTurn ()
        {
            if ( inTurn === "black" )
            {
                inTurn = "white";
            } else
            {
                inTurn = "black";
            }
        }
        let TempPosition = [];
        function pieceStatus ( tempPositions )
        {
            tempPositions.forEach( ( e ) =>
            {
                // console.log(e[1])
                const square = keySquareMapper[ e ];
                const firstSquare = keySquareMapper[ tempPositions[ 0 ] ];

                if ( square?.piece === null && firstSquare?.piece === null )
                {
                    nextPosition.push( e );
                }
            } );
        }
        const clickPieceId = e.target.parentNode.id;
        const square = keySquareMapper[ clickPieceId ];

        // clicking pieces // selecting  pieces 

        if (
            e.target.localName === "img" &&
            !globalCapturePosition.includes( e.target.parentNode.id ) &&
            inTurn === square.piece.type
        )
        {
            globalClearHighlight( selfHighlightState );
            globalCurrentSquare = square;
            // black pieces section

            // BlackPawn CLick
            if ( square.piece.pieceId === "BlackPawn" && inTurn === "black" )
            {
                const piece = square.piece;
                let capturePosition = [];
                let currentPosition = square.piece.currentPosition;
                globalCurrentPosition = currentPosition;
                if ( currentPosition[ 1 ] == 7 )
                {
                    TempPosition.push(
                        `${ currentPosition[ 0 ] }${ Number( currentPosition[ 1 ] ) - 1 }`
                    );
                    TempPosition.push(
                        `${ currentPosition[ 0 ] }${ Number( currentPosition[ 1 ] ) - 2 }`
                    );
                } else
                {
                    TempPosition.push(
                        `${ currentPosition[ 0 ] }${ Number( currentPosition[ 1 ] ) - 1 }`
                    );
                }

                function caputarePieceHighlight ()
                {
                    let diagonalSquare = [];
                    const nextSibling =
                        document.getElementById( currentPosition ).nextSibling?.id;
                    const previousSibling =
                        document.getElementById( currentPosition ).previousSibling?.id;
                    nextSibling !== undefined &&
                        diagonalSquare.push(
                            `${ nextSibling[ 0 ] }${ Number( nextSibling[ 1 ] ) - 1 }`
                        );
                    previousSibling !== undefined &&
                        diagonalSquare.push(
                            `${ previousSibling[ 0 ] }${ Number( previousSibling[ 1 ] ) - 1 }`
                        );
                    diagonalSquare.forEach( ( e ) =>
                    {
                        const diagSquare = keySquareMapper[ e ];
                        if (
                            diagSquare?.piece &&
                            square?.piece.type !== diagSquare?.piece.type
                        )
                        {
                            capturePosition.push( e );
                        }
                    } );
                }
                caputarePieceHighlight();
                globalCapturePosition = capturePosition;

                if ( piece == selfHighlightState )
                {
                    clearPreviousHighlight( nextPosition );
                    clearPreviousSelfHighlight( currentPosition );
                    clearCaptureHighlight( capturePosition );
                    capturePosition = [];
                    selfHighlightState = null;
                    return;
                }
                pieceStatus( TempPosition );
                nextPosition.forEach( ( squareHighlight ) =>
                {
                    const square = keySquareMapper[ squareHighlight ];
                    square.highlight_state = true;
                } );
                highlightPieces( nextPosition );
                highlightSelf( currentPosition );
                if ( capturePosition.length > 0 )
                {
                    capturePositionHighlight( capturePosition );
                }
                selfHighlightState = piece;
                globalNextPosition = nextPosition;
            }
            // black rook click 
            else if ( square.piece.pieceId === "BlackRook" && inTurn === "black" )
            {
                const piece = square.piece;
                let capturePosition = [];
                let currentPosition = square.piece.currentPosition;
                globalCurrentPosition = currentPosition;
                //    function to find the next available places
                let { nextPositions, capturePositions } = RookNextPositions( square );
                nextPosition = nextPositions;
                capturePosition = capturePositions;
                globalCapturePosition = capturePosition;
                if ( piece == selfHighlightState )
                {
                    clearPreviousHighlight( nextPosition );
                    clearPreviousSelfHighlight( currentPosition );
                    clearCaptureHighlight( capturePosition );
                    capturePosition = [];
                    selfHighlightState = null;
                    return;
                }

                pieceStatus( TempPosition );
                nextPosition.forEach( ( squareHighlight ) =>
                {
                    const square = keySquareMapper[ squareHighlight ];
                    square.highlight_state = true;
                } );
                highlightPieces( nextPosition );
                highlightSelf( currentPosition );
                if ( capturePosition.length > 0 )
                {
                    capturePositionHighlight( capturePosition );
                }
                selfHighlightState = piece;
                globalNextPosition = nextPosition;
            }
            else if ( square.piece.pieceId === "BlackKnight" && inTurn === "black" )
            {
                const piece = square.piece;
                let capturePosition = [];
                let currentPosition = square.piece.currentPosition;
                globalCurrentPosition = currentPosition;
                //    function to find the next available places
                let { nextPositions, capturePositions } = KnightNextPostions( square );
                nextPosition = nextPositions;
                capturePosition = capturePositions;
                globalCapturePosition = capturePosition;
                if ( piece == selfHighlightState )
                {
                    clearPreviousHighlight( nextPosition );
                    clearPreviousSelfHighlight( currentPosition );
                    clearCaptureHighlight( capturePosition );
                    capturePosition = [];
                    selfHighlightState = null;
                    return;
                }

                pieceStatus( TempPosition );
                nextPosition.forEach( ( squareHighlight ) =>
                {
                    const square = keySquareMapper[ squareHighlight ];
                    if ( square )
                    {
                        square.highlight_state = true;

                    }
                } );
                highlightPieces( nextPosition );
                highlightSelf( currentPosition );
                if ( capturePosition.length > 0 )
                {
                    capturePositionHighlight( capturePosition );
                }
                selfHighlightState = piece;
                globalNextPosition = nextPosition;
            }
            else if ( square.piece.pieceId === "BlackBishop" && inTurn === "black" )
            {
                const piece = square.piece;
                let capturePosition = [];
                let currentPosition = square.piece.currentPosition;
                globalCurrentPosition = currentPosition;
                //    function to find the next available places
                let { nextPositions, capturePositions } = BishopNextPostions( square );
                nextPosition = nextPositions;
                capturePosition = capturePositions;
                globalCapturePosition = capturePosition;
                if ( piece == selfHighlightState )
                {
                    clearPreviousHighlight( nextPosition );
                    clearPreviousSelfHighlight( currentPosition );
                    clearCaptureHighlight( capturePosition );
                    capturePosition = [];
                    selfHighlightState = null;
                    return;
                }

                pieceStatus( TempPosition );
                nextPosition.forEach( ( squareHighlight ) =>
                {
                    const square = keySquareMapper[ squareHighlight ];
                    if ( square )
                    {
                        square.highlight_state = true;

                    }
                } );
                highlightPieces( nextPosition );
                highlightSelf( currentPosition );
                if ( capturePosition.length > 0 )
                {
                    capturePositionHighlight( capturePosition );
                }
                selfHighlightState = piece;
                globalNextPosition = nextPosition;
            }
            else if ( square.piece.pieceId === "BlackQueen" && inTurn === "black" )
            {
                const piece = square.piece;
                let capturePosition = [];
                let currentPosition = square.piece.currentPosition;
                globalCurrentPosition = currentPosition;
                //    function to find the next available places
                let { nextPositions, capturePositions } = QueenNextPositions( square );
                nextPosition = nextPositions;
                capturePosition = capturePositions;
                globalCapturePosition = capturePosition;
                if ( piece == selfHighlightState )
                {
                    clearPreviousHighlight( nextPosition );
                    clearPreviousSelfHighlight( currentPosition );
                    clearCaptureHighlight( capturePosition );
                    capturePosition = [];
                    selfHighlightState = null;
                    return;
                }

                pieceStatus( TempPosition );
                nextPosition.forEach( ( squareHighlight ) =>
                {
                    const square = keySquareMapper[ squareHighlight ];
                    if ( square )
                    {
                        square.highlight_state = true;

                    }
                } );
                highlightPieces( nextPosition );
                highlightSelf( currentPosition );
                if ( capturePosition.length > 0 )
                {
                    capturePositionHighlight( capturePosition );
                }
                selfHighlightState = piece;
                globalNextPosition = nextPosition;
            }
            else if ( square.piece.pieceId === "BlackKing" && inTurn === "black" )
            {
                const piece = square.piece;
                let capturePosition = [];
                let currentPosition = square.piece.currentPosition;
                globalCurrentPosition = currentPosition;
                //    function to find the next available places
                let { nextPositions, capturePositions } = KingNextPositions( square );
                // return;
                nextPosition = nextPositions;
                capturePosition = capturePositions;
                globalCapturePosition = capturePosition;
                if ( piece == selfHighlightState )
                {
                    clearPreviousHighlight( nextPosition );
                    clearPreviousSelfHighlight( currentPosition );
                    clearCaptureHighlight( capturePosition );
                    capturePosition = [];
                    selfHighlightState = null;
                    return;
                }

                pieceStatus( TempPosition );
                nextPosition.forEach( ( squareHighlight ) =>
                {
                    const square = keySquareMapper[ squareHighlight ];
                    if ( square )
                    {
                        square.highlight_state = true;

                    }
                } );
                highlightPieces( nextPosition );
                highlightSelf( currentPosition );
                if ( capturePosition.length > 0 )
                {
                    capturePositionHighlight( capturePosition );
                }
                selfHighlightState = piece;
                globalNextPosition = nextPosition;
            }


            // white pieces sections 

            // white Pawn click
            else if ( square.piece.pieceId === "WhitePawn" && inTurn === "white" )
            {
                let capturePosition = [];
                const piece = square.piece;
                let currentPosition = square.piece.currentPosition;
                globalCurrentPosition = currentPosition;
                if ( currentPosition[ 1 ] == 2 )
                {
                    TempPosition.push(
                        `${ currentPosition[ 0 ] }${ Number( currentPosition[ 1 ] ) + 1 }`
                    );
                    TempPosition.push(
                        `${ currentPosition[ 0 ] }${ Number( currentPosition[ 1 ] ) + 2 }`
                    );
                } else
                {
                    TempPosition.push(
                        `${ currentPosition[ 0 ] }${ Number( currentPosition[ 1 ] ) + 1 }`
                    );
                }
                // checking caputare piece and highligting the piece
                function caputarePieceHighlight ()
                {
                    let diagonalSquare = [];
                    const nextSibling =
                        document.getElementById( currentPosition ).nextSibling?.id;
                    const previousSibling =
                        document.getElementById( currentPosition ).previousSibling?.id;
                    nextSibling !== undefined &&
                        diagonalSquare.push(
                            `${ nextSibling[ 0 ] }${ Number( nextSibling[ 1 ] ) + 1 }`
                        );
                    previousSibling !== undefined &&
                        diagonalSquare.push(
                            `${ previousSibling[ 0 ] }${ Number( previousSibling[ 1 ] ) + 1 }`
                        );
                    // console.log( diagonalSquare )
                    diagonalSquare.forEach( ( e ) =>
                    {
                        const diagSquare = keySquareMapper[ e ];
                        if (
                            diagSquare?.piece &&
                            square.piece.type !== diagSquare?.piece.type
                        )
                        {
                            capturePosition.push( e );
                        } else
                        {
                            return;
                        }
                    } );
                }
                caputarePieceHighlight();

                globalCapturePosition = capturePosition;
                if ( piece === selfHighlightState )
                {
                    clearPreviousHighlight( nextPosition );
                    clearPreviousSelfHighlight( currentPosition );
                    clearCaptureHighlight( capturePosition );
                    capturePosition = [];
                    globalNextPosition = [];
                    globalCapturePosition = [];
                    selfHighlightState = null;
                    return;
                }
                pieceStatus( TempPosition );

                nextPosition.forEach( ( squareHighlight ) =>
                {
                    const square = keySquareMapper[ squareHighlight ];
                    square.highlight_state = true;
                } );
                highlightPieces( nextPosition );
                highlightSelf( currentPosition );
                if ( capturePosition.length > 0 )
                {
                    capturePositionHighlight( capturePosition );
                }
                selfHighlightState = piece;
                globalNextPosition = nextPosition;
            }
            // white rook click
            else if ( square.piece.pieceId === "WhiteRook" && inTurn === "white" )
            {
                const piece = square.piece;
                let capturePosition = [];
                let currentPosition = square.piece.currentPosition;
                globalCurrentPosition = currentPosition;
                //    function to find the next available places
                let { nextPositions, capturePositions } = RookNextPositions( square );
                nextPosition = nextPositions;
                capturePosition = capturePositions;
                globalCapturePosition = capturePosition;
                if ( piece == selfHighlightState )
                {
                    clearPreviousHighlight( nextPosition );
                    clearPreviousSelfHighlight( currentPosition );
                    clearCaptureHighlight( capturePosition );
                    capturePosition = [];
                    selfHighlightState = null;
                    return;
                }

                pieceStatus( TempPosition );
                nextPosition.forEach( ( squareHighlight ) =>
                {
                    const square = keySquareMapper[ squareHighlight ];
                    square.highlight_state = true;
                } );
                highlightPieces( nextPosition );
                highlightSelf( currentPosition );
                if ( capturePosition.length > 0 )
                {
                    capturePositionHighlight( capturePosition );
                }
                selfHighlightState = piece;
                globalNextPosition = nextPosition;
            }
            // white knight click 
            else if ( square.piece.pieceId === "WhiteKnight" && inTurn === "white" )
            {
                const piece = square.piece;
                let capturePosition = [];
                let currentPosition = square.piece.currentPosition;
                globalCurrentPosition = currentPosition;
                //    function to find the next available places
                let { nextPositions, capturePositions } = KnightNextPostions( square );
                nextPosition = nextPositions;
                capturePosition = capturePositions;
                globalCapturePosition = capturePosition;
                if ( piece == selfHighlightState )
                {
                    clearPreviousHighlight( nextPosition );
                    clearPreviousSelfHighlight( currentPosition );
                    clearCaptureHighlight( capturePosition );
                    capturePosition = [];
                    selfHighlightState = null;
                    return;
                }
                pieceStatus( TempPosition );
                nextPosition.forEach( ( squareHighlight ) =>
                {
                    const square = keySquareMapper[ squareHighlight ];
                    if ( square )
                    {
                        square.highlight_state = true;

                    }
                } );
                highlightPieces( nextPosition );
                highlightSelf( currentPosition );
                if ( capturePosition.length > 0 )
                {
                    capturePositionHighlight( capturePosition );
                }
                selfHighlightState = piece;
                globalNextPosition = nextPosition;
            }
            else if ( square.piece.pieceId === "WhiteBishop" && inTurn === "white" )
            {
                const piece = square.piece;
                let capturePosition = [];
                let currentPosition = square.piece.currentPosition;
                globalCurrentPosition = currentPosition;
                //    function to find the next available places
                let { nextPositions, capturePositions } = BishopNextPostions( square );
                nextPosition = nextPositions;
                capturePosition = capturePositions;
                globalCapturePosition = capturePosition;
                if ( piece == selfHighlightState )
                {
                    clearPreviousHighlight( nextPosition );
                    clearPreviousSelfHighlight( currentPosition );
                    clearCaptureHighlight( capturePosition );
                    capturePosition = [];
                    selfHighlightState = null;
                    return;
                }

                pieceStatus( TempPosition );
                nextPosition.forEach( ( squareHighlight ) =>
                {
                    const square = keySquareMapper[ squareHighlight ];
                    if ( square )
                    {
                        square.highlight_state = true;

                    }
                } );
                highlightPieces( nextPosition );
                highlightSelf( currentPosition );
                if ( capturePosition.length > 0 )
                {
                    capturePositionHighlight( capturePosition );
                }
                selfHighlightState = piece;
                globalNextPosition = nextPosition;
            }
            else if ( square.piece.pieceId === "WhiteQueen" && inTurn === "white" )
            {
                const piece = square.piece;
                let capturePosition = [];
                let currentPosition = square.piece.currentPosition;
                globalCurrentPosition = currentPosition;
                //    function to find the next available places
                let { nextPositions, capturePositions } = QueenNextPositions( square );
                nextPosition = nextPositions;
                capturePosition = capturePositions;
                globalCapturePosition = capturePosition;
                if ( piece == selfHighlightState )
                {
                    clearPreviousHighlight( nextPosition );
                    clearPreviousSelfHighlight( currentPosition );
                    clearCaptureHighlight( capturePosition );
                    capturePosition = [];
                    selfHighlightState = null;
                    return;
                }

                pieceStatus( TempPosition );
                nextPosition.forEach( ( squareHighlight ) =>
                {
                    const square = keySquareMapper[ squareHighlight ];
                    if ( square )
                    {
                        square.highlight_state = true;

                    }
                } );
                highlightPieces( nextPosition );
                highlightSelf( currentPosition );
                if ( capturePosition.length > 0 )
                {
                    capturePositionHighlight( capturePosition );
                }
                selfHighlightState = piece;
                globalNextPosition = nextPosition;
            }
            else if ( square.piece.pieceId === "WhiteKing" && inTurn === "white" )
            {
                const piece = square.piece;
                let capturePosition = [];
                let currentPosition = square.piece.currentPosition;
                globalCurrentPosition = currentPosition;
                //    function to find the next available places
                let { nextPositions, capturePositions } = KingNextPositions( square );
                // return;
                nextPosition = nextPositions;
                capturePosition = capturePositions;
                globalCapturePosition = capturePosition;
                if ( piece == selfHighlightState )
                {
                    clearPreviousHighlight( nextPosition );
                    clearPreviousSelfHighlight( currentPosition );
                    clearCaptureHighlight( capturePosition );
                    capturePosition = [];
                    selfHighlightState = null;
                    return;
                }

                pieceStatus( TempPosition );
                nextPosition.forEach( ( squareHighlight ) =>
                {
                    const square = keySquareMapper[ squareHighlight ];
                    if ( square )
                    {
                        square.highlight_state = true;

                    }
                } );
                highlightPieces( nextPosition );
                highlightSelf( currentPosition );
                if ( capturePosition.length > 0 )
                {
                    capturePositionHighlight( capturePosition );
                }
                selfHighlightState = piece;
                globalNextPosition = nextPosition;
            }
        }
        // moving pieces in chess board
        else if (
            e.target.localName === "span" &&
            globalNextPosition?.includes( e.target.id )
        )
        {
            const nextPlace = keySquareMapper[ e.target.id ];
            if ( globalCurrentSquare?.piece )
            {
                globalCurrentSquare.piece.currentPosition = e.target.id;
                nextPlace.piece = globalCurrentSquare.piece;
            }
            if ( nextPlace.piece )
            {
                const squareEl = document.getElementById( nextPlace.id );
                const piece = document.createElement( "img" );
                piece.src = nextPlace.piece.img;
                squareEl.appendChild( piece );
                const prevPosition = keySquareMapper[ globalCurrentPosition ];
                const currEl = document.getElementById( globalCurrentPosition );
                currEl.firstChild?.remove();
                prevPosition.piece = null;
                // promotion logic
                pawnPromotion( nextPlace );
            }

            clearPreviousHighlight( globalNextPosition );
            clearPreviousSelfHighlight( globalCurrentSquare?.id );
            clearCaptureHighlight( globalCapturePosition );
            selfHighlightState = null;
            globalCurrentPosition = null;
            globalCurrentSquare = null;
            globalNextPosition = [];
            globalCapturePosition = [];
            changeTurn();
        }

        //capturing pieces 
        else if (
            globalCapturePosition.includes( e.target.parentNode.id ) &&
            e.target.localName == "img"
        )
        {
            const capturePlace = keySquareMapper[ e.target.parentNode.id ];
            if ( globalCurrentSquare?.piece )
            {
                globalCurrentSquare.piece.currentPosition = capturePlace.id;
                capturePlace.piece = globalCurrentSquare.piece;
            }

            if ( capturePlace?.piece )
            {
                const currEl = document.getElementById( globalCurrentPosition );
                currEl.firstChild?.remove();
                const squareEl = document.getElementById( capturePlace.id );
                squareEl.firstChild.remove();
                const piece = document.createElement( "img" );
                piece.src = capturePlace.piece.img;
                squareEl.appendChild( piece );
                // king check logic for pawn


                checkDiagonalForKingCheck( globalCurrentSquare, capturePlace, square );
                // promotion logic
                pawnPromotion( capturePlace );
            }

            clearPreviousHighlight( globalNextPosition );
            clearPreviousSelfHighlight( globalCurrentSquare?.id );
            clearCaptureHighlight( globalCapturePosition );
            selfHighlightState = null;
            globalCurrentPosition = null;
            globalNextPosition = [];
            globalCurrentSquare.piece = null;
            globalCapturePosition = [];
            changeTurn();
        }
    } );
}

export { GlobalEvents };
