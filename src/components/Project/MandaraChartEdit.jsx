import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, TextInput, Button } from 'react-native';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../views/firebaseConfig';

const MandalaChart = ({ navigation, route }) => {
  const { projectId, userId } = route.params;
  const [projectData, setProjectData] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchProjectData();
  }, []);

  const fetchProjectData = async () => {
    if (userId && projectId) {
      try {
        const projectRef = doc(collection(doc(db, 'users', userId), 'Projects'), projectId);
        const projectSnapshot = await getDoc(projectRef);
        if (projectSnapshot.exists()) {
          const data = projectSnapshot.data();
          setProjectData(data);
        } else {
          console.log('プロジェクトが見つかりません');
        }
      } catch (error) {
        console.error('データの取得中にエラーが発生しました:', error);
      }
    }
  };

  const handleEditButtonPress = async () => {
    if (projectData && selectedCell) {
      const updatedMandala = projectData.mandala.map(item =>
        item.id === selectedCell.id ? { ...item, text: editText } : item
      );

      const projectRef = doc(collection(doc(db, 'users', userId), 'Project'), projectId);
      await updateDoc(projectRef, { mandala: updatedMandala });

      setProjectData(prevData => ({ ...prevData, mandala: updatedMandala }));
      setModalVisible(false);
    }
  };

  const renderMandalaCell = (item, index) => {
    const isCenter = index === 4;
    return (
      <View key={item.id} style={[styles.mandalaCell, isCenter && styles.centerCell]}>
        <TextInput
          style={[styles.mandalaCellText, isCenter && styles.centerCellText]}
          value={isCenter ? projectData.goal : item.text}
          onChangeText={(text) => {
            if (!isCenter) {
              const updatedMandala = projectData.mandala.map(cell =>
                cell.id === item.id ? { ...cell, text } : cell
              );
              setProjectData(prevData => ({ ...prevData, mandala: updatedMandala }));
            }
          }}
          editable={!isCenter}
        />
        {!isCenter && (
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => {
              setSelectedCell(item);
              setDetailsModalVisible(true);
            }}
          >
            <Text style={styles.detailsButtonText}>詳細</Text>
          </TouchableOpacity>
        )}
      </View>
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

  const renderDetailsModal = () => {
    if (!selectedCell) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>「{selectedCell.text}」の詳細</Text>
            <View style={styles.subMandalaContainer}>
              {(selectedCell.contents || []).map((item, index) => (
                <View key={item.id} style={[styles.subMandalaCell, index === 4 && styles.subMandalaCenterCell]}>
                  <Text style={[styles.subMandalaCellText, index === 4 && styles.subMandalaCenterCellText]}>
                    {index === 4 ? selectedCell.text : item.text}
                  </Text>
                </View>
              ))}
            </View>
            <Button
              title="保存"
              onPress={() => {
                setDetailsModalVisible(false);
                navigation.navigate('ProjectScreen'); // Replace 'ProjectScreen' with the actual screen name
              }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setDetailsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  if (!projectData) {
    return <Text style={styles.loadingText}>読み込み中...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{projectData.name}</Text>
      <Text style={styles.sectionTitle}>曼荼羅チャート</Text>
      {renderMandala()}
      {renderDetailsModal()}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>「{selectedCell?.text}」の編集</Text>
            <TextInput
              style={styles.textInput}
              value={editText}
              onChangeText={setEditText}
            />
            <Button title="保存" onPress={handleEditButtonPress} />
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
  detailsButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
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
  },
  textInput: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  subMandalaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  subMandalaCell: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: '1%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subMandalaCenterCell: {
    backgroundColor: '#E3F2FD',
  },
  subMandalaCellText: {
    fontSize: 12,
    textAlign: 'center',
    padding: 3,
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
