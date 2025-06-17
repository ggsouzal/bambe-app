import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { db } from '../../services/firebaseConfig';
import { ref, update } from 'firebase/database';

export default function EditarProduto() {
  const navigation = useNavigation();
  const { produto } = useLocalSearchParams();

  const dados = JSON.parse(produto as string);

  const [nome, setNome] = useState(dados.nome);
  const [descricao, setDescricao] = useState(dados.descricao);
  const [preco, setPreco] = useState(String(dados.preco));
  const [quantidade, setQuantidade] = useState(String(dados.quantidade));
  const [imagem, setImagem] = useState<string | null>(dados.imagem);

  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Você precisa permitir acesso à câmera.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const imagemBase64 = 'data:image/jpg;base64,' + result.assets[0].base64;
      setImagem(imagemBase64);
    }
  };

  const salvarAlteracoes = () => {
    if (!nome || !descricao || !preco || !imagem || !quantidade) {
      Alert.alert('Erro', 'Preencha todos os campos e tire uma foto.');
      return;
    }

    const produtoAtualizado = {
      nome,
      descricao,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade),
      imagem,
    };

    const produtoRef = ref(db, `produtos/${dados.id}`);
    update(produtoRef, produtoAtualizado)
      .then(() => {
        Alert.alert('Sucesso', 'Produto atualizado!');
        navigation.goBack();
      })
      .catch(() => {
        Alert.alert('Erro', 'Ocorreu um erro ao atualizar.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Produto</Text>

      <TextInput
        placeholder="Nome do Produto"
        placeholderTextColor="#999"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        placeholder="Descrição"
        placeholderTextColor="#999"
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
      />

      <TextInput
        placeholder="Preço (Ex: 49.90)"
        placeholderTextColor="#999"
        style={styles.input}
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Quantidade"
        placeholderTextColor="#999"
        style={styles.input}
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
      />

      {imagem && <Image source={{ uri: imagem }} style={styles.preview} />}

      <TouchableOpacity style={styles.botaoCinza} onPress={tirarFoto}>
        <Text style={styles.textoBotaoCinza}>Tirar Nova Foto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoVerde} onPress={salvarAlteracoes}>
        <Text style={styles.textoBotaoVerde}>Salvar Alterações</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', padding: 20 },
  title: { fontSize: 22, color: '#fff', fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#1c1c1c', color: '#fff', padding: 12, borderRadius: 8, borderColor: '#333', borderWidth: 1, marginBottom: 15 },
  botaoCinza: { backgroundColor: '#333', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  textoBotaoCinza: { color: '#fff', fontWeight: 'bold' },
  botaoVerde: { backgroundColor: '#a5c9a1', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  textoBotaoVerde: { color: '#000', fontWeight: 'bold' },
  preview: { width: 100, height: 100, borderRadius: 10, alignSelf: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#444' },
});
