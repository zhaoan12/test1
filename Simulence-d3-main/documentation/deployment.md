### Manual Deployment Instructions

1. Install firebase CLI: https://firebase.google.com/docs/cli#install_the_firebase_cli
```
$ npm install -g firebase-tools
```
2. Login using provided Firebase credentials
```
$ firebase login
```
3. Ensure 'production', 'qa', 'development', 'testd2' and 'production-alt' are present as seen in .firebaserc
```
$ firebase projects:list
```
4. Select the project you wish to deploy (recommended: 'development')
```
$ firebase use development
```
5. Ensure correct configuration is set in the `/<path to root>/Simulence2.0-main/src/main.js` file. You can comment/uncomment the ones you don't want/want. For example, if you want to deploy to `projectId: simulence-test-d2`, then uncomment that `firebaseConfig` object and comment out the other `firebaseConfig` objects.
6. Navigate to the root of your project in the CLI
```
$ cd /<path to root>/Simulence2.0
```
7. Deploy the project
```
$ npm run build
$ firebase deploy --only hosting
```

### Automatic Deployment Instructions
1. Follow steps 1-6 for manual deployment.
2. Make sure you have admin permission over the repository by checking here https://github.com/settings/applications and searching for an application called Firebase CLI. Click on it and make sure Firebase CLI has full permission and access to any organization that controls the repository containing this code. If needed, acquire permission. Note: If you do not see Firebase CLI as an application here, you can try running steps 3 or 4 and it may fail if you don't have permissions and you should see Firebase CLI afterwards. 
3. Run the following command to create a GitHub action on your local machine.
```
firebase init hosting:github
```
4. If hosting is not already setup (it should already be, so you may not need this step)
```
firebase init hosting
```
5. Use the following for the "run" command
```
run: cd Simulence2.0-main && npm install && npm run build
```
6. Use the following as entryPoint underneath the "with:" property. Do this for both yamls (pull request and merge). 
```
entryPoint: './Simulence2.0-main'
```
7. There should be workflows in the .github folder but they will not work because the secrets have not been registered into your repository. This means PRs may fail initially unless you disable those workflows.

### Notes for New Environments
Firestore requires you to build indexes for composite searching through the database. This is when you use multiple fields to search through a collection (e.g. Surveys, Templates).
If you find that some list is not loading on the new deployment, it may be missing these composite indexes.
1. Go to the Firebase console for that environment
2. Click on "Firestore Database"
3. Click on "Indexes"
4. Click on "Composite"
5. Add any indexes that the simulence-prod-3 environment has to your new environment.
6. If you continue to experience issues, make sure to debug using Chrome's debug tools (check the console for a link that when clicked, will give you an option to build the necessary index).
7. Wait until it is finished building.
8. Refresh the page and retest. It should be working now.