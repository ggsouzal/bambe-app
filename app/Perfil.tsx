// app/PerfilScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Image,
  ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../services/firebaseConfig';
import { ref, update, onValue } from 'firebase/database';
import {
  signOut,
  onAuthStateChanged,
  User,
  updateProfile as fbUpdateProfile
} from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

function showAlert(title: string, message: string) {
  Platform.OS === 'web'
    ? window.alert(`${title}\n\n${message}`)
    : Alert.alert(title, message);
}

export default function PerfilScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [apelido, setApelido] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      if (!u) router.replace('/LoginScreen');
      else {
        setUser(u);
        setApelido(u.displayName || '');
        setPhotoUri(u.photoURL);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const userRef = ref(db, `users/${user.uid}`);
    const unsubDb = onValue(userRef, snap => {
      const data = snap.val() || {};
      setTelefone(data.telefone || '');
      setDob(data.dob || '');
      setAddress(data.address || '');
    });
    return () => unsubDb();
  }, [user]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return showAlert('Erro', 'Permissão negada');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1,1],
      quality: 0.5
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    try {
      await fbUpdateProfile(user, { displayName: apelido, photoURL: photoUri });
      await update(ref(db, `users/${user.uid}`), { telefone, dob, address });
      showAlert('Sucesso', 'Perfil salvo');
      setEditing(false);
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      showAlert('Erro', 'Não foi possível salvar');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/LoginScreen');
  };

  const goReset = () => router.push('/RedefinirSenha');

  if (!user) return null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/HomeScreen')}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={editing ? pickImage : undefined} style={styles.avatarContainer}>
          <Image source={photoUri ? { uri: photoUri } : require('../assets/images/perfil.png')} style={styles.avatar} />
          {editing && <Text style={styles.changePhoto}>Alterar foto</Text>}
        </TouchableOpacity>

        {/** Editable fields **/}
        {['Apelido', 'E-mail', 'Telefone', 'Data de Nascimento', 'Endereço'].map((label, idx) => {
          const value = { 'Apelido': apelido, 'E-mail': user.email, 'Telefone': telefone, 'Data de Nascimento': dob, 'Endereço': address }[label];
          const setter = { 'Apelido': setApelido, 'Telefone': setTelefone, 'Data de Nascimento': setDob, 'Endereço': setAddress }[label];
          const keyboard = label === 'Telefone' ? 'phone-pad' : undefined;
          return (
            <View key={idx} style={styles.row}>
              <Text style={styles.label}>{label}</Text>
              {label === 'E-mail' || !editing ? (
                <Text style={styles.text}>{value || '—'}</Text>
              ) : (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={setter as any}
                  keyboardType={keyboard as any}
                  placeholderTextColor="#555"
                />
              )}
            </View>
          );
        })}

        {!editing && (
          <TouchableOpacity style={styles.actionBtn} onPress={goReset}>
            <Text style={styles.actionText}>Redefinir senha</Text>
          </TouchableOpacity>
        )}

        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setEditing(!editing)}>
            <Text style={styles.actionText}>{editing ? 'Cancelar' : 'Editar Perfil'}</Text>
          </TouchableOpacity>
          {editing && (
            <TouchableOpacity style={[styles.actionBtn, styles.saveBtn]} onPress={saveProfile}>
              <Text style={styles.actionText}>Salvar</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#0f0f0f' },
  header: {
    height: 60,
    backgroundColor: '#1c1c1c',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'space-between'
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarContainer: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: '#a5c9a1' },
  changePhoto: { color: '#a5c9a1', fontSize: 12, marginTop: 6 },
  row: { width: '100%', marginVertical: 8 },
  label: { fontSize: 12, color: '#888' },
  text: { fontSize: 16, color: '#fff', marginTop: 4 },
  input: {
    borderBottomWidth: 1,
    borderColor: '#333',
    color: '#fff',
    paddingVertical: 6,
    marginTop: 4
  },
  actionBtn: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: '#a5c9a1',
    borderRadius: 5,
    alignItems: 'center'
  },
  saveBtn: { backgroundColor: '#556b2f', marginLeft: 10 },
  actionText: { color: '#000', fontSize: 14, fontWeight: '600' },
  btnRow: { flexDirection: 'row', marginTop: 20 },
  logoutBtn: {
    marginTop: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#ff5555',
    borderRadius: 5,
    alignItems: 'center'
  },
  logoutText: { color: '#fff', fontSize: 14, fontWeight: '600' }
});
