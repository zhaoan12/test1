**1. A summary of your decisions and the options you considered for your component(s) (UI/frontend, logic/backend, database) so your TA knows what you have built and why.**

Our sub-team developed the logic/backend for the new survey analytics page. This component is the link between the data stored in the database and the frontend, providing the necessary data processing and retrieval functionalities.

We decided on the functionalities to be implemented based on the discussions with our partner and considering what they want for the MVP. The partner requested that response data can be exported using CSV, so we made a function to do that. After discussing with the front-end team, we created multiple functions to retrieve different survey analytics depending on the type of question (i.e. multi-choice, dropdown, text-based, multi-select, and rating scale questions).

Because our work mainly focuses on retrieving data from the database and processing it, we chose to backdoor fake data into the database, as it is a lot of work to manually create testers and responses in the existing application. We created some functions to do this as well. We were not responsible for any CRUD operations as they already existed beforehand.

When choosing what language to use, we quickly decided on Node.js as it was already being used in the project. Similarly, the database was already implemented using Firebase. Therefore, we opted to implement this backend logic using Node.js with Firestore as the database.

For unit testing, we chose to use Jest and firestore-jest-mock. This library allows us to simulate and mock interactions with Firebase, ensuring that our backend logic works correctly under different scenarios.
Since there was no existing testing framework for unit tests, we considered a few different options. 

One option we considered was using Mocha as the testing framework. 
However, this option had conflicts with different configurations of Babel, which was also utilized by Webpack in our project. 
These conflicts made it hard to set up the test environment, and we looked into alternative frameworks. 

We ended up using Jest as our testing framework, but there were still complications in fetching data from the database. 
The code was connected to the production database and thus is prone to change and impossible to reliably use to test. 

One option we explored to fix this was using a test Firebase project to store data for testing, 
and using the cross-env package to switch between the main and test databases by setting the environment variable NODE_ENV. 
While this approach would have provided an isolated testing environment and mimics real interactions, it has some limitations. 
Testing in this manner forces the code to make calls to the cloud database, creating an external dependency. 
Additionally, Google Cloud places restrictions on the number of read/write operations for the free tier, which may cause issues when running many tests multiple times. 

Ultimately, we chose firestore-jest-mock as the solution to our testing needs. 
This library allowed us to set up different databases for various tests, ensuring that our tests remained isolated and independent. 
It also allowed us to monitor how our backend code interacted with the database, ensuring we were calling the database correctly. 
This decision was further reinforced by the need to mock Firestore without invoking actual cloud database calls, thus effectively addressing cost concerns and minimizing dependencies within our testing environment.

One limitation of this framework is that Jest is unable to check the correctness of multiple calls of the same function, which is especially common when chaining "where" calls in Firestore queries. 
However, the benefits of firestore-jest-mock, such as not calling the cloud database, minimizing external dependencies, and offering better test isolation, outweighed this concern.

**2. Individual contributions explaining who did what. You can keep it to at most one paragraph per person to highlight any work that is not captured in any of the repos.**

Brian: write functions for exporting responses as CSV and associated unit tests, setup automated deployment and the database used following the documentation left behind by previous team

Andy: setup testing framework, write functions for getting survey analytics and associated unit tests

Together: create fake frontend


**3. All the details and instructions needed for your TA to see and verify your work. You need to provide enough documentation so your TA can confirm:**

**a. Your software does what you say it does.**
**b. You've done the work (i.e., it's something on your repo/servers, etc.).**

Application:

- https://simulence-d2-prod.web.app/#/fakesurveyanalytics is our basic UI for the backend code we wrote

- First two buttons download a CSV with response data. 

- Other buttons collect data that frontend will display using pretty graphs, which we did not implement in our UI

- Documentation for these functions are in the comments above each function, in the src/Firestore/SurveyAnalytics.js file. 

- Backdoor buttons are useful to see and change what’s happening in the database without going through the rest of the application, which is slow

- Backdoored survey has 5 questions, one of each question type, which effectively simulates any real survey.

- Automated deployment using github actions on our private fork, following instructions left by previous team (see documentation/deployment.md)

  - Build is created and deployed whenever code is merged to main branch

![image](https://github.com/csc301-2023-fall/deliverable-2-38-2-wangbri6-jianga11/assets/77268649/f17213a9-20fe-4bfd-9301-33e6d6f8d13b)

![image](https://github.com/csc301-2023-fall/deliverable-2-38-2-wangbri6-jianga11/assets/77268649/d29b6617-50b6-40e9-95a4-dd60ea70b0dc)

- The work we have done is on the repository, in the following files and folders: /src/Firestore/BackdoorData.js, /src/Firestore/ExportSurveyAnalytics.js, /src/Firestore/SurveyAnalytics.js, /test, /src/components/fake-frontend

- We also removed some old code that was broken which interfered with our work

- All other code was (mostly) written by the previous team, with some bug fixes by our team interspersed in the commits. 

Testing:

- Step 1: Clone the repository

- Step 2: Run npm ci then npm run test

- This will run the unit tests. 
