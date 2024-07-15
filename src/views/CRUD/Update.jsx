import { db, auth } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

// Firebaseにデータを保存する関数
const Update = async (data) => {
    try {
      const userId = auth.currentUser.uid;
      const projectDocRef = doc(db, "users", userId, "Projects", data.id); // プロジェクトIDを適切に使用
      await updateDoc(projectDocRef, data);
      console.log("データが正常に更新されました");
    } catch (error) {
      console.error("データの更新中にエラーが発生しました: ", error);
    }
  };

export default Update;
