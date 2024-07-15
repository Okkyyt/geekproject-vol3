import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, FlatList } from 'react-native';
import { collection, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../views/firebaseConfig';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

const MandalaChart = ({ navigation }) => {
  const [projectData, setProjectData] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [achievementRate, setAchievementRate] = useState(0);

  useEffect(() => {
    fetchProjectData();
  }, []);

  const fetchProjectData = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const projectId = "aVKwdWnJGNZY8g58T2e9";
        const projectRef = doc(collection(doc(db, 'users', user.uid), 'Project'), projectId);
        const projectSnapshot = await getDoc(projectRef);
        if (projectSnapshot.exists()) {
          const data = projectSnapshot.data();
          setProjectData(data);
          calculateAchievementRate(data.mandala);
        } else {
          console.log('プロジェクトが見つかりません');
        }
      } catch (error) {
        console.error('データの取得中にエラーが発生しました:', error);
      }
    }
  };

  const calculateAchievementRate = (mandala) => {
    const achievedGoals = mandala.filter(item => item.flag === true).length;
    const rate = (achievedGoals / 8) * 100;
    setAchievementRate(rate);
  };

  const renderMandalaCell = (item, index) => {
    const isCenter = index === 4;
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.mandalaCell, isCenter && styles.centerCell]}
        onPress={() => {
          if (!isCenter) {
            setSelectedCell(item);
            setModalVisible(true);
          }
        }}
      >
        <Text style={[styles.mandalaCellText, isCenter && styles.centerCellText]}>
          {isCenter ? projectData.goal : item.text}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMandala = () => {
    if (!projectData || !projectData.mandala) return null;

    return (
      <View style={styles.mandalaContainer}>
        {projectData.mandala.map((item, index) => renderMandalaCell(item, index))}
      </View>
    );
  };

  const renderAchievementChart = () => {
    return (
      <View style={styles.achievementContainer}>
        <Text style={styles.sectionTitle}>達成状況</Text>
        <View style={styles.chartContainer}>
          <Svg height="200" width="200">
            <Circle
              cx="100"
              cy="100"
              r="80"
              stroke="#E0E0E0"
              strokeWidth="20"
              fill="none"
            />
            <Circle
              cx="100"
              cy="100"
              r="80"
              stroke="#4CAF50"
              strokeWidth="20"
              fill="none"
              strokeDasharray={`${achievementRate * 5.02} 502`}
              strokeDashoffset={251} // ここで開始位置を12時の方向に変更
            />
            <SvgText
              x="100"
              y="100"
              fontSize="40"
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="central"
              fill="#333"
            >
              {`${achievementRate.toFixed(0)}%`}
            </SvgText>
          </Svg>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>やること</Text>
          <Text style={styles.statusText}>完了</Text>
        </View>
      </View>
    );
  };

  const renderTodoItem = ({ item, index }) => (
    <View style={styles.todoItem}>
      <MaterialIcons
        name={item.flag ? "check-box" : "check-box-outline-blank"}
        size={24}
        color={item.flag ? "#4CAF50" : "#9E9E9E"}
      />
      <Text style={[styles.todoText, item.flag && styles.completedTodo]}>{item[0]}</Text>
    </View>
  );

  const renderTodoList = () => {
    if (!projectData || !projectData.todo) return null;

    return (
      <View style={styles.todoContainer}>
        <Text style={styles.sectionTitle}>Todo リスト</Text>
        <FlatList
          data={projectData.todo}
          renderItem={renderTodoItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  if (!projectData) {
    return <Text style={styles.loadingText}>読み込み中...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[{ key: 'mandala' }, { key: 'achievement' }, { key: 'todo' }]}
        renderItem={({ item }) => {
          if (item.key === 'mandala') {
            return (
              <>
                {renderMandala()}
              </>
            );
          } else if (item.key === 'achievement') {
            return renderAchievementChart();
          } else if (item.key === 'todo') {
            return renderTodoList();
          }
        }}
        keyExtractor={item => item.key}
        ListHeaderComponent={() => (
          <View>
            <Text style={styles.title}>{projectData.name}</Text>
            <Text style={styles.sectionTitle}>曼荼羅チャート</Text>
          </View>
        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>「{selectedCell?.text}」の小さな目標</Text>
            <View style={styles.subMandalaContainer}>
              {selectedCell?.contents.map((item, index) => (
                <View key={item.id} style={[styles.subMandalaCell, index === 4 && styles.subMandalaCenterCell]}>
                  <Text style={[styles.subMandalaCellText, index === 4 && styles.subMandalaCenterCellText]}>
                    {index === 4 ? selectedCell.text : item.text}
                  </Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#333',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  mandalaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  mandalaCell: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    margin: '1%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  centerCell: {
    backgroundColor: '#E3F2FD',
  },
  mandalaCellText: {
    fontSize: 14,
    textAlign: 'center',
    padding: 5,
    color: '#333',
  },
  centerCellText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  achievementContainer: {
    alignItems: 'center',
  },
  chartContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  statusText: {
    fontSize: 16,
    color: '#333',
  },
  todoContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  todoText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  completedTodo: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subMandalaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  subMandalaCell: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: '1%',
  },
  subMandalaCenterCell: {
    backgroundColor: '#E3F2FD',
  },
  subMandalaCellText: {
    fontSize: 12,
    textAlign: 'center',
    padding: 5,
    color: '#333',
  },
  subMandalaCenterCellText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MandalaChart;
