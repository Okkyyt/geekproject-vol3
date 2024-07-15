import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { Icon } from "@rneui/themed";
import { collection, getDocs, query, orderBy, limit, doc, setDoc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../views/firebaseConfig.js';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Fotter from './Fotter.jsx';

const ServerCreate = ({ navigation }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [popularGroups, setPopularGroups] = useState([]);
  const [groupId, setGroupId] = useState('');

  useEffect(() => {
    if (!auth.currentUser) {
      navigation.navigate('Login');
      return;
    }

    const fetchPopularGroups = async () => {
      try {
        const groupsCollection = collection(db, 'group');
        const groupsQuery = query(groupsCollection, orderBy('member', 'desc'), limit(3));
        const querySnapshot = await getDocs(groupsQuery);
        const groups = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPopularGroups(groups);
      } catch (error) {
        console.error('Error fetching popular groups:', error);
      }
    };

    fetchPopularGroups();
  }, []);

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const handlesearch = () => {
    navigation.navigate('ServerSearch');
  };
  const handleadd = () => {
    navigation.navigate('ServerAdd');
  };

  const participation = (groupname, id) => {
    Alert.alert(
      `[${groupname}]に参加しますか？`,
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

  const handleinvite = () => {
    Alert.prompt(
      'パーティIDを入力してください',
      '',
      [
        { text: 'キャンセル', onPress: () => console.log('キャンセルされました'), style: 'cancel' },
        {
          text: '確認',
          onPress: async (enteredPassword) => {
            try {
              const groupsCollection = collection(db, 'group');
              const querySnapshot = await getDocs(groupsCollection);
              let groupFound = false;
              querySnapshot.forEach((doc) => {
                if (doc.id === enteredPassword) {
                  console.log(doc.data().groupname);
                  groupFound = true;
                  participation(doc.data().groupname, doc.id);
                }
              });
              if (!groupFound) {
                Alert.alert('IDが違います', 'もう一度お試しください');
              }
            } catch (error) {
              console.error('Error fetching groups:', error);
              Alert.alert('エラー', 'グループ情報の取得中にエラーが発生しました。');
            }
          }
        }
      ],
      'secure-text'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>パーティーへ参加!</Text>
        <Text style={styles.description}>
          パーティーは、あなたとフレンドが交流する場所です。パーティー名は2桁以下で簡潔に設けましょう。
        </Text>
        <TouchableOpacity style={styles.button} onPress={handlesearch}>
          <Icon name="search" size={20} color="black" />
          <Text style={styles.buttonText}> 検索する</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleadd}>
          <Icon name="create" size={20} color="black" />
          <Text style={styles.buttonText}>オリジナルの作成</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleToggleDropdown}>
          <Ionicons name="medal" size={20} color="black" />
          <Text style={styles.buttonText}>人気なパーティー</Text>
          <Ionicons name={showDropdown ? 'arrow-up-circle-outline' : 'arrow-down-circle-outline'} size={20} color="black" />
        </TouchableOpacity>
        {showDropdown && (
          <View style={styles.dropdown}>
            {popularGroups.map((group, index) => (
              <TouchableOpacity 
                key={group.id} 
                style={styles.dropdownItem} 
                onPress={() => group.isPublic ? participation(group.groupname, group.id) : handlePasswordModal(group.password, group.groupname)}
              >
                <Text style={styles.dropdownText}>{`${index + 1}位`}</Text>
                <Icon name="people" size={20} color="black" />
                <Text style={styles.dropdownText}>{group.groupname}</Text>
              </TouchableOpacity>
            ))}
          </View> 
        )}
        <Text style={styles.prompt}>もう招待されていますか?</Text>
        <TouchableOpacity style={[styles.button, styles.joinButton]} onPress={handleinvite}>
          <Text style={styles.joinButtonText}>友達に会おう</Text>
        </TouchableOpacity>
      </View>
      <Fotter />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  heading: {
    fontSize: 24,
    marginTop: '20%',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Helvetica', 
  },
  description: {
    color: '#8BA2AD',
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center', 
    fontFamily: 'Helvetica', 
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row', 
    alignItems: 'center', 
    fontFamily: 'Helvetica', 
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    marginRight: 10, 
    fontFamily: 'Helvetica', 
  },
  prompt: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'Helvetica', 
  },
  joinButton: {
    backgroundColor: '#522357',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 5,
    width: '100%', // 追加
  },  
  joinButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Helvetica',
    textAlign: 'center', // 追加
    width: '100%', // 追加
  },    
  dropdown: {
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    fontFamily: 'Helvetica', 
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    fontFamily: 'Helvetica', 
  },
  dropdownText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Helvetica', 
  },
});

export default ServerCreate;
