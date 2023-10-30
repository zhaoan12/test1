import { mockFirebase } from 'firestore-jest-mock';
import { database } from './initializeMockDatabase2';
mockFirebase({
    database: database,
});

const { mockCollection, mockWhere } = require('firestore-jest-mock/mocks/firestore');

// more extensive unit tests
describe('Testing the SurveyAnalytics Functions using Surveys with 5 Different Responses', function() {
    const {
        getResponsesByQuestion,
        getSurveyAnalyticsCount,
        getSurveyAnalyticsText,
        getSurveyAnalyticsProportion,
        getSurveyAnalyticsMultiCount} = require('../src/Firestore/SurveyAnalytics').default;

    // set ID of preloaded survey in mock database (5 different responses)
    const sID = 'FakeTestSurveyID';

    describe('getResponsesByQuestion', function() {
        it('gets array of Response objects, where field "responses" is an array with only one response corresponding to question 0 of survey', function(done) {
            getResponsesByQuestion(sID, 0)
            .then(p => {
                expect(mockCollection).toHaveBeenCalledWith('Survey');
                expect(mockCollection).toHaveBeenCalledWith('Response');
                expect(mockWhere).toHaveBeenCalledWith('sID', '==', sID);
                expect(p.success).toBeTruthy();
                // since we are using mock firestore as the database, the rIDs are all set to abc123
                expect(p.data).toEqual([
                    {"rID": "abc123", "responses": [{"index": 0, "value": 1}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester4"},
                    {"rID": "abc123", "responses": [{"index": 0, "value": 3}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester2"},
                    {"rID": "abc123", "responses": [{"index": 0, "value": 2}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester3"},
                    {"rID": "abc123", "responses": [{"index": 0, "value": 4}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester1"},
                    {"rID": "abc123", "responses": [{"index": 0, "value": 0}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester5"}
                ]);
                done();
            });
        });

        it('gets array of Response objects, where field "responses" is an array with only one response corresponding to question 1 of survey', function(done) {
            getResponsesByQuestion(sID, 1)
            .then(p => {
                expect(mockCollection).toHaveBeenCalledWith('Survey');
                expect(mockCollection).toHaveBeenCalledWith('Response');
                expect(mockWhere).toHaveBeenCalledWith('sID', '==', sID);
                expect(p.success).toBeTruthy();
                expect(p.data).toEqual([
                    {"rID": "abc123", "responses": [{"index": 1, "value": [0]}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester4"},
                    {"rID": "abc123", "responses": [{"index": 1, "value": [3, 2]}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester2"},
                    {"rID": "abc123", "responses": [{"index": 1, "value": [2, 1]}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester3"},
                    {"rID": "abc123", "responses": [{"index": 1, "value": [4, 3]}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester1"},
                    {"rID": "abc123", "responses": [{"index": 1, "value": [0, 4]}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester5"}
                ]);
                done();
            });
        });

        it('gets array of Response objects, where field "responses" is an array with only one response corresponding to question 2 of survey', function(done) {
            getResponsesByQuestion(sID, 2)
            .then(p => {
                expect(mockCollection).toHaveBeenCalledWith('Survey');
                expect(mockCollection).toHaveBeenCalledWith('Response');
                expect(mockWhere).toHaveBeenCalledWith('sID', '==', sID);
                expect(p.success).toBeTruthy();
                expect(p.data).toEqual([
                    {"rID": "abc123", "responses": [{"index": 2, "value": 0}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester4"},
                    {"rID": "abc123", "responses": [{"index": 2, "value": 2}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester2"},
                    {"rID": "abc123", "responses": [{"index": 2, "value": 1}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester3"},
                    {"rID": "abc123", "responses": [{"index": 2, "value": 3}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester1"},
                    {"rID": "abc123", "responses": [{"index": 2, "value": 2}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester5"}
                ]);
                done();
            });
        });

        it('gets array of Response objects, where field "responses" is an array with only one response corresponding to question 3 of survey', function(done) {
            getResponsesByQuestion(sID, 3)
            .then(p => {
                expect(mockCollection).toHaveBeenCalledWith('Survey');
                expect(mockCollection).toHaveBeenCalledWith('Response');
                expect(mockWhere).toHaveBeenCalledWith('sID', '==', sID);
                expect(p.success).toBeTruthy();
                expect(p.data).toEqual([
                    {"rID": "abc123", "responses": [{"index": 3, "value": "text4"}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester4"},
                    {"rID": "abc123", "responses": [{"index": 3, "value": "text2"}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester2"},
                    {"rID": "abc123", "responses": [{"index": 3, "value": "text3"}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester3"},
                    {"rID": "abc123", "responses": [{"index": 3, "value": "text1"}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester1"},
                    {"rID": "abc123", "responses": [{"index": 3, "value": "text5"}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester5"}
                ]);
                done();
            });
        });

        it('gets array of Response objects, where field "responses" is an array with only one response corresponding to question 4 of survey', function(done) {
            getResponsesByQuestion(sID, 4)
            .then(p => {
                expect(mockCollection).toHaveBeenCalledWith('Survey');
                expect(mockCollection).toHaveBeenCalledWith('Response');
                expect(mockWhere).toHaveBeenCalledWith('sID', '==', sID);
                expect(p.success).toBeTruthy();
                expect(p.data).toEqual([
                    {"rID": "abc123", "responses": [{"index": 4, "value": 4}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester4"},
                    {"rID": "abc123", "responses": [{"index": 4, "value": 6}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester2"},
                    {"rID": "abc123", "responses": [{"index": 4, "value": 5}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester3"},
                    {"rID": "abc123", "responses": [{"index": 4, "value": 7}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester1"},
                    {"rID": "abc123", "responses": [{"index": 4, "value": 2}], "sID": "FakeTestSurveyID", "status": 1, "testerID": "FakeTester5"}
                ]);
                done();
            });
        });
    });

    describe('getSurveyAnalyticsCount', function() {
        // question 0 is of type "multi-choice"
        it('gets object containing "option index : count" for all responses to question 0 in survey', function(done) {
            getSurveyAnalyticsCount(sID, 0)
            .then(p => {
                expect(mockCollection).toHaveBeenCalledWith('Survey');
                expect(mockCollection).toHaveBeenCalledWith('Response');
                expect(mockWhere).toHaveBeenCalledWith('sID', '==', sID);
                expect(p.success).toBeTruthy();
                expect(p.data).toEqual({"0": 1, "1": 1, "2": 1, "3": 1, "4": 1});
                done();
            });
        });

        // question 2 is of type "dropdown"
        it('gets object containing "option index : count" for all responses to question 2 in survey', function(done) {
            getSurveyAnalyticsCount(sID, 2)
            .then(p => {
                expect(mockCollection).toHaveBeenCalledWith('Survey');
                expect(mockCollection).toHaveBeenCalledWith('Response');
                expect(mockWhere).toHaveBeenCalledWith('sID', '==', sID);
                expect(p.success).toBeTruthy();
                expect(p.data).toEqual({"0": 1, "1": 1, "2": 2, "3": 1});
                done();
            });
        });
    });

    describe('getSurveyAnalyticsText', function() {
        // question 3 is of type "text"
        it('gets array of all text responses to question 3 in survey', function(done) {
            getSurveyAnalyticsText(sID, 3)
            .then(p => {
                expect(mockCollection).toHaveBeenCalledWith('Survey');
                expect(mockCollection).toHaveBeenCalledWith('Response');
                expect(mockWhere).toHaveBeenCalledWith('sID', '==', sID);
                expect(p.success).toBeTruthy();
                expect(p.data).toEqual(["text4", "text2", "text3", "text1", "text5"]);
                done();
            });
        });
    });

    describe('getSurveyAnalyticsProportion', function() {
        // question 4 is of type "linear-scale"
        it('gets object containing "rating : proportion" of all responses to question 4 in survey', function(done) {
            getSurveyAnalyticsProportion(sID, 4)
            .then(p => {
                expect(mockCollection).toHaveBeenCalledWith('Survey');
                expect(mockCollection).toHaveBeenCalledWith('Response');
                expect(mockWhere).toHaveBeenCalledWith('sID', '==', sID);
                expect(p.success).toBeTruthy();
                expect(p.data).toEqual({"data": {"2": 0.2, "4": 0.2, "5": 0.2, "6": 0.2, "7": 0.2}, "total": 5});
                done();
            });
        });
    });

    describe('getSurveyAnalyticsMultiCount', function() {
        // question 1 is of type "multi-select"
        it('gets object containing "option index : count" for all responses to question 1 in survey', function(done) {
            getSurveyAnalyticsMultiCount(sID, 1)
            .then(p => {
                expect(mockCollection).toHaveBeenCalledWith('Survey');
                expect(mockCollection).toHaveBeenCalledWith('Response');
                expect(mockWhere).toHaveBeenCalledWith('sID', '==', sID);
                expect(p.success).toBeTruthy();
                expect(p.data).toEqual({"0": 2, "1": 1, "2": 2, "3": 2, "4": 2});
                done();
            });
        });
    });
});