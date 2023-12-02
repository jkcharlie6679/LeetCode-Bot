import { google } from "googleapis"
import { logOutput } from "./log.js";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly", "https://www.googleapis.com/auth/drive"];
// The file token.json stores the user"s access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

async function getAuthToken() {
  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES
  });
  const authToken = await auth.getClient();
  return authToken;
}

async function updateSheet(auth, spreadsheetId, updateRange, resource) {
  const sheets = google.sheets({ version: "v4", auth });
  const today = new Date(new Date().toLocaleString({ timeZone: "UCT" }));
  sheets.spreadsheets.values.update({
    spreadsheetId: spreadsheetId,
    range: updateRange,
    valueInputOption: "USER_ENTERED",
    resource: resource,
  }, (err, result) => {
    if (err) {
      logOutput(1, today.toISOString().replace(/T/, " ").replace(/\..+/, ""), err);
    } else {
      logOutput(0, today.toISOString().replace(/T/, " ").replace(/\..+/, "") + " Update today daliy challenge.\n")
    }
  });
}

async function getSheetId(auth, spreadsheetId, sheetName) {
  const sheets = google.sheets({ version: "v4", auth });

  const response = await sheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  const sheet = response.data.sheets.find(s => s.properties.title === sheetName);

  if (sheet) {
    return sheet.properties.sheetId;
  } else {
    console.error(`Sheet "${sheetName}" not found in the spreadsheet.`);
    return null;
  }
}

async function drawColor(auth, spreadsheetId, sheetId, sheetRange, colorHex) {
  const [startColumn, startRow] = sheetRange.split(":")[0].match(/[A-Z]+|\d+/g);
  const [endColumn, endRow] = sheetRange.split(":")[1].match(/[A-Z]+|\d+/g);

  const gridRange = {
    sheetId: sheetId,
    startRowIndex: parseInt(startRow, 10) - 1,
    endRowIndex: parseInt(endRow, 10),
    startColumnIndex: startColumn.charCodeAt(0) - "A".charCodeAt(0),
    endColumnIndex: endColumn.charCodeAt(0) - "A".charCodeAt(0) + 1,
  };
  const rgbColor = {
    red: parseInt(colorHex.substring(0, 2), 16) / 255,
    green: parseInt(colorHex.substring(2, 4), 16) / 255,
    blue: parseInt(colorHex.substring(4, 6), 16) / 255,
  };
  const sheets = google.sheets({ version: "v4", auth });
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    resource: {
      requests: [
        {
          updateCells: {
            range: gridRange,
            fields: "userEnteredFormat.backgroundColor",
            rows: [
              {
                values: [
                  {
                    userEnteredFormat: {
                      backgroundColor: rgbColor,
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  });
}



export {
  getAuthToken,
  updateSheet,
  getSheetId,
  drawColor
};
