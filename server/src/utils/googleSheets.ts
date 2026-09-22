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

export { logToGoogleSheets, readFromSheets }