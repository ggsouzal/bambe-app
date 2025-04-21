// Produtos/Listar.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, Image
} from 'react-native';
import { useNavigation, useLocalSearchParams } from 'expo-router';

export default function ListarProdutos() {
  const navigation = useNavigation();
  const { novoProduto } = useLocalSearchParams();

  const [produtos, setProdutos] = useState([
    { id: '1', nome: 'Fralda Rosa', descricao: 'Fralda ecológica para bebês', preco: 'R$ 49,90', imagem: null },
    { id: '2', nome: 'Fralda Verde', descricao: 'Fralda com duplo reforço', preco: 'R$ 52,00', imagem: null }
  ]);

  useEffect(() => {
    if (novoProduto) {
      try {
        const produtoConvertido = JSON.parse(novoProduto as string);
        setProdutos((prev) => [...prev, produtoConvertido]);
      } catch {}
    }
  }, [novoProduto]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')} style={styles.voltar}>
        <Text style={styles.voltarTexto}>← Voltar ao Menu</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Lista de Produtos</Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.textos}>
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={styles.descricao}>{item.descricao}</Text>
                <Text style={styles.preco}>{item.preco}</Text>
              </View>
              {item.imagem && (
                <Image source={{ uri: item.imagem }} style={styles.imagemMiniatura} />
              )}
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate('Produtos/Cadastrar')}
      >
        <Text style={styles.textoBotao}>Cadastrar Novo Produto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#0f0f0f', padding: 20
  },
  voltar: {
    alignSelf: 'flex-start', marginBottom: 20,
    backgroundColor: '#1c1c1c', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 8
  },
  voltarTexto: {
    color: '#a5c9a1', fontSize: 14, fontWeight: 'bold'
  },
  title: {
    fontSize: 22, fontWeight: 'bold', color: '#ffffff',
    textAlign: 'center', marginBottom: 20
  },
  card: {
    backgroundColor: '#1c1c1c', padding: 15, borderRadius: 12,
    marginBottom: 12, borderColor: '#333', borderWidth: 1
  },
  cardContent: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  textos: {
    flex: 1, paddingRight: 10
  },
  nome: {
    fontSize: 16, fontWeight: 'bold', color: '#ffffff'
  },
  descricao: {
    fontSize: 13, color: '#cccccc', marginTop: 2
  },
  preco: {
    fontSize: 14, color: '#a5c9a1', marginTop: 4
  },
  imagemMiniatura: {
    width: 60, height: 60, borderRadius: 8, borderWidth: 1, borderColor: '#444'
  },
  botao: {
    backgroundColor: '#a5c9a1', paddingVertical: 14,
    borderRadius: 10, alignItems: 'center', marginTop: 10
  },
  textoBotao: {
    color: '#000', fontSize: 15, fontWeight: 'bold'
  }
});
