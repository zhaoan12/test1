import firebase from 'firebase'
import {firestore, query, collection, where, getAll} from 'firebase/firestore';
import {db, auth} from '../db';

// helper Function
function err(e) {
  return {success: false, error: e};
}

//GameDetail-Testers.vue
async function assignTimeSlot(gameId, testerId, timeSlot) {

    function err(e) {
        return {success: false, error: e};
    }

    return new Promise(async (resolve, reject) => {

        // check if this gameid exist in db (not sure if this is necessary)
        db.collection("Game").doc(gameId).get()
        .then(doc => {
            console.log(doc.exists);
            if (!doc.exists) {
                console.log("game does not exist");
                reject({success: false, error: "game does not exist"});  
            }
        }).catch(e => reject(err(e)));

        // check if this user exist in db (not sure if this is necessary)
        db.collection("User").doc(testerId).get()
        .then(doc => {
            console.log(doc.exists);
            if (!doc.exists) {
                console.log("user does not exist");
                reject({success: false, error: "user does not exist"});  
            }
        }).catch(e => reject(err(e)));

        // adding new timeslot to db
        db.collection("Timeslot").doc().set({
            gameId,
            testerId,
            timeSlot
        })
        .then(() => resolve({success: true}))
        .catch(e => reject(err(e)));
    })
}

async function getTimeSlot(gameId, testerId) {
    return new Promise((resolve, reject) => {
        if (gameId === "" || testerId === "") {
            reject(() => {
                return {success: false, error: "'gameId' or 'testerId' were invalid"}
            })
        }
        db.collection("Timeslot")
        .where("gameId", "==", gameId)
        .where("testerId", "==", testerId)
        .limit(1)
        .get()
        .then(querySnap => {
            let res = []
            // not an error if no timeslots
            // if so, then we return empty array
            querySnap.forEach(doc => {
                doc.data().timeSlot.forEach(element => {
                    res.push([element[0], element[1]])
                })
            })
            resolve(() => {return {success: true, data: res}})
        }).catch(e => {reject (() => {return {success: false, error: e}})})
    })
}

//GameDetail-Testers.vue
async function deleteTester(gameId, testerId) {
    function err(e) {
        return {sucess: false, error: e};
    }

    return new Promise(async (resolve, reject) => {
        // check if this gameid exist in db (not sure if this is necessary)
        db.collection("Game").doc(gameId).get()
        .then(doc => {
            console.log(doc.exists);
            if (!doc.exists) {
                console.log("game does not exist");
                reject({success: false, error: "game does not exist"});  
            }
        }).catch(e => reject(err(e)));

        // check if this user exist in testerIDs (not sure if this is necessary)
        db.collection("Game").doc(gameId).get()
        .then(doc => {
            // check if game tester array is empty
            if (!doc.data().testerIDs) {
                console.log("this game document does not have any game testers");
                reject({success: false, error: "this game document does not have any game testers"});  
            }
            // check if this testerId exist inside of game tester array
            if (!doc.data().testerIDs.includes(testerId)) {
                console.log("this game tester does not exisit inside of game testers")
                reject({success: false, error: "this game tester does not exisit inside of game testers"});  
            }

            // delete this testerId from game testerIDs
            db.collection("Game").doc(gameId).update({
                    
                testerIDs: doc.data().testerIDs.filter(tID => tID !== testerId)
            })
            .then(res => {
                // return {success: true};
                resolve({success: true})
            }).catch(e => reject(err(e)));
            
        }).catch(e => reject(err(e)));
    })
}

// create test session - initiated by tester testerID for project projectID
async function createTestSession(testerID, projectID) {
    function err(e) {
      return { success: false, error: e };
    }
    return new Promise(async (resolve, reject) => {
      // adding new test session to db
      db.collection("Test").add({
        testerID: testerID,
        gameID: projectID,
        developerID: null,
        streamToken: null,
        status: 'Created',
        startDateTime: null,
        endDateTime: null,
        testFocus: '',
        notes: []
      })
        .then((docRef) => resolve({success: true, data: docRef.id}))
        .catch(e => reject(err(e)));
    });
  }


  // deprecated
  // get test session for project projectID and validate that testerID/developerID are associated with the project/test session
async function getTestSession(projectID, testerID, developerID) {
    return new Promise(async (resolve, reject) => {
      if (testerID === null && developerID === null) {
        reject(err({ success: false, error: "both testerID and projectID were null" }));
      }
  
      // fetching test session from db
      let q = db.collection("Test")
        .where("projectID", "==", projectID)
        .where("status", "!=", 'Active');
      if (testerID !== null) {
        q = q.where("testerID", "==", testerID);
      }
      if (developerID !== null) {
        q = q.where("developerID", "==", developerID);
      }
  
      q.get().then((qs) => {
        // if the query snapshot is empty  then we know that there are no matching test
        // sessions.
        if (qs.empty) {
          reject({ 
            success: false, 
            error: "no test session matching the given parameters could be found" 
          });
        } else {
          // collect all available test sessions in array `data`, the task did not specify 
          // how to handle multiple test sessions being available, so just return all of
          // them in an array and let the caller decide. 
          let data = [];
          qs.forEach((session) => {
            let new_data = {
              sessionID: session.id,
              projectID: session.data().projectID,
              testerID: session.data().testerID,
              developerID: session.data().developerID,
              status: session.data().status,
              streamToken: session.data().streamToken
            };
            data.push(new_data);
          });
          resolve({ success: true, data: data });
        }
      }).catch((e) => reject({ success: false, error: e }));
    });
  }
  
  // developer(ID) joining an active test session(ID)
  async function joinTestSession(sessionID, developerID) {
    return new Promise(async (resolve, reject) => {
      db.collection("Test").doc(sessionID).get()
      .then((doc) => {
          console.log(doc.data());
        if (!doc.exists) {
          reject({ 
            success: false, 
            error: "test session with given sessionID does not exist" 
          });
  
        } else {
          db.collection("Test").doc(doc.id)
          .update({
              developerID
          })
          .then(res => {
              resolve({ success: true });
          })
          .catch((e) => reject({ success: false, error: e }));
        }
      }).catch((e) => reject({ success: false, error: e }));
    });
  }
  
  // get all test sessions for a given game - used in gamedetails - analysis page
  async function getGameTestSessions(gameID) {
      return new Promise((resolve, reject) => {
          db.collection('Test')
          .where('gameID', '==', gameID)
          .where('status', '==', 'Done')
          .get()
          .then(q => {
              if (q.empty) { // no sessions - return empty array
                  resolve({success: true, data: []});
              } else  {
                  let sessions = [];
                  q.forEach(doc => {
                      let newDoc = {
                          id: doc.id,
                          focus: doc.data().testFocus,
                          startDateTime: doc.data().startDateTime.toDate(),
                          endDateTime: doc.data().endDateTime.toDate(),
                          notes: doc.data().notes
                      }
                      sessions.push(newDoc);
                  });
                  // sort sessions by startDateTime in descending order (most recent at the top) so they're displayed that way
                  sessions = sessions.sort((a,b) => {
                      if (a.startDateTime > b.startDateTime) {
                          return -1;
                      } else if (b.startDateTime > a.startDateTime) {
                          return 1;
                      } else {
                          return 0;
                      }
                  });
                  resolve({success: true, data: sessions});
              }
          })
          .catch(e => reject({success: false, error: e}));
      });
  }
  
  // add new session note with given note text
  async function addSessionNote(sessionID, note) {
      return new Promise((resolve, reject) => {
          db.collection('Test').doc(sessionID)
          .update({
              // get current timestamp from system and use that as the note timestamp
              notes: firebase.firestore.FieldValue.arrayUnion({timestamp: firebase.firestore.Timestamp.now(), text: note})
          })
          .then(ref => {
              console.log({timestamp: firebase.firestore.Timestamp.now(), text: note});
              resolve({success: true});
          })
          .catch(e => reject({success: false, error: e}));
      });
  }
  
  // update session(ID) test (new)focus
  async function updateTestSessionFocus(sessionID, newFocus) {
      return new Promise((resolve, reject) => {
          if (!newFocus || !newFocus.length) reject({success: false, error: "newFocus not defined or is blank"});
          else {
              db.collection('Test').doc(sessionID)
              .update({
                  testFocus: newFocus
              })
              .then(ref => {
                  resolve({success: true});
              })
              .catch(e => reject({success: false, error: e}));
          }
      });
  }
  
  // check if game(ID) has an active test session for tester(ID)
  async function checkGameHasActiveTestSession(gameID, testerID) {
      return new Promise((resolve, reject) => {
          if (gameID===null || gameID==='') reject({success: false, error: "gameID is invalid"});
          else {
              db.collection("Game").doc(gameID).get()
              .then(doc => {
                  if (!doc.exists) reject({success: false, error: "game doesn't exist"});
                  else { // project exists
                      // check if testerID is associated with this game
                      if (testerID && !doc.data().testerIDs.includes(testerID)) reject({success: false, error: "tester is not associated with this game"});
                      else {
                          // check if any test sessions for this project exist and are active
                          db.collection("Test")
                          .where("gameID", "==", doc.id)
                          .where("status", "==", "Active")
                          .get()
                          .then(q => {
                              // no sessions => return
                              if (q.empty) resolve({success: true, data: {activeSessions: false}})
                              else {
                                  // populate test session list and return
                                  let sessions = [];
                                  q.forEach(session => {
                                      let newSession = {
                                          ...session.data(),
                                          sessionID: session.id
                                      }
                                      resolve({success: true, data: {activeSession: true, session: newSession}});
                                  });
                              }
                          })
                          .catch(e => reject({success: false, error: e}));
                      }
                  }
              })
              .catch(e => reject({success: false, error: e}));
          }
      });
  }
  
  // update test session(ID) with current datetime as start date and active status
  async function testerStartTestSession(sessionID) {
      return new Promise((resolve, reject) => {
          db.collection("Test").doc(sessionID).update({
              startDateTime: firebase.firestore.Timestamp.now(),
              status: "Active"
          })
          .then(ref => {
              resolve({success: true});
          })
          .catch(e => reject({success: false, error: e}));
      });
  }
  
  // update test session(ID) with current datetime as end date and done status
  async function testerEndTestSession(sessionID) {
      return new Promise((resolve, reject) => {
          db.collection("Test").doc(sessionID).update({
              endDateTime: firebase.firestore.Timestamp.now(),
              status: "Done"
          })
          .then(ref => {
              resolve({success: true});
          })
          .catch(e => reject({success: false, error: e}));
      });
  }
  
  // get list of developer notes for a test session(ID)
  async function getTestSessionNotes(sessionID) {
      return new Promise((resolve, reject) => {
          db.collection('Test').doc(sessionID)
          .get()
          .then(doc => {
              resolve({success: true, data: doc.data().notes});
          })
          .catch(e => reject({success: false, error: e}));
      });
  }
  
  // get test session(ID) test focus
  async function getTestSessionFocus(sessionID) {
      return new Promise((resolve, reject) => {
          db.collection('Test').doc(sessionID)
          .get()
          .then(doc => {
              resolve({success: true, data: doc.data().testFocus});
          })
          .catch(e => reject({success: false, error: e}));
      });
  }

export default {
    assignTimeSlot,
    getTimeSlot,
    deleteTester,
    createTestSession,
    getTestSession,
    joinTestSession,
    getGameTestSessions,
    addSessionNote,
    getTestSessionNotes,
    updateTestSessionFocus,
    getTestSessionFocus,
    checkGameHasActiveTestSession,
    testerStartTestSession,
    testerEndTestSession,
}