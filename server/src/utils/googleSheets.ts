import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN as string
});

const sheets = google.sheets({
    version: "v4",
    auth: oauth2Client
});

const logToGoogleSheets = async (sheetsId: string, toLog: string[]): Promise<boolean> => {
    try {
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: sheetsId,
            range: "Sheet1!A:D",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [
                    toLog
                ]
            }
        });

        if (response.data.updates?.updatedRows === 1) {
            return true;
        } else {
            throw new Error("Data wasn't uploaded on google sheets");
        }
    } catch(error: unknown) {
        console.log(error);

        return false;
    }
}

const readFromSheets = async (sheetsId: string) => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetsId,
            range: "Sheet1!A1:D10"
        });

        console.log(response.data.values);
    } catch(error: unknown) {
        console.log(error);

        return;
    }
}

const updateOneValueBasedOnOneValueInSheets = async (sheetsId: string, searchValue: string, searchColumn: string, updateColumn: string, newValue: string): Promise<boolean> => {
    try {
        // Read the column in which we want to search
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetsId,
            range: `Sheet1!${searchColumn}:${searchColumn}`
        });

        const rows = response.data.values || [];

        // Find the row containing the search value
        const rowIndex = rows.findIndex((row) => row[0] === searchValue);

        if (rowIndex === -1) {
            console.log("Value not found in Google Sheets");
            return false;
        }

        // Google Sheets row numbers start from 1
        const rowNumber = rowIndex + 1;

        // Update the particular cell
        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetsId,
            range: `Sheet1!${updateColumn}${rowNumber}`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [
                    [newValue]
                ]
            }
        });

        return true;

    } catch (error: unknown) {
        console.log(error);

        return false;
    }
};

// const findAndUpdateCellInSheets = async (sheetsId: string, searchColumn1: number, searchValue1: string, searchColumn2: number, searchValue2: string, updateColumn: string, newValue: string): Promise<boolean> => {
//     try {
//         const response = await sheets.spreadsheets.values.get({
//             spreadsheetId: sheetsId,
//             range: "Sheet1!A:D"
//         });

//         const rows = response.data.values || [];

//         const rowIndex = rows.findIndex((row, index) => {
//             if (index === 0) return false; // Skip header

//             return (
//                 row[searchColumn1] === searchValue1 &&
//                 row[searchColumn2] === searchValue2
//             );
//         });

//         if (rowIndex === -1) {
//             console.log("Matching row not found");
//             return false;
//         }

//         const rowNumber = rowIndex + 1;

//         await sheets.spreadsheets.values.update({
//             spreadsheetId: sheetsId,
//             range: `Sheet1!${updateColumn}${rowNumber}`,
//             valueInputOption: "USER_ENTERED",
//             requestBody: {
//                 values: [[newValue]]
//             }
//         });

//         return true;

//     } catch (error: unknown) {
//         console.log(error);

//         return false;
//     }
// };

// const findAndUpdateSubmissionLinksAndStatusInSheets = async (sheetsId: string, searchColumn1: number, searchValue1: string, searchColumn2: number, searchValue2: string, updateColumn1: string, newValue1: string, updateColumn2: string, newValue2: string): Promise<boolean> => {
//     try {
//         // Get the sheet data
//         const response = await sheets.spreadsheets.values.get({
//             spreadsheetId: sheetsId,
//             range: "Sheet1!A:D"
//         });

//         const rows = response.data.values || [];

//         // Find the row where both search conditions match
//         const rowIndex = rows.findIndex((row, index) => {
//             if (index === 0) return false; // Skip header

//             return (
//                 row[searchColumn1] === searchValue1 &&
//                 row[searchColumn2] === searchValue2
//             );
//         });

//         if (rowIndex === -1) {
//             console.log("Matching row not found");
//             return false;
//         }

//         // Google Sheets rows start from 1
//         const rowNumber = rowIndex + 1;

//         // Update both cells
//         await sheets.spreadsheets.values.batchUpdate({
//             spreadsheetId: sheetsId,
//             requestBody: {
//                 valueInputOption: "USER_ENTERED",
//                 data: [
//                     {
//                         range: `Sheet1!${updateColumn1}${rowNumber}`,
//                         values: [[newValue1]]
//                     },
//                     {
//                         range: `Sheet1!${updateColumn2}${rowNumber}`,
//                         values: [[newValue2]]
//                     }
//                 ]
//             }
//         });

//         return true;

//     } catch (error: unknown) {
//         console.log(error);

//         return false;
//     }
// };

const updateTwoValuesBasedOnOneValueInSheets = async (sheetsId: string, searchColumn: number, searchValue: string, updateColumn1: string, newValue1: string, updateColumn2: string, newValue2: string): Promise<boolean> => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetsId,
            range: "Sheet1!A:D"
        });

        const rows = response.data.values || [];

        // Find the row
        const rowIndex = rows.findIndex((row, index) => {
            if (index === 0) return false; // Skip header

            return row[searchColumn] === searchValue;
        });

        if (rowIndex === -1) {
            console.log("Matching row not found");
            return false;
        }

        const rowNumber = rowIndex + 1;

        // Update two cells
        await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: sheetsId,
            requestBody: {
                valueInputOption: "USER_ENTERED",
                data: [
                    {
                        range: `Sheet1!${updateColumn1}${rowNumber}`,
                        values: [[newValue1]]
                    },
                    {
                        range: `Sheet1!${updateColumn2}${rowNumber}`,
                        values: [[newValue2]]
                    }
                ]
            }
        });

        return true;

    } catch (error: unknown) {
        console.log(error);

        return false;
    }
};

export { logToGoogleSheets, readFromSheets, updateTwoValuesBasedOnOneValueInSheets, updateOneValueBasedOnOneValueInSheets }