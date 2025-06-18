// app/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

export const unstable_settings = {
  headerShown: false,
};

export default function HomeScreen() {
  const router = useRouter();
  const auth = getAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Monitora o estado de autenticação
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color="#a5c9a1" size="large" />
      </View>
    );
  }

  if (!user) {
    // Se por algum motivo não houver usuário, volta para login
    router.replace('/LoginScreen');
    return null;
  }

  const displayName = user.displayName || user.email?.split('@')[0];
  const email = user.email!;
  const photoURI =
    user.photoURL ||
    // fallback para imagem padrão
    require('../assets/images/perfil.png');

  return (
    <View style={styles.container}>
      {/* Perfil */}
      <View style={styles.perfil}>
        <Image
          source={typeof photoURI === 'string' ? { uri: photoURI } : photoURI}
          style={styles.foto}
        />
        <Text style={styles.nome}>{displayName}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <Text style={styles.title}>Menu Principal</Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push('Produtos/Listar')}
      >
        <Text style={styles.textoBotao}>📦 Gerenciar Produtos</Text>
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
        onPress={() => router.push('Vendas/Listar')}
      >
        <Text style={styles.textoBotao}>📑 Listar Vendas</Text>
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
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  perfil: {
    alignItems: 'center',
    marginBottom: 20,
  },
  foto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#a5c9a1',
  },
  nome: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  email: {
    color: '#ccc',
    fontSize: 13,
  },
  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  botao: {
    backgroundColor: '#a5c9a1',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  textoBotao: {
    color: '#000',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
