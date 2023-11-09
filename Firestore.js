import firebase from 'firebase'
import {firestore, query, collection, where, getAll} from 'firebase/firestore';
import {db, auth} from './db';

// helper Function
function err(e) {
  return {success: false, error: e};
}

// BarGraph.vue
/*
    get array of answer documents from Answer collection that have surveyId and questionId matching function parameters
*/
async function getAnswers(surveyId, questionId) {
    function err(e) {
        return {success: false, error: e};
    }

    return new Promise((resolve, reject) => {
        // get all answers for a given survey and question
        var query = db.collection("Answer");
        query = query.where("questionnaireID", "==", surveyId);
        query = query.where("questionID", "==", questionId);
        query.get()
        .then(docs => {
            // no answers matching parameters
            if (docs.length===0) reject(err("no answers for provided question or questionnaire"));
            let res = [];
            docs.forEach(doc => {
                // add each answer to temp res array
                let newDoc = {
                    surveyID: doc.data().surveyID,
                    questionID: doc.data().questionID,
                    testerID: doc.data().testerID,
                    content: doc.data().content,
                }
                res.push(newDoc);
            })
            // return - send success and res array
            resolve({success: true, data: res});
        })
        .catch(e => reject(err(e)));
    });
}

// AdminViewSurveyQuestions.vue
/*
    get list of questions from Question collection matching inputted questionIDs
*/
async function getQuestions(questionIDs) {
    function err(e) {
        return {success: false, error: e};
    }

    return new Promise((resolve, reject) => {
        // return empty array when no questionIDs provided
        if (questionIDs.length === 0) {
            resolve({success: true, data: []});
        } else {
            // check for document IDs that match inputted questionIDs
            db.collection("Question").where(firebase.firestore.FieldPath.documentId(), "in", questionIDs).get()
            .then(docs => {
                let questions = [];
                docs.forEach(doc => {
                    // for each found, add to temp quesitons array
                    const newQuestion = {
                        content: doc.data().content,
                        inTemplate: doc.data().inTemplate,
                        options: doc.data().options,
                        type: doc.data().type,
                    };
                    questions.push(newQuestion);
                });
                // return - send questions array
                resolve({success: true, data: questions});
            })
            .catch(e => reject(err(e)));
        }

    });
}

// GameDeatil-Testers.vue
async function getAllResponses(testerId) {
    function err(e) {
        return {success: true, error: e};
    }

    // assuming it returns all reponses for this game's questionnaire done by this tester
        //     what should return
        // - questionnaireIDs from Game collection
        // - loopthrough Answer collection matching questionnaireID
        // -> if testerId match, return content + questionnaireID
    return new Promise((resolve, reject) => {
        // check if this user exists
        db.collection("User").doc(testerId).get()
        .then(doc => {
            console.log(doc.exists);
            if (!doc.exists) {
                console.log("user does not exist");
                reject({success: false, error: "user does not exist"});
            } else {
                db.collection("Game").where('testerIDs', 'array_contains', testerId).get()
                .then(querySnapshot => {
                    if (querySnapshot.empty) {
                        reject(err("this user have not recorded any responses"));
                    } else {
                        let docs = [];
                        querySnapshot.forEach(d => {
                            d.data().questionIDs.forEach(question => {
                                db.collection('Answer')
                                .where('questionnaireID', '==', question)
                                .where('testerID', '==', testerId).get()
                                .then(testerContent => {
                                let newDoc = {
                                    content: testerContent.content,
                                    questionID: testerContent.questionID,
                                    questionnaireID: testerContent.questionnaireID,
                                    testerID: testerId
                                };
                                docs.push(newDoc);
                                })
                                .catch(e => reject(err(e)));
                            })
                        })
                        resolve({success: true, data: docs});
                    }

                }).catch(e => reject(err(e)));
            }
        }).catch(e => reject(err(e)));
    })
}

// Dashboard.vue
/*
    return a list of projects assigned to the given tester
*/
async function getTesterProjects(testerId) {
  return new Promise((resolve, reject) => {
      db.collection("Game").where("testerIDs", "array-contains", testerId).get()
      .then(querySnapshot => {
          if (querySnapshot.empty) { // return error if no surveys found
              reject(err("no projects found"));
          } else {
              let docs = [];
              // get projects, add to temp array and return success with temp array
              querySnapshot.forEach(doc => {
                let newDoc = {
                  gameId: doc.id,
                  devId: doc.data().developerID,
                  gameName: doc.data().gameName,
                  gameStudio: doc.data().company,
                  endTime: doc.data().endTime,
                  img: doc.data().img,
                  description: doc.data().description,
                  qaLead: doc.data().qaLead,
                  questionnaireIDs: doc.data().questionnaireIDs
                }
                  docs.push(newDoc);
              });
              resolve({success: true, data: docs});
          }
      })
      .catch(e => reject({success: false, error: e}));
  });
}

// Dashboard.vue
/*
    return a list of projects owned by the given dev
*/
async function getDevProjects(devId) {
  return new Promise((resolve, reject) => {
      db.collection("Game").where("developerID", "==", devId).get()
      .then(querySnapshot => {
          if (querySnapshot.empty) { // return error if no surveys found
              reject(err("no projects found"));
          } else {
              let docs = [];
              // get projects, add to temp array and return success with temp array
              querySnapshot.forEach(doc => {
                let newDoc = {
                  gameId: doc.id,
                  devId: doc.data().developerID,
                  gameName: doc.data().gameName,
                  gameStudio: doc.data().company,
                  endTime: doc.data().endTime,
                  img: doc.data().img,
                  description: doc.data().description,
                  qaLead: doc.data().qaLead,
                  questionnaireIDs: doc.data().questionnaireIDs
                }
                  docs.push(newDoc);
              });
              resolve({success: true, data: docs});
          }
      })
      .catch(e => reject({success: false, error: e}));
  });
}

export default {
    getAnswers,
    getQuestions,
    getAllResponses,
    getTesterProjects,
    getDevProjects
}
