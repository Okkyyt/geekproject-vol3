import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const MandalaChartExplanation = () => {
  const navigation = useNavigation();

  const navigateToMakeProject = () => {
    navigation.navigate('MakeProject');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>曼荼羅チャートとは何か</Text>
      <Text style={styles.text}>
        曼荼羅チャートは、目標達成のための具体的な行動を視覚的に整理するためのツールです.
      </Text>
      
      <Text style={styles.subTitle}>ステップ１：目標設定</Text>
      <Text style={styles.text}>
      中央の3x3グリッドの中心セルに、あなたの大きな目標を書きます。
      </Text>

      <View style={styles.chartContainer}>
        <View style={styles.row}>
          <View style={styles.cell}><Text>体づくり</Text></View>
          <View style={styles.cell}><Text>コントロール</Text></View>
          <View style={styles.cell}><Text>キレ</Text></View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}><Text>メンタル</Text></View>
          <View style={styles.centerCell}><Text>ドラ18球団</Text></View>
          <View style={styles.cell}><Text>スピード160km/h</Text></View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}><Text>人間性</Text></View>
          <View style={styles.cell}><Text>運</Text></View>
          <View style={styles.cell}><Text>変化球</Text></View>
        </View>
      </View>

      <Text style={styles.subTitle}>ステップ２：行動計画</Text>
      <Text style={styles.text}>
      目標を囲む8つのセルには、その目標を達成するための具体的な行動や小目標を書きます。
      </Text>

      <View style={styles.chartContainer}>
        <View style={styles.row}>
          <View style={styles.cell}><Text>体のケア</Text></View>
          <View style={styles.cell}><Text>サプリメントを飲む</Text></View>
          <View style={styles.cell}><Text>FSQ 90kg</Text></View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}><Text>柔軟性</Text></View>
          <View style={styles.centerCell}><Text>体づくり</Text></View>
          <View style={styles.cell}><Text>RSQ130kg</Text></View>
        </View>
        <View style={styles.row}>
          <View style={styles.cell}><Text>スタミナ</Text></View>
          <View style={styles.cell}><Text>可動域</Text></View>
          <View style={styles.cell}><Text>食事夜７杯朝３杯</Text></View>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={navigateToMakeProject}>
        <Text style={styles.buttonText}>曼荼羅チャートを作ってみよう！！</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8', 
  },
  title: {
    fontSize: 26, 
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 22, 
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 18, 
    lineHeight: 24,
    textAlign: 'center',
  },
  chartContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
  },
  cell: {
    width: width * 0.25, // 画面サイズに応じてセルの幅を変更
    height: width * 0.25, // 画面サイズに応じてセルの高さを変更
    borderWidth: 1,
    padding:10,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerCell: {
    width: width * 0.25, // 画面サイズに応じてセルの幅を変更
    height: width * 0.25, // 画面サイズに応じてセルの高さを変更
    borderWidth: 1,
    padding:10,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  button: {
    marginTop: 40,
    padding: 20, 
    marginBottom: 50,
    backgroundColor: '#4CAF50', 
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18, 
    fontWeight: 'bold',
  },
});

export default MandalaChartExplanation;
