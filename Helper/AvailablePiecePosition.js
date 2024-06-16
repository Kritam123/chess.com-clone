// for rook 
import { keySquareMapper } from "../js/index.js";
// find rookavailable positions
function RookNextPositions ( square )
{
    let nextPositions = [];
    let capturePositions = [];
    function topPositions ()
    {
        const piece = square.piece;
        const currentPosition = piece.currentPosition;
        let nextPosition = `${ currentPosition[ 0 ] }${ Number( currentPosition[ 1 ] ) + 1 }`
        let nextSquare = keySquareMapper[ nextPosition ];


        while ( nextSquare?.piece === null && nextPosition[ 1 ] !== '9' )
        {

            const nextSquarePosition = nextSquare?.id;
            nextPositions.push( nextSquarePosition );
            nextPosition = `${ nextSquarePosition[ 0 ] }${ Number( nextSquarePosition[ 1 ] ) + 1 }`
            nextSquare = keySquareMapper[ nextPosition ];
        }
        if ( nextSquare?.piece?.type !== piece?.type && nextSquare?.piece )
        {
            capturePositions.push( nextSquare.id );
        }
    }
    //top place 
    topPositions()
    function buttomPositions ()
    {
        const piece = square.piece;
        const currentPosition = piece.currentPosition;
        let nextPosition = `${ currentPosition[ 0 ] }${ Number( currentPosition[ 1 ] ) - 1 }`
        let nextSquare = keySquareMapper[ nextPosition ];


        while ( nextPosition[ 1 ] !== '0' && nextSquare?.piece === null )
        {

            const nextSquarePosition = nextSquare?.id;
            nextPositions.push( nextSquarePosition );
            nextPosition = `${ nextSquarePosition[ 0 ] }${ Number( nextSquarePosition[ 1 ] ) - 1 }`
            nextSquare = keySquareMapper[ nextPosition ];
        }
        if ( nextSquare?.piece?.type !== piece?.type && nextSquare?.piece )
        {
            capturePositions.push( nextSquare.id );
        }
    }
    //buttom place 
    buttomPositions();
    // right place

    function rightPositions ()
    {
        const piece = square.piece;
        const currentPosition = piece.currentPosition;
        let nextPosition = document.getElementById( currentPosition ).nextSibling?.id;
        let nextSquare = keySquareMapper[ nextPosition ];


        while ( nextSquare?.piece === null && nextPosition !== undefined )
        {

            const nextSquarePosition = nextSquare?.id;
            nextPositions.push( nextSquarePosition );
            nextPosition = document.getElementById( nextSquarePosition ).nextSibling?.id
            nextSquare = keySquareMapper[ nextPosition ];
        }
        if ( nextSquare?.piece?.type !== piece?.type && nextSquare?.piece )
        {
            capturePositions.push( nextSquare.id );
        }
    }
    rightPositions();
    // left place
    function leftPositions ()
    {
        const piece = square.piece;
        const currentPosition = piece.currentPosition;
        let nextPosition = document.getElementById( currentPosition ).previousSibling?.id;
        let nextSquare = keySquareMapper[ nextPosition ];
        while ( nextSquare?.piece === null && nextPosition !== undefined )
        {

            const nextSquarePosition = nextSquare?.id;
            nextPositions.push( nextSquarePosition );
            nextPosition = document.getElementById( nextSquarePosition ).previousSibling?.id
            nextSquare = keySquareMapper[ nextPosition ];
        }
        if ( nextSquare?.piece?.type !== piece?.type && nextSquare?.piece )
        {
            capturePositions.push( nextSquare.id );
        }
    }
    leftPositions();
    return { nextPositions, capturePositions };
}

// find knightNextPositions
function KnightNextPostions ( square )
{
    let nextPositions = [];
    let capturePositions = [];
    // top Side Positions
    function topSidePositions ()
    {
        const piece = square.piece;
        const currentPosition = piece.currentPosition;
        let nextPosition = `${ currentPosition[ 0 ] }${ Number( currentPosition[ 1 ] ) - 1 }`;
        let nextSquare = null;
        let i = 1;
        while ( i < 2 && nextSquare !== undefined )
        {
            nextPosition = `${ nextPosition[ 0 ] }${ Number( nextPosition[ 1 ] ) - 1 }`
            nextSquare = keySquareMapper[ nextPosition ];
            i++;
        }
        const nextSibling = document.getElementById( nextPosition )?.nextSibling?.id
        const previousSibling = document.getElementById( nextPosition )?.previousSibling?.id;
        const nextSiblingSquare = keySquareMapper[ nextSibling ];
        const previousSiblingSquare = keySquareMapper[ previousSibling ];
        ( nextSiblingSquare?.piece?.type !== piece?.type && nextSiblingSquare?.piece ) && capturePositions.push( nextSiblingSquare.id );
        ( previousSiblingSquare?.piece?.type !== piece?.type && previousSiblingSquare?.piece ) && capturePositions.push( previousSiblingSquare.id );
        nextSiblingSquare?.piece === null && nextPositions.push( nextSibling )
        previousSiblingSquare?.piece === null && nextPositions.push( previousSibling )
        if ( nextSiblingSquare?.piece && nextSiblingSquare?.piece.pieceId === "King" && nextSiblingSquare?.piece?.type !== piece?.type )
        {
            console.log( "king check" );
        }
        if ( previousSiblingSquare?.piece && previousSiblingSquare?.piece.pieceId === "King" && previousSiblingSquare?.piece?.type !== piece?.type )
        {
            console.log( "king check" );
        }
    }
    topSidePositions();

    // buttom side positions

    function buttomSidePositions ()
    {
        const piece = square.piece;
        const currentPosition = piece.currentPosition;
        let nextPosition = `${ currentPosition[ 0 ] }${ Number( currentPosition[ 1 ] ) + 1 }`;
        let nextSquare = null;
        let i = 1;
        while ( i < 2 && nextSquare !== undefined )
        {
            nextPosition = `${ nextPosition[ 0 ] }${ Number( nextPosition[ 1 ] ) + 1 }`
            nextSquare = keySquareMapper[ nextPosition ];
            i++;
        }
        const nextSibling = document.getElementById( nextPosition )?.nextSibling?.id
        const previousSibling = document.getElementById( nextPosition )?.previousSibling?.id;
        const nextSiblingSquare = keySquareMapper[ nextSibling ];
        const previousSiblingSquare = keySquareMapper[ previousSibling ];
        ( nextSiblingSquare?.piece?.type !== piece?.type && nextSiblingSquare?.piece ) && capturePositions.push( nextSiblingSquare.id );
        ( previousSiblingSquare?.piece?.type !== piece?.type && previousSiblingSquare?.piece ) && capturePositions.push( previousSiblingSquare.id );
        nextSiblingSquare?.piece === null && nextPositions.push( nextSibling )
        previousSiblingSquare?.piece === null && nextPositions.push( previousSibling )
        if ( nextSiblingSquare?.piece && nextSiblingSquare?.piece.pieceId === "King" && nextSiblingSquare?.piece?.type !== piece?.type )
        {
            console.log( "king check" );
        }
        if ( previousSiblingSquare?.piece && previousSiblingSquare?.piece.pieceId === "King" && previousSiblingSquare?.piece?.type !== piece?.type )
        {
            console.log( "king check" );
        }
    }
    buttomSidePositions();
    //  left side positions
    function leftSidePositions ()
    {
        const piece = square.piece;
        const currentPosition = piece.currentPosition;
        let nextPosition = document.getElementById( currentPosition )?.previousSibling?.id;
        let nextSquare = null;
        let i = 1;
        while ( i < 2 )
        {
            nextPosition = document.getElementById( nextPosition )?.previousSibling?.id;
            nextSquare = keySquareMapper[ nextPosition ];
            i++;
        }
        const top = nextPosition && `${ nextPosition[ 0 ] }${ Number( nextPosition[ 1 ] ) + 1 }`;
        const buttom = nextPosition && `${ nextPosition[ 0 ] }${ Number( nextPosition[ 1 ] ) - 1 }`;
        const topSquare = keySquareMapper[ top ];
        const buttomSquare = keySquareMapper[ buttom ];
        ( topSquare?.piece?.type !== piece?.type && topSquare?.piece ) && capturePositions.push( top );
        ( buttomSquare?.piece?.type !== piece?.type && buttomSquare?.piece ) && capturePositions.push( buttom );
        topSquare?.piece === null && nextPositions.push( top )
        buttomSquare?.piece === null && nextPositions.push( buttom )
        if ( topSquare?.piece && topSquare?.piece.pieceId === "King" && topSquare?.piece?.type !== piece?.type )
        {
            console.log( "king check" );
        }
        if ( buttomSquare?.piece && buttomSquare?.piece.pieceId === "King" && buttomSquare?.piece?.type !== piece?.type )
        {
            console.log( "king check" );
        }
    }
    leftSidePositions();
    // right side positions
    function rightSidePositions ()
    {
        const piece = square.piece;
        const currentPosition = piece.currentPosition;
        let nextPosition = document.getElementById( currentPosition )?.nextSibling?.id;
        let nextSquare = null;
        let i = 1;
        while ( i < 2 )
        {
            nextPosition = document.getElementById( nextPosition )?.nextSibling?.id;
            nextSquare = keySquareMapper[ nextPosition ];
            i++;
        }
        const top = nextPosition && `${ nextPosition[ 0 ] }${ Number( nextPosition[ 1 ] ) + 1 }`;
        const buttom = nextPosition && `${ nextPosition[ 0 ] }${ Number( nextPosition[ 1 ] ) - 1 }`;
        const topSquare = keySquareMapper[ top ];
        const buttomSquare = keySquareMapper[ buttom ];
        ( topSquare?.piece?.type !== piece?.type && topSquare?.piece ) && capturePositions.push( top );
        ( buttomSquare?.piece?.type !== piece?.type && buttomSquare?.piece ) && capturePositions.push( buttom );
        topSquare?.piece === null && nextPositions.push( top )
        buttomSquare?.piece === null && nextPositions.push( buttom )
        if ( topSquare?.piece && topSquare?.piece.pieceId === "King" && topSquare?.piece?.type !== piece?.type )
        {
            console.log( "king check" );
        }
        if ( buttomSquare?.piece && buttomSquare?.piece.pieceId === "King" && buttomSquare?.piece?.type !== piece?.type )
        {
            console.log( "king check" );
        }
    }
    rightSidePositions();

    return { nextPositions, capturePositions }
}

// find bishop next positions

function BishopNextPostions ( square )
{
    let nextPositions = [];
    let capturePositions = [];

    function topRightPositions ()
    {
        const piece = square.piece;
        const currentPosition = piece.currentPosition;
        let nextSibling = document.getElementById( currentPosition )?.nextSibling?.id;
        let nextPosition = nextSibling && `${ nextSibling[ 0 ] }${ Number( nextSibling[ 1 ] ) + 1 }`
        let nextSquare = keySquareMapper[ nextPosition ];
        while ( nextSquare?.piece === null && nextPosition !== undefined )
        {
            const nextSquarePosition = nextSquare?.id;
            nextPositions.push( nextSquarePosition );
            nextSibling = nextSquarePosition && document.getElementById( nextSquarePosition )?.nextSibling?.id
            nextPosition = nextSibling && `${ nextSibling[ 0 ] }${ Number( nextSibling[ 1 ] ) + 1 }`
            nextSquare = keySquareMapper[ nextPosition ];
        }
        if ( nextSquare?.piece?.type !== piece?.type && nextSquare?.piece )
        {
            capturePositions.push( nextSquare?.id );
        }
    }
    //top right place 
    topRightPositions()
    // top left place 

    function topLeftPositions ()
    {
        const piece = square.piece;
        const currentPosition = piece.currentPosition;
        let previousSibling = document.getElementById( currentPosition )?.previousSibling?.id;
        let nextPosition = previousSibling && `${ previousSibling[ 0 ] }${ Number( previousSibling[ 1 ] ) + 1 }`
        let nextSquare = keySquareMapper[ nextPosition ];
        while ( nextSquare?.piece === null && nextPosition !== undefined )
        {
            const nextSquarePosition = nextSquare?.id;
            nextPositions.push( nextSquarePosition );
            previousSibling = nextSquarePosition && document.getElementById( nextSquarePosition )?.previousSibling?.id
            nextPosition = previousSibling && `${ previousSibling[ 0 ] }${ Number( previousSibling[ 1 ] ) + 1 }`
            nextSquare = keySquareMapper[ nextPosition ];
        }
        if ( nextSquare?.piece?.type !== piece?.type && nextSquare?.piece )
        {
            capturePositions.push( nextSquare?.id );
        }
    }
    topLeftPositions();

    // buttom left place ;
    function buttomLeftPositions ()
    {
        const piece = square.piece;
        const currentPosition = piece.currentPosition;
        let previousSibling = document.getElementById( currentPosition )?.previousSibling?.id;
        let nextPosition = previousSibling && `${ previousSibling[ 0 ] }${ Number( previousSibling[ 1 ] ) - 1 }`
        let nextSquare = keySquareMapper[ nextPosition ];
        while ( nextSquare?.piece === null && nextPosition !== undefined )
        {
            const nextSquarePosition = nextSquare?.id;
            nextPositions.push( nextSquarePosition );
            previousSibling = nextSquarePosition && document.getElementById( nextSquarePosition )?.previousSibling?.id
            nextPosition = previousSibling && `${ previousSibling[ 0 ] }${ Number( previousSibling[ 1 ] ) - 1 }`
            nextSquare = keySquareMapper[ nextPosition ];
        }
        if ( nextSquare?.piece?.type !== piece?.type && nextSquare?.piece )
        {
            capturePositions.push( nextSquare?.id );
        }
    }
    buttomLeftPositions();
    // buttom right place;

    function buttomRightPositions ()
    {
        const piece = square.piece;
        const currentPosition = piece.currentPosition;
        let previousSibling = document.getElementById( currentPosition )?.nextSibling?.id;
        let nextPosition = previousSibling && `${ previousSibling[ 0 ] }${ Number( previousSibling[ 1 ] ) - 1 }`
        let nextSquare = keySquareMapper[ nextPosition ];
        while ( nextSquare?.piece === null && nextPosition !== undefined )
        {
            const nextSquarePosition = nextSquare?.id;
            nextPositions.push( nextSquarePosition );
            previousSibling = nextSquarePosition && document.getElementById( nextSquarePosition )?.nextSibling?.id
            nextPosition = previousSibling && `${ previousSibling[ 0 ] }${ Number( previousSibling[ 1 ] ) - 1 }`
            nextSquare = keySquareMapper[ nextPosition ];
        }
        if ( nextSquare?.piece?.type !== piece?.type && nextSquare?.piece )
        {
            capturePositions.push( nextSquare?.id );
        }
    }
    buttomRightPositions();
    return { nextPositions, capturePositions }
}
// find queen next positions

function QueenNextPositions ( square )
{
    let nextPositions = [];
    let capturePositions = [];
    function topPositions ()
    {
        const piece = square.piece;
        const currentPosition = piece.currentPosition;
        let nextPosition = `${ currentPosition[ 0 ] }${ Number( currentPosition[ 1 ] ) + 1 }`
        let nextSquare = keySquareMapper[ nextPosition ];


        while ( nextSquare?.piece === null && nextPosition[ 1 ] !== '9' )
        {

            const nextSquarePosition = nextSquare?.id;
            nextPositions.push( nextSquarePosition );
            nextPosition = `${ nextSquarePosition[ 0 ] }${ Number( nextSquarePosition[ 1 ] ) + 1 }`
            nextSquare = keySquareMapper[ nextPosition ];
        }
        if ( nextSquare?.piece?.type !== piece?.type && nextSquare?.piece )
        {
            capturePositions.push( nextSquare.id );
        }
    }
    //top place 
    topPositions()
    function buttomPositions ()
    {
        const piece = square.piece;
        const currentPosition = piece.currentPosition;
        let nextPosition = `${ currentPosition[ 0 ] }${ Number( currentPosition[ 1 ] ) - 1 }`
        let nextSquare = keySquareMapper[ nextPosition ];


        while ( nextPosition[ 1 ] !== '0' && nextSquare?.piece === null )
        {

            const nextSquarePosition = nextSquare?.id;
            nextPositions.push( nextSquarePosition );
            nextPosition = `${ nextSquarePosition[ 0 ] }${ Number( nextSquarePosition[ 1 ] ) - 1 }`
            nextSquare = keySquareMapper[ nextPosition ];
        }
        if ( nextSquare?.piece?.type !== piece?.type && nextSquare?.piece )
        {
            capturePositions.push( nextSquare.id );
        }
    }
    //buttom place 
    buttomPositions();
    // right place

    function rightPositions ()
    {
        const piece = square.piece;
        const currentPosition = piece.currentPosition;
        let nextPosition = document.getElementById( currentPosition ).nextSibling?.id;
        let nextSquare = keySquareMapper[ nextPosition ];


        while ( nextSquare?.piece === null && nextPosition !== undefined )
        {

            const nextSquarePosition = nextSquare?.id;
            nextPositions.push( nextSquarePosition );
            nextPosition = document.getElementById( nextSquarePosition ).nextSibling?.id
            nextSquare = keySquareMapper[ nextPosition ];
        }
        if ( nextSquare?.piece?.type !== piece?.type && nextSquare?.piece )
        {
            capturePositions.push( nextSquare.id );
        }
    }
    rightPositions();
    // left place
    function leftPositions ()
    {
        const piece = square.piece;
        const currentPosition = piece.currentPosition;
        let nextPosition = document.getElementById( currentPosition ).previousSibling?.id;
        let nextSquare = keySquareMapper[ nextPosition ];
        while ( nextSquare?.piece === null && nextPosition !== undefined )
        {

            const nextSquarePosition = nextSquare?.id;
            nextPositions.push( nextSquarePosition );
            nextPosition = document.getElementById( nextSquarePosition ).previousSibling?.id
            nextSquare = keySquareMapper[ nextPosition ];
        }
        if ( nextSquare?.piece?.type !== piece?.type && nextSquare?.piece )
        {
            capturePositions.push( nextSquare.id );
        }
    }
    leftPositions();
    function topRightPositions ()
    {
        const piece = square.piece;
        const currentPosition = piece.currentPosition;
        let nextSibling = document.getElementById( currentPosition )?.nextSibling?.id;
        let nextPosition = nextSibling && `${ nextSibling[ 0 ] }${ Number( nextSibling[ 1 ] ) + 1 }`
        let nextSquare = keySquareMapper[ nextPosition ];
        while ( nextSquare?.piece === null && nextPosition !== undefined )
        {
            const nextSquarePosition = nextSquare?.id;
            nextPositions.push( nextSquarePosition );
            nextSibling = nextSquarePosition && document.getElementById( nextSquarePosition )?.nextSibling?.id
            nextPosition = nextSibling && `${ nextSibling[ 0 ] }${ Number( nextSibling[ 1 ] ) + 1 }`
            nextSquare = keySquareMapper[ nextPosition ];
        }
        if ( nextSquare?.piece?.type !== piece?.type && nextSquare?.piece )
        {
            capturePositions.push( nextSquare?.id );
        }
    }
    //top right place 
    topRightPositions()
    // top left place 

    function topLeftPositions ()
    {
        const piece = square.piece;
        const currentPosition = piece.currentPosition;
        let previousSibling = document.getElementById( currentPosition )?.previousSibling?.id;
        let nextPosition = previousSibling && `${ previousSibling[ 0 ] }${ Number( previousSibling[ 1 ] ) + 1 }`
        let nextSquare = keySquareMapper[ nextPosition ];
        while ( nextSquare?.piece === null && nextPosition !== undefined )
        {
            const nextSquarePosition = nextSquare?.id;
            nextPositions.push( nextSquarePosition );
            previousSibling = nextSquarePosition && document.getElementById( nextSquarePosition )?.previousSibling?.id
            nextPosition = previousSibling && `${ previousSibling[ 0 ] }${ Number( previousSibling[ 1 ] ) + 1 }`
            nextSquare = keySquareMapper[ nextPosition ];
        }
        if ( nextSquare?.piece?.type !== piece?.type && nextSquare?.piece )
        {
            capturePositions.push( nextSquare?.id );
        }
    }
    topLeftPositions();

    // buttom left place ;
    function buttomLeftPositions ()
    {
        const piece = square.piece;
        const currentPosition = piece.currentPosition;
        let previousSibling = document.getElementById( currentPosition )?.previousSibling?.id;
        let nextPosition = previousSibling && `${ previousSibling[ 0 ] }${ Number( previousSibling[ 1 ] ) - 1 }`
        let nextSquare = keySquareMapper[ nextPosition ];
        while ( nextSquare?.piece === null && nextPosition !== undefined )
        {
            const nextSquarePosition = nextSquare?.id;
            nextPositions.push( nextSquarePosition );
            previousSibling = nextSquarePosition && document.getElementById( nextSquarePosition )?.previousSibling?.id
            nextPosition = previousSibling && `${ previousSibling[ 0 ] }${ Number( previousSibling[ 1 ] ) - 1 }`
            nextSquare = keySquareMapper[ nextPosition ];
        }
        if ( nextSquare?.piece?.type !== piece?.type && nextSquare?.piece )
        {
            capturePositions.push( nextSquare?.id );
        }
    }
    buttomLeftPositions();
    // buttom right place;

    function buttomRightPositions ()
    {
        const piece = square.piece;
        const currentPosition = piece.currentPosition;
        let previousSibling = document.getElementById( currentPosition )?.nextSibling?.id;
        let nextPosition = previousSibling && `${ previousSibling[ 0 ] }${ Number( previousSibling[ 1 ] ) - 1 }`
        let nextSquare = keySquareMapper[ nextPosition ];
        while ( nextSquare?.piece === null && nextPosition !== undefined )
        {
            const nextSquarePosition = nextSquare?.id;
            nextPositions.push( nextSquarePosition );
            previousSibling = nextSquarePosition && document.getElementById( nextSquarePosition )?.nextSibling?.id
            nextPosition = previousSibling && `${ previousSibling[ 0 ] }${ Number( previousSibling[ 1 ] ) - 1 }`
            nextSquare = keySquareMapper[ nextPosition ];
        }
        if ( nextSquare?.piece?.type !== piece?.type && nextSquare?.piece )
        {
            capturePositions.push( nextSquare?.id );
        }
    }
    buttomRightPositions();
    return { nextPositions, capturePositions };
}

// find queen next positions

function KingNextPositions ( square )
{
    let nextPositions = [];
    let capturePositions = [];
    let temps = [];
    const piece = square.piece;
    const currentPosition = piece.currentPosition;
    // top 
    let top = `${ currentPosition[ 0 ] }${ Number( currentPosition[ 1 ] ) + 1 }`;
    // left 
    let left = ( document.getElementById( currentPosition )?.previousSibling?.id );

    // right 
    let right = ( document.getElementById( currentPosition )?.nextSibling?.id );

    // buttom
    let buttom = ( `${ currentPosition[ 0 ] }${ Number( currentPosition[ 1 ] ) - 1 }` );

    // topright
    let topright = ( document.getElementById( `${ currentPosition[ 0 ] }${ Number( currentPosition[ 1 ] ) + 1 }` )?.nextSibling?.id );

    // buttom right
    let buttomright = ( document.getElementById( `${ currentPosition[ 0 ] }${ Number( currentPosition[ 1 ] ) - 1 }` )?.nextSibling?.id );

    // top left 
    let topleft = ( document.getElementById( `${ currentPosition[ 0 ] }${ Number( currentPosition[ 1 ] ) + 1 }` )?.previousSibling?.id );

    // buttom left
    let buttomleft = ( document.getElementById( `${ currentPosition[ 0 ] }${ Number( currentPosition[ 1 ] ) - 1 }` )?.previousSibling?.id );


    top && temps.push( top )
    left && temps.push( left )
    buttom && temps.push( buttom )
    right && temps.push( right )
    topright && temps.push( topright )
    topleft && temps.push( topleft )
    buttomright && temps.push( buttomright )
    buttomleft && temps.push( buttomleft )


    temps.forEach( ( e ) =>
    {
        let nextPlace = keySquareMapper[ e ];
        if ( nextPlace )
        {
            ( nextPlace.piece !== null && nextPlace.piece.type !== piece?.type ) && capturePositions.push( e );
            nextPlace.piece === null && nextPositions.push( e );

        }
    } )
    return { nextPositions, capturePositions }
}

export { RookNextPositions, KnightNextPostions, KingNextPositions, BishopNextPostions, QueenNextPositions }