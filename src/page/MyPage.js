import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Fotter from './Fotter';

const MyPage = () => {
  const [userData, setUserData] = useState(null);
  const [badge, setBadge] = useState('');
  const auth = getAuth();
  const db = getFirestore();
  const navigation = useNavigation();

  const fetchUserData = useCallback(async () => {
    if (auth.currentUser) {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
        updateBadge(userDoc.data().totalLikesGiven || 0);
      }
    } else {
      navigation.navigate('Initial');
    }
  }, [auth.currentUser, db, navigation]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  const updateBadge = (totalLikes) => {
    if (totalLikes >= 100) {
      setBadge('ゴールドバッジ');
    } else if (totalLikes >= 50) {
      setBadge('シルバーバッジ');
    } else if (totalLikes >= 10) {
      setBadge('ブロンズバッジ');
    } else {
      setBadge('初心者バッジ');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Initial' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };


  const handleEdit = () => {
    navigation.navigate('UserProfileEdit');
  };

  if (!userData) {
    return <Text>ユーザーデータがありません</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: userData.headerImage || 'https://via.placeholder.com/500x200' }}
            style={styles.headerImage}
          />
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: userData.photoURL || 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.username}>{userData.username || 'ユーザー名'}</Text>
              <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <Text style={styles.editButtonText}>編集</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>バッジコレクション</Text>
          <Text style={styles.badgeText}>{badge}</Text>
          <Text style={styles.badgeDescription}>ほかの人を応援することによりゲット！バッジを集めてプロフィールにつけよう！</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>自己紹介</Text>
          <Text style={styles.bioText}>{userData.bio || '自己紹介が未設定です。'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>メンバーになった日</Text>
          <Text style={styles.dateText}>{userData.createdAt ? new Date(userData.createdAt.seconds * 1000).toLocaleDateString('ja-JP') : '不明'}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>ログアウト</Text>
        </TouchableOpacity>
      </ScrollView>
      <Fotter/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  headerContainer: {
    marginBottom: 10,
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  nameContainer: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 5,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 16,
    marginBottom: 5,
  },
  badgeDescription: {
    fontSize: 14,
    color: '#666',
  },
  bioText: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  logoutText: {
    fontSize: 16,
    color: '#333',
  },
});

export default MyPage;