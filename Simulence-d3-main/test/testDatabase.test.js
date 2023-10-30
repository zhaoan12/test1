import { mockFirebase } from 'firestore-jest-mock';
import { database } from './initializeMockDatabase'
mockFirebase({
    database: database,
});

const { mockCollection } = require('firestore-jest-mock/mocks/firestore');

describe('Check correct database', function() {
    const {db} = require('../src/db.js')

    it('checkCorrectDatabase', function(done) {
        db.collection("DatabaseID").where("databaseName", "==", "d2-testing").get().then(
            (querySnapshot) => {
                expect(mockCollection).toHaveBeenCalledWith('DatabaseID');
                expect(querySnapshot.empty).toBeFalsy()
                done()
            }
        )
    })
})