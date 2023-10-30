import firebase from 'firebase'
import {firestore, query, collection, where, getAll} from 'firebase/firestore';
import {db, auth} from '../db';

// helper Function
function err(e) {
  return {success: false, error: e};
}

// GameDetail-Testers.vue
/*
  Get all filter field names and values.
  return a promise with an object of testerFields and variantsList
  testerFields is an array of objects related to filter field names and values.
  variantsList is an array of button colors used in the filter.
 */
  async function getFilter() {
    return new Promise(async (resolve, reject) => {
      // get the playTesterFilter document
      db.collection("Constant").doc("playTesterFilter").get()    
      .then(doc => {
        if (!doc.exists) {
          reject({success: false, error: "filter does not exist"})
  
        } else {
          const newFilter = {
            testerFields: doc.data().testerFields,
            variantsList: doc.data().variantsList,
          }
  
          // setting isAdded in each value to false
          newFilter.testerFields.forEach(field => {
            field.fieldValues.forEach(value => {
              value.isAdded = false
            })
          })
  
          resolve({success: true, data: newFilter})
        }
      })
      .catch(e => reject(err(e)))
    }) 
  }

  // GameDetail-Testers.vue
/*
  Get additional Testers that passes the filter and are not in the game yet.
  returns a promise of testerList, totalPage.
  testerList is an array of at most pageSize number of testers that passes the filter and are not in the game yet.
  totalPage is calculated based on the total possible testers.
*/
async function getTester(gameId, pageNum, pageSize, fireStoreFilter) {
    return new Promise(async (resolve, reject) => {
      const doc = await db.collection("Game").doc(gameId).get()
      if (!doc.exists) {
        reject({success: false, error: "gameId given is not in the database"})
      }
  
      // using the filter to find adequate testers
      let conjunction = [], isEntirelyEmpty = true, ifFirstField = true
      // outer loop is a conjunction of different filter fields ex) age, gender, genre
      for (const field of fireStoreFilter) {
        if (field.fieldValues.length) {
          isEntirelyEmpty = false
          let disjunction = [] 
          // inner loop is a disjunction of different filter values ex) male, female, binary, ...
          for (const value of field.fieldValues) {
            const res = await getDisjunction(field.fieldName, value) /* using helper function */
            disjunction = [...disjunction, ...res.data]
          }
   
          if (ifFirstField) { /* base case */
              conjunction = disjunction
              ifFirstField = false
  
          } else { /* enforcing conjunction property */
              conjunction = conjunction.filter(value => disjunction.includes(value))
          }
        }
      }
  
      // getting testerList and calculating totalPage
      const gameTesterIDs = doc.data().testerIDs /* testers already in the game */
      let testerData = []
      db.collection("User")
      .where("userName", "!=", null)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => { /* for each User from the DB */
          if (!(gameTesterIDs.includes(doc.id)) && (doc.data().userType === "tester")) { /* for testers not in the game */
            // if the developer is not using a filter, display all testers
            if (isEntirelyEmpty) { 
              testerData.push({
                id: doc.id,
                name: doc.data().userName,
                img: doc.data().img,
                email: doc.data().email
              }) 
            }
            // if the developer is using a filter, display testers who pass the filter
            if (!isEntirelyEmpty && conjunction.includes(doc.id)) { 
              testerData.push({
                id: doc.id,
                name: doc.data().userName,
                img: doc.data().img,
                email: doc.data().email
              }) 
            }
          }
        })
  
        let totalPages = Math.ceil(testerData.length / pageSize)        
        resolve({success: true, data: {
          testerList: testerData.slice((pageNum - 1) * pageSize, pageNum * pageSize),
          totalPage: totalPages
        }})
  
      })
      .catch(e => {reject({success: false, error: e})}) /* end of db.collection("User")... */
    })
    .catch(e => {reject({success: false, error: e})})
  }
  
  /*
    Helper function of getTester.
    returns a promise with an array of testerIDs.
  */
  async function getDisjunction(fieldName, fieldValue) {
    return new Promise((resolve, reject) => {
      let testerIDs = []
      // if a Playtester's fieldName contains fieldValue, add that user to testerIDs 
      db.collection("PlayTester").where(fieldName, "array-contains", fieldValue).get() 
      .then(query => {
        query.forEach(doc => {
          testerIDs.push(doc.data().testerID)                       
        })
  
        resolve({success: true, data: testerIDs})
      })
      .catch(e => {reject({success: false, error: e})})
    })
  }

export default {
    getFilter,
    getTester,
    getDisjunction,
}