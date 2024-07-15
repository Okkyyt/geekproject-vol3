import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Card from './Card';  // インポートの修正

const IntroductionPage = ({navigation}) => {

    const handlepress = () => {
        navigation.navigate('MyPage'); // プロジェクト作成画面に��移
    }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>曼荼羅クエストへようこそ！</Text>
        <Text style={styles.subtitle}>目標達成の旅をサポートします</Text>
      </View>

      <Card style={styles.card}>
        <MaterialCommunityIcons name="target" color="#4CAF50" size={48} />
        <Text style={styles.cardTitle}>目標の可視化</Text>
        <Text style={styles.cardDescription}>
          曼荼羅チャートを使って、あなたの目標を明確に視覚化します。大きな目標を小さなステップに分解し、達成への道筋を明確にします。
        </Text>
      </Card>

      <Card style={styles.card}>
        <FontAwesome name="users" color="#2196F3" size={48} />
        <Text style={styles.cardTitle}>コミュニティサポート</Text>
        <Text style={styles.cardDescription}>
          同じ目標を持つ仲間とつながり、互いに励まし合いましょう。経験や知識を共有し、共に成長する環境を提供します。
        </Text>
      </Card>

      <Card style={styles.card}>
        <FontAwesome name="trophy" color="#FFC107" size={48} />
        <Text style={styles.cardTitle}>達成の喜びを共有</Text>
        <Text style={styles.cardDescription}>
          目標達成の過程を記録し、成果を祝福しあいます。小さな進歩も大切にし、モチベーションを高め合いましょう。
        </Text>
      </Card>
      <TouchableOpacity onPress={handlepress} style={styles.button}>
        <Text style={styles.buttonText}>
            あなたの目標達成の旅を始めましょう！
        </Text>
     </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
    marginTop: 20
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: '25rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default IntroductionPage;
