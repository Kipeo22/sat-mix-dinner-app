import { getUsers, getVotes } from "../lib/spreadsheet";
import Image from "next/image";

// ページの再レンダリングを動的に行う設定
export const dynamic = "force-dynamic";

async function getUserGroups() {
  const [users, votes] = await Promise.all([getUsers(), getVotes()]);

  // 投票済みのユーザー名リストを作成
  const votedUserNames = new Set(votes.map((vote) => vote.userName));

  // 未投票のユーザーのみをフィルタリング
  const unvotedUsers = users.filter((user) => !votedUserNames.has(user.name));

  // 班ごとにグループ化
  const userGroups = unvotedUsers.reduce((acc, user) => {
    const group = user.group || "未分類";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(user);
    return acc;
  }, {});

  return userGroups;
}

export default async function UserPage() {
  const userGroups = await getUserGroups();

  return (
    <div>
      <h1>投票まだ</h1>
      {Object.entries(userGroups).map(([groupName, users]) => (
        <div key={groupName}>
          <h2>{groupName}</h2>
          <div className="card-container">
            {users.map((user) => (
              <div key={user.id} className="card">
                <Image
                  src={user.imageUrl || "/default-avatar.png"}
                  alt={user.name}
                  width={300}
                  height={160}
                  className="card-image"
                />
                <div className="user-card-content">
                  <p>{user.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
