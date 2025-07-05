"use client"; // このファイルがクライアントコンポーネントであることを示す

import { useState } from "react";
import { useRouter } from "next/navigation"; // next/routerから変更
import Image from "next/image";

// トースト通知コンポーネント
function Toast({ message, type = "success", onClose }) {
  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <div className="toast-icon">
          {type === "success" && (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
          )}
          {type === "error" && (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          )}
        </div>
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}

// 投票モーダルコンポーネント
function VoteModal({ store, users, onClose, onVote, isSubmitting }) {
  const [selectedUser, setSelectedUser] = useState(users[0]?.name || "");
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser) {
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              placeholder="コメントを入力（任意）"
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="button button-secondary"
              disabled={isSubmitting}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className={`button ${isSubmitting ? "button-loading" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  投票中...
                </>
              ) : (
                "投票"
              )}
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const router = useRouter();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    // 3秒後に自動で消す
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleVote = async (voteData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(voteData),
      });

      if (!response.ok) {
        throw new Error("投票に失敗しました。");
      }

      showToast("投票が完了しました！🎉", "success");

      setSelectedStore(null);

      // サーバー側のデータを再取得してページを更新
      router.refresh();
    } catch (error) {
      console.error(error);
      showToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
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
          isSubmitting={isSubmitting}
        />
      )}

      {/* トースト通知 */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
