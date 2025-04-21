import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';

export default function Perfil() {
  const router = useRouter();

  const nome = 'Mariana Souza';
  const email = 'mariana@bambe.com.br';

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/150.png')}
        style={styles.avatar}
      />

      <Text style={styles.nome}>{nome}</Text>
      <Text style={styles.email}>{email}</Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.replace('LoginScreen')}
      >
        <Text style={styles.textoBotao}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#a5c9a1'
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5
  },
  email: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 30
  },
  botao: {
    backgroundColor: '#a5c9a1',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8
  },
  textoBotao: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16
  }
});
