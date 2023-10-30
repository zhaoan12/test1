import { mockFirebase } from 'firestore-jest-mock';
import { database } from './initializeMockDatabase'
mockFirebase({
    database: database,
});

const { mockCollection, mockWhere } = require('firestore-jest-mock/mocks/firestore');

describe('Test Export as CSV function', function() {
    const ExportSurveyAnalytics = require('../src/Firestore/ExportSurveyAnalytics').default

    beforeEach(() => {
        return jest.clearAllMocks()
    });

    it('test no demographics', function(done) {
        ExportSurveyAnalytics.exportCSVBySurvey('KjMwKbjDbAxPwOhKsOEi').then((res) => {
            expect(mockCollection).toHaveBeenCalledWith('Response');
            expect(mockWhere).toHaveBeenCalledWith('sID', '==', 'KjMwKbjDbAxPwOhKsOEi');
            expect(res.success).toBeTruthy()
            expect(res.data).toBe("data:text/csv;charset=utf-8,sep=,\r\nTesterID,qIndex,qValue\r\nys92xoQir1N07kJ4wXGydVZMjVx2,0,1\r\nys92xoQir1N07kJ4wXGydVZMjVx2,1,1\r\nys92xoQir1N07kJ4wXGydVZMjVx2,2,0\r\nys92xoQir1N07kJ4wXGydVZMjVx2,3,1\r\nys92xoQir1N07kJ4wXGydVZMjVx2,4,4\r\nZyMLD7mYbredPEHVJDJvwb57SwX2,0,1\r\nZyMLD7mYbredPEHVJDJvwb57SwX2,1,2&1&4\r\nZyMLD7mYbredPEHVJDJvwb57SwX2,2,0\r\nZyMLD7mYbredPEHVJDJvwb57SwX2,3,123Text\r\nZyMLD7mYbredPEHVJDJvwb57SwX2,4,6\r\n")
            done()
        })
    })

    it('test with demographics', function(done) {
        ExportSurveyAnalytics.exportCSVBySurvey('KjMwKbjDbAxPwOhKsOEi', true).then((res) => {
            expect(res.success).toBeTruthy()
            expect(res.data).toBe("data:text/csv;charset=utf-8,sep=,\r\nTesterID,qIndex,qValue,Age,Gender,Hours,Profile,Platform,Genre,Behavior,Purchasing Behavior\r\nys92xoQir1N07kJ4wXGydVZMjVx2,0,1,<18,Male,0-5,Gamer in a Past Life&Popcorn/Recreational,Mobile&Game Console,Casual/Puzzle&Multiplayer Online,Competition&Community/Social,One Time Game Purchases&Additional Game Content&Free to Play\r\nys92xoQir1N07kJ4wXGydVZMjVx2,1,1,<18,Male,0-5,Gamer in a Past Life&Popcorn/Recreational,Mobile&Game Console,Casual/Puzzle&Multiplayer Online,Competition&Community/Social,One Time Game Purchases&Additional Game Content&Free to Play\r\nys92xoQir1N07kJ4wXGydVZMjVx2,2,0,<18,Male,0-5,Gamer in a Past Life&Popcorn/Recreational,Mobile&Game Console,Casual/Puzzle&Multiplayer Online,Competition&Community/Social,One Time Game Purchases&Additional Game Content&Free to Play\r\nys92xoQir1N07kJ4wXGydVZMjVx2,3,1,<18,Male,0-5,Gamer in a Past Life&Popcorn/Recreational,Mobile&Game Console,Casual/Puzzle&Multiplayer Online,Competition&Community/Social,One Time Game Purchases&Additional Game Content&Free to Play\r\nys92xoQir1N07kJ4wXGydVZMjVx2,4,4,<18,Male,0-5,Gamer in a Past Life&Popcorn/Recreational,Mobile&Game Console,Casual/Puzzle&Multiplayer Online,Competition&Community/Social,One Time Game Purchases&Additional Game Content&Free to Play\r\nZyMLD7mYbredPEHVJDJvwb57SwX2,0,1,<18,Male,0-5,Gamer in a Past Life,Mobile,Adventure&Casual/Puzzle,Completion,One Time Game Purchases\r\nZyMLD7mYbredPEHVJDJvwb57SwX2,1,2&1&4,<18,Male,0-5,Gamer in a Past Life,Mobile,Adventure&Casual/Puzzle,Completion,One Time Game Purchases\r\nZyMLD7mYbredPEHVJDJvwb57SwX2,2,0,<18,Male,0-5,Gamer in a Past Life,Mobile,Adventure&Casual/Puzzle,Completion,One Time Game Purchases\r\nZyMLD7mYbredPEHVJDJvwb57SwX2,3,123Text,<18,Male,0-5,Gamer in a Past Life,Mobile,Adventure&Casual/Puzzle,Completion,One Time Game Purchases\r\nZyMLD7mYbredPEHVJDJvwb57SwX2,4,6,<18,Male,0-5,Gamer in a Past Life,Mobile,Adventure&Casual/Puzzle,Completion,One Time Game Purchases\r\n")
            done()
        })
    })
})