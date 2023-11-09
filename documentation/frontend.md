# Simulence Frontend Architecture & Workflow

## Architecture & UI Design
Simulence uses the frontend framework Vue2. We use Bootstrap/BootstrapVue as our component library/CSS framework.

This is the [figma file](https://www.figma.com/file/n0gI9h4RNjFyEW74DtLrDo/Wireframe-Simulence-v1.0-(Copy)?node-id=0-1&t=KbumMscB6AwVGmG7-0) shared by our partner with the target UI design. Note that most of the mockups here are slightly vague. Make sure to check with the partner first to make sure that you are mocking up the features they want correctly and are not making incorrect assumptions. In the top-right corner, you will see the Survey/Template Creation Process. This is mostly when our team worked on (Winter 2023 semester). More on this below.

## Component/Page workflow
Below are component/page workflows for each of the 3 usertypes. Note that these workflows represent the *current* workflow, not the partner's ideal workflow.

These flowcharts show what .vue files are connected to which URLs, which components are used by other components, and where the page redirects when buttons on the frontend are clicked.

We have made notes here where there are pages that currently not working because of changes in database objects during our semester.

**DEV workflow**: https://www.figma.com/file/FZuZnXDEQwz4V4g1wd1rGp/Frontend-Component-Workflow?node-id=0%3A1&t=4pb0yxNYsu9Ts2y2-1

**ADMIN workflow**: https://www.figma.com/file/FZuZnXDEQwz4V4g1wd1rGp/Frontend-Component-Workflow?node-id=35%3A634&t=4pb0yxNYsu9Ts2y2-1

**PLAYTESTER workflow**: https://www.figma.com/file/FZuZnXDEQwz4V4g1wd1rGp/Frontend-Component-Workflow?node-id=31%3A233&t=4pb0yxNYsu9Ts2y2-1

## File Structure & Code Style
All frontend code is in `src/components`. In this file, the components are generally split into pages, but there are some components which may be used in multiple different areas.

Assets are stored in `src/assets`.

Routing code is stored in `src/router/index.js`. You can see all routes in this file and what component they link to.

### `scoped`
We have seen issues where different components are using CSS classes with the same name, which results in one or the other using styles that it is not supposed to. In order to combat this, we started to use `<style scoped>` for CSS in our Vue files. This ensures that CSS in the given component does not leak over the other components. However, not all of our components use this (as we only discovered this issue half way through), and all of the previous teams components do not use this either. We *highly recommend* that `scoped` is eventually added to all components in order to avoid CSS leaks.

### Naming
Because this project has been worked on by multiple teams in the past, it is common to see some slightly different naming conventions. It would be good to make this consistent across the entire codebase. Our team members have been using the following rules:
- Vue files are PascalCase
- folders are kebab-case
- Javascript variables are camelCase
- CSS classes are kebab-case
- routes are camelCase (I think this should be changed to kebab-case, personally)

There is also some naming discrepency with general concepts. For example, both "projects", and "games" refers to the same thing. There is also "surveys" and "questionnaires", and "tester" and "playtester".

### Shared components
There are various places in the app that share components. However, many of them are placed in one folder, and used in a completely different folder, or are duplicated into different folders. For cleaner code, it would be better if there was a "Shared componets" folder, or something similar to avoid the issues mentioned above. Some big offenders are:
1) `create-survey/preview-survey-components` components
2) New survey/template search pages (currently seen at `survey-create/SearchTemplates.vue` and `survey-developer-only/SearchSurveys.vue`)

## Using the backend API
1. Import the file with the backend API function into the `<script>` of the .vue file.
```jsx
import Template from './Firestore/Template.js'
```
2. Call the desired function. 
```jsx
Template.getAllSurveys()
```
3. Since all backend API functions are asynchronous, you should call `.then()` after the function call to retrieve the results from the call. If you want to learn more about Javascript asynchronous operations, you can start [here (Promises)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and [here (async await)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).
```jsx
Tempalte.getAllSurveys()
.then(res => { ... })
```
4. To access the data that is retrieved, use `res.data`.
```jsx
Template.getallSurveys()
.then(res => {
    this.surveys = res.data
})
```
5. In order to refer to specific attributes that are returned, you can check the return value of the backend function, or our Simulence backend docs (if available).
```jsx
// in ./Firestore/Template.js
// the keys (left side) are what you will be referring to on the frontend

let newDoc = {
    sID: doc.id,
    name: doc.data().name,
    tags: doc.data().tags,
    questions: doc.data().questions,
    description: doc.data().description,
    gameID: doc.data().gameID,
    testerIDs: doc.data().testerIDs,
    developerID: doc.data().developerID,
    status: doc.data().status,
};
```
```htmlembedded
<!-- in the .vue file -->

<div>
    // show the name of the first survey
    {{ this.surveys[0].name }}
</div>
```

## Our changes (Winter 2023 Team) & Next Steps
### Create Survey/Template
This semester, we completely refactored the survey/template creation process. Surveys are one way for a developer to gain feedback about their games from playtesters. Admins are able to create templates which devs can use as a starting point for their surveys. See the Survey/Template Creation Process section in the top right corner of the [figma](https://www.figma.com/file/n0gI9h4RNjFyEW74DtLrDo/Wireframe-Simulence-v1.0-(Copy)?node-id=0-1&t=KbumMscB6AwVGmG7-0) for details on the new design. Note that the current workflow is as follows:
- Dev: select template -> survey details -> add questions -> add to project
- Admin: template details -> add questions -> publish

However, there is another step that we wanted to implement that we were not able to. That is the "Review" step. On this step, the dev/admin should be able to review the their entire creation (all of name, description, tags, questions) right before finishing the process. With this step, the new workflow would be:
- Dev: select template -> survey details -> add questions -> review -> add to project
- Admin: template details -> add questions -> review -> publish

The figma contains a mockup of the Review step.
![](https://i.imgur.com/Iaq5ekn.png)


In addition, our partner would also like for devs to have the ability to submit their surveys to become templates (public surveys). We were not able to implement this as the potential template must first be verified by an admin before it can be published, but this workflow does not yet exist for the admin. There are mockups for the different options an admin/dev might see at the end of their creation process.
![](https://i.imgur.com/4TAAKI2.png)


### Project Details/Project Dashboard
See the Project Details - Analysis page on the upper right side of the [figma](https://www.figma.com/file/n0gI9h4RNjFyEW74DtLrDo/Wireframe-Simulence-v1.0-(Copy)?node-id=0-1&t=KbumMscB6AwVGmG7-0) for details on the new design for the Project Details (sometimes called the project dashboard). We changed the design of the Project Details page to look a little cleaner. Specifically, we worked on the Analysis tab of this page. In the previous workflow, a survey would be created from the `/surveys` page, and part of the creation process would be to choose which project to assign it to. Now, we have changed the workflow so that a dev must do into the project details' analysis tab to create a new survey. The survey is automatically added to that project. 
![](https://i.imgur.com/Oz6ug5T.png)


Surveys should have 3 states (represented by staus = 0, 1, 2 on the backend). The language for these 3 states have not been solidified yet, but the general idea is:
1. The survey is added to the project, but has not been released to testers at. At this stage in our current implementation, the only thing the dev can do is publish (release to testers), but there should be more features such as deleting the survey, editing the survey, or viewing the survey.
2. The survey has been released to the testers. At this stage in our implementation, the UI simple changes so that there is a "Results" button. However, this button is not functional. Our partner has informed us that a previous team had put some work toward display aggregated survey results, but this is likely broken now due to our database changes. This feature should be implemented in the future.
3. The survey is no longer active. We have not discussed this state very much, but logically, it should be the state where responses are no longer being accepted for the survey (either because all respondants have responded, or because the survey has passed its deadline).

Other than the surveys, there also seemed to be something implemented by a previous team for in-game test sessions. Unfortunately, it was not with the scope of our work to work through this, so the "In Game" section on the page is currently empty. However, the code for the component should still be in the codebase!

### Survey/Template search page
This page first appeared in the survey creation process where devs can search for a template to begin with. 
![](https://i.imgur.com/SYw6OE6.png)


However, we later realized that there are many other places in the application that could use the same UI. That would be any of the pages where a survey or template is being search for.
- dev surveys page (can only see surveys from their own projects)
- admin surveys page (can see all surveys)
- admin templates page (can see all templates)
- tester surveys page (can only see surveys assigned to them)

All of these pages will be very similar except for a few things. Some pages will need additional functionalities (like deleting, viewing, editing, etc.). Also, some pages might benefit from additional search features (e.g., search by project).

A similar UI might could also be used for pages such as:
- admin users page
- dev add playtesters page
- playtesters project search page (currently does not exist)

### Dashboard (project page)
The Dashboard acts as a Projects page for devs and testers (for admins, the Dashboard is currently empty). For devs, this page will list all the projects that the dev owns. Clicking on a project card will redirect to the Project's Details page. For testers, this page will list all the projects that the tester is assigned to. Clicking on a project card will open a list of surveys for that project, which the tester will then be able to fill out. This page's functionalities are relatively basic as it is one of the final features we pushed. Improvements are definitely a possibility.

### Navbar (`SideBarNew.vue`)
Previously, the app used to use a top bar. This bar is still visible on many of the pages in the app. Our partner's new design features a side bar, which we have implemented with the pages that we have designed. The side bar design makes use of `flex` to ensure that the page's elements are always properly aligned. However, the old top bar used `position: absolute`. This makes it a bit tedious to change existing page's nav bars to our new side bar, which is why we weren't able to find the time to do it. In the future, all pages should be using the new side bar.