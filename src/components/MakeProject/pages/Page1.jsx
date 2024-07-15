import React, { useState } from "react";
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";
import { TextInput, Button, Text, Surface } from "react-native-paper";
import Fotter from "../../../page/Fotter";

const Page1 = ({ navigation }) => {
  const [projectName, setProjectName] = useState("");
  const [projectGoal, setProjectGoal] = useState("");
  const [error, setError] = useState("");

  const handleNameChange = (text) => {
    setProjectName(text);
    setError("");
  };

  const handleGoalChange = (text) => {
    setProjectGoal(text);
    setError("");
  };

  const handleButtonPress = () => {
    if (projectName.trim() === "" || projectGoal.trim() === "") {
      setError("プロジェクト名と目標を入力してください。");
    } else {
      console.log("Project Name:", projectName);
      console.log("Project Goal:", projectGoal);
      navigation.navigate("Page2", { projectName, projectGoal });
    }
  };

  const handlePress = () => {
    Keyboard.dismiss();
  };

  const handleButtonPress2 = () => {
    navigation.navigate("Mandara_intro");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <TouchableWithoutFeedback onPress={handlePress}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Surface style={styles.surface}>
              <Text style={styles.title}>曼荼羅チャート作成</Text>
              <Text style={styles.subtitle}>
                目標の具体例: 「1年以内に新しいスキルを習得し、キャリアアップを実現する」
              </Text>
              <TextInput
                label="プロジェクト名"
                onChangeText={handleNameChange}
                value={projectName}
                placeholder="例: キャリアアップ計画"
                style={styles.input}
                mode="outlined"
              />
              <TextInput
                label="あなたの目標"
                onChangeText={handleGoalChange}
                value={projectGoal}
                placeholder="目標を入力してください"
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={3}
              />
              {error !== "" && <Text style={styles.errorText}>{error}</Text>}
              <Button
                style={styles.button}
                mode="contained"
                onPress={handleButtonPress}
              >
                曼荼羅を始める
              </Button>
              <Button
                style={styles.infoButton}
                mode="outlined"
                onPress={handleButtonPress2}
              >
                曼荼羅の書き方
              </Button>
            </Surface>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <Fotter />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    paddingBottom: 70, // フッターの高さ分の余白を追加
  },
  surface: {
    padding: 20,
    width: "100%",
    alignItems: "center",
    elevation: 4,
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input: {
    width: "100%",
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 20,
    width: "100%",
    paddingVertical: 8,
  },
  infoButton: {
    marginTop: 10,
    width: "100%",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default Page1;