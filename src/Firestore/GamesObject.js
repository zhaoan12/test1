import firebase from 'firebase'
import {firestore, query, collection, where, getAll} from 'firebase/firestore';
import {db, auth} from '../db';

// helper Function
function err(e) {
  return {success: false, error: e};
}

// GameInfoEdit.vue
/*
  Updates a game project of the gameId. 
  If gameId is not given, creates a new game project.
*/
async function createProject(gameId, developerID, gameName, company, img, endTime, description, qaLead){
    return new Promise((resolve, reject) => {
      // create(add) a new Game project
      if (gameId === "-1") {
        db.collection("Game").doc().set({
          developerID: developerID,
          gameName,
          company,
          img,
          endTime,
          description,
          qaLead,
          questionnaireIDs: [],
          testerIDs: []
        })
        .then(() => {
          resolve({success: true});
        })
        .catch(e => reject(err(e)));
      // update an existing project
      } else {
        db.collection("Game").doc(gameId).get().
        then(doc => {
          // Check if the game exists
          if (!doc.exists) {
            reject({success: false, error: "game does not exist"});
          }
          // Update the Game project
          db.collection("Game").doc(gameId).update({
            developerID: developerID,
            gameName,
            company,
            img,
            endTime,
            description,
            qaLead
          })
          .then(() => {
            resolve({success: true})
          })
          .catch(e => reject(err(e)))
        })
        .catch(e => reject(err(e)))         
      }
    });
  }

  /*
    remove a game with provided id from game list, and associated game IDs from tester/developer profiles
*/
export async function deleteGame(gameId) {
    return new Promise((resolve, reject) => {
        // developerID of this game
        let developerID = '';
  
        // check if game exists
        db.collection("Game").doc(gameId)
        .get()            
        .then(doc => {
            console.log(doc.exists);
            if (!doc.exists) {
                console.log("game doesn't exist");
                reject({success: false, error: "game doesn't exist"});  
            }
  
            // get the developerID of this game
            developerID = doc.data().developerID
        }).catch(e => reject(err(e)));
  
        // remove game object from Game collection
        db.collection("Game").doc(gameId).delete()
        .then(() => { console.log("Game deleted")}).catch(e => reject(err(e)));
  
        // remove timeSlot associated with gameId
        db.collection("Timeslot")
        .where("gameID", "==", gameId)
        .get()
        .then(docs => {
            docs.forEach(doc => {
                db.collection("Timeslot").doc(doc.id).delete()
                .then(() => { console.log("Deleted a timeslot")})
                .catch(e => reject(err(e)));
            })
        }).catch(e => reject(err(e)));
  
        // remove question associated with gameId, then the questionnaire
        db.collection("Questionnaire")
        .where("gameID", "==", gameId)
        .get()
        .then(surveys => {
            // for each quesionnaire, get its questionIDs
            surveys.forEach(survey => {
                let question_ids = survey.data().questionIDs
                // delete each question in the questionIDs 
                question_ids.forEach(question => {
                    db.collection("Question").doc(question).delete()
                    .then(() => { console.log("Deleted a question") })
                    .catch(e => reject(err(e)));
                })
  
                // delete the questionnaire
                db.collection("Questionnaire").doc(survey.id).delete()
                    .then(() => { console.log("Deleted a questionnaire") })
                    .catch(e => reject(err(e)));
            })
        })
        .catch(e => reject(err(e)));
  
        resolve({success: true});
    })
  }

  // GameDetails.vue
/*
  Get the given Game project.
  return a promise with an object of Game Data.
*/
async function getProject(gameId){
    return new Promise((resolve, reject) => {
          db.collection("Game").where(firebase.firestore.FieldPath.documentId(), "==", gameId).get()
          .then(querySnapshot => {
              if (querySnapshot.empty) {
                  reject({success: false, error: "the game was not found"});
              } else {
                  querySnapshot.forEach(doc => {
                      // const testerIDsLength = doc.data().testerIDs ? doc.data().testerIDs : 0;
                      const newProject = {
                          testerIds: doc.data().testerIDs,
                          description: doc.data().description,
                          img: doc.data().img,
                          company: doc.data().company,
                          // endTime: doc.data().endTime,
                          gameName: doc.data().gameName,
                          qaLead: doc.data().qaLead,
                          // testerNum: testerIDsLength,
                          gameId: doc.id,
                          developerID: doc.data().developerID,
                          // questionnaireIdList: doc.data().questionnaireIdList,
                          // lastUpdatedQuestionnaire: doc.data().lastUpdatedQuestionnaire,
                      };
                      resolve({success: true, data: newProject});
                  });
              }
          })
          .catch(e => reject(err(e)));
      });
  }

  // Calendar.vue
/*
    get array of games for a specific user in a provided time frame, organized by game end date
*/
async function getCalendar(userId, queryTime) {
    function err(e) {
        return {success: false, error: e};
    }

    /*
        return the next month given a yearmonth (e.g., 2022-10 for October 2022) as input
    */
    function nextMonth(yearmonth) {
        const [inputYear, inputMonth] = yearmonth.split("-");
        let newYear = inputYear;
        let newMonth = "";
        if (+inputMonth==12) {
            newMonth="01";
            newYear=`${+newYear+1}`;
        } else if (+inputMonth < 9) {
            newMonth=`0${+inputMonth+1}`;
        } else {
            newMonth=`${+inputMonth+1}`;
        }
        return parseInt(`${newYear}${newMonth}`);
    }

    return new Promise((resolve, reject) => {
        // if userid is blank (is admin) then return all games
        if (userId==="") {
            db.collection("Game").get()
            .then(querySnapshot => {
                if (querySnapshot.empty) {
                    reject({success: false, error: "no games found for admin"});
                } else {
                    let res = [];
                    querySnapshot.forEach(doc => {
                        // calculate provided and current end yearmonth
                        let nextYearMonth = nextMonth(doc.data().endTime);
                        const [endYear, endMonth] = doc.data().endTime.split("-");
                        const endTime = parseInt(`${endYear}${endMonth}`);

                        const [queryYear, queryMonth] = queryTime.split("-");
                        const queryTimeInt = parseInt(`${queryYear}${queryMonth}`);

                        // check if the end datetime for the current game is in the current month (before the next month)
                        //      and the end datetime for the current game is after the provided yearmonth 
                        if (endTime < nextYearMonth && endTime > queryTimeInt) {
                            console.log("get length");
                            const testerIDsLength = doc.data().testerIDs ? doc.data().testerIDs.length : 0;
                            console.log(testerIDsLength);

                            // create game template and add to temp res array
                            let newDoc = {
                                gameName: doc.data().gameName,
                                gameStudio: doc.data().company,
                                endTime: doc.data().endTime,
                                img: doc.data().img,
                                gameId: doc.id,
                                devId: doc.data().developerID,
                                testerNum: testerIDsLength,
                            }
                            res.push(newDoc);
                        }
                    });
                    // return - send success and games array (res)
                    resolve({success: true, data: res});
                }
            }).catch(e => reject(err(e)));
        } else {
            db.collection("Game").where("developerID", "==", userId).get()
            .then(querySnapshot => {
                console.log(querySnapshot)
                if (querySnapshot.empty) {
                    reject({success: false, error: "no games found for this developer"});
                } else {
                    let res = [];
                    querySnapshot.forEach(doc => {
                        // calculate provided and current end yearmonth
                        let nextYearMonth = nextMonth(doc.data().endTime);
                        const [endYear, endMonth] = doc.data().endTime.split("-");
                        const endTime = parseInt(`${endYear}${endMonth}`);

                        const [queryYear, queryMonth] = queryTime.split("-");
                        const queryTimeInt = parseInt(`${queryYear}${queryMonth}`);

                        // check if the end datetime for the current game is in the current month (before the next month)
                        //      and the end datetime for the current game is after the provided yearmonth 
                        if (endTime < nextYearMonth && endTime > queryTimeInt) {
                            console.log("get length");
                            const testerIDsLength = doc.data().testerIDs ? doc.data().testerIDs.length : 0;
                            console.log(testerIDsLength);

                            // create game template and add to temp res array
                            let newDoc = {
                                gameName: doc.data().gameName,
                                gameStudio: doc.data().company,
                                endTime: doc.data().endTime,
                                img: doc.data().img,
                                gameId: doc.id,
                                devId: doc.data().developerID,
                                testerNum: testerIDsLength,
                            }
                            res.push(newDoc);
                        }
                    });
                    // return - send success and games array (res)
                    resolve({success: true, data: res});
                }
            }).catch(e => reject(err(e)));
        }
    });
}

// Calendar.vue
/*
    get array of games for a specific user in a provided time frame, organized by game end date
*/
async function getTesterCalendar(userId, queryTime) {
    function err(e) {
        return {success: false, error: e};
    }

    function nextMonth(yearmonth) {
        const [inputYear, inputMonth] = yearmonth.split("-");
        let newYear = inputYear;
        let newMonth = "";
        if (+inputMonth==12) {
            newMonth="01";
            newYear=`${+newYear+1}`;
        } else if (+inputMonth < 9) {
            newMonth=`0${+inputMonth+1}`;
        } else {
            newMonth=`${+inputMonth+1}`;
        }
        return parseInt(`${newYear}${newMonth}`);
    }

    return new Promise(async (resolve, reject) => {
        // if userid is blank (is admin) then return all games
        if (userId==="") {
            reject(err("User is not a tester"));
        } else {
            let calendarList = [];
            let sectionObj = {};
            // get timeslots for current user
            await db.collection("Timeslot").where("testerID", "==", userId).get()
            .then(querySnapshot => {
                if (querySnapshot.empty) {
                    resolve({success: true, data: []});
                } else {
                    for (const doc of querySnapshot.docs) {
                        // doc is a Timeslot document
                        for (const slot of doc.data().timeslot) {
                            // slot is object of {startTime:_, endTime:_}
                            const startTimestamp = slot.startTime;
                            const queryTimestamp = Date.parse((queryTime+"-01 00:00:00"))/1000;
                            const nextMonthTimestamp = Date.parse(nextMonth(queryTime)+"-01 00:00:00")/1000;
                            // check for timeslot matching inputted datetime
                            if (startTimestamp > queryTimestamp && startTimestamp < nextMonthTimestamp) {
                                if (sectionObj[doc.data().gameID]) {
                                    sectionObj[doc.data().gameID].push(slot);
                                } else {
                                    sectionObj[doc.data().gameID] = [slot];
                                }
                            }
                        };
                    }
                }
            }).catch(e => reject(err(e)));
            // loop through all games in section
            for (const key in sectionObj) {
                const section = sectionObj[key];
                // if there's data in the current game
                if (section.length) {
                    // get game document for current game
                    await db.collection("Game").where(firebase.firestore.FieldPath.documentId(), "==", key).get()
                    .then(querySnapshot2 => {
                        console.log(querySnapshot2);
                        if (querySnapshot2.empty) {
                            resolve({success: true, data: []});
                        } else {
                            for (const game of querySnapshot2.docs) {
                                const testerIDsLength = game.data().testerIDs ? game.data().testerIDs.length : 0;
                                let newGame = {
                                    gameId: game.id,
                                    gameName: game.data().gameName,
                                    img: game.data().img,
                                    endTime: game.data().endTime,
                                    devId: game.data().developerID,
                                    testerNum: testerIDsLength,
                                    timeSlots: section,
                                }
                                calendarList.push(newGame);
                            };
                        }
                    })
                    .catch(e => reject(err(e)));
                }
            }
            // return - send success and games array (res)
            resolve({success: true, data: calendarList});
        }
    });
}

export default {
    createProject,
    deleteGame,
    getProject,
    getCalendar,
    getTesterCalendar,
}