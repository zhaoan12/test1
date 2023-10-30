import { mockFirebase } from 'firestore-jest-mock';
import { database } from './initializeMockDatabase';
mockFirebase({
    database: database,
});

const { mockCollection, mockWhere } = require('firestore-jest-mock/mocks/firestore');

describe('Testing the SurveyAnalytics Functions using Survey with 2 Different Responses', function() {
    const {
        getResponsesByQuestion,
        getSurveyAnalyticsCount,
        getSurveyAnalyticsText,
        getSurveyAnalyticsProportion,
        getSurveyAnalyticsMultiCount} = require('../src/Firestore/SurveyAnalytics').default;

    // set ID of preloaded survey in mock database (2 different responses)
    const sID = 'KjMwKbjDbAxPwOhKsOEi';

    describe('getResponsesByQuestion', function() {
        it('gets array of Response objects, where field "responses" is an array with only one response corresponding to question 0 of survey', function(done) {
            getResponsesByQuestion(sID, 0)
            .then(p => {
                expect(mockCollection).toHaveBeenCalledWith('Survey');
                expect(mockCollection).toHaveBeenCalledWith('Response');
                expect(mockWhere).toHaveBeenCalledWith('sID', '==', 'KjMwKbjDbAxPwOhKsOEi');
                expect(p.success).toBeTruthy();
                expect(p.data[0].responses).toEqual([{"value": 1, "index": 0}]);
                expect(p.data[1].responses).toEqual([{"index": 0, "value": 1}]);
                done();
            });
        });

        it('gets array of Response objects, where field "responses" is an array with only one response corresponding to question 1 of survey', function(done) {
            getResponsesByQuestion(sID, 1)
            .then(p => {
                expect(mockCollection).toHaveBeenCalledWith('Survey');
                expect(mockCollection).toHaveBeenCalledWith('Response');
                expect(mockWhere).toHaveBeenCalledWith('sID', '==', 'KjMwKbjDbAxPwOhKsOEi');
                expect(p.success).toBeTruthy();
                expect(p.data[0].responses).toEqual([{"index": 1, "value": [1]}]);
                expect(p.data[1].responses).toEqual([{"index": 1, "value": [2,1,4]}]);
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
                expect(p.data[0].responses).toEqual([{"index": 2, "value": 0}]);
                expect(p.data[1].responses).toEqual([{"index": 2, "value": 0}]);
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
                expect(p.data[0].responses).toEqual([{"index": 3, "value": "1"}]);
                expect(p.data[1].responses).toEqual([{"index": 3, "value": "123Text"}]);
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
                expect(p.data[0].responses).toEqual([{"index": 4, "value": 4}]);
                expect(p.data[1].responses).toEqual([{"index": 4, "value": 6}]);
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
                expect(p.data).toEqual({"1": 2});
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
                expect(p.data).toEqual({"0": 2});
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
                expect(p.data).toEqual(["1", "123Text"]);
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
                expect(p.data).toEqual({"data": {"4": 0.5, "6": 0.5}, "total": 2});
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
                expect(p.data).toEqual({"1": 2, "2": 1, "4": 1});
                done();
            });
        });
    });
});