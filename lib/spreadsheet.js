import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { unstable_cache } from "next/cache";

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

// 全シートのデータを一度に取得し、キャッシュする関数
const getSpreadsheetData = unstable_cache(
  async () => {
    await doc.loadInfo();
    const usersSheet = doc.sheetsByTitle["users"];
    const storesSheet = doc.sheetsByTitle["stores"];
    const votesSheet = doc.sheetsByTitle["votes"];

    const usersRows = await usersSheet.getRows();
    const storesRows = await storesSheet.getRows();
    const votesRows = await votesSheet.getRows();

    return {
      users: usersRows.map((row) => row.toObject()),
      stores: storesRows.map((row) => row.toObject()),
      votes: votesRows.map((row) => row.toObject()),
    };
  },
  ["spreadsheet-data"], // キャッシュキー
  { revalidate: 60 } // 60秒間キャッシュを有効にする
);

export async function getUsers() {
  const { users } = await getSpreadsheetData();
  return users;
}

export async function getStores() {
  const { stores } = await getSpreadsheetData();
  return stores;
}

export async function getVotes() {
  const { votes } = await getSpreadsheetData();
  return votes;
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
