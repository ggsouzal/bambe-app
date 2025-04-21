// services/api.ts

export const salvarProduto = async (produto: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Produto enviado para o servidor simulado:', produto);
        resolve({ status: 201, data: produto });
      }, 1000);
    });
  };
  