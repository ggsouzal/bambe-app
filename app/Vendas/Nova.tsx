import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from 'expo-router';

export default function NovaVenda() {
  const navigation = useNavigation();

  const [produtos] = useState([
    { id: '1', nome: 'Fralda Rosa', preco: 'R$ 49,90' },
    { id: '2', nome: 'Fralda Verde', preco: 'R$ 52,00' },
    { id: '3', nome: 'Fralda Azul', preco: 'R$ 47,00' }
  ]);

  const [produtoSelecionado, setProdutoSelecionado] = useState<string | null>(null);

  const confirmarVenda = () => {
    if (!produtoSelecionado) {
      Alert.alert('Erro', 'Selecione um produto para vender');
      return;
    }

    const produto = produtos.find((p) => p.id === produtoSelecionado);
    Alert.alert('Venda realizada', `Você vendeu: ${produto?.nome}`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Venda</Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              produtoSelecionado === item.id && styles.cardSelecionado
            ]}
            onPress={() => setProdutoSelecionado(item.id)}
          >
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.preco}>{item.preco}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.botao} onPress={confirmarVenda}>
        <Text style={styles.textoBotao}>Confirmar Venda</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#ffffff'
  },
  card: {
    backgroundColor: '#1c1c1c',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333'
  },
  cardSelecionado: {
    backgroundColor: '#2f4f2f',
    borderColor: '#a5c9a1'
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  preco: {
    fontSize: 14,
    color: '#a5c9a1',
    marginTop: 4
  },
  botao: {
    backgroundColor: '#a5c9a1',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center'
  },
  textoBotao: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16
  }
});
