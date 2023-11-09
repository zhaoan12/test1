import firebase from 'firebase'
import {firestore, query, collection, where, getAll} from 'firebase/firestore';
import {db, auth} from '../db';

// helper Function
function err(e) {
  return {success: false, error: e};
}

// Users.vue
/*
  Get all Testers and Developers.
  returns a promise with an array of User data.
*/
async function getAllUsers() {
    return new Promise((resolve, reject) => {
      db.collection('User').where('userType', '!=', 'admin').get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          resolve({success: true, data: []}) /* there is not a single tester nor developer in the DB */
  
        } else {
          let users = []
          querySnapshot.forEach(async doc => { 
            const gameList = await getUserGames(doc.id, doc.data().userType) /* using helper function */
            let newDoc = {
              id: doc.id,
              userName: doc.data().userName,
              userType: doc.data().userType,
              gameIds: gameList.data,
              email: doc.data().email
            }
            users.push(newDoc)            
          })
          
          resolve({success: true, data: users}) 
        }
      })
      .catch(e => reject(err(e)))
    })
  }
  /*
  Helper function used in getAllUsers.
  returns a promise with an array of gameIDs relevant to the input user.
  userType must be either tester or developer.
*/
async function getUserGames(userID, userType) {
  return new Promise(async (resolve, reject) => {
    /* get all games assigned to this tester */
    if (userType === "tester") { 
      db.collection("Game")
      .where("testerIDs", "array-contains", userID)
      .get()
      .then(games => {
          let gameList = []
          games.forEach(doc => {              
              gameList.push(doc.id)
          })
          resolve({success: true, data: gameList})
      })
      .catch(e => reject(err(e)))
    } 
  
    /* get all games developed by this developer */
    if (userType === "developer") { 
      db.collection("Game")
      .where("developerID", "==", userID)
      .get()
      .then(games => {
          let gameList = []
          games.forEach(doc => {              
              gameList.push(doc.id)
          })
          resolve({success: true, data: gameList})
      })
      .catch(e => reject(err(e)))
    }

  })
}

  export default {
    getAllUsers,
  }