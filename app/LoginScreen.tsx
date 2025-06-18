import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Alert
} from 'react-native';
import * as Network from 'expo-network';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { useRouter } from 'expo-router';

function showAlert(title: string, message: string) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const verificarConexao = async () => {
      const status = await Network.getNetworkStateAsync();
      setIsConnected(status.isConnected);
    };
    verificarConexao();
    const intervalo = setInterval(verificarConexao, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const handleLogin = () => {
    if (!email || !senha) {
      showAlert('Atenção', 'Preencha todos os campos.');
      return;
    }

    signInWithEmailAndPassword(auth, email, senha)
      .then(() => {
        showAlert('✅ Sucesso', 'Login realizado com sucesso!');
        router.push('/HomeScreen');
      })
      .catch((error) => {
        console.log('❌ Erro no login:', error.code, error.message);
        switch (error.code) {
          case 'auth/invalid-email':
            showAlert('Erro', 'Formato de e-mail inválido.');
            break;
          case 'auth/user-not-found':
            showAlert('Erro', 'E-mail não cadastrado.');
            break;
          case 'auth/wrong-password':
            showAlert('Erro', 'Senha incorreta. Tente novamente.');
            break;
          case 'auth/too-many-requests':
            showAlert(
              'Erro',
              'Muitas tentativas falharam. Aguarde alguns minutos antes de tentar de novo.'
            );
            break;
          default:
            showAlert('Erro', 'Ocorreu um erro: ' + error.message);
        }
      });
  };

  return (
    <View style={styles.container}>
      {isConnected === false && (
        <View style={styles.alertaDesconectado}>
          <Text style={styles.textoAlerta}>Você está offline ⚠️</Text>
        </View>
      )}
      {isConnected === true && (
        <View style={styles.alertaConectado}>
          <Text style={styles.textoAlerta}>Conectado à internet ✅</Text>
        </View>
      )}

      <Image
        source={require('../assets/images/logobambe.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Bem-vindo de volta</Text>
      <Text style={styles.subtitle}>Acesse com seu e-mail corporativo</Text>

      <TextInput
        placeholder="E-mail"
        placeholderTextColor="#999"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
        <Text style={styles.textoBotao}>ENTRAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertaDesconectado: {
    backgroundColor: '#ff5555',
    padding: 10,
    borderRadius: 8,
    marginBottom: 100,
    alignItems: 'center'
  },
  alertaConectado: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 8,
    marginBottom: 100,
    alignItems: 'center'
  },
  textoAlerta: {
    color: '#ffff',
    fontWeight: 'bold'
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4
  },
  subtitle: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 20
  },
  input: {
    width: '100%',
    backgroundColor: '#1c1c1c',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333'
  },
  botao: {
    backgroundColor: '#a5c9a1',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10
  },
  textoBotao: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16
  }
});
