# Simulence Backend API Documentation

## Introduction
For back-end, Firebase's Cloud Firestore, Authentication, Hosting, and Storage services are used.

In Winter 2023, the team worked on the survey system for admin (Simulence), developers, and testers. Admin can create templates for developers to use to make their surveys. Developers can then release surveys to testers for them to fill out surveys and send their responses back to the developers.

User registration, login, project creation, test session-related code were from previous teams and remained untouched. 

All back-end code is placed under the `Simulence2.0/src/Firestore/` directory.

### Using Firebase Console
When you log in to the Firebase console, you'll see the different projects for development, QA, and deployment.
![](https://i.imgur.com/EkGizAp.png)

Here's an example of the `simulence-test-d2` environment. On the left (under Project Shortcuts) you'll see the Cloud Firestore Database, Authentication, Hosting, and Storage.
![](https://i.imgur.com/x5UXvvR.png)

Under Project settings, you'll find the SDK setup and configurations used in `Simulence2.0/src/main.js`.
![](https://i.imgur.com/4GZWuaL.png)
![](https://i.imgur.com/i6l0vXE.png)

You'll see the database here.
![](https://i.imgur.com/vBqpK6R.png)

When querying using multiple fields, be sure to create an index.
![](https://i.imgur.com/nSGqcbD.png)

Template and survey images are uploaded to `template_images` in Storage.
![](https://i.imgur.com/yzdC4Pj.png)

## Data Models
![](https://i.imgur.com/uO8qpic.jpg)
Above is an ER diagram of the collections used in the Cloud Firestore database.

Here's other relevant information about the data models:

### User
* `userType` is either `"admin"` or `"developer"` or `"tester"`

### Game
* Testers added to this project are in `testerIDs`. When a survey is created, the project's current `testerIDs` is stored in the survey. Currently, when a project's `testerIDs` is changed after the survey is created, the survey's `testerIDs` will remain unchanged.

### Template
* `name_lower` is used for sorting templates in case insensitive, ascending order (same for surveys). This is due to limitations in Firestore.
* Instead of using a Question collection like before, the team chose to just store `questions` as an array of JSON objects. This is because:
    * Easier modification and customization of questions. If multiple templates or surveys were referencing the same ID, changing a question would result in unwanted changes in other templates or surveys.
    * Less querying across collections.
    * Easier implementation when creating a template or survey.
* Each JSON object in `questions` has a `qType` field (a string), which is one of the following: `"multi-choice"`, `"multi-select"`, `"dropdown"`, `"text-answer"`, `"linear-scale"`.
* Each JSON object also has a `content` field specific to each `qType`.
    * Here's an example: 
    ```
    this.questions = [
    {"qType": "multi-choice", "content": {"title": "Multiple Choice", "options": [{"text": "True", "imgSrc": ""}, {"text": "False", "imgSrc": ""}]}},
    {"qType": "multi-select", "content": {"title": "Multiple Select", "options": ["opt1", "opt2", "opt3"]}},
    {"qType": "dropdown", "content": {"title": "Dropdown", "options": ["opt1", "opt2", "opt3", "opt4", "opt5"]}},
    {"qType": "text-answer", "content": {"title": "Text Answer", "imgSrc": ""}},
    {"qType": "linear-scale", "content": {"title": "Linear Scale", "start": 1, "end": 5, "startLabel": "HORRIBLE", "endLabel": "AMAZING"}}
            ]
    ```
    * So far only multi-choice and text-answer questions have an `imgSrc` field to store a URL to access uploaded files in the Firebase Storage. This can be expanded in the future so that other question types include images too.
    * All uploads are stored in Storage's `template_images` folder.

### Survey
* Surveys are always created under a project. The project is referenced as `gameID`.
* `questions` is the same as in Template. All uploads are in `template_images` folder too.
* `status` has 3 potential values with different behaviour:
    * `0`: default value. The survey is inactive (hasn't been published/released to testers) and can still be modified.
        * Modifying functions have been implemented, but haven't been integrated into front-end.
    * `1`: the survey is published (has been released to testers) and cannot be modified anymore.
    * `2`: the survey is closed (all testers have completed their response) and the developer can view the results and analytics
        * Viewing the results and analytics hasn't been fully implemented yet.

### Response
* When a survey is published, a Response is created in the database for each assigned tester.
* `status` has 2 possible values:
    * `0`: default value. Response is incomplete.
    * `1`: response is completed.
* `responses` is an array that stores responses to each question in the survey
    * `null` by default when the Response is first created (`status == 0`).
    * Once the tester has responded, `status` is set to `1`.
    * The JSON objects are not ordered to match the question order in surveys. Instead, each JSON object has an `index`.
    * The values for each `qType` are stored as:
        * text-answer: string
        * multi-select: array of ints (indices of the options chosen in the array)
        * dropdown/multi-choice: int (index of the option chosen)
        * linear-scale: int (rating)
    * Here's an example:
    ```
    response: {
    "responses": [
        {"index": 1, "value": 0}, // multi-choice -> option index
        {"index": 3, "value": [1,3,2]}, // multi-select -> options index
        {"index": 0, "value": "blah blah blah"}, // text-answer 
        {"index": 2, "value": 3}, // linear-scale -> value, NOT index
        {"index": 4, "value": 2}, // dropdown -> index
        ]
    }
    ```

### PlayTester
* The fields are attributes of a tester that can be used to filter them.
* In the Firebase `prod` environment, there's a Constant collection storing pre-set options for PlayTester fields.
* Constant has 2 fields:
    * `testerFields` (array of JSON objects):
        * age: `"<18"`, `"18 - 34"`, `"35 - 54"`, `"55 - 64"`, `"65+"`
        * gender: `"Male"`, `"Female"`, `"Non Binary"`, `"Prefer not to say"`
        * hours: `"0 - 5"`, `"6 - 10"`, `"11 - 15"`, `"16 - 20"`, `"21 - 30"`, `"31+"`
        * profile: `"Ultimate Gamer"`, `"Conventional"`, `"Popcorn/Recreational"`, `"Time Filler"`, `"Gamer in a Past Life"`
        * platform: `"Game Console"`, `"PC/Laptop"`, `"VR"`, `"Handheld"`
        * behaviour: `"Completion"`, `"Destruction"`, `"Fantasy"`, `"Community/Social"`, `"Story"`, `"Design"`
        * genre: `"Action"`, `"Adventure"`, `"Strategy"`, `"Shooter"`, `"Role Playing Game"`, `"Sports"`, `"Simulation"`, `"Multiplayer Online"`
        * purchasingBehaviour: `"Subscriptions"`, `"One Time Game Purchases"`, `"Characters"`, `"Cosmetics"`, `"Items"`, `"Lootboxes"`, `"Money Packs"`, `"Free 2 Play"`
    * `variantsList` (array of strings): stores different button colour variants used in the filter. 

## File Organization and Functions
Based on the previous teams' code in `Simulence2.0/src/Firestore.js`, we made a directory `Simulence2.0/src/Firestore/`. For the new survey system, we worked on `Template.js` (new template and survey-related code) and `Response.js` (tester responses). The remaining files are refactored from `Firestore.js`.

Functions related to one use case (e.g. tester responses) should be in a separate file in the directory. 

Outdated files contain functions no longer being called in front-end or are called in outdated front-end code.

Below is a summary of the 12 files:

### FilteringTesters.js

```
getFilter()
getTester(gameId, pageNum, pageSize, fireStoreFilter)
getDisjunction(fieldName, fieldValue)
```

### GameTesting.js

```
assignTimeSlot(gameId, testerId, timeSlot)
getTimeSlot(gameId, testerId)
deleteTester(gameId, testerId)
createTestSession(testerID, projectID)
getTestSession(projectID, testerID, developerID)
joinTestSession(sessionID, developerID)
getGameTestSessions(gameID)
addSessionNote(sessionID, note)
updateTestSessionFocus(sessionID, newFocus)
checkGameHasActiveTestSession(gameID, testerID)
testerStartTestSession(sessionID)
testerEndTestSession(sessionID)
getTestSessionNotes(sessionID)
getTestSessionFocus(sessionID)
```

### GamesObject.js 

```
createProject(gameId, developerID, gameName, company, img, endTime, description, qaLead)
getProject(gameId)
deleteGame(gameId)
getCalendar(userId, queryTime)
getTesterCalendar(userId, queryTime)
```

### PlayTesterUser.js

```
createPlayTesterProfile(testerDetails)
createTester(gameId, testerId)
```

### Response.js 

```
assignSurvey(sID, testerID)
assignSurveyToAll(sID, testerIDs)
saveResponses(sID, testerID, responses)
getResponsesByTester(testerID)
getResponsesBySurvey(sID)
getCompletedResponses(sID)
getIncompleteResponsesByTesterProject(testerID, gameID)
deleteResponses(sID, testerID)
```

### Template.js

```
uploadImage(file)
createTemplate(name, tags, questions, description)
getTemplateQuestions(tID)
getAllTemplates()
deleteTemplate(tID)
createSurvey(name, tags, questions, description, gameID, testerIDs, developerID)
getAllSurveys()
getSurveysByGameID(gameID)
setTemplateNameLower()
setSurveyNameLower()
modifySurveyName(sID, name)
modifySurveyTags(sID, tags)
modifySurveyQuestions(sID, questions)
modifySurveyDescription(sID, description)
modifySurveyTesterIDs(sID, testerIDs)
setSurveyStatus(sID, status)
deleteSurvey(sID)
```

### UserCollection.js

```
getAllUsers()
getUserGames(userID, userType)
```

### UserObject.js

```
registerUser(userDetails)
loginUser(userDetails)
logoutUser()
updateProfile(userId, userName, nickName, gender, bio, email, workphone, mobile, password, img)
getProfile(userId)
deleteUser(userId)
```


## Conventions
* Camel case for function names, attribute names, etc. Unfortunately, there are still many style inconsistencies due to this project being passed around by many teams. 
* Functions should have comments to explain their use, parameters, etc.