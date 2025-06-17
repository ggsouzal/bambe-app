import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../../services/firebaseConfig';
import { onValue, push, ref, update } from 'firebase/database';

export const unstable_settings = {
  headerShown: false,
};

export default function NovaVenda() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<any[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<any | null>(null);
  const [quantidadeSelecionada, setQuantidadeSelecionada] = useState('');

  useEffect(() => {
    const produtosRef = ref(db, 'produtos');

    const unsubscribe = onValue(produtosRef, (snapshot) => {
      const data = snapshot.val();
      const lista = data
        ? Object.keys(data)
            .map((key) => ({
              id: key,
              ...data[key],
            }))
            .filter((item) => item.quantidade > 0) // Somente produtos com estoque
        : [];
      setProdutos(lista);
    });

    return () => unsubscribe();
  }, []);

  const confirmarVenda = () => {
    if (!produtoSelecionado) {
      Alert.alert('Erro', 'Selecione um produto para vender');
      return;
    }

    const quantidadeNum = parseInt(quantidadeSelecionada);

    if (!quantidadeNum || quantidadeNum <= 0) {
      Alert.alert('Erro', 'Digite uma quantidade válida');
      return;
    }

    if (quantidadeNum > produtoSelecionado.quantidade) {
      Alert.alert(
        'Erro',
        `Quantidade insuficiente em estoque. Estoque atual: ${produtoSelecionado.quantidade}`
      );
      return;
    }

    // Registrar a venda
    const vendasRef = ref(db, 'vendas');
    push(vendasRef, {
      produtoId: produtoSelecionado.id,
      produtoNome: produtoSelecionado.nome,
      quantidadeVendida: quantidadeNum,
      data: new Date().toISOString(),
    });

    // Atualizar estoque
    const produtoRef = ref(db, `produtos/${produtoSelecionado.id}`);
    update(produtoRef, {
      quantidade: produtoSelecionado.quantidade - quantidadeNum,
    });

    Alert.alert(
      'Venda realizada',
      `Você vendeu: ${quantidadeNum} unidade(s) de ${produtoSelecionado.nome}`
    );
    router.back();
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

      <Text style={styles.title}>Nova Venda</Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              produtoSelecionado?.id === item.id && styles.cardSelecionado,
            ]}
            onPress={() => setProdutoSelecionado(item)}
          >
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.preco}>{formatarPreco(item.preco)}</Text>
            <Text style={styles.estoque}>Estoque: {item.quantidade}</Text>
          </TouchableOpacity>
        )}
      />

      {produtoSelecionado && (
        <View>
          <Text style={styles.label}>
            Quantidade para vender de: {produtoSelecionado.nome}
          </Text>
          <TextInput
            placeholder="Digite a quantidade"
            placeholderTextColor="#999"
            style={styles.input}
            value={quantidadeSelecionada}
            onChangeText={setQuantidadeSelecionada}
            keyboardType="numeric"
          />
        </View>
      )}

      <TouchableOpacity style={styles.botao} onPress={confirmarVenda}>
        <Text style={styles.textoBotao}>Confirmar Venda</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 20 },
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#1c1c1c',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardSelecionado: {
    backgroundColor: '#2f4f2f',
    borderColor: '#a5c9a1',
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  preco: {
    fontSize: 14,
    color: '#a5c9a1',
    marginTop: 4,
  },
  estoque: {
    fontSize: 13,
    color: '#ffffff',
    marginTop: 4,
  },
  label: {
    color: '#ffffff',
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#1c1c1c',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    borderColor: '#333',
    borderWidth: 1,
    marginBottom: 10,
  },
  botao: {
    backgroundColor: '#a5c9a1',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
