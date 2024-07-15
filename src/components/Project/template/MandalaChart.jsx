import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Button, Checkbox } from "react-native-paper";

const MandalaChart = ({ item, setPressId, goal, handleChecked, isModal }) => {
  const { width } = Dimensions.get("window");
  const size = isModal ? width * 0.8 : width - 40;
  const cellSize = size / 3;

  const handlePress = (id) => {
    setPressId(id);
  };

  return (
    <View>
      <View style={[styles.chartWrapper, { width: size, height: size }]}>
        {item.mandala.map((cell, index) => {
          const row = Math.floor(index / 3);
          const col = index % 3;

          if (index === 4) {
            return (
              <View
                key={index}
                style={[
                  styles.cell,
                  {
                    top: row * cellSize,
                    left: col * cellSize,
                    width: cellSize - 10,
                    height: cellSize - 10,
                  },
                ]}
              >
                <Text style={styles.centerCellText}>{goal}</Text>
              </View>
            );
          } else {
            return (
              <View
                key={index}
                style={[
                  styles.cell,
                  {
                    top: row * cellSize,
                    left: col * cellSize,
                    width: cellSize - 10,
                    height: cellSize - 10,
                  },
                ]}
              >
                {cell.text && <Checkbox
                  status={cell.flag ? "checked" : "unchecked"}
                  onPress={() => handleChecked(index)}
                />}
                {cell.mandala && cell.text? (
                  <Button
                    style={styles.cellText}
                    onPress={() => handlePress(cell.id)}
                  >
                    {cell.text}
                  </Button>
                ) : (
                  <Text style={styles.cellText}>{cell.text}</Text>
                )}
              </View>
            );
          }
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartWrapper: {
    position: "relative",
    marginBottom: 20,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  centerCellText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  cellText: {
    textAlign: "center",
    color: '#333',
  },
});

export default MandalaChart;