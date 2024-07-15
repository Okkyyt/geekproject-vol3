import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  Linking,
  StyleSheet,
} from "react-native";
import { Button } from "react-native-paper";
import { Icon } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";

const TodoModal = ({ tasks, setTasks, id, modalVisible, onCloseModal }) => {
  const [task, setTask] = useState(""); //タスク
  const [description, setDescription] = useState(""); //タスクの詳細
  const [date, setDate] = useState(new Date()); //日付（UTC基準）
  const [selectedValue, setSelectedValue] = useState(""); //繰り返しの選択
  const [recurValue, setRecurValue] = useState(""); //繰り返しの値

  const handleSave = () => {
    // データベースに入れるデータ
    const newTask = {
      id: id, //ID
      title: task, //Todoのタイトル
      description: description, //Todoの詳細
      date: date.toISOString().split("T")[0], // 日付(YYYY-MM-DD format)
      recur: recurValue, //繰り返しの予定(DAILY, WEEKLY;BYDAY=, `MONTHLY;BYMONTHDAY=)
      flag: false //flag処理
    };
    setTasks([...tasks, newTask]);
    onCloseModal();
  };

  //   日付の選択
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  // 繰り返しの選択
  const handleSelect = (value) => {
    setSelectedValue(value);
    if (value === "daily") {
      setRecurValue("DAILY"); //毎日
    } else if (value === "weekly") {
      const daysOfWeek = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
      const dayOfWeek = daysOfWeek[date.getUTCDay()]; // UTCの曜日を取得
      setRecurValue(`WEEKLY;BYDAY=${dayOfWeek}`); //毎週
    } else if (value === "monthly") {
      const dayOfMonth = date.getUTCDate(); // UTCの日付を取得
      setRecurValue(`MONTHLY;BYMONTHDAY=${dayOfMonth}`); //毎月
    }
  };

  const addToCalendar = () => {
    //日付のフォーマットをStringに変える
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    //予定の固定値(開始時刻:現在の時間、終了時刻:1時間後)
    const startDate = formatDate(date);
    const endDate = formatDate(new Date(date.getTime() + 3600000)); // 1時間後
    //繰り返しがあればURLに含める
    let recurrence = "";
    if (["daily", "weekly", "monthly"].includes(selectedValue)) {
      recurrence = `RRULE:FREQ=${recurValue}`;
    }
    //googleカレンダーのURL
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(task)}&dates=${encodeURIComponent(startDate)}/${encodeURIComponent(endDate)}&details=${encodeURIComponent(description)}&recur=${encodeURIComponent()}`;
    //URLにとぶ
    Linking.openURL(url);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onCloseModal}
    >
      <View style={styles.modalView}>
        <View>
          <Text style={styles.title}>予定を追加</Text>

          <TextInput
            style={styles.input}
            placeholder="タイトルを追加"
            value={task}
            onChangeText={setTask}
          />

          {/* 日付の設定 */}
          <View style={styles.row}>
            <Text>日付：</Text>
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              maximumDate={new Date(2100, 11, 31)} // オプション：最大日付を指定
              minimumDate={new Date(2000, 0, 1)} // オプション：最小日付を指定
              style={styles.dateTimePicker}
            />
          </View>

          {/* 繰り返しの設定 */}
          <RNPickerSelect
            onValueChange={handleSelect}
            items={[
              { label: "毎日", value: "daily" },
              { label: "毎週", value: "weekly" },
              { label: "毎月", value: "monthly" },
            ]}
            placeholder={{
              label: "繰り返さない",
              value: "",
            }}
            style={pickerSelectStyles}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="説明を追加"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={4}
          />

          <Button onPress={addToCalendar}>
            <Icon name="event" />
          </Button>

          <Button onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>保存</Text>
          </Button>

          <Button onPress={onCloseModal} style={styles.closeButton}>
            <Icon name="close" />
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20, // Reduced padding
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    padding: 10,
    width: 250,
    borderRadius: 5,
    borderColor: "#ccc",
    color: "#000", // 修正: "000" を "#000" に変更
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    borderColor: "#ccc",
  },
  row: {
    flexDirection: "row", // 横並びにするためにrowを指定
    justifyContent: "space-around", // スペースを均等に配置
    alignItems: "center",
  },
  dateTimePicker: {
    width: "auto",
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "transparent",
  },
  checkbox: {
    marginVertical: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    color: "black",
    width: 250,
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "black",
    width: 250,
    marginBottom: 10,
  },
  placeholder: {
    color: "black",
  },
});

export default TodoModal;
