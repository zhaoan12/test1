import {db} from '../db';
import Template from './Template';

function err(e) {
    return { success: false, error: e };
}

/* Create a Response object for the tester assigned to this survey */
async function assignSurvey(sID, testerID) {
    return new Promise((resolve, reject) => {
        db.collection("Response").where("sID", "==", sID).where("testerID", "==", testerID).get()
        .then(querySnapshot => {
            if (!querySnapshot.empty) {
                console.log("Response already exists");
                resolve({success: false});
            } else {
                db.collection("Response").add({
                    sID: sID,
                    testerID: testerID,
                    status: 0,
                    responses: null,
                })
                .then((docRef) => {
                    // console.log("Response created with ID: ", docRef.id);
                    resolve({success: true});
                })
                .catch(e => reject(err(e)))
            }
        })
        .catch(e => reject(err(e)))
    })
}

async function assignSurveyToAll(sID, testerIDs){
    await Promise.all(testerIDs.map(testerID => assignSurvey(sID, testerID)));
    await Template.setSurveyStatus(sID, 1);
}

/* Saves a tester's response to a survey
   Once all responses to a survey are completed, sets survey status to 2 ("closed")
*/
async function saveResponses(sID, testerID, responses) {
    return new Promise((resolve, reject) => {
        
        db.collection("Response").where("sID", "==", sID).where("testerID", "==", testerID).get()
        .then(querySnapshot => {
            console.log("HI")
            if (querySnapshot.empty) {
                db.collection("Response").add({
                    sID: sID,
                    testerID: testerID,
                    status: 1,
                    responses: responses,
                })
                resolve({success: true})
            } else {
                querySnapshot.forEach((doc) => {
                    // there should only be one repsonse
                    let rID = doc.id
                    // console.log("Update id: ", rID);
                    db.collection("Response").doc(rID).update({
                        responses: responses,
                        status: 1,
                    })
                    .then(() => {
                        // console.log("Responses saved");

                        db.collection("Response").where("sID", "==", sID).where("status", "==", 1).get()
                        .then(responseQuery => {
                            db.collection("Survey").doc(sID).get()
                            .then(surveyQuery => {
                                // console.log("Number of testers: ", surveyQuery.data().testerIDs.length);
                                // console.log("Number of responses: ", responseQuery.size);
                                if (surveyQuery.data().testerIDs.length === responseQuery.size) {
                                    // setSurveyCompleted
                                    // console.log("Survey completed!");
                                    Template.setSurveyStatus(sID, 2);
                                } else {
                                    // console.log("Survey incompleted");
                                }
                                resolve({success: true});
                            })
                            .catch(e => {
                                console.log("Error in querying survey");
                                reject(err(e))
                            })
                        })
                        .catch(e => {
                            console.log("Error in querying Response");
                            reject(err(e))
                        })

                    })
                    .catch(e => {
                        console.log(e)
                        reject(err(e))
                    })
                })
            }
        })
    })
}

async function getResponsesByTester(testerID) {
    return new Promise(async (resolve, reject) => {
        await db.collection("Response").where("testerID", "==", testerID).get()
        .then(querySnapshot => {
            if (querySnapshot.empty) { // this testerID does not have any response yet, send empty array
                resolve({success: true, data: []});
            } else {
                let result = [];
                querySnapshot.forEach(doc => {
                    let response = {
                        rID : doc.id,
                        sID : doc.data().sID,
                        testerID : doc.data().testerID,
                        status : doc.data().status,
                        responses : doc.data().responses,
                    }
                    result.push(response);
                })
                // console.log("result: ", result);
                resolve({success: true, data: result});
            }
        })
        .catch(e => reject(err(e)));
    })
}

async function getResponsesBySurvey(sID) {
    return new Promise(async (resolve, reject) => {
        await db.collection("Response").where("sID", "==", sID).get()
        .then(querySnapshot => {
            if (querySnapshot.empty) { // this sID does not have any response yet, send empty array
                resolve({success: true, data: []});
            } else {
                let result = [];
                querySnapshot.forEach(doc => {
                    let response = {
                        rID : doc.id,
                        sID : doc.data().sID,
                        testerID : doc.data().testerID,
                        status : doc.data().status,
                        responses : doc.data().responses,
                    }
                    result.push(response);
                })
                // console.log("result: ", result);
                resolve({success: true, data: result});
            }
        })
        .catch(e => reject(err(e)));
    })
}

async function getCompletedResponses(sID) {
    return new Promise(async (resolve, reject) => {
        await db.collection("Response").where("sID", "==", sID).where("status", "==", 1).get()
        .then(querySnapshot => {
            if (querySnapshot.empty) { // this sID does not have any response yet, send empty array
                resolve({success: true, data: []});
            } else {
                let result = [];
                querySnapshot.forEach(doc => {
                    let response = {
                        rID : doc.id,
                        sID : doc.data().sID,
                        testerID : doc.data().testerID,
                        status : doc.data().status,
                        responses : doc.data().responses,
                    }
                    result.push(response);
                })
                // console.log("result: ", result);
                resolve({success: true, data: result});
            }
        })
        .catch(e => reject(err(e)));
    })
}

/* Returns all incomplete Response objects (status == 0) for a specific tester and project */
async function getIncompleteResponsesByTesterProject(testerID, gameID) {
    return new Promise(async (resolve, reject) => {
        // get surveys that are under the given project
        let surveyResult = await Template.getSurveysByGameID(gameID);
        let surveyIDs = surveyResult.data.map(survey => survey.sID)

        await db.collection("Response").where("testerID", "==", testerID).where("sID", "in", surveyIDs).where("status", "==", 0).get()
        .then(querySnapshot => {
            if (querySnapshot.empty) { // no corresponding response yet, send empty array
                resolve({success: true, data: []});
            } else {
                let result = [];
                querySnapshot.forEach(doc => {
                    let response = {
                        rID : doc.id,
                        sID : doc.data().sID,
                        testerID : doc.data().testerID,
                        status : doc.data().status,
                        responses : doc.data().responses,
                    }
                    result.push(response);
                })
                // console.log("result: ", result);
                resolve({success: true, data: result});
            }
        })
        .catch(e => reject(err(e)));
    })
}

async function deleteResponses(sID, testerID) {
    return new Promise((resolve, reject) => {
        db.collection("Response").where("sID", "==", sID).where("testerID", "==", testerID).get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                console.log("Could not find response with given sID and testerID");
                resolve({success: false});
            } else {
                querySnapshot.forEach((doc) => {
                    let rID = doc.id
                    // console.log("Delete id: ", rID);
                    db.collection("Response").doc(rID).delete()
                    .then(() => {
                        // console.log("Delete response with id ", rID);
                        resolve({success: true});
                    })
                    .catch(e => reject(err(e)))
                })
            }
        })
        .catch(e => reject(err(e)))
    })
}

export default {
    assignSurvey,
    assignSurveyToAll,
    saveResponses,
    getResponsesByTester,
    getResponsesBySurvey,
    getCompletedResponses,
    getIncompleteResponsesByTesterProject,
    deleteResponses, 
}