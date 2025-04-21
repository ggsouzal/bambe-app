import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu Principal</Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push('Produtos/Listar')}
      >
        <Text style={styles.textoBotao}>📦 Produtos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push('Produtos/Cadastrar')}
      >
        <Text style={styles.textoBotao}>➕ Cadastrar Produto</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push('Vendas/Nova')}
      >
        <Text style={styles.textoBotao}>🛒 Nova Venda</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push('Perfil')}
      >
        <Text style={styles.textoBotao}>👤 Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    padding: 30,
    justifyContent: 'center'
  },
  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40
  },
  botao: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15
  },
  textoBotao: {
    color: '#ffff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
