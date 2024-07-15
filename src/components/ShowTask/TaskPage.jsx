import React,{useState} from "react";
import { View, Text, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";

const TaskPage = ({ data }) => {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  const daysOfWeek = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  const dayName = daysOfWeek[today.getDay()];

  const check_week = (toDoItem) => {
    if (toDoItem.flag) {
      return false; // 1. toDoItemのflagがtrueの場合、falseを返す（表示しない）
    }
    if (toDoItem.date !== formattedDate) {
      return false; // 2. toDoItemのdateが今日の日付と異なる場合、falseを返す（表示しない）
    }
    const recurParts = toDoItem.recur.split(";");
    const recurDayName = recurParts[1].split("=")[1];
    if (recurDayName !== dayName) {
      return false; // 3. toDoItemのrecurの曜日部分が今日の曜日名と一致しない場合、falseを返す（表示しない）
    }
    const recurType = recurParts[0];
    if (recurType !== "WEEKLY") {
      return false; // 4. toDoItemのrecurのタイプが"WEEKLY"でない場合、falseを返す（表示しない）
    }
    return true;
  };

  const CheckList = ({ toDoItem }) => {
    const [checked, setChecked] = useState(false);

    return (
      check_week(toDoItem) && (
        <View key={toDoItem.id} style={styles.checkList}>
          <View>
            <Checkbox
              status={checked ? "checked" : "unchecked"}
              onPress={() => {
                setChecked(!checked);
              }}
            />
          </View>
          <Text style={styles.todoTitle}>{toDoItem.title}</Text>
          <Text style={styles.todoDate}>{toDoItem.date}</Text>
        </View>
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>今日のタスク</Text>
      <Text style={styles.date}>{formattedDate}</Text>
      {data.map((item, index) =>
        item.todo.map((todoItem, index) => (
          <CheckList key={index} toDoItem={todoItem} />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  date: {
    fontSize: 18,
    marginBottom: 20,
    color: "#666",
  },
  checkList: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  todoTitle: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  todoDate: {
    fontSize: 14,
    color: "#999",
  },
});

export default TaskPage;
