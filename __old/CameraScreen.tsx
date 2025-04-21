import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from 'expo-router';

export default function CameraScreen() {
  const [imagem, setImagem] = useState<string | null>(null);
  const navigation = useNavigation();

  const abrirCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Você precisa permitir o uso da câmera.');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 0.5, 
    });

    if (!resultado.canceled) {
      const uriBase64 = 'data:image/jpg;base64,' + resultado.assets[0].base64;
      setImagem(uriBase64);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tirar Foto do Produto</Text>
      <Button title="Abrir Câmera" onPress={abrirCamera} />
      {imagem && (
        <Image source={{ uri: imagem }} style={styles.imagem} />
      )}
      <Button title="Voltar para Produtos" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 20
  },
  title: {
    fontSize: 22, fontWeight: 'bold', marginBottom: 20
  },
  imagem: {
    width: 300, height: 300, marginTop: 20, borderRadius: 10
  }
});
