import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Button, Alert, Keyboard, Dimensions, Animated } from 'react-native';
import { onSnapshot, getDocs, collection, doc, getDoc, addDoc } from 'firebase/firestore';
import { db, auth } from '../views/firebaseConfig.js';
import { useFocusEffect } from '@react-navigation/native';
import { Avatar } from '@rneui/themed';
import Fotter from './Fotter.jsx';

const GroupScreen = ({ navigation }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [talkName, setTalkName] = useState([]);
  const [talkMembers, setTalkMembers] = useState([]);
  const [inputText, setInputText] = useState('');
  const [showAllGroups, setShowAllGroups] = useState(false);
  const [selectedGroupGoal, setSelectedGroupGoal] = useState('');
  const [groupIds,setgroupIds]=useState('');
  const [error, setError] = useState('');
  const [chatDocs, setChatDocs] = useState({});

  const displayedGroups = showAllGroups ? groups : groups.slice(0, 5);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserGroups = async () => {
        try {
          //userコレクションからgroupidを取得
          const user = auth.currentUser;
          if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            const groupCollectionRef = collection(userDocRef, 'groups'); // 修正箇所
            const groupSnapshot = await getDocs(groupCollectionRef);
  
            const groupIds = groupSnapshot.docs.map(doc => doc.id);

            //groupコレクションからgroupデータを取得
            const groupData = [];
            for (const groupId of groupIds) {
              const groupDocRef = doc(db, 'group', groupId);
              const groupDoc = await getDoc(groupDocRef);
              if (groupDoc.exists()) {
                groupData.push({
                  id: groupDoc.id,
                  ...groupDoc.data()
                });
              }
            }
            setGroups(groupData);
            if (groupData.length > 0) {
              handleAvatarPress(groupData[0].id);
            }
          }
        } catch (error) {
          console.error('Error fetching user groups:', error);
        }
      }
      fetchUserGroups();
    }, [])
  );
  

  const getAvatarBackgroundColor = (index) => {
    const colors = [
      "rgba(255, 0, 0, 0.8)",    // Red
      "rgba(0, 0, 255, 0.8)",    // Blue
      "rgba(0, 128, 0, 0.8)",    // Green
      "rgba(128, 0, 128, 0.8)",  // Purple
      "rgba(255, 165, 0, 0.8)"   // Orange
    ];
    const colorIndex = index % colors.length;
    return colors[colorIndex];
  };

  //アバターを押したときの処理
  const handleAvatarPress = async (groupId) => {
    try {
      setgroupIds(groupId);
      const groupDocRef = doc(db, 'group', groupId);
      const groupDoc = await getDoc(groupDocRef);
      
      if (groupDoc.exists()) {
        const groupData = groupDoc.data();
        const groupName = groupData.groupname;
        const groupGoal = groupData.groupgoal;
        
        setSelectedGroup(groupName);
        setSelectedGroupGoal(groupGoal);
        
        const groupChatCollectionRef = collection(groupDocRef, 'groupchat');
        const groupChatSnapshot = await getDocs(groupChatCollectionRef);
        
        const talkNameArray = [];
        const talkMembersArray = [];
        
        groupChatSnapshot.forEach(subDoc => {
          const data = subDoc.data();
          if (data.name) {
            talkNameArray.push(data.name);
          }
          else{
            console.log('No name')
          }
        });

        // メンバーのユーザーID配列を取得
        const memberIds = groupData.member || [];
        
        // メンバーのユーザー名を取得
        for (const memberId of memberIds) {
          const userDoc = await getDoc(doc(db, 'users', memberId));
          if (userDoc.exists()) {
            const userName = userDoc.data().username;
            talkMembersArray.push(userName);
          }
        }
        setTalkName(talkNameArray);
        setTalkMembers(talkMembersArray);
      }
    } catch (error) {
      console.error('Error fetching group data:', error);
    }
  };
  
  
  
  const handleaddChatToGroup = async (inputText) => {
    try {
      const groupDocRef = doc(db, 'group', groupIds);
      const groupChatCollectionRef = collection(groupDocRef, 'groupchat');
      const docRef = await addDoc(groupChatCollectionRef, { name: inputText.trim() });
      
      // チャットドキュメントIDを更新
      setChatDocs(prevChatDocs => ({
        ...prevChatDocs,
        [inputText.trim()]: docRef.id
      }));
      
      handleAvatarPress(groupIds); // 更新されたチャットリストを再取得
    } catch (error) {
      console.error('Error adding chat to Firestore:', error);
    }
  };

  useEffect(() => {
    const fetchChatDocs = async () => {
      if (groupIds) {
        const groupDocRef = doc(db, 'group', groupIds);
        const groupChatCollectionRef = collection(groupDocRef, 'groupchat');
        const chatSnapshot = await getDocs(groupChatCollectionRef);
        
        const chatDocsData = {};
        chatSnapshot.forEach(doc => {
          chatDocsData[doc.data().name] = doc.id;
        });
        setChatDocs(chatDocsData);
      }
    };

    fetchChatDocs();
  }, [groupIds]);

  const handlePress = (chatName) => {
    const chatDocId = chatDocs[chatName];
    if (chatDocId) {
      navigation.navigate('ChatScreen', {
        groupId: groupIds,
        groupName: selectedGroup,
        chatName: chatName,
        chatDocId: chatDocId
      });
    } else {
      Alert.alert('Error', 'Chat document ID not found');
      navigation.navigate('Initial')
    }
  };

  //グループidの表示（招待機能で使う）
  const handleMember= () => {
    Alert.alert("グループID:",groupIds);
  };

  //ダイアログの表示
  const handleChatText = () => {
    Alert.prompt(
      'チャット名を入力してください',
      '',
      [
        { text: 'キャンセル', onPress: () => console.log('キャンセルされました'), style: 'cancel' },
        {
          text: '追加',
          onPress: async (chatName) => {
            if (chatName.trim() === '') {
              setError('チャット名を入力してください');
            } else {
              try {
                const groupDocRef = doc(db, 'group', groupIds);
                const groupChatCollectionRef = collection(groupDocRef, 'groupchat');
                const querySnapshot = await getDocs(groupChatCollectionRef);

                const chatExists = querySnapshot.docs.some(doc => doc.data().name === chatName.trim());
                if (chatExists) {
                  setError('同じ名前のチャットが既に存在します');
                } else {
                  await handlecreateChatToGroup(chatName);
                  console.log('チャットが追加されました');
                  // グループの表示を更新
                  await handleAvatarPress(groupIds);
                }
              } catch (error) {
                console.error('Error adding chat:', error);
                setError('チャットの追加に失敗しました');
              }
            }
          }
        }
      ],
      'plain-text'
    );
  };
  
  const handlecreateChatToGroup = async (chatName) => {
    const groupDocRef = doc(db, 'group', groupIds);
    const groupChatCollectionRef = collection(groupDocRef, 'groupchat');
    const docRef = await addDoc(groupChatCollectionRef, { name: chatName.trim() });
    
    // チャットドキュメントIDを更新
    setChatDocs(prevChatDocs => ({
      ...prevChatDocs,
      [chatName.trim()]: docRef.id
    }));
  };
  
  //グループの作成
  const addGroup = () => {
    // Navigate to server create page
    navigation.navigate('ServerCreate');
    
  };

  //ダイアログの非表示
  const hideDialog = () => {
    setModalVisible(false);
    setError('');
    setInputText('');
  };

  //テキストチャットの処理
  const handleSubmit = async () => {
    if (inputText.trim() === '') {
      setError('テキストを入力してください');
    } else {
      try {
        // groupchatサブコレクションから既存のドキュメントを取得
        const groupDocRef = doc(db, 'group', groupIds);
        const groupChatCollectionRef = collection(groupDocRef, 'groupchat');
        const querySnapshot = await getDocs(groupChatCollectionRef);
  
        // 入力されたテキストと同じ名前のチャットが既に存在するかチェック
        const chatExists = querySnapshot.docs.some(doc => doc.data().name === inputText.trim());
        if (chatExists) {
          setError('同じ名前のチャットが既に存在します');
        } else {
          await handleaddChatToGroup(inputText);
          hideDialog();
          // グループの表示を更新
          await handleAvatarPress(groupIds);
        }
      } catch (error) {
        console.error('Error adding chat:', error);
        setError('チャットの追加に失敗しました');
      }
    }
  };


  return (
    <View style={styles.all_container}>
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <ScrollView style={styles.leftavater}>
          {displayedGroups.map((group, index) => (
            <TouchableOpacity 
              key={index} 
              onPress={() => handleAvatarPress(group.id)}
              style={[
                styles.groupItem,
                selectedGroup === group.groupname && styles.selectedGroup
              ]}
            >
              <Avatar
                size={40}
                rounded
                title={group.groupname}
                containerStyle={{ backgroundColor: getAvatarBackgroundColor(index) }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
        {groups.length > 5 && (
          <TouchableOpacity style={styles.showAllButton} onPress={() => setShowAllGroups(!showAllGroups)}>
            <Text style={styles.showAllButtonText}>{showAllGroups ? '▲ ' : '▼ '}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.addButton} onPress={addGroup}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
  
      <View style={styles.centerContainer}>
  {groups.length === 0 ? (
    <View style={styles.noGroupsContainer}>
      <Text style={styles.noGroupsText}>グループに所属していません</Text>
      <TouchableOpacity style={styles.joinGroupButton} onPress={addGroup}>
        <Text style={styles.joinGroupButtonText}>グループに参加</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <>
      <View style={styles.groupHeader}>
        <Text style={styles.centerTitle}>{selectedGroup}</Text>
        <Text style={styles.centerGoal}>{selectedGroupGoal}</Text>
      </View>

      <View style={styles.chatSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>テキストチャンネル</Text>
          <TouchableOpacity onPress={handleChatText}>
            <Text style={styles.addText}>+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.chatList}>
          {talkName.map((value, index) => (
            <TouchableOpacity
              key={index}
              style={styles.chatItem}
              onPress={() => handlePress(value)}
            >
              <Text style={styles.chatName}># {value}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.memberSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>メンバー</Text>
          <TouchableOpacity onPress={handleMember}>
            <Text style={styles.infoText}>i</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.memberList}>
          {talkMembers.map((value, index) => (
            <View key={index} style={styles.memberItem}>
              <Avatar 
                size={32} 
                rounded 
                title={value[0]} 
                containerStyle={{ backgroundColor: getAvatarBackgroundColor(index) }} 
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  )}
</View>

      </View>
      <Fotter/>
    </View>
  );
}

const styles = StyleSheet.create({
  all_container: {
    flex: 1,
    flexDirection: 'column',  // ここを変更
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  leftContainer: {
    width: 70,
    backgroundColor: '#d2d9d8',
    padding: 10,
    justifyContent: 'space-between',
  },
  leftavater:{
    marginTop:20,
  },
  showAllButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  showAllButtonText: {
    fontSize: 20,
  },
  addButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 24,
  },

  centerContainer: {
    flex: 1,
    padding: 20,
    marginRight: 20,
    marginLeft: 10,
    borderRadius:30,
    marginTop: 20,
  },
  noGroupsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noGroupsText: {
    fontSize: 18,
    color: '#2980B9',
    marginBottom: 20,
  },
  joinGroupButton: {
    backgroundColor: '#2980B9',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  joinGroupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  groupItem: {
    alignItems: 'center',
    marginBottom: 15,
  },
  selectedGroup: {
    // backgroundColor: '#7289da',
    borderRadius: 15,
    padding: 5,
  },
  groupName: {
    fontSize: 10,
    marginTop: 5,
    textAlign: 'center',
  },
  groupHeader: {
    marginBottom: 20,
  },
  centerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  centerGoal: {
    fontSize: 14,
    // color: '#b9bbbe',
    marginTop: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chatSection: {
    maxHeight: '40%',  // テキストチャットの最大高さを設定
  },
  memberSection: {
    maxHeight: '40%',  // メンバーリストの最大高さを設定
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatList: {
    marginTop: 10,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  chatName: {
    // color: '#b9bbbe',
    marginLeft: 10,
  },
  memberSection: {
    marginTop: 20,
  },
  memberList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  memberItem: {
    margin: 5,
  },
  memberName: {
    // color: '#b9bbbe',
    fontSize: 12,
    marginTop: 5,
  },
  modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
      },
      input: {
        height: 40,
        width: 200,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      },
      modalButton: {
        backgroundColor:'skyblue',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
      },
      errorText:{
        color:'red',
      },
      addText: {
        fontSize: 24,
      },
      infoText: {
        fontSize: 18,
        fontWeight: 'bold',
      },
});

export default GroupScreen;