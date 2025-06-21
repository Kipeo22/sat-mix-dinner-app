import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

// 新しい認証設定
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // .envの改行文字を元に戻す
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const doc = new GoogleSpreadsheet(
  process.env.GOOGLE_SHEET_ID,
  serviceAccountAuth
);

// docインスタンスを直接使うように変更したため、getDoc関数は不要になります。

export async function getUsers() {
  await doc.loadInfo(); // ドキュメント情報をロード
  const sheet = doc.sheetsByTitle["users"];
  const rows = await sheet.getRows();
  return rows.map((row) => row.toObject());
}

export async function getStores() {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle["stores"];
  const rows = await sheet.getRows();
  return rows.map((row) => row.toObject());
}

export async function getVotes() {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle["votes"];
  const rows = await sheet.getRows();
  return rows.map((row) => row.toObject());
}

export async function addVote(vote) {
  await doc.loadInfo();
  const sheet = doc.sheetsByTitle["votes"];
  await sheet.addRow({
    userName: vote.userName,
    storeName: vote.storeName,
    comment: vote.comment,
    timestamp: new Date().toISOString(),
  });
}
