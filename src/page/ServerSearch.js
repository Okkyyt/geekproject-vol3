import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, FlatList, SafeAreaView } from 'react-native';
import { collection, getDocs, doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, auth } from '../views/firebaseConfig.js';
import { Icon } from "@rneui/themed";
import { LinearGradient } from 'expo-linear-gradient';

const ServerSearch = ({ navigation }) => {
  const [groups, setGroups] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const groupsCollectionRef = collection(db, 'group');
      const querySnapshot = await getDocs(groupsCollectionRef);
      const groupsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGroups(groupsData);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const participation = (groupname, id) => {
    console.log('成功しました:グローバル');
    Alert.alert(
      '[' + groupname + ']に参加しますか？',
      '',
      [
        { text: 'いいえ', style: 'cancel' },
        { text: 'はい', onPress: () => handleJoin(groupname, id) }
      ],
      { cancelable: false }
    );
  };

  const handleJoin = async (groupname, groupid) => {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const groupsCollectionRef = collection(userDocRef, 'groups');
      const querySnapshot = await getDocs(groupsCollectionRef);

      const alreadyJoined = querySnapshot.docs.some(doc => doc.id === groupid);
      if (alreadyJoined) {
        Alert.alert('すでに参加しています', 'このグループにはすでに参加しています。');
        return;
      }

      await setDoc(doc(userDocRef, 'groups', groupid), {
        groupname: groupname,
        joinedAt: serverTimestamp(),
      });

      const groupDocRef = doc(db, 'group', groupid);
      console.log(groupDocRef);
      const groupDoc = await getDoc(groupDocRef);
      if (groupDoc.exists()) {
        const currentMembers = groupDoc.data().member || [];
        const updatedMembers = [...currentMembers, auth.currentUser.uid];
        await updateDoc(groupDocRef, {
          member: updatedMembers,
        });
        Alert.alert('成功しました', 'パーティーに参加しました');
        navigation.navigate('GroupScreen');
      } else {
        Alert.alert('エラーが発生しました', 'グループが見つかりません');
      }
    } catch (error) {
      console.error('エラーが発生しました:', error);
    }
  };

  const handlePasswordModal = (correctPassword, groupname) => {
    console.log('成功しました:パスワード');
    let enteredPassword = '';
    if (correctPassword) {
      Alert.prompt(
        'パスワードを入力してください',
        '',
        [
          { text: 'キャンセル', onPress: () => console.log('キャンセルされました'), style: 'cancel' },
          {
            text: '確認',
            onPress: (password) => {
              enteredPassword = password;
              if (enteredPassword === correctPassword) {
                handleJoin(groupname);
              } else {
                Alert.alert('パスワードが違います', 'もう一度お試しください');
              }
            }
          }
        ],
        'secure-text'
      );
    } else {
      handleJoin(groupname);
    }
  };

  const renderGroupItem = ({ item }) => (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.groupContainer}
    >
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{item.groupname}</Text>
        <Text style={styles.groupMemberCount}>{item.member ? item.member.length : 0} members</Text>
      </View>
      <TouchableOpacity
        style={styles.joinButton}
        onPress={() => item.isPublic ? participation(item.groupname, item.id) : handlePasswordModal(item.password, item.groupname)}
      >
        <Text style={styles.joinButtonText}>参加</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#4c669f" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search groups"
          placeholderTextColor="#8e8e8e"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
        data={groups.filter(group => group.groupname.toLowerCase().includes(searchText.toLowerCase()))}
        keyExtractor={item => item.id.toString()}
        renderItem={renderGroupItem}
        ListEmptyComponent={<Text style={styles.noGroupText}>No groups found</Text>}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2faf6',
    fontFamily: 'helvetica',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    margin: 16,
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
    fontFamily: 'helvetica',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  groupContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    fontFamily: 'helvetica',
  },
  groupMemberCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'helvetica',
  },
  joinButton: {
    backgroundColor: '#E7E7E7', // Changed to the desired color
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  joinButtonText: {
    color: '#522357',
    fontWeight: 'bold',
    fontFamily: 'helvetica',
  },
  noGroupText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    marginTop: 20,
    fontFamily: 'helvetica',
  },
});

export default ServerSearch;