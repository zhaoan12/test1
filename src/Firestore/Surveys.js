import firebase from 'firebase'
import {firestore, query, collection, where, getAll} from 'firebase/firestore';
import {db, auth} from '../db';

// helper Function
function err(e) {
  return {success: false, error: e};
}

// AdminSurveys.vue
/*
    return array of surveys from Questionnaire collection with a valid name
*/
async function getAllSurveys() {
    function err(e) {
        return {success: false, error: e};
    }

    return new Promise((resolve, reject) => {
        // get questionnaires that are not null (e.g. exist)
        db.collection("Questionnaire").where("name", "!=", null).get()
        .then(querySnapshot => {
            if (querySnapshot.empty) { // no questionnaires, send empty array
                resolve({success: true, data: []});
            } else {
                let docs = [];
                // get all questionnaires and add to docs array
                querySnapshot.forEach(doc => {
                    let newDoc = {
                        id: doc.id,
                        name: doc.data().name,
                        questionIDs: doc.data().questionIDs,
                        checked: doc.data().checked,
                        completedIDs: doc.data().completedIDs,
                        developerID: doc.data().developerID,
                        gameID: doc.data().gameID,
                        status: doc.data().status,
                        testerIDs: doc.data().testerIDs,
                    };
                    docs.push(newDoc);
                })
                // return - send success and  docs array
                resolve({success: true, data: docs});
            }
        }).catch(e => reject(err(e)));
    });
}

// Login.vue
/*
    get array of surveys for a provided tester ID
*/
async function getTesterSurveys(testerId) {
    return new Promise((resolve, reject) => {
        db.collection("Questionnaire").where("testerIDs", "array-contains", testerId).where("status", "==", 2).get()
        .then(querySnapshot => {
            if (querySnapshot.empty) { // return error if no surveys found
                reject(err("no surveys found"));
            } else {
                let docs = [];
                // get surveys, add to temp array and return success with temp array
                querySnapshot.forEach(doc => {
                    let newDoc = {
                        id: doc.id,
                        name: doc.data().name,
                        questionIDs: doc.data().questionIDs,
                        checked: doc.data().checked,
                        completedIDs: doc.data().completedIDs,
                        developerID: doc.data().developerID,
                        gameID: doc.data().gameID,
                        status: doc.data().status,
                        testerIDs: doc.data().testerIDs,
                    };
                    docs.push(newDoc);
                });
                resolve({success: true, data: docs});
            }
        })
        .catch(e => reject({success: false, error: e}));
    });
}

// Survey.vue
/*
  Get all Questionnaires assgined to the given developer.
  returns a promise with an object with an array of Questionnaire Data
*/
async function getDeveloperSurveys(developerID) {
    return new Promise((resolve, reject) => {
      // check if developer exists
      db.collection("User").doc(developerID).get()
      .then(doc => {
        if (!doc.exists) {
          reject({success: false, error: "developer doesn't exist"})
        }
      }).catch(e => reject(err(e)))
  
      // get all Questionnaires made by the given Developer
      db.collection("Questionnaire")
      .where("developerID", "==", developerID)
      .get()
      .then(docs => {
        // filling in the list of Questionnaire objects
        let survey_list = []
        docs.forEach(doc => {
          let survey = {
            id: doc.id,
            checked: doc.data().checked,
            completedIDs: doc.data().completedIDs,
            developerID: doc.data().developerID,
            gameID: doc.data().gameID,
            name: doc.data().name,
            questionIDs: doc.data().questionIDs,
            status: doc.data().status,
            testerIDs: doc.data().testerIDs
          }
          survey_list.push(survey)
        })
        
        let res = {surveyList: survey_list}
        resolve({success: true, data: res})
      })
      .catch(e => reject(err(e)))
    })
  }

export default {
    getAllSurveys,
    getTesterSurveys,
    getDeveloperSurveys,
}