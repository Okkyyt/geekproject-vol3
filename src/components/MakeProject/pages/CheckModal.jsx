// import React from "react";
// import { View, Text } from "react-native";
// import { Button, Modal, useTheme } from "react-native-paper";
// import { useNavigation } from "@react-navigation/native";

// import Create from '../../../views/CRUD/Create'; // Createモジュールをインポート

// const CheckModal = ({
//   isVisible,
//   onConfirm,
//   onCancel,
//   data
// }) => {
//   const { saveData } = Create();
//   const theme = useTheme();
//   const navigation = useNavigation(); // useNavigationを使用してナビゲーションオブジェクトを取得

//   // データを検証する関数
//   const validateData = (data) => {
//     for (const key in data) {
//       if (data[key] === undefined || data[key] === null) {
//         console.error(`Invalid value for field "${key}": ${data[key]}`);
//         throw new Error(`Invalid value for field "${key}": ${data[key]}`);
//       }
//     }
//   };

//   // データを保存する関数
//   const handlePress = async () => {
//     try {
//       console.log("Validating Mandala data...");
//       validateData(data);
//       console.log("Saving Mandala data...");
//       await saveData(data);
//       console.log("Mandala saved successfully!");
//       console.log(data)
//       onConfirm();
//       navigation.navigate("ProjectScreen"); 
//     } catch (error) {
//       console.error("Error saving data: ", error.message);
//       console.error("Detailed error:", error);
//     }
//   };

//   // キャンセルボタンの処理
//   const handleCancel = () => {
//     onCancel();
//   };

//   return (
//     <Modal
//       visible={isVisible}
//       onDismiss={handleCancel}
//       contentContainerStyle={{
//         backgroundColor: theme.colors.background,
//         padding: 20,
//       }}
//     >
//       <View style={{ alignItems: "center" }}>
//         <Text style={{ marginBottom: 20, fontSize: 18, fontWeight: "bold" }}>
//           プロジェクトを作成しますか？
//         </Text>
//         <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
//           <Button
//             mode="contained"
//             onPress={handlePress}
//             style={{ backgroundColor: theme.colors.primary }}
//           >
//             はい
//           </Button>
//           <Button mode="outlined" onPress={handleCancel}>
//             キャンセル
//           </Button>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default CheckModal;


import React from "react";
import { View, Text } from "react-native";
import { Button, Modal, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import Create from '../../../views/CRUD/Create'; // Createモジュールをインポート

const CheckModal = ({ isVisible, onConfirm, onCancel, data }) => {
  const { saveData } = Create();
  const theme = useTheme();
  const navigation = useNavigation(); // useNavigationを使用してナビゲーションオブジェクトを取得

  // データを検証する関数
  const validateData = (data) => {
    for (const key in data) {
      if (data[key] === undefined || data[key] === null) {
        console.error(`Invalid value for field "${key}": ${data[key]}`);
        throw new Error(`Invalid value for field "${key}": ${data[key]}`);
      }
    }
  };

  // データを保存する関数
  const handlePress = async () => {
    try {
      console.log("Validating Mandala data...");
      validateData(data);

      console.log("Saving Mandala data...");
      await saveData(data);
      console.log("Mandala saved successfully!");

      onConfirm();
      // 保存が成功したらナビゲーションのスタックをリセットして再度ホームスクリーンに戻る
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      console.error("Error saving data: ", error.message);
      console.error("Detailed error:", error);
    }
  };

  // キャンセルボタンの処理
  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal
      visible={isVisible}
      onDismiss={handleCancel}
      contentContainerStyle={{
        backgroundColor: theme.colors.background,
        padding: 20,
      }}
    >
      <View style={{ alignItems: "center" }}>
        <Text style={{ marginBottom: 20, fontSize: 18, fontWeight: "bold" }}>
          プロジェクトを作成しますか？
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Button
            mode="contained"
            onPress={handlePress}
            style={{ backgroundColor: theme.colors.primary }}
          >
            はい
          </Button>
          <Button mode="outlined" onPress={handleCancel}>
            キャンセル
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default CheckModal;