import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const ProjectForm = ({ label, onChangeText, value, placeholder }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
});

export default ProjectForm;