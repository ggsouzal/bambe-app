import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { db } from '../../services/firebaseConfig';
import { onValue, ref } from 'firebase/database';
import { useRouter } from 'expo-router';

export const unstable_settings = {
  headerShown: false,
};

export default function ListarVendas() {
  const router = useRouter();
  const [vendas, setVendas] = useState<any[]>([]);

  useEffect(() => {
    const vendasRef = ref(db, 'vendas');

    const unsubscribe = onValue(vendasRef, (snapshot) => {
      const data = snapshot.val();
      const lista = data
        ? Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }))
        : [];
      setVendas(lista);
    });

    return () => unsubscribe();
  }, []);

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${data.getFullYear()} ${data
      .getHours()
      .toString()
      .padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push('/HomeScreen')}
        style={styles.voltar}
      >
        <Text style={styles.voltarTexto}>← Voltar ao Menu</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Lista de Vendas</Text>

      <FlatList
        data={vendas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.produto}>Produto: {item.produtoNome}</Text>
            <Text style={styles.quantidade}>Quantidade: {item.quantidadeVendida}</Text>
            <Text style={styles.data}>Data: {formatarData(item.data)}</Text>
          </View>
        )}
      />

      {vendas.length === 0 && (
        <Text style={styles.semVendas}>Nenhuma venda registrada.</Text>
      )}
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
  produto: { color: '#fff', fontWeight: 'bold', marginBottom: 4 },
  quantidade: { color: '#a5c9a1', marginBottom: 4 },
  data: { color: '#ccc' },
  semVendas: { color: '#ccc', textAlign: 'center', marginTop: 20 },
});
