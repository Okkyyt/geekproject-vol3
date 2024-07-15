import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,SafeAreaView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, updateProfile } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const UserProfileEdit = ({ navigation }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [headerImage, setHeaderImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        if (auth.currentUser) {
          setName(auth.currentUser.displayName || '');
          setProfileImage(auth.currentUser.photoURL || null);

          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setBio(userData.bio || '');
            setHeaderImage(userData.headerImage || null);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('エラー', 'ユーザー情報の取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async (type) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'header' ? [16, 9] : [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      if (type === 'header') {
        setHeaderImage(result.assets[0].uri);
      } else {
        setProfileImage(result.assets[0].uri);
      }
    }
  };

  const uploadImage = async (uri, path) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let headerUrl = headerImage;
      let profileUrl = profileImage;

      if (headerImage && headerImage.startsWith('file://')) {
        headerUrl = await uploadImage(headerImage, `headers/${auth.currentUser.uid}.jpg`);
      }
      if (profileImage && profileImage.startsWith('file://')) {
        profileUrl = await uploadImage(profileImage, `profiles/${auth.currentUser.uid}.jpg`);
      }

      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: profileUrl,
      });

      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        name: name,
        bio: bio,
        headerImage: headerUrl,
        photoURL: profileUrl,
      });

      Alert.alert('成功', 'プロフィールが正常に更新されました。');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('エラー', 'プロフィールの更新に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => pickImage('header')} style={styles.headerImageContainer}>
          {headerImage ? (
            <Image source={{ uri: headerImage }} style={styles.headerImage} />
          ) : (
            <View style={styles.headerImagePlaceholder}>
              <Text style={styles.placeholderText}>タップしてヘッダー画像を選択</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={() => pickImage('profile')} style={styles.profileImageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImage, styles.profileImagePlaceholder]}>
              <Text style={styles.placeholderText}>+</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.form}>
        <Text style={styles.label}>名前</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="名前を入力"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>自己紹介</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={bio}
          onChangeText={setBio}
          placeholder="自己紹介を入力"
          placeholderTextColor="#999"
          multiline
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>保存</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    height: '30%',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d0d0d0',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: -50,
  },
  profileImageContainer: {
    borderRadius: 75,
    borderWidth: 5,
    borderColor: '#f8f8f8',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  profileImagePlaceholder: {
    backgroundColor: '#4a90e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 0,
  },
  label: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    color: '#333',
    marginBottom: 10,
  },
  bioInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  loadingText: {
    color: '#333',
    marginTop: 10,
    fontSize: 16,
  },
});

export default UserProfileEdit;