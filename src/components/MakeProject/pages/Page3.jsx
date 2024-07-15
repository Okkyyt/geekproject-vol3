import React, { useState } from "react";
import { View, Text, StyleSheet, Keyboard, ScrollView } from "react-native";
import { Button } from "react-native-paper";

import CheckModal from "./CheckModal";
import Mandala from "../templates/Mandala";
import TodoModal from "./TodoModal";

const Page3 = ({ route, navigation }) => {
    //データの取得
  const { projectName, projectGoal, mandalaContents } = route.params || {};
    //キーボードの処理
  const handlePress = () => {
    Keyboard.dismiss();
  };

  const [pressId, setPressId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [contents, setContents] = useState(mandalaContents);

  const [tasks, setTasks] = useState([]);

  const handleModalClose = () => {
    setModalVisible(false);
  };

  //確認モーダルの処理
  const [confirmModal, setConfirmModal] = useState(false);
  const closeConfirmModal = () => {
    setConfirmModal(!confirmModal);
  };
  const handleConfirmModal = () => {
    closeConfirmModal();
  };

  return (
    <View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.scrollView}
      >
        <View onPress={handlePress} style={styles.content}>
          <View style={styles.buttonContainer}>
            <Text onPress={() => navigation.goBack()} style={styles.button}>
              ＜ 戻る
            </Text>
          </View>
          <View style={styles.Top}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>目標：{projectName}</Text>
            </View>
            <Button
              mode="contained"
              onPress={() => setConfirmModal(true)}
              style={[styles.button, { alignSelf: 'flex-end' }]} // 右寄せにする
            >
              作成
            </Button>
          </View>

          <Mandala
            contents={contents}
            setContents={setContents}
            projectGoal={projectGoal}
            setPressId={setPressId}
            setModalVisible={setModalVisible}
          />

          {pressId !== null && modalVisible && (
            <TodoModal
              tasks={tasks}
              setTasks={setTasks}
              id={pressId}
              modalVisible={modalVisible}
              onCloseModal={handleModalClose}
            />
          )}

          <CheckModal
            isVisible={confirmModal}
            onConfirm={handleConfirmModal}
            onCancel={closeConfirmModal}
            data={{
              name: projectName,
              goal: projectGoal,
              mandala: contents,
              todo: tasks,
            }}
          />
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
    marginTop: 40,
    marginLeft: 30,
  },
  button: {
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});

export default Page3;
