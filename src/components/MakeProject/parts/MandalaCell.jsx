import React from "react";
import { View, TextInput, Button, StyleSheet, Dimensions, Text } from "react-native";

const MandalaCell = ({
  index,
  content,
  setContents,
  projectGoal,
  setPressId,
  setModalVisible,
}) => {
  
  const handleButtonPress = () => {
    if (setPressId && setModalVisible) {
      setPressId(index);
      setModalVisible(true);
    }
  };

  const handleInputChange = (text) => {
    const newContent = { ...content, text: text };
    setContents(newContent);
  };

  const showButton = content.text !== "";

  const cellContent = index === 4 ? (
    <TextInput
      value={projectGoal}
      editable={false}
      style={[styles.text, styles.input]}
      returnKeyType="done"
    />
  ) : (
    <TextInput
      onChangeText={handleInputChange}
      value={content.text}
      placeholder={`目標 ${content.id}`}
      style={styles.text}
      returnKeyType="done"
    />
  );

  return (
    <View style={[styles.cell, { borderColor: "#000" }]}>
      <View style={styles.cellContent}>
        {cellContent}
      </View>
      {showButton && index !== 4 && (
        <Button
          onPress={handleButtonPress}
          title="Detail"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: Dimensions.get("window").width / 3 - 20,
    height: Dimensions.get("window").width / 3 - 20,
    borderWidth: 1,
    padding: 5,
    margin: 5,
    justifyContent: 'space-between',
  },
  idText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  cellContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    width: '100%',
  },
  button: {
    marginTop: 5,
  },
});

export default MandalaCell;