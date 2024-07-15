import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Icon } from "react-native-elements";

const TodoList = ({ tasks, setTasks }) => {
  const idList = ["F", "C", "G", "B", "D", "E", "A", "H"];
  const color = [
    "#FF0000",
    "#0000FF",
    "#FFFF00",
    "#00FFFF",
    "",
    "#32CD32",
    "#800080",
    "#FFC0CB",
    "#A52A2A",
  ];

  const [task, setTask] = useState("");
  const [currentId, setCurrentId] = useState(0);

  const addTask = () => {
    if (task.trim() !== "") {
      const newTask = { [currentId]: task, isTask: false };
      setTasks([...tasks, newTask]);
      setTask("");
    }
  };

  const removeTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const handleButtonPress = (taskId, index) => {
    const uploadItem = () => {
      const newTasks = tasks.map((item, i) => {
        if (i === index) {
          let newTaskId = parseInt(taskId) + 1; // 新しいタスクのID
          if (newTaskId > 7) {
            newTaskId = 0; // 7を超える場合は0に戻る
          }
          const newTask = { [newTaskId]: Object.values(item)[0] };
          return newTask;
        }
        return item;
      });
      return newTasks; // 更新されたタスクのリストを返す
    };
    setTasks(uploadItem()); // 更新されたタスクのリストを設定する
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ToDoリスト</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="新しいタスクを追加"
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Icon name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          data={tasks}
          // ScrollViewとlatListの重複を防ぐ
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <View style={styles.taskItem}>
              <Button
                title={`${idList[Object.keys(item)[0]]}: ${Object.values(item)[0]}`}
                onPress={() => handleButtonPress(Object.keys(item), index)}
                style={{ color: color[index] }}
              />
              <TouchableOpacity onPress={() => removeTask(index)}>
                <Icon name="delete" size={20} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    height: 700,
    backgroundColor: "#ffffff", // 背景色を白に設定
    width: "100%", // 幅を100%に設定
    maxWidth: 500, // 最大幅を設定（適宜調整してください）
    marginHorizontal: "auto", // 中央揃えにするために左右のマージンを自動で設定
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40, // ヘッダーのマージンを変更
    marginBottom: 20,
    textAlign: "center", // テキストを中央揃えにする
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20, // 入力コンテナーのマージンを変更
    alignItems: "center", // アイテムを中央揃えにする
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#cccccc", // 枠線の色を変更
    marginRight: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: "#007bff", // ボタンの背景色を青に変更
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20, // ボタンを丸くする
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 10, // タスクアイテムの上下のパディングを追加
    paddingHorizontal: 20, // タスクアイテムの左右のパディングを追加
    backgroundColor: "#f8f9fa", // タスクアイテムの背景色を変更
    borderRadius: 10, // タスクアイテムを角丸にする
  },
});

export default TodoList;
