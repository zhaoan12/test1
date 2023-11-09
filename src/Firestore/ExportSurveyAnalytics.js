import Response from "./Response.js"
import {db} from '../db';
/*
  Gathers data and returns an exportable CSV of the survey results. 
*/
async function exportCSVBySurvey(surveyID, addDemographics = false) {
    return new Promise(async (resolve, reject) => {
        await Response.getCompletedResponses(surveyID).then(async ({data}) => {
            console.log(data)
            let csvText = "data:text/csv;charset=utf-8,"
            csvText += "sep=," + "\r\n"
            csvText += ["TesterID", "qIndex", "qValue"].join(",")
            if (addDemographics) {
                csvText += "," + ["Age", "Gender", "Hours", "Profile", "Platform", "Genre", "Behavior", "Purchasing Behavior"].join(",")
            }
            csvText += "\r\n"
            

            //fetch tester demographics
            let testerMap;
            if (addDemographics) {
                let testerIds = Array.from(new Set(data.map(x => x.testerID))); 
                let getTestersResponse = await getTestersByIds(testerIds)
                if (getTestersResponse.success == false) {
                    reject(getTestersResponse);
                }
                let testers = getTestersResponse.data
                testerMap = {}
                testers.forEach(tester => {
                    testerMap[tester.testerID] = [tester.age, tester.gender, tester.hours, 
                        tester.profile.join("&"), tester.platform.join("&"), tester.genre.join("&"), tester.behavior.join("&"), tester.purchasingBehavior.join("&")]
                })
            }
            for (let response of data) {
                for (let q of response.responses) {
                    let cols = [response.testerID, q.index, q.value]
                    if (typeof q.value == "object") {
                        cols[2] = q.value.join("&")
                    }
                    csvText += cols.join(",");
                    //add tester demographics
                    if (addDemographics && testerMap[response.testerID] != undefined) {
                        csvText += "," + testerMap[response.testerID].join(",") 
                    }
                    csvText += "\r\n";
                }
            }
            resolve({success: "true", data: csvText})
        }).catch(e => {
            reject({success: "false", error: e})
        })
    })
}

/*
    Helper function for exportCSVBySurvey. 
    Gets tester data from the database to get tester demographics. 
*/
async function getTestersByIds(testerIds) {
    return new Promise((resolve, reject) => {
        let testers = []
        db.collection("PlayTester").where("testerID", "in", testerIds).get() 
        .then(query => {
          query.forEach(doc => {
            let ddata = doc.data()
            testers.push(ddata)
          })
    
          resolve({success: true, data: testers})
        })
        .catch(e => {reject({success: false, error: e})})
      })
}

export default {
    exportCSVBySurvey,
    getTestersByIds
}