import firebase from 'firebase'
import {firestore, query, collection, where, getAll} from 'firebase/firestore';
import {db, auth} from '../db';

// helper Function
function err(e) {
  return {success: false, error: e};
}

//AttributeEdit.vue
async function createPlayTesterProfile(testerDetails){
    const {age, behavior, gender, genre, hours, platform, profile, purchasingBehavior, testerId} = testerDetails;
    console.log("before adding to PlayTester");
    console.log(testerDetails);

    function err(e){
        return {success:false, error:e}
    }

    return new Promise((resolve, reject) => {
        db.collection("User").doc(testerId).get()
        .then(doc => {
            // check if user exists
            console.log(doc.exists);
            if (!doc.exists) {
                console.log("user doesn't exist");
                // return {success: false, message: "user does not exist"};
                reject({success: false, error: "user does not exist"});  
            }

            if (doc.data().userType !== "tester") {
                reject({success: false, error: "user is not a tester"});
            } else {
                console.log("user is a tester");
                db.collection("PlayTester").doc(testerId).set({
                    age: age, 
                    behavior: behavior, 
                    gender: gender, 
                    genre: genre, 
                    hours: hours, 
                    platform: platform, 
                    profile: profile, 
                    purchasingBehavior: purchasingBehavior,
                    testerID : testerId,
                })
                .then(() => {
                    console.log("PlayTester Attributes added");
                    resolve({success: true})
                }).catch(e => reject(err(e)));
            }
        }).catch(e => reject(err(e)));
    });
}

// AddTesterItem.vue
/*
    adds a tester (id testerId) to a game (id gameId) if not a tester for the game already
*/
async function createTester(gameId, testerId) {
    function err(e) {
        return {success: false, error: e};
    }
        
    return new Promise((resolve, reject) => {
        // check if game exists
        db.collection("Game").doc(gameId).get()
        .then(doc => {
            if (!doc.exists) {
                reject({success: false, error: "game does not exist"});
            }

            const gameTesterIDs = doc.data().testerIDs;

            // if the user exists and is not in the game, add the user to it
            db.collection("User").doc(testerId).get()
            .then(doc => {
                if (!doc.exists) { // user doesn't exist, send error
                    console.log("user doesn't exist");
                    reject({success: false, error: "user does not exist"});  
                }
                
                if (gameTesterIDs.includes(doc.id) || doc.data().userType !== "tester") {
                    reject({success: false, error: "user is not a tester or is already in the game"});
                } else { // user is not in gametesterIDs array, add them
                    db.collection("Game").doc(gameId).update({
                    
                        testerIDs: [...gameTesterIDs, testerId]
                    })
                    .then(res => {
                        resolve({success: true})
                    }).catch(e => reject(err(e)));
                }
            }).catch(e => reject(err(e)));
        }).catch(e => reject(err(e)));
    });
}

export default {
    createPlayTesterProfile,
    createTester,
}