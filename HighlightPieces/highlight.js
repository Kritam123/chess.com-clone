import { keySquareMapper, globalState } from "../js/index.js";

function globalClearHighlight ( selfHighlightState )
{
    if ( selfHighlightState )
    {

        const self = document.getElementById( selfHighlightState?.currentPosition );
        self.classList.remove( "selfHighlight" )
    }
    const highlightEle = globalState.flat().filter( ( ele ) => ele.highlight_state === true );
    highlightEle.forEach( ( square ) =>
    {

        square.highlight_state = false;
        const highlightSquare = document.getElementById( square.id );
        highlightSquare.classList.remove( "highlight" )
    } );
    const captureHighlight = globalState.flat().filter( ( ele ) => ele.captureHighlight_state === true );
    captureHighlight.forEach( ( square ) =>
        {
    
            square.highlight_state = false;
            const highlightSquare = document.getElementById( square.id );
            highlightSquare.classList.remove( "caputarePieceHighlight" );
        } );
}

function highlightPieces ( postions )
{
    postions?.forEach( piecePos =>
    {
        const highlightSquare = document.getElementById( piecePos );
        highlightSquare?.classList.add( "highlight" )


    } );
}
function highlightSelf ( currentPosition )
{
    const self = document.getElementById( currentPosition );
    self.classList.add( "selfHighlight" )
}
function clearPreviousHighlight ( postions )
{
    postions?.forEach( piecePos =>
    {
        const square = keySquareMapper[ piecePos ];
        if(square) {
            square.highlight_state = false;
        const highlightSquare = document.getElementById( square.id );
        highlightSquare.classList.remove( "highlight" );
        }
    } );
}
function clearPreviousSelfHighlight ( currentPosition )
{
    const self = document.getElementById( currentPosition );
    self?.classList?.remove( "selfHighlight" );
}
function capturePositionHighlight ( capturePosition )
{
    capturePosition.forEach((e)=>{
        const square = keySquareMapper[ e ];
        square.captureHighlight_state = true;
        const diagonalSquareHighlight = document.getElementById( e );
        diagonalSquareHighlight.classList.add( "caputarePieceHighlight" ); 
    })
}
function clearCaptureHighlight ( capturePosition )
{
    capturePosition?.forEach( piecePos =>
    {
        const square = keySquareMapper[ piecePos ];
        square.captureHighlight_state = false;
        const highlightSquare = document.getElementById( piecePos );
        highlightSquare.classList.remove( "caputarePieceHighlight" );
    } );
}
export { highlightPieces, globalClearHighlight, clearCaptureHighlight,highlightSelf, capturePositionHighlight,clearPreviousHighlight, clearPreviousSelfHighlight }