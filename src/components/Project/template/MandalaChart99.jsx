import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Checkbox } from "react-native-paper";

const MandalaChart99 = ({ item, handleChecked }) => {
  const mandala3x3 = (subItem, goal, largeIndex, baseRow, baseCol) => (
    <View>
      <View style={styles.chartWrapper}>
        {subItem.mandala.map((cell, smallIndex) => {
          const row = Math.floor(smallIndex / 3);
          const col = smallIndex % 3;

          const left = (baseCol + col) * (Dimensions.get("window").width / 9);
          const top = (baseRow + row) * (Dimensions.get("window").width / 9);

          if (smallIndex === 4) {
            return (
              <View
                key={smallIndex}
                style={[
                  styles.cell,
                  {
                    top,
                    left,
                    width: Dimensions.get("window").width / 9,
                    height: Dimensions.get("window").width / 9,
                  },
                ]}
              >
                <Text style={styles.centerCellText}>{goal}</Text>
              </View>
            );
          } else {
            return (
              <View
                key={smallIndex}
                style={[
                  styles.cell,
                  {
                    top,
                    left,
                    width: Dimensions.get("window").width / 9,
                    height: Dimensions.get("window").width / 9,
                  },
                ]}
              >
                {cell.text && (
                  <Checkbox
                    status={cell.flag ? "checked" : "unchecked"}
                    onPress={() => handleChecked(largeIndex, smallIndex)}
                  />
                )}

                <Text style={styles.cellText}>{cell.text}</Text>
              </View>
            );
          }
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {item.mandala.map((i, largeIndex) => {
        const baseRow = Math.floor(largeIndex / 3) * 3;
        const baseCol = (largeIndex % 3) * 3;

        if (largeIndex === 4) {
          return mandala3x3(item, item.goal, largeIndex, baseRow, baseCol);
        } else {
          return mandala3x3(i, i.text, largeIndex, baseRow, baseCol);
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width,
    position: "relative",
  },
  chartWrapper: {
    position: "relative",
  },
  cell: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#84A98C",
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  centerCellText: {
    fontWeight: "bold",
    fontSize: 14, 
    color: "#333",
    textAlign: "center",
  },
  cellText: {
    textAlign: "center",
    color: "#333",
    fontSize: 12, 
    paddingHorizontal: 2, 
  },
});

export default MandalaChart99;