import React, { useState } from "react";
import { View, Text, StyleSheet, Keyboard, ScrollView } from "react-native";
import { Button } from "react-native-paper";

import Mandala from "../templates/Mandala";
import MandalaModal from "./MandalaModal";

const Page2 = ({ route, navigation }) => {
  //projectの名前と目標の取得
  const { projectName, projectGoal } = route.params || {};

  //キーボードをしまう操作
  const handlePress = () => {
    Keyboard.dismiss();
  };

  //曼荼羅のIDの定義
  const idList = ["F", "C", "G", "B", "", "D", "E", "A", "H"];

  //曼荼羅のデータの初期化
  const [contents, setContents] = useState(
    Array(9)
      .fill("")
      .map((_, index) => ({
        id: idList[index],
        text: "",
        flag: false,
        mandala: Array(9)
          .fill("")
          .map((_, subIndex) => ({
            id: idList[subIndex],
            text: "",
            flag: false,
          })),
      }))
  );

  //曼荼羅のモーダル処理
  const [pressId, setPressId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const handleModalClose = () => {
    setModalVisible(false);
  };

  //次のページへ移動
  const handleNext = () => {
    navigation.navigate("Page3", {
      projectName,
      projectGoal,
      mandalaContents: contents,
    });
  };

  return (
    <View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.scrollView}
      >
        <View onPress={handlePress} style={styles.content}>
          {/* 前のページへ戻る */}
          <View style={styles.buttonContainer}>
            <Text onPress={() => navigation.goBack()} style={styles.button}>
              ＜ 戻る
            </Text>
          </View>

          {/* プロジェクトの名前と「次へ」ボタン */}
        <View style={styles.Top}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>目標：{projectName}</Text>
          </View>
          <Button
            style={[styles.button, { alignSelf: 'flex-end' }]} // 右寄せにする
            mode="contained"
            onPress={handleNext}
          >
            次へ
          </Button>
        </View>

          {/* 曼荼羅の表示 */}
          <Mandala
            contents={contents}
            setContents={setContents}
            projectGoal={projectGoal}
            setPressId={setPressId}
            setModalVisible={setModalVisible}
          />

          {/* 曼荼羅のモーダル */}
          {pressId !== null && modalVisible && (
            <MandalaModal
              contents={contents}
              setContents={setContents}
              pressId={pressId}
              modalVisible={modalVisible}
              onCloseModal={handleModalClose}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  buttonContainer: {
    marginLeft: 30,
  },
  button: {
    marginTop: 30,
    marginRight:30,
    fontSize: 18,
    alignSelf: 'flex-end', // 右寄せにする
  },
  Top: {
    marginTop: 20,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
  },
});

export default Page2;
