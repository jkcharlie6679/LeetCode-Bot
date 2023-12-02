import schedule from "node-schedule"
import { getAuthToken, updateSheet, getSheetId, drawColor } from "./src/sheetApi.js";
import { fetchDailyCodingChallenge } from "./src/leetcodeApi.js";

process.env.GOOGLE_APPLICATION_CREDENTIALS = "./credentials.json"
process.env.TZ = "UTC"

const spreadsheetId = process.argv[2];
const difficultyColor = {
  "Easy": "b7d7a8",
  "Medium": "ffe599",
  "Hard": "ea9999"
}

schedule.scheduleJob("5 0 * * *", () => {
  getAuthToken().then(async (authToken) => {

    const todayStr = new Date().toLocaleString({ timeZone: "UCT" });
    const today = new Date(todayStr);
    const discussDay = new Date;
    discussDay.setDate(today.getDate() + 8 - today.getDay());

    let sheetName = discussDay.getFullYear() + "/" + ("0" + (discussDay.getMonth() + 1)).slice(-2) + "/" + ("0" + discussDay.getDate()).slice(-2);
    const sheedId = await getSheetId(authToken, spreadsheetId, sheetName);
    const updateRange = sheetName + "!A" + (today.getDay() + 1) + ":B" + (today.getDay() + 1);

    const [_, data] = await fetchDailyCodingChallenge();
    const difficulty = data["data"]["activeDailyCodingChallengeQuestion"]["question"]["difficulty"];
    const questionId = data["data"]["activeDailyCodingChallengeQuestion"]["question"]["frontendQuestionId"];
    const title = data["data"]["activeDailyCodingChallengeQuestion"]["question"]["title"];
    const url = "https://leetcode.com" + data["data"]["activeDailyCodingChallengeQuestion"]["link"];

    const resource = { values: [[difficulty, "=HYPERLINK(\"" + url + "\", \"" + questionId + ". " + title + "\")"]] };
    await updateSheet(authToken, spreadsheetId, updateRange, resource);

    const colorRange = "A" + (today.getDay() + 1) + ":A" + (today.getDay() + 1);
    await drawColor(authToken, spreadsheetId, sheedId, colorRange, difficultyColor[difficulty]);
  });
});

