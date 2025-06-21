"use client"; // このファイルがクライアントコンポーネントであることを示す

import { useState } from "react";
import { useRouter } from "next/navigation"; // next/routerから変更
import Image from "next/image";

// 投票モーダルコンポーネント (同じファイル内に定義)
function VoteModal({ store, users, onClose, onVote }) {
  const [selectedUser, setSelectedUser] = useState(users[0]?.name || "");
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser) {
      alert("ユーザーを選択してください。");
      return;
    }
    onVote({
      userName: selectedUser,
      storeName: store.name,
      comment: comment,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{store.name}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>名前:</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="form-control"
            >
              {users.map((user) => (
                <option key={user.id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>ひとこと:</label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="button button-secondary"
            >
              キャンセル
            </button>
            <button type="submit" className="button">
              投票
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// お店リストの表示と操作を担当するコンポーネント
export default function StoreClientComponent({ stores, users }) {
  const [selectedStore, setSelectedStore] = useState(null);
  const router = useRouter(); // App Router用のルーター

  const handleVote = async (voteData) => {
    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(voteData),
      });

      if (!response.ok) {
        throw new Error("投票に失敗しました。");
      }

      alert("投票が完了しました！");
      setSelectedStore(null);

      // サーバー側のデータを再取得してページを更新
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <>
      <div className="card-container">
        {stores.map((store) => (
          <div
            key={store.id}
            onClick={() => setSelectedStore(store)}
            className="card clickable"
          >
            {store.imageUrl && store.imageUrl.startsWith("http") ? (
              <Image
                src={store.imageUrl}
                alt={store.name}
                width={300}
                height={160}
                className="card-image"
                priority
              />
            ) : (
              <Image
                src="/default-placeholder.png" // 代替画像
                alt={store.name}
                width={300}
                height={160}
                className="card-image"
              />
            )}
            <div className="card-content">
              <h3>{store.name}</h3>
              <p>投票数：{store.voteCount}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedStore && (
        <VoteModal
          store={selectedStore}
          users={users}
          onClose={() => setSelectedStore(null)}
          onVote={handleVote}
        />
      )}
    </>
  );
}
