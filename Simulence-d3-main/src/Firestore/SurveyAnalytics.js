import {db} from '../db';

// helper error function
function err(e) {
    return {success: false, error: e};
}

// helper success function
function success(d) {
    return {success: true, data: d}
}

/*
    Get the IDs of all questions in a survey.
    Returns an array of question IDs for the given survey ID.

async function getQuestionIds(sID) { // currently unused
    return new Promise((resolve, reject) => {
        // get survey with sID
        db.collection("Survey").doc(sID)
        .get()            
        .then(doc => {
            // check if survey with sID doesn't exist
            if (!doc.exists) {
                console.log("Survey does not exist");
                reject(err("Survey does not exist"));  
            }

            // get the array of question IDs of this survey
            const qIDs = doc.data().questionIDs;

            // fulfill Promise, and data = array of question IDs
            console.log(qIDs)
            resolve(success(qIDs));
        }).catch(e => reject(err(e)));
    })
}
*/

/*
    Get all of the completed responses to a particular question of a survey.
    Returns an array of Response objects for the given question ID in survey ID.
*/
async function getResponsesByQuestion(sID, qID) {
    return new Promise((resolve, reject) => {
        // check if survey with sID exists
        db.collection("Survey").doc(sID)
        .get()            
        .then(doc => {
            if (!doc.exists) {
                console.log("Survey does not exist");
                reject(err("Survey does not exist"));  
            }
        }).catch(e => reject(err(e)));
    
        // get all completed responses to survey with sID
        db.collection("Response").where("sID", "==", sID).where("status", "==", 1).get()
        .then(querySnapshot => {
            // if the survey has no completed responses yet, resolve with empty array 
            if (querySnapshot.empty) {
                resolve({success: true, data: []});
            }
            
            // else create array containing the completed Response objects 
            const result = [];
            querySnapshot.forEach(doc => {
                const qResponses = [];
                const responses = doc.data().responses;

                // loop through array of responses to each question
                responses.forEach(response => {
                    // only add responses corresponding to qID
                    if (response.index == qID) { // assuming qID is just the index of question in survey
                        qResponses.push(response);
                    }
                })
                
                // create response object with responses only corresponding to qID
                const response = {
                    rID : doc.id,
                    sID : doc.data().sID,
                    testerID : doc.data().testerID,
                    status : doc.data().status,
                    responses : qResponses // should be an array of one object
                }

                result.push(response);
            })

            // fulfill Promise, and data = array of Response objects
            resolve(success(result));
        }).catch(e => reject(err(e)));
    })
}

/*
    Get the analytics of responses to a question of type "multiple-choice" or "dropdown" in a survey.
    Returns a JSON object containing the index of the option chosen as the key and
    the number of responses with that index as the value, given a survey ID and question index.
*/
async function getSurveyAnalyticsCount(sID, qID) {
    return new Promise((resolve, reject) => {
        // get array of response objects
        getResponsesByQuestion(sID, qID)
        .then(p => {
            // assign the returned array to a variable
            const qResponses = p.data;

            // initialize object to store index: count
            const indexCounts = {};
            // loop through response objects
            qResponses.forEach(r => {
                // assign the response value (int) to a variable
                const value = r.responses[0].value;

                // store the value and update number of occurrences (count)
                if (indexCounts[value]) {
                    indexCounts[value] += 1; // if already a key, increment the count
                } else {
                    indexCounts[value] = 1; // if not a key, initialize the count to 1
                }
            })

            // fulfill Promise, and data = object containing option index values and their count
            resolve(success(indexCounts));
        }).catch(e => reject(err(e)));
    })
}

/*
    Get the analytics of responses to a question of type "text" in a survey.
    Returns an array containing all of the text responses, given a survey ID and question index.
*/
async function getSurveyAnalyticsText(sID, qID) {
    return new Promise((resolve, reject) => {
        // get array of response objects
        getResponsesByQuestion(sID, qID)
        .then(p => {
            // assign the returned array to a variable
            const qResponses = p.data;

            // initialize array to store the text responses
            const texts = [];
            // loop through response objects
            qResponses.forEach(r => {
                // add the response value (string) to array
                texts.push(r.responses[0].value);
            })

            // fulfill Promise, and data = array of text responses
            resolve(success(texts));
        }).catch(e => reject(err(e)));
    })
}

/*
    Get the analytics of responses to a question of type "linear-scale" in a survey.
    Returns a JSON object containing the rating as the key and the proportion of responses with that rating
    as the value, given a survey ID and question index.
*/
async function getSurveyAnalyticsProportion(sID, qID) {
    return new Promise((resolve, reject) => {
        // get array of response objects
        getResponsesByQuestion(sID, qID)
        .then(p => {
            // assign the returned array to a variable
            const qResponses = p.data;

            // initialize object to store rating: count
            const ratingCounts = {};

            // initialize count variable
            let totalCount = 0;

            // loop through response objects
            qResponses.forEach(r => {
                // assign the response value (int) to a variable
                const value = r.responses[0].value;

                // store the value and update number of occurrences (count)
                if (ratingCounts[value]) {
                    ratingCounts[value] += 1; // if already a key, increment the count
                } else {
                    ratingCounts[value] = 1; // if not a key, initialize the count to 1
                }
                totalCount++;
            })

            // initialize object to store rating: proportion
            const ratingProportion = {};
            // calculate proportions and store in object
            for (const i in ratingCounts) {
                const count = ratingCounts[i];
                const proportion = count / totalCount;
                ratingProportion[i] = proportion;
            }

            // final object for return, where 
            // total is the total number of responses and data is the rating: proportion object
            const result = {"total": totalCount, "data": ratingProportion};

            // fulfill Promise, and data = result
            resolve(success(result));
        }).catch(e => reject(err(e)));
    })
}

/*
    Get the analytics of responses to a question of type "multi-select" in a survey.
    Returns a JSON object containing the option indices as the key and the number of responses with that
    index as the value, given a survey ID and question index.
*/
async function getSurveyAnalyticsMultiCount(sID, qID) {
    return new Promise((resolve, reject) => {
        // get array of response objects
        getResponsesByQuestion(sID, qID)
        .then(p => {
            // assign the returned array to a variable
            const qResponses = p.data;

            // initialize object to store index: count
            const indexCounts = {};

            // loop through response objects
            qResponses.forEach(r => {
                // assign the response value (array of ints) to a variable
                const arr = r.responses[0].value;
                
                // loop through array
                for (const i in arr) {
                    // store the value and update number of occurrences (count)
                    if (indexCounts[arr[i]]) {
                        indexCounts[arr[i]] += 1; // if already a key, increment the count
                    } else {
                        indexCounts[arr[i]] = 1; // if not a key, initialize the count to 1
                    }
                }
            })

            // fulfill Promise, and data = object containing option index values and their count
            resolve(success(indexCounts));
        }).catch(e => reject(err(e)));
    })
}

export default {
    // getQuestionIds,
    getResponsesByQuestion,
    getSurveyAnalyticsCount,
    getSurveyAnalyticsText,
    getSurveyAnalyticsProportion,
    getSurveyAnalyticsMultiCount
}