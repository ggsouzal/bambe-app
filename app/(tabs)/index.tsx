import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logobambe.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>CRM Bambé</Text>
      <Text style={styles.subtitle}>Ferramenta de apoio ao colaborador Bambé</Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push('LoginScreen')}
      >
        <Text style={styles.textoBotao}>ENTRAR NO SISTEMA</Text>
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
  logo: {
    borderRadius: 90,
    width: 100,
    height: 100,
    marginBottom: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 30
  },
  botao: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10
  },
  textoBotao: {
    color: '#ffff',
    fontWeight: 'bold',
    fontSize: 16
  }
});
