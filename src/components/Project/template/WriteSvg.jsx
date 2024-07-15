import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";

function WriteSvg({ item, isModal }) {
  const { width } = Dimensions.get("window");
  const size = isModal ? width * 0.7 : width - 40;
  const radius = (size - 20) / 2;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  const CountProgress = () => {
    let flagCount = 0;
    let trueCount = 0;
    item.mandala.forEach((i) => {
      if (i.text){
        flagCount++;
      }
      if (i.flag && i.text) {
        trueCount++;
      }
    });
    return trueCount / flagCount;
  };

  const progress = { totalProgress: CountProgress() };
  const totalOffset = circumference - progress.totalProgress * circumference;

  return (
    <View style={styles.progressCircleWrapper}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#4CAF50"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={totalOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <SvgText
          x={size / 2}
          y={size / 2 + 10}
          fontSize="40"
          fill="#333"
          textAnchor="middle"
          fontWeight="bold"
        >
          {`${Math.round(progress.totalProgress * 100)}%`}
        </SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  progressCircleWrapper: {
    alignItems: "center",
  },
});

export default WriteSvg;