import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../views/firebaseConfig.js';

const ChatScreen = ({ route, navigation }) => {
    const { groupId, groupName, chatName, chatDocId } = route.params;
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const flatListRef = useRef(null);

    useEffect(() => {
        navigation.setOptions({ title: `${groupName} - ${chatName}` });
        const messagesRef = collection(db, 'group', groupId, 'groupchat', chatDocId, 'message');
        const q = query(messagesRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messageList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(messageList);
        });

        return () => unsubscribe();
    }, [groupId, groupName, chatName, chatDocId]);

    //送信の処理
    const sendMessage = async () => {
        if (inputMessage.trim() === '') return;
        const user = auth.currentUser;
        if (!user) return;

        try {
            const messagesRef = collection(db, 'group', groupId, 'groupchat', chatDocId, 'message');
            await addDoc(messagesRef, {
                text: inputMessage,
                createdAt: new Date(),
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                likes: []
            });
            setInputMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    //いいねの処理
    const likeMessage = async (messageId, likes, messageUserId) => {
      const user = auth.currentUser;
      if (!user) return;
  
      // 自分のメッセージにはいいねできない
      if (user.uid === messageUserId) return;
  
      const messageRef = doc(db, 'group', groupId, 'groupchat', chatDocId, 'message', messageId);
      const userRef = doc(db, 'users', user.uid);
  
      try {
          if (likes && likes.includes(user.uid)) {
              await updateDoc(messageRef, {
                  likes: arrayRemove(user.uid)
              });
              await updateDoc(userRef, {
                  totalLikesGiven: increment(-1)
              });
          } else {
              await updateDoc(messageRef, {
                  likes: arrayUnion(user.uid)
              });
              await updateDoc(userRef, {
                  totalLikesGiven: increment(1)
              });
          }
      } catch (error) {
          console.error('Error liking/unliking message:', error);
      }
  };
  

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>#{chatName}</Text>
                <Text style={styles.headerSubtitle}>お互いモチベーションを高めましょう！！</Text>
            </View>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={({ item }) => {
                      const liked = item.likes ? item.likes.includes(auth.currentUser.uid) : false;
                      return (
                          <View style={[
                              styles.messageContainer,
                              item.userId === auth.currentUser.uid ? styles.ownMessage : styles.otherMessage
                          ]}>
                              <Text style={styles.userName}>{item.userName}</Text>
                              <View style={styles.messageBubble}>
                                  <Text style={styles.messageText}>{item.text}</Text>
                              </View>
                              <View style={styles.messageFooter}>
                                  <Text style={styles.messageTime}>
                                      {item.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </Text>
                                  {item.userId !== auth.currentUser.uid && (
                                      <TouchableOpacity onPress={() => likeMessage(item.id, item.likes, item.userId)} style={styles.likeButton}>
                                          <Text style={[styles.likeButtonText, liked && styles.liked]}>{liked ? '❤️' : '♡'} {item.likes ? item.likes.length : 0}</Text>
                                      </TouchableOpacity>
                                  )}
                              </View>
                          </View>
                      );
                  }}
                    keyExtractor={item => item.id}
                    inverted
                    contentContainerStyle={styles.messageList}
                    onContentSizeChange={() => flatListRef.current.scrollToOffset({ animated: true, offset: 0 })}
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputMessage}
                        onChangeText={setInputMessage}
                        placeholder="メッセージを送信"
                        placeholderTextColor="#72767d"
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !inputMessage.trim() && styles.sendButtonDisabled]}
                        onPress={sendMessage}
                        disabled={!inputMessage.trim()}
                    >
                        <Text style={styles.sendButtonText}>送信</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#bcd7f5',
    },
    header: {
        backgroundColor: 'white',
        padding: 15,
        borderBottomWidth: 1,
        // borderBottomColor: '#202225',
    },
    headerTitle: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        color: '#6e6f70',
        fontSize: 14,
        marginTop: 5,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    messageList: {
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    messageContainer: {
        marginBottom: 15,
        maxWidth: '80%',
    },
    ownMessage: {
        alignSelf: 'flex-end',
    },
    otherMessage: {
        alignSelf: 'flex-start',
    },
    userName: {
        fontSize: 12,
        color: '#6e6f70',
        marginBottom: 2,
    },
    messageBubble: {
        backgroundColor: 'white',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    messageText: {
        fontSize: 16,
        color: 'black',
    },
    messageFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    messageTime: {
        fontSize: 10,
        color: '#72767d',
        marginTop: 2,
    },
    likeButton: {
        marginLeft: 10,
    },
    likeButtonText: {
        fontSize: 14,
        color: '#72767d',
    },
    liked: {
        color: '#ff0000',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#dff7f6',
        borderTopWidth: 1,
        borderTopColor: '#202225',
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        color: 'black',
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: 'white',
    },
    sendButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
});

export default ChatScreen;
