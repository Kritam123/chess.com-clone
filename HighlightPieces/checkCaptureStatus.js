import { keySquareMapper } from "../js/index.js";

function caputarePieceHighlight (currentPosition,square)
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
                            console.log(e)
                            return e;
                        }
                    } );
                  
                }

                export {caputarePieceHighlight}