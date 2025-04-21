import React from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useNavigation } from 'expo-router';


const produtos = [
  { id: '1', nome: 'Fralda Bambé Rosa', descricao: 'Modelo ecológico com absorção extra', preco: 'R$ 49,90' },
  { id: '2', nome: 'Fralda Bambé Azul', descricao: 'Alta durabilidade e conforto', preco: 'R$ 47,90' },
  { id: '3', nome: 'Fralda Bambé Verde', descricao: 'Design sustentável e prático', preco: 'R$ 52,00' }
];

export default function ProductsScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produtos Bambé</Text>
      
      <Button title="Tirar foto de produto" onPress={() => navigation.navigate('CameraScreen')} />
      
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.descricao}>{item.descricao}</Text>
            <Text style={styles.preco}>{item.preco}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#fff', padding: 20
  },
  title: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center'
  },
  card: {
    backgroundColor: '#f2f2f2', padding: 15, marginBottom: 15, borderRadius: 10
  },
  nome: {
    fontSize: 18, fontWeight: 'bold'
  },
  descricao: {
    fontSize: 14, color: '#666'
  },
  preco: {
    fontSize: 16, color: '#00a859', marginTop: 5
  }
});
