import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../../services/firebaseConfig';
import { ref, onValue, remove } from 'firebase/database';

export const unstable_settings = {
  headerShown: false,
};

export default function ListarProdutos() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<any[]>([]);

  useEffect(() => {
    const produtosRef = ref(db, 'produtos');

    const unsubscribe = onValue(produtosRef, (snapshot) => {
      const data = snapshot.val();
      const lista = data
        ? Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
        : [];
      setProdutos(lista);
    });

    return () => unsubscribe();
  }, []);

  const excluirProduto = (id: string) => {
    if (Platform.OS === 'web') {
      const confirmacao = confirm('Deseja excluir este produto?');
      if (confirmacao) {
        const produtoRef = ref(db, `produtos/${id}`);
        remove(produtoRef);
      }
    } else {
      Alert.alert('Confirmação', 'Deseja excluir este produto?', [
        { text: 'Cancelar' },
        {
          text: 'Excluir',
          onPress: () => {
            const produtoRef = ref(db, `produtos/${id}`);
            remove(produtoRef);
          },
        },
      ]);
    }
  };

  const formatarPreco = (valor: number) => {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push('/HomeScreen')}
        style={styles.voltar}
      >
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
                <Text style={styles.preco}>{formatarPreco(item.preco)}</Text>
                <Text style={styles.quantidade}>
                  Estoque: {item.quantidade}
                </Text>
              </View>
              {item.imagem && (
                <Image
                  source={{ uri: item.imagem }}
                  style={styles.imagemMiniatura}
                />
              )}
            </View>

            <View style={styles.botoesContainer}>
              <TouchableOpacity
                style={styles.botaoEditar}
                onPress={() =>
                  router.push({
                    pathname: 'Produtos/Editar',
                    params: { produto: JSON.stringify(item) },
                  })
                }
              >
                <Text style={styles.textoEditar}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoExcluir}
                onPress={() => excluirProduto(item.id)}
              >
                <Text style={styles.textoExcluir}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push('Produtos/Cadastrar')}
      >
        <Text style={styles.textoBotao}>Cadastrar Novo Produto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    padding: 20,
  },
  voltar: {
    alignSelf: 'flex-start',
    backgroundColor: '#1c1c1c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 20,
  },
  voltarTexto: {
    color: '#a5c9a1',
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1c1c1c',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderColor: '#333',
    borderWidth: 1,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textos: {
    flex: 1,
    paddingRight: 10,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  descricao: {
    fontSize: 13,
    color: '#cccccc',
    marginTop: 2,
  },
  preco: {
    fontSize: 14,
    color: '#a5c9a1',
    marginTop: 4,
  },
  quantidade: {
    fontSize: 13,
    color: '#ffffff',
    marginTop: 2,
  },
  imagemMiniatura: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  botao: {
    backgroundColor: '#a5c9a1',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
  },
  botaoExcluir: {
    backgroundColor: '#a94442',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  textoExcluir: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botaoEditar: {
    backgroundColor: '#1E90FF',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  textoEditar: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
