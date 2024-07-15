import { collection, addDoc, doc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebaseConfig"; // Firebase設定をインポート

const Create = () => {
  // Projectデータを保存する関数
  const saveData = async (data) => {
    try {
      // 現在のユーザーIDを取得
      const userId = auth.currentUser.uid;

      // "users" コレクションのユーザードキュメントを参照
      const userDocRef = doc(db, "users", userId);

      // "Projects" サブコレクションの参照を取得
      const userProjectsRef = collection(userDocRef, "Projects");

      // 新しいプロジェクトデータにタイムスタンプを追加
      const dataWithTimestamp = {
        ...data,
        timestamp: serverTimestamp()
      };

      // 新しいプロジェクトデータを追加
      await addDoc(userProjectsRef, dataWithTimestamp);
      
      console.log("プロジェクトデータが正常に保存されました");
    } catch (error) {
      console.error("データの保存中にエラーが発生しました: ", error);
    }
  };

  return { saveData };
};

export default Create;