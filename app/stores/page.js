import { getStores, getUsers, getVotes } from "../../lib/spreadsheet"; // getVotesを追加
import StoreClientComponent from "../../components/StoreClientComponent";

async function getStoresWithVoteCount() {
  const [stores, votes] = await Promise.all([getStores(), getVotes()]);

  // お店ごとの投票数を集計
  const voteCounts = votes.reduce((acc, vote) => {
    acc[vote.storeName] = (acc[vote.storeName] || 0) + 1;
    return acc;
  }, {});

  // storeデータに投票数を追加
  return stores.map((store) => ({
    ...store,
    voteCount: voteCounts[store.name] || 0,
  }));
}

export default async function StorePage() {
  // データ取得はサーバーコンポーネントで行う
  const [stores, users] = await Promise.all([
    getStoresWithVoteCount(),
    getUsers(),
  ]);

  return (
    <div>
      <h1>お店一覧</h1>
      {/* データをクライアントコンポーネントに渡す */}
      <StoreClientComponent stores={stores} users={users} />
    </div>
  );
}
