// Vuex managing global variables.
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // Login page
        logincolor: '#E39E4D',
        cancelbcolor: '#fbfbfb',
        textcolor: '#3b3a3a',
        promptcolor: '#4C4F55',
        promptbkcolor:'#FFFFFF',
        loginpage:'#F5F5F5',
        logincontainer:'#7C7E82',
        logintitle:'#FFFFFF',

        // Loading page
        loading:'#FC7727',

        // Navigation bar
        navtheme:'lightGray',
        navctn:'#4C4F55', // underline navigation bar
        naveffect:'#FC7727', // button effect
        triangle:'#FC7727',
        account:'black', // account name
        logout:'black',

        // Dashboard
        dashboard: '#F5F5F5',
        projectnum:'#FC7727',
        searchtext: '#807e7e',
        searchbkbtn: '#FC7727',
        searchbtn: 'black',
        searchcrs: '#ADABAB',
        addnew: '#E75B4B',
        noproj: '#C4C2C2',
        pageswitch:'#E75B4B',
        scrollbar: '#E9E9EA',
        scrollbart: '#36393F',
        
        // User profile
        userprofile:'#F5F5F5',
        nickname:'#2a2a2b',

        // User profile - profile
        modifybk:'#FC7727',
        modify:'#292828',
        confirm:'#E39E4D',

        // User profile - preference
        pretext: '#000000',

        // side bar
        sidetext: '#000111',
        sidetextoc: '#FC7727',

        // Survey item
        cardbk: 'lightGray',

        // Game detail Description
        gamedm: 'lightGray',

        // GameItem 
        gameib: 'lightGray',
        gameibc: 'lightGray',
        viewdetail: '#C4C2C2',
        surveybutton: '#C4C2C2',

        // GameTester
        gametesterb: 'lightGray',
        viewres: 'lightGray',

        // QuestionForm
        quesform_background: 'lightGray',

        // Survey
        searchButton: 'lightGray',

        // SurveyContent
        content_background: 'lightGray',
        actionButton_background: 'lightGray',
        theBarLayer_background: 'lightGray',

        // SurveyDetail
        gameItem_border: 'lightGray',
        gameItem_background: 'lightGray',

        // SurveyItem
        surveyItem_border: 'lightGray',
        surveyItem_background: 'lightGray',
        surveyButton: 'lightGray',

        // SurveyMetaData
        surveyMetaDataForm_background: 'lightGray',

        // SurveyTemplate
        questionsWrapper_background: 'lightGray',

        // TemplateItem
        templateItem_border: 'lightGray',
        templateItem_background: 'lightGray',

        // TestSessionItem
        sessionItem_border: 'lightGray',
        sessionItem_background: 'lightGray',

        // UserItem
        cardColor_background: 'lightGray',
    },

    mutations: {
        defaultcolor (state) {
            state.logincolor = '#E39E4D';
            state.cancelbcolor = '#fbfbfb';
            state.textcolor = '#3b3a3a';
            state.promptcolor = '#4C4F55';
            state.promptbkcolor = '#FFFFFF';
            state.loginpage = '#F5F5F5';
            state.logincontainer = '#7C7E82';
            state.logintitle = '#FFFFFF';
            // Loading page
            state.loading = '#FC7727';

            // Navigation bar
            state.navtheme = 'lightGray';
            state.navctn = '#4C4F55'; // underline navigation bar
            state.naveffect = '#FC7727'; // button effect
            state.triangle = '#FC7727';
            state.account = 'black'; // account name
            state.logout = 'black';

            // Dashboard
            state.dashboard =  '#F5F5F5';
            state.projectnum = '#FC7727';
            state.searchtext =  '#807e7e';
            state.searchbkbtn =  '#FC7727';
            state.searchbtn = 'black';
            state.searchcrs =  '#ADABAB';
            state.addnew = '#E75B4B';
            state.noproj =  '#C4C2C2';
            state.pageswitch = '#E75B4B';
            state.scrollbar = '#E9E9EA';
            state.scrollbart = '#36393F';
            
            // User profile
            state.userprofile = '#F5F5F5';
            state.nickname = '#2a2a2b'; //??

            // User profile - profile
            state.modifybk = '#FC7727';
            state.modify = '#292828';
            state.confirm = '#E39E4D';

             // User profile - preference
            state.pretext = '#000000';

            // Side bar
            state.sidetext = '#000111'; 
            state.sidetextoc = '#FC7727';

            // Survey item
            state.cardbk= 'lightGray';

             // Game detail Description
            state.gamedm = 'lightGray';

            // GameItem 
            state.gameib = 'lightGray';
            state.gameibc = 'lightGray';
            state.viewdetail = 'C4C2C2';
            state.surveybutton = '#C4C2C2';

            // GameTester
            state.gametesterb = 'lightGray';
            state.viewres = 'lightGray';

            // QuestionForm
            state.quesform_background = 'lightGray';

            // Survey
            state.state.searchButton = 'lightGray';

            // SurveyContent
            state.content_background = 'lightGray';
            state.actionButton_background = 'lightGray';
            state.theBarLayer_background = 'lightGray';

            // SurveyDetail
            state.gameItem_border = 'lightGray';
            state.gameItem_background = 'lightGray';

            // SurveyItem
            state.surveyItem_border = 'lightGray';
            state.surveyItem_background = 'lightGray';
            state.surveyButton = 'lightGray';

            // SurveyMetaData
            state.surveyMetaDataForm_background = 'lightGray';

            // SurveyTemplate
            state.questionsWrapper_background = 'lightGray';

            // TemplateItem
            state.templateItem_border = 'lightGray';
            state.templateItem_background = 'lightGray';

            // TestSessionItem
            state.sessionItem_border = 'lightGray';
            state.sessionItem_background = 'lightGray';


            // UserItem
            state.cardColor_background = 'lightGray';
        },

        darkcolor (state) {
            state.logincolor = '#E39E4D';
            state.cancelbcolor = '#fbfbfb';
            state.textcolor = '#3b3a3a';
            state.promptcolor = '#4C4F55';
            state.promptbkcolor = '#FFFFFF';
            state.loginpage = '#F5F5F5';
            state.logincontainer = '#7C7E82';
            state.logintitle = '#FFFFFF';
            // Loading page
            state.loading = '#000000';

            // Navigation bar
            state.navtheme = '#5a3c3c';
            state.navctn = '#4C4F55'; // underline navigation bar
            state.naveffect = '#FC7727'; // button effect
            state.triangle = '#FFFFFF';
            state.account = '#FFFFFF'; // account name
            state.logout = '#FFFFFF';

            // Dashboard
            state.dashboard =  '#F5F5F5';
            state.projectnum = '#FC7727';
            state.searchtext =  '#807e7e';
            state.searchbkbtn =  '#FC7727';
            state.searchbtn = '#F8DC77';
            state.searchcrs =  '#ADABAB';
            state.addnew = '#E75B4B';
            state.noproj =  '#C4C2C2';
            state.pageswitch = '#E75B4B';
            state.scrollbar = '#36393F';
            state.scrollbart = '#E9E9EA';

            // User profile
            state.userprofile = '#341b1b';
            state.nickname = '#2a2a2b';

            // User profile - profile
            state.modifybk = '#FC7727';
            state.modify = '#292828';
            state.confirm = '#E39E4D';

            // User profile - preference
            state.pretext = '#fbfbfb';

            // Side bar
            state.sidetext = '#fbfbfb'; 
            state.sidetextoc = '#FC7727';

            // Survey item
            state.cardbk= 'F8DC77';

             // Game detail Description
            state.gamedm = 'FFD333';
        }
    }
});