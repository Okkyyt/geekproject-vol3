import React from "react";
import { View, Text, Button, StyleSheet, ScrollView, Dimensions } from "react-native";

import MandalaChart from "./template/MandalaChart";
import WriteSvg from "./template/WriteSvg";

const ModalPage = ({
  pressId,
  mandalaItem,
  handleSmallMandalaChecked,
  setPressId,
  setModalVisible,
}) => {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>小さい曼荼羅</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.scrollView}>
          {pressId !== null && (
            <MandalaChart
              item={mandalaItem.mandala.find((m) => m.id === pressId)}
              setPressId={() => setPressId(null)}
              goal={mandalaItem.mandala.find((m) => m.id === pressId).text}
              handleChecked={(index) =>
                handleSmallMandalaChecked(pressId, index)
              }
              isModal={true} // Modal内で表示するためのサイズ調整
            />
          )}
          <WriteSvg item={mandalaItem.mandala.find((m) => m.id === pressId)} isModal={true} />
        </ScrollView>
        <Button title="閉じる" onPress={() => setModalVisible(false)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: '90%',
    height: '80%',
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: '#333',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  scrollView: {
    width: '100%',
  },
});

export default ModalPage;