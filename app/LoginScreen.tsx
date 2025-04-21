import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image
} from 'react-native';
import { useNavigation } from 'expo-router';
import * as Network from 'expo-network';

export default function LoginScreen() {
  const navigation = useNavigation();

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
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    navigation.navigate('HomeScreen');
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
