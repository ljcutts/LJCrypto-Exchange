 export function FETCH_GUESSINGGAME() {
     return `query {
       guessingGames(orderBy:id, orderDirection:desc, first: 1) {
             id
             Winner
             requestId
             Player
        }
      }`;
    }

    export function FETCH_LOTTERYGAME() {
      return `query {
       lotteryGames(orderBy:id) {
             id
             entryAmount
             winner
             requestId
             player
        }
      }`;
    }
