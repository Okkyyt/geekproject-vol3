import React from "react";
import { View, StyleSheet } from "react-native";

import MandalaCell from "../parts/MandalaCell";

function Mandala({
  contents,
  setContents,
  projectGoal,
  setPressId,
  setModalVisible,
}) {
  const updateContents = (index, updatedContent) => {
    const newContents = [...contents];
    newContents[index] = updatedContent;
    setContents(newContents);
  };

  return (
    <View style={styles.grid}>
      {/* 曼荼羅 */}
      {contents.map((content, index) => (
        <View key={index}>
          <MandalaCell
            index={index}
            content={content}
            setContents={(updatedContent) =>
              updateContents(index, updatedContent)
            }
            projectGoal={projectGoal}
            setPressId={setPressId}
            setModalVisible={setModalVisible}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Mandala;
