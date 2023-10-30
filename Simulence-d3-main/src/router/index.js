import Vue from 'vue'
import Router from 'vue-router'
import AdminSurveys from '../components/admin-only/AdminSurveys.vue'
import Templates from "../components/admin-only/Templates"
import Users from "../components/admin-only/Users"
import Calendar from '../components/calendar/Calendar.vue'
import AddGame from '../components/game-dashboard/AddGame.vue'
import Projects from '../components/game-dashboard/Projects.vue'
import ProjectSurveys from '../components/game-dashboard/ProjectSurveys.vue'
import GameDetailDescription from '../components/game-detail/GameDetail-Description.vue'
import GameDetailAnalysis from '../components/game-detail/GameDetail-Analysis.vue'
import GameDetailTesters from '../components/game-detail/GameDetail-Testers.vue'
import GameDetailRecordings from '../components/game-detail/GameDetail-Recordings.vue'
import GameDetail from '../components/game-detail/GameDetail.vue'
import Login from '../components/layout/Login.vue'
import PageNotFound from '../components/layout/PageNotFound.vue'
import CreateSurveyBase from '../components/survey-create/CreateSurveyBase.vue'
import Surveys from '../components/survey-developer-only/Surveys.vue'
import Reporting from "../components/survey-reporting/Reporting";
import PlaytesterAttribute from '../components/user-profile/PlayTesterAttribute.vue'
import UserProfile from '../components/user-profile/UserProfile.vue'
import UserProfileComponent from '../components/user-profile/UserProfile-Profile.vue'
import UserContactComponent from '../components/user-profile/UserProfile-Contact.vue'
import UserSecurityComponent from '../components/user-profile/UserProfile-Security.vue'
import UserPreferenceComponent from '../components/user-profile/UserProfile-Preference.vue'
import TestSession from '../components/test-session/TestSession.vue'
import FakeSurveyAnalytics from '../components/fake-frontend/FakeSurveyAnalytics.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Projects
    }, {
      path: '/project-surveys',
      name: 'project-surveys',
      component: ProjectSurveys
    }, {
      path: '/login',
      name: 'login',
      component: Login,
    }, {
      path: '/test',
      name: 'test',
      component: TestSession,
    },{
      path: '/survey',
      name: 'survey',
      component: Surveys,
    }, {
      path: '/createSurvey',
      name: 'createSurvey',
      component: CreateSurveyBase,
    }, {
      path: '/calendar',
      name: 'calendar',
      component: Calendar,
    }, {
      path: '/userprofile',
      name: 'userprofile',
      component: UserProfile,
      redirect: () => {
        var userProfileIndex = parseInt(window.localStorage.getItem("userProfileIndex"));
        if (userProfileIndex == 0) {
          return '/userprofile/profile';
        } else if (userProfileIndex == 1) {
          return '/userprofile/contact';
        } else if (userProfileIndex == 2) {
          return '/userprofile/security';
        } else if (userProfileIndex == 3) {
          return '/userprofile/preference';
        }  else {
          window.localStorage.setItem("userProfileIndex", 0);
          return '/userprofile/profile';
        }
      },
      children: [
        {
          path: 'profile',
          component: UserProfileComponent
        },
        {
          path: 'contact',
          component: UserContactComponent
        },
        {
          path: 'security',
          component: UserSecurityComponent
        },
        {
          path: 'preference',
          component: UserPreferenceComponent
        }
      ]
    }, {
      path: '/gamedetail',
      name: 'gamedetail',
      component: GameDetail,
      redirect: () => {
        var gameDetailIndex = parseInt(window.localStorage.getItem("gameDetailIndex"));
        if (gameDetailIndex == 0) {
          return '/gamedetail/description';
        } else if (gameDetailIndex == 1) {
          return '/gamedetail/analysis';
        } else if (gameDetailIndex == 2) {
          return '/gamedetail/testers';
        } else if (gameDetailIndex == 3) {
          return '/gamedetail/recordings';
        } else {
          window.localStorage.setItem("gameDetailIndex", 0);
          return '/gamedetail/description';
        }
      },
      children: [
        {
          path: 'description',
          component: GameDetailDescription
        },
        {
          path: 'analysis',
          component: GameDetailAnalysis
        },
        {
          path: 'testers',
          component: GameDetailTesters
        },
        {
          path: 'recordings',
          component: GameDetailRecordings
        },
      ]
    }, {
      path: '/addgame',
      name: 'addgame',
      component: AddGame,
    }, {
      path: '/templates',
      name: 'templates',
      component: Templates,
    }, {
      path: '/users',
      name: 'users',
      component: Users,
    }, {
      path: '/adminsurveys',
      name: 'adminsurveys',
      component: AdminSurveys,
    }, {
      path: '/',
      redirect: '/dashboard'
    }, {
      path: '/reporting/:surveyId',
      component: Reporting
    },{
      path: '*',
      name: 'pageNotFound',
      component: PageNotFound,
    }, {
      path: '/playtesteratt',
      name: 'playtesteratt',
      component: PlaytesterAttribute,
    }, {
      path: '/fakesurveyanalytics',
      name: 'fakesurveyanalytics',
      component: FakeSurveyAnalytics,
    }
  ]
})
