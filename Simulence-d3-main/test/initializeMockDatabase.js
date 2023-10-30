let databaseID = [{id: "wtv", name: "d2-testing"}]
let survey = [{
    "id": "KjMwKbjDbAxPwOhKsOEi",
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
}];

let response = [{
    "id": "Lls5OZy5j5KM5air8r6l",
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
}, {
    "id": "yTfHOKn9kR73NOD8uolZ",
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
}]

let tester = [{
    "id": "ZyMLD7mYbredPEHVJDJvwb57SwX2",
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
}, {
    "id": "ys92xoQir1N07kJ4wXGydVZMjVx2",
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
        "Free to Play"
    ],
    "age": [
        "<18"
    ],
    "gender": [
        "Male"
    ]
}]

let database = {
    DatabaseID: databaseID,
    Survey: survey,
    Response: response,
    PlayTester: tester,
}
export {
    database
}