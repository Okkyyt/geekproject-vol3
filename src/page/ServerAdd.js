import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { addDoc, collection, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../views/firebaseConfig.js';
import { Ionicons } from '@expo/vector-icons';

const ServerAdd = ({ navigation }) => {
  const [groupname, setGroupName] = useState('');
  const [groupgoal, setGroupGoal] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const createParty = async () => {
    if (!groupname || !groupgoal) {
      setError('グループ名と目標を入力してください');
      return;
    }

    try {
      const groupCollectionRef = collection(db, 'group');
      const groupDocRef = await addDoc(groupCollectionRef, {
        groupname,
        groupgoal,
        isPublic,
        password: isPublic ? '' : password,
        createdAt: serverTimestamp(),
        member: [auth.currentUser.uid],
      });

      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(doc(userDocRef, 'groups', groupDocRef.id), {
        groupname,
        createdAt: serverTimestamp(),
      });

      Alert.alert('成功', 'パーティーの結成に成功しました！', [
        { text: 'OK', onPress: () => navigation.navigate('GroupScreen') }
      ]);
      setGroupName('')
      setGroupGoal('')
    } catch (error) {
      console.error('Error creating party:', error);
      setError('グループの作成中にエラーが発生しました。もう一度お試しください。');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>新しいパーティを作成</Text>
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <Ionicons name="people-outline" size={24} color="#2980B9" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="グループ名"
              placeholderTextColor="#95A5A6"
              value={groupname}
              onChangeText={setGroupName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="flag-outline" size={24} color="#2980B9" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="グループの目標"
              placeholderTextColor="#95A5A6"
              value={groupgoal}
              onChangeText={setGroupGoal}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>パーティの公開</Text>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              thumbColor={isPublic ? '#15a146' : '#BDC3C7'}
              trackColor={{ false: '#71eb9b', true: '#71eb9b' }}
            />
          </View>
          {!isPublic && (
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#2980B9" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="パスワード"
                placeholderTextColor="#95A5A6"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          )}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity style={styles.createButton} onPress={createParty}>
            <Text style={styles.buttonText}>パーティを作成</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 30, // タイトルの下に間隔を追加
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20, // カードの下に間隔を追加
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // 入力フィールド間に間隔を追加
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D1',
    paddingVertical: 20, // 入力フィールド内の上下パディングを追加
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, // スイッチと他の要素間に間隔を追加
  },
  switchLabel: {
    fontSize: 16,
    color: 'black',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 14,
    marginBottom: 20, // エラーメッセージと他の要素間に間隔を追加
  },
  createButton: {
    backgroundColor: '#2980B9',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 30, // ボタンの上に間隔を追加
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ServerAdd;

