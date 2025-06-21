import { getVotes, getUsers, getStores } from "../../lib/spreadsheet"; // getStores を追加
import Image from "next/image";

export const dynamic = "force-dynamic";

async function getVotesByStore() {
  // 投票、ユーザー、お店の情報をすべて並行して取得
  const [votes, users, stores] = await Promise.all([
    getVotes(),
    getUsers(),
    getStores(),
  ]);

  // ユーザー名とユーザー情報の対応表（マップ）を作成
  const userMap = new Map(users.map((user) => [user.name, user]));

  // お店名前とお店情報の対応表（マップ）を作成
  const storeMap = new Map(stores.map((store) => [store.name, store]));

  // 投票情報にユーザー情報を紐付け
  const votesWithUserInfo = votes.map((vote) => ({
    ...vote,
    user: userMap.get(vote.userName) || { name: vote.userName, imageUrl: null },
  }));

  // お店ごとに投票情報とmapUrlをグループ化
  const votesByStore = votesWithUserInfo.reduce((acc, vote) => {
    const storeName = vote.storeName;

    // まだ集計オブジェクトにお店がなければ初期化
    if (!acc[storeName]) {
      const storeInfo = storeMap.get(storeName);
      acc[storeName] = {
        votes: [],
        mapUrl: storeInfo ? storeInfo.mapUrl : null, // storeMapからmapUrlを取得
      };
    }

    // 該当のお店のvotes配列に投票情報を追加
    acc[storeName].votes.push(vote);

    return acc;
  }, {});

  return votesByStore;
}

export default async function ResultsPage() {
  const votesByStore = await getVotesByStore();

  return (
    <div>
      <h1>投票結果</h1>
      {Object.entries(votesByStore).map(([storeName, storeData]) => (
        <div key={storeName}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <h2>
              {storeName} ({storeData.votes.length}票)
            </h2>
            {/* ▼ ここからリンクを追加 ▼ */}
            {storeData.mapUrl && (
              <a
                href={storeData.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="map-link-button" // CSSクラスを適用
                style={{ marginLeft: "1.5rem" }} // h2との間隔
              >
                場所はこちら
              </a>
            )}
            {/* ▲ ここまでリンクを追加 ▲ */}
          </div>
          <div className="card-container">
            {storeData.votes.map((vote) => (
              <div key={`${vote.timestamp}-${vote.user.name}`} className="card">
                {vote.user.imageUrl && vote.user.imageUrl.startsWith("http") ? (
                  <Image
                    src={vote.user.imageUrl}
                    alt={vote.user.name}
                    width={300}
                    height={160}
                    className="card-image"
                  />
                ) : (
                  <Image
                    src="/default-avatar.png"
                    alt={vote.user.name}
                    width={300}
                    height={160}
                    className="card-image"
                  />
                )}
                <div className="user-card-content">
                  <p>
                    <strong>{vote.user.name}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
