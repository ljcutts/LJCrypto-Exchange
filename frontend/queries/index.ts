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

// export function FETCH_WINNER() {
//   return `query {
//        guessingGames(orderBy:id, orderDirection:desc, first: 2) {
//              Winner  
//         }
//       }`;
// }