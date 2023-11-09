import firebase from 'firebase'
import {firestore, query, collection, where, getAll} from 'firebase/firestore';
import {db, auth} from '../db';

// helper Function
function err(e) {
  return {success: false, error: e};
}

// Login.vue
/*
    register user with provided details if not already a user, or error if already a user or incorrect details provided
*/
async function registerUser(userDetails) {
    const {name, userType, email, password, img} = userDetails;
    console.log("before register");
    console.log(userDetails);
    return new Promise((resolve, reject) => {
        db.collection("User").where("email", "==", email).get()
        .then(user => {
            // check if user exists already
            if (user.exists) {
                reject({success: false, error: "User with this email already exists"});
                console.log("register: user exists");
            }
            else {
                console.log("user doesn't exist");
                // use Firebase Auth to create a new user with provided email and password
                auth.createUserWithEmailAndPassword(email, password)
                .then(doc => {
                    // add user to database with ID that we get from firebase Auth new user
                    db.collection("User").doc(auth.currentUser.uid)
                    .set({
                        email,
                        img,
                        userName: name,
                        userType,
                    })
                    .then(() => {
                        //new user added
                        console.log("new user added");
                        const auth_userid = auth.currentUser.id;
                        auth.signOut().then(() => {
                            // sign user out since they're automatically signed in when firebase auth creates the user
                            console.log("logged out");
                            resolve({success: true, data: {id: auth_userid, userType: userType}});
                        });
                    })
                    .catch(e => reject({success: false, error: e}));
                })
            }
        })
        .catch(e => reject({success: false, error: e}));
    });
}

// Login.vue
/*
    log a user in with provided details if user exists and login info is valid. Send error otherwise
*/
async function loginUser(userDetails) {
    const {email, password} = userDetails;

    return new Promise((resolve, reject) => {
        // send error if a user is already logged in
        if (auth.currentUser) reject({success: false, error: "user already logged in"});
        db.collection("User").where("email", "==", email).get()
        .then(querySnapshot => {
            // send error if no user with provided email exists
            if (querySnapshot.empty) {reject(err("unidentified email"));}

            querySnapshot.forEach(doc => {
                // using forEach here but only expecting one user in querySnapshot
                auth.signInWithEmailAndPassword(email, password)
                .then(user => {
                    resolve({success: true, data: {id: auth.currentUser.uid, userType: doc.data().userType}});
                })
                .catch(e => reject({success: false, error: e}));
            });
            
        })
        .catch(e => reject({success: false, error: e}));
    });
}

// ?? NavBar.vue ??
async function logoutUser() {
    return new Promise((resolve, reject) => {

        if (auth.currentUser===null) reject({success: false, error: "no user logged in"});

        auth.signOut()
        .then(() => {
            console.log(auth.currentUser);
            resolve({success: true});
        })
        .catch(e => reject({success: false, error: e}));
    });
}

// UserProfile.vue
/*
  Update the given User's profile.
*/
async function updateProfile(userId, userName, nickName, gender, bio, email, workphone, mobile, password, img) {
    return new Promise((resolve, reject) => {
        // check if user exists
        db.collection("User").doc(userId).get()
        .then(doc => {
          if (!doc.exists) {
              reject({success: false, error: "user doesn't exist"});  
          }
  
          // if the arguments are undefined, set them to an empty string to satisfy firestore requirements
          if (!userId) userId = ""
          if (!userName) userName = ""
          if (!nickName) nickName = ""
          if (!gender) gender = ""
          if (!bio) bio = ""
          if (!email) email = ""
          if (!workphone) workphone = ""
          if (!mobile) mobile = ""
          if (!password) password = ""
          if (!img) img = ""
  
          // update user profile
          db.collection("User").doc(userId).update({
            userId: userId,
            userName: userName,
            nickName: nickName,
            gender: gender,
            bio: bio,
            email: email,
            workPhone: workphone,
            mobile: mobile,
            password: password,
            img: img
          })
          .then(() => {
            resolve({success: true})
          })
          .catch(e => reject(err(e)))
      })
      .catch(e => reject(err(e)))
    })
  }
  // Get the profile of the given User.
// return a promise with an object of User data.
async function getProfile(userId){
    return new Promise((resolve, reject) => {
      // Get the User.
      db.collection("User").doc(userId).get()
      .then(doc => {
        if (!doc.exists) {
            reject({success: false, error: "no user found with given user id"})
        } else {
          const newProfile = {
            userName: doc.data().userName,
            nickName: doc.data().nickName,
            img: doc.data().img,
            email: doc.data().email,
            workPhone: doc.data().workPhone,
            mobile: doc.data().mobile,
            gender: doc.data().gender,
            bio: doc.data().bio,
          }
          resolve({success: true, data: newProfile})
        }
      })
      .catch(e => reject(err(e)))
    })
  }

  // Users.vue
/*
  Delete the given User.
*/
export async function deleteUser(userId) {
    return new Promise((resolve, reject) => {
      // check if user exists
      db.collection("User").doc(userId).get()
      .then(doc => {
        if (!doc.exists) {
          reject({success: false, error: "user doesn't exist"})  
        }
  
        // delete user
        db.collection("User").doc(userId).delete()
        .then(() => {
          resolve({success: true})
        })
        .catch(e => reject(err(e)))
      })
      .catch(e => reject(err(e)))
    })
  }
  export default {
    registerUser,
    loginUser,
    logoutUser,
    updateProfile,
    getProfile,
    deleteUser,
  }
