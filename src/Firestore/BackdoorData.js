import {db} from '../db';

async function logAllUsers() {
    await db.collection("User").get().then(
        (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id)
                console.log(doc.data())
            })
        }
    )
}

async function logAllGames() {
    await db.collection("Game").get().then(
        (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id)
                console.log(doc.data())
            })
        }
    )
}

async function logAllPlaytesters() {
    await db.collection("PlayTester").get().then(
        (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id)
                console.log(doc.data())
            })
        }
    )
}

async function logAllResponses() {
    await db.collection("Response").get().then(
        (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id)
                console.log(doc.data())
            })
        }
    )
}

async function logAllSurveys() {
    await db.collection("Survey").get().then(
        (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id)
                console.log(doc.data())
            })
        }
    )
}

async function logAll() {
    await logAllGames()
    await logAllPlaytesters()
    await logAllUsers()
    await logAllResponses()
    await logAllSurveys()
}

async function addGame() {
    await db.collection("Game").doc("WJcUsN11pSxGvP5IX3yV").set({
        "gameName": "Test",
        "developerID": "Js3kHsBGUieAZa3PGB3KbBkB4tF2",
        "qaLead": {
            "name": "",
            "mobile": "",
            "email": "",
            "workPhone": ""
        },
        "company": "",
        "description": "",
        "img": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAABr4SURBVHgB7d2JchNJtgbgGuMFY4zB0HQ3dPdM3Pv+LzHzHHdihmbHeMXY8kJfHbmLNkYlyakqKav0fREOFu+2lH+dPJlZf/vXP//5RwEAt/PHUgEACQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEkECABJBAgASQQIAEmWC2ixpaWlYunOnWJ5eXnw9ztLd/r/Xhr8fWV55ept+q+Pf4d4u+vuXHvdJL58+VJcXl5+8+94KV2cnw/+PL84//PfF8Xll8uvbxevv/720GYChGyV4bC6ulqsrKwMBv8IiOXy77cc/Gv7mkZ9zvX1YhLn/SC5uLgYhMn5+dng7+d/hstZrydkaAUBwtzFgLy6tlas9V8iGFZWVr+GRlfF9/bX97fx3esjQHp/Bkmvdzr4e4RMhAvkQoAwUxEWd/tX6ev9l0UIilTxc1r/s5rZ2PgrYMpgiVA5650VvbOeUGFuBAiNisoiBsK11bVBcAiL6ZTBsn5tqqwMlZOTz/2XE1NgzIwAoVbRn4gr5vX1e4NBbtY9ikU0LFQiSMpAOe2/QBMECFOLyiJCY2PjvgojE9cDJaqRCJLjT5+K4+NPqhNqI0BIUobG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",
        "testerIDs": [
            "ZyMLD7mYbredPEHVJDJvwb57SwX2",
            "ys92xoQir1N07kJ4wXGydVZMjVx2"
        ],
        "endTime": "2023-01-01T00:00:00",
        "questionnaireIDs": []
    })
}

async function addTesters() {
    await db.collection("PlayTester").doc("ZyMLD7mYbredPEHVJDJvwb57SwX2").set({
        "hours": [
            "0-5"
        ],
        "platform": [
            "Mobile"
        ],
        "purchasingBehavior": [
            "One Time Game Purchases"
        ],
        "behavior": [
            "Completion"
        ],
        "profile": [
            "Gamer in a Past Life"
        ],
        "gender": [
            "Male"
        ],
        "age": [
            "<18"
        ],
        "genre": [
            "Adventure",
            "Casual/Puzzle"
        ],
        "testerID": "ZyMLD7mYbredPEHVJDJvwb57SwX2"
    })
    await db.collection("PlayTester").doc("ys92xoQir1N07kJ4wXGydVZMjVx2").set({
        "behavior": [
            "Competition",
            "Community/Social"
        ],
        "genre": [
            "Casual/Puzzle",
            "Multiplayer Online"
        ],
        "hours": [
            "0-5"
        ],
        "profile": [
            "Gamer in a Past Life",
            "Popcorn/Recreational"
        ],
        "testerID": "ys92xoQir1N07kJ4wXGydVZMjVx2",
        "platform": [
            "Mobile",
            "Game Console"
        ],
        "purchasingBehavior": [
            "One Time Game Purchases",
            "Additional Game Content",
            "Free to Play",
            "Cosmetics"
        ],
        "age": [
            "<18"
        ],
        "gender": [
            "Male"
        ]
    })
}

async function addUsers() {
    await db.collection("User").doc("Js3kHsBGUieAZa3PGB3KbBkB4tF2").set({
        "img": "data:image/png;base64,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",
        "userType": "developer",
        "userName": "Dev",
        "email": "devSimulence@gmail.com"
    })
    await db.collection("User").doc("ZyMLD7mYbredPEHVJDJvwb57SwX2").set({
        "userId": "ZyMLD7mYbredPEHVJDJvwb57SwX2",
        "email": "testerSimulence@gmail.com",
        "img": "data:image/png;base64,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",
        "userType": "tester",
        "gender": "Male",
        "mobile": "",
        "workPhone": "",
        "nickName": "",
        "password": "",
        "userName": "Tester",
        "bio": ""
    })
    await db.collection("User").doc("ys92xoQir1N07kJ4wXGydVZMjVx2").set({
        "email": "tester2Simulence@gmail.com",
        "img": "data:image/png;base64,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",
        "userType": "tester",
        "userName": "tester2"
    })
}

async function addResponses() {
    await db.collection("Response").doc("Lls5OZy5j5KM5air8r6l").set({
        "testerID": "ys92xoQir1N07kJ4wXGydVZMjVx2",
        "status": 1,
        "sID": "KjMwKbjDbAxPwOhKsOEi",
        "responses": [
            {
                "value": 1,
                "index": 0
            },
            {
                "index": 1,
                "value": [
                    1
                ]
            },
            {
                "value": 0,
                "index": 2
            },
            {
                "value": "1",
                "index": 3
            },
            {
                "value": 4,
                "index": 4
            }
        ]
    })
    await db.collection("Response").doc("yTfHOKn9kR73NOD8uolZ").set({
        "sID": "KjMwKbjDbAxPwOhKsOEi",
        "responses": [
            {
                "index": 0,
                "value": 1
            },
            {
                "index": 1,
                "value": [
                    2,
                    1,
                    4
                ]
            },
            {
                "value": 0,
                "index": 2
            },
            {
                "value": "123Text",
                "index": 3
            },
            {
                "value": 6,
                "index": 4
            }
        ],
        "testerID": "ZyMLD7mYbredPEHVJDJvwb57SwX2",
        "status": 1
    })
}

async function addSurvey() {
    await db.collection("Survey").doc("KjMwKbjDbAxPwOhKsOEi").set({
        "status": 1,
        "developerID": "Js3kHsBGUieAZa3PGB3KbBkB4tF2",
        "testerIDs": [],
        "questions": [
            {
                "content": {
                    "title": "q1MC",
                    "options": [
                        {
                            "text": "1Option1",
                            "imgSrc": ""
                        },
                        {
                            "imgSrc": "",
                            "text": "1Option2"
                        },
                        {
                            "imgSrc": "",
                            "text": "1Option3"
                        },
                        {
                            "text": "1Option4",
                            "imgSrc": ""
                        },
                        {
                            "text": "1Option5",
                            "imgSrc": ""
                        }
                    ]
                },
                "qType": "multi-choice"
            },
            {
                "content": {
                    "options": [
                        "2Option1",
                        "2Option2",
                        "2Option3",
                        "2Option4",
                        "2Option5"
                    ],
                    "title": "q2MS"
                },
                "qType": "multi-select"
            },
            {
                "content": {
                    "title": "q3Dropdown",
                    "options": [
                        "3Option1",
                        "3Option2",
                        "3Option3",
                        "3Option4"
                    ]
                },
                "qType": "dropdown"
            },
            {
                "content": {
                    "title": "q4Text",
                    "imgSrc": ""
                },
                "qType": "text-answer"
            },
            {
                "content": {
                    "startLabel": "Low",
                    "endLabel": "High",
                    "start": 1,
                    "end": "7",
                    "title": "q5Scale"
                },
                "qType": "linear-scale"
            }
        ],
        "gameID": "WJcUsN11pSxGvP5IX3yV",
        "name": "TestSurvey",
        "description": "aszdasdf",
        "tags": [
            "Mechanics",
            "Environment"
        ],
        "name_lower": "testsurvey"
    });
}

async function addAll() {
    await addGame();
    await addTesters();
    await addUsers();
    await addResponses();
    await addSurvey();
}

// Removes all responses to a given survey
async function removeAllResponses(sID) {
    return new Promise((resolve, reject) => {
        // get all responses corresponding to sID
        db.collection("Response").where("sID", "==", sID)
        .get()
        .then(querySnapshot => {
            if (querySnapshot.empty) {
                console.log("Could not find response with given sID and testerID");
                resolve({success: false});
            } else {
                querySnapshot.forEach((doc) => {
                    db.collection("Response").doc(doc.id).delete();
                })
                resolve({success: true});
            }
        }).catch(e => reject(err(e)));
    });
}


async function getSurveyById(sID) {
    return new Promise(async (resolve, reject) => {
        try {
            await db.collection('Survey').doc(sID).get().then((res) => {
                resolve(res.data())
            })
        } catch(e) {
            reject(e)
        }
    })
}
      
export default {
    logAll,
    addAll,
    removeAllResponses,
    getSurveyById
}