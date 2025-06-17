import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export const unstable_settings = {
  headerShown: false,
};

export default function Perfil() {
  const router = useRouter();

  const nome = 'Mariana Souza';
  const email = 'mariana@bambe.com.br';

  return (
    <LinearGradient
      colors={['#0f0f0f', '#1c1c1c', '#0f0f0f']}
      style={styles.container}
    >
      <TouchableOpacity
        onPress={() => router.push('/HomeScreen')}
        style={styles.voltar}
      >
        <Text style={styles.voltarTexto}>← Voltar ao Menu</Text>
      </TouchableOpacity>

      <Text style={styles.bemVinda}>👋 Bem-vinda de volta, Mariana!</Text>

      <View style={styles.card}>
        <Image
          source={require('../assets/images/perfil.png')}
          style={styles.avatar}
        />

        <Text style={styles.nome}>{nome}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.replace('LoginScreen')}
      >
        <Text style={styles.textoBotao}>🚪 Sair</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  voltar: {
    alignSelf: 'flex-start',
    backgroundColor: '#1c1c1c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    position: 'absolute',
    top: 40,
    left: 20,
  },
  voltarTexto: {
    color: '#a5c9a1',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bemVinda: {
    color: '#a5c9a1',
    fontSize: 16,
    marginBottom: 20,
    fontWeight: 'bold',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#1c1c1c',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#a5c9a1',
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#cccccc',
  },
  botao: {
    backgroundColor: '#a5c9a1',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  textoBotao: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
