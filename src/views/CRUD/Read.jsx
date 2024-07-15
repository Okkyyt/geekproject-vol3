import { db, auth } from "../firebaseConfig";
import { collection, getDocs, doc, query, orderBy } from "firebase/firestore";

const Read = async () => {
  try {
    // 現在のユーザーIDを取得
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error("ユーザーが認証されていません");
    }
    // 確認
    console.log(`現在のユーザーID: ${userId}`);

    // "users" コレクションの特定ユーザードキュメントの参照を取得
    const userDocRef = doc(db, "users", userId);

    // "Projects" サブコレクションの参照を取得
    const subCollectionRef = collection(userDocRef, "Projects");

    console.log(`サブコレクションへの参照: ${subCollectionRef.path}`);

    // タイムスタンプで降順に並べるクエリを作成
    const projectsQuery = query(subCollectionRef, orderBy("timestamp", "desc"));

    // クエリを実行してサブコレクションの全ドキュメントを取得
    const querySnapshot = await getDocs(projectsQuery);

    if (querySnapshot.empty) {
      console.log(`サブコレクション "Projects" にデータが存在しません`);
    } else {
      console.log(`取得したドキュメントの数: ${querySnapshot.size}`);
    }

    // ドキュメントのデータをマップして配列に格納
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id, // ドキュメントのIDを含める
      ...doc.data(), // データを展開
    }));

    // 確認
    console.log("取得したデータ:", data);

    return data;
  } catch (error) {
    console.error(`Error getting "Projects" data: `, error);
    throw error; // エラーを再スローしてキャッチする
  }
};

export default Read;