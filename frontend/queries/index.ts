 export function FETCH_GUESSINGGAME() {
     return `query {
       guessingGames(orderBy:id, orderDirection:desc, first: 1) {
             id
             Winner
             GameId
             Player
             requestId
        }
      }`;
    }