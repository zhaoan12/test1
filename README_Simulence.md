# Simulence
## Winter 2023

## I. Accessing the Product
### 1. Access
Users can access the product by this URL: https://simulence-prod-3.web.app/

### 2. Sign Up/ Sign In
Users can either register a new account or log in using an existing account. <br />
Here are some existing accounts.
| Type of User | Email | Password |
| --- | --- | --- |
| Developer | devSimulence@gmail.com    | 123123 |
| Tester | testerSimulence@gmail.com  | 123123 |
| Admin | adminSimulence@gmail.com | 123123 |

### 3. Demo Videos

**Our Handoff Video**: https://www.youtube.com/watch?v=1lpF2EMcTyg

**Fall 2022 Handoff Video (for legacy)**: https://youtu.be/BRSFPQo6prY
<br/>

## II. Accessing Firebase

You can access the Firebase project used in this Product: https://console.firebase.google.com/u/1/project/simulence-e7915/overview.

Ask your project partner for the email and password.

<br/>

## III. Developing the Product

### 1. Setting up Local Development Environment

1. Clone the repo.
2. After cloning the repo, open the terminal and type the following four commands.

```
# go to the project folder

cd Simulence2.0/

# checkout qa and make sure your local branch is up to date

git checkout qa
git pull

# create a new branch based off of qa

git checkout -b new-feature-branch

# install all dependencies

npm install

# run the dev script

npm run dev
```

3. Go to localhost with URL [**http://localhost:8080/**](http://localhost:8080/)

4. Congratulations! You have a locally running program on this URL.

### 2. Deployment Instructions
See `documentation/deployment.md`.

## IV. Useful Dev Documentation
See the `/documention` folder for useful developer documention.

In particular, before you begin diving into the code, it will be useful if you first read `/documentation/frontend.md` and `/documentation/backend.md`. These will talk about the architecture of the backend and frontend, give instructions, and detail the workflow and data models, among other things.

`/documentation/deployment.md` has instructions on manual and automatic deployment.

`/documentation/useful-resources.md` has some resources that may be useful.

`/documentation/todos.md` is a legacy document from the Winter 2023 team.

## V. Licenses
Since our client doesn't plan to make the code public, we will keep our repository private and we have agreed to release the code under the MIT license. Our clients hope to charge their target users in the future and thus we will not publish any code related to this project. Our partner has a license to use the code for commercial purposes.
