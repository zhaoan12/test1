# Useful Resources for Future Developers

### Resources for learning VueJS and JavaScript
[VueJS Crash Course](https://www.youtube.com/watch?v=qZXt1Aom3Cs&t=1575s&ab_channel=TraversyMedia)

[JavaScript Allgorithms and Data Structures](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/)

NOTE: The following is legacy documentation from the Fall 2022 teams.

### 1. Ask your project partner for the link&permission of the resources listed below 
- Figma Wireframe: the aimed UI design is here.
- Firebase: the email and password to access the Firebase project.
- Firebase Schema: the collection/field names used in Firestore.js are written here: https://docs.google.com/document/d/1g6iHzSigS7w_muHmnN9nKULA3Rf-3omZeywgJMK8F_Q/edit?usp=sharing 

### 2. Streaming with the RTCMultiConnection module
- Documentation can be found here: https://github.com/muaz-khan/RTCMultiConnection/blob/master/demos/video-broadcasting.html
- Here is a link to similar demos (and their github repo source code links) using this module: https://muazkhan.com:9001/demos/
- During testing, if an active stream is not ended during a local test (e.g. on localhost) but there are changes made in the code and the code live-compiles, it will not end the test session and the tester will not be able to start a new test for that project. To fix this: in Firestore in the Test collection, find the document with status 'Active' and delete that document. Refresh the site and you'll be able to start a new test.
- The socket server in use in TestSession.vue (connection.socketurl) is currently being hosted by the creator of the module (Muaz Khan). If in the future this socket server becomes unavailable, a new socket server can be hosted on a site like Heroku by following the setup instructions found here: https://github.com/muaz-khan/RTCMultiConnection-Server

### 3. Using the Filter to refine Playtesters
- The filter searches a user who has at least one value for each filter category.
- For instance, lets say there is filter composed of three values - action, PC/laptop and console. There are two filter categories, genre(action, adventure, ...) and platform(PC/laptop, console, VR, ...), in the filter. Note that there are other categories such as gender and age, however, since neither of their values are in the filter, they can be ignored. 
- These users will be searched: tester1(action, adventure, PC/laptop), tester2(action, PC/laptop, console), tester3(action, console). Even though Tester3 doesn't have PC/laptop, it can be searched because it has console, which is another value in the filter within the same category with PC/laptop. 
- These users will be not searched: tester4(adventure, PC/laptop), tester5(male), tester6(action, VR). These testers do not have action for genre or do not have either PC/laptop or console for platform. 
