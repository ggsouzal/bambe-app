// app/RedefinirSenha.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform
} from 'react-native';
import { auth } from '../services/firebaseConfig';
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  signOut
} from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

function showAlert(title: string, message: string) {
  Platform.OS === 'web'
    ? window.alert(`${title}\n\n${message}`)
    : Alert.alert(title, message);
}

export default function RedefinirSenha() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return showAlert('Atenção', 'Preencha todos os campos.');
    }
    if (newPassword !== confirmPassword) {
      return showAlert('Atenção', 'Nova senha e confirmação não coincidem.');
    }

    setLoading(true);
    const user = auth.currentUser;
    if (!user || !user.email) {
      showAlert('Erro', 'Usuário não autenticado.');
      setLoading(false);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      showAlert('Sucesso', 'Senha alterada com sucesso.');
      // Após alterar, desloga e leva para tela de login
      await signOut(auth);
      router.replace('/LoginScreen');
    } catch (err: any) {
      console.error('Erro redefinir senha:', err);
      showAlert('Erro', err.message || 'Não foi possível alterar a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Redefinir Senha</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Senha Atual"
          placeholderTextColor="#555"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Nova Senha"
          placeholderTextColor="#555"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Nova Senha"
          placeholderTextColor="#555"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.disabled]}
          onPress={handleChangePassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Alterando...' : 'Alterar Senha'}
          </Text>
        </TouchableOpacity>
      </View>
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
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    width: '100%',
    backgroundColor: '#1c1c1c',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 15
  },
  button: {
    backgroundColor: '#a5c9a1',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center'
  },
  disabled: { backgroundColor: '#555' },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
