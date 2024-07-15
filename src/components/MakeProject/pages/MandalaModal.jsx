import React, { useState, useEffect } from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import MandalaCell from "../parts/MandalaCell";

const MandalaModal = ({
  contents,
  setContents,
  pressId,
  modalVisible,
  onCloseModal,
}) => {
  
  const [modalContents, setModalContents] = useState([]);

  useEffect(() => {
    if (modalVisible && pressId !== null) {
      setModalContents(contents[pressId]?.mandala || []);
    }
  }, [modalVisible, pressId, contents]);

  const updateModalContent = (index, updatedContent) => {
    setModalContents((prevModalContents) => {
      const newModalContents = [...prevModalContents];
      newModalContents[index] = updatedContent;
      return newModalContents;
    });
  };

  const handleSave = () => {
    const newContents = contents.map((item, index) => {
      if (index === pressId) {
        return { ...item, mandala: modalContents };
      }
      return item;
    });
    setContents(newContents);
    onCloseModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={onCloseModal}
    >
      <View style={styles.page}>
        <Text style={styles.text}>{`「${contents[pressId]?.text}」を実現するためにどうする？`}</Text>
      <View>
          <View style={styles.grid}>
            {modalContents.map((content, index) => (
              <View key={index}>
                <MandalaCell
                  index={index}
                  content={content}
                  setContents={(updatedContent) => updateModalContent(index, updatedContent)}
                  projectGoal={contents[pressId]?.text}
                  setPressId={false}
                  setModalVisible={false}
                />
              </View>
            ))}
          </View>
          <Button onPress={handleSave} mode="contained" style={styles.modalButton}>
            保存して戻る
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    marginLeft: 50,
    fontSize: 25, 
  },
  modalButton: {
    borderRadius: 10,
    marginTop: 50,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MandalaModal;
