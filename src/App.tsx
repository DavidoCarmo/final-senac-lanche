import React, { useReducer } from 'react';
import { Box, Button, Container, Flex, Grid, Image, Stack, Text } from '@mantine/core';

interface Lanche {

  id: number;
  nome: string;
  preco: number;
  imagem: string;
}

interface State {
  pedido: Lanche[];
  total: number;
}

type Action =
  | { type: 'ADICIONAR_ITEM'; payload: Lanche }
  | { type: 'REMOVER_ITEM'; payload: number }
  | { type: 'LIMPAR_PEDIDO' };


const Lanches: Lanche[] = [

  { id: 1, nome: 'Hambúrguer', preco: 15.00, imagem: "../public/burguer.png" },
  { id: 2, nome: 'Batata Frita', preco: 7.50, imagem: "../public/batata.png" },
  { id: 3, nome: 'Cachorro Quente', preco: 10.00, imagem: "../public/cachorro.png" },
  { id: 4, nome: 'Refrigerante', preco: 5.00, imagem: "../public/refri.png" },
  { id: 5, nome: 'Sorvete', preco: 8.00, imagem: "../public/sorvete.png" }
];

const initialState: State = { pedido: [], total: 0 };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADICIONAR_ITEM':
      return {
        ...state,
        pedido: [...state.pedido, action.payload],
        total: state.total + action.payload.preco
      };
    case 'REMOVER_ITEM':
      return {
        ...state,
        pedido: state.pedido.reduce((acc, item) => {
          if (item.id !== action.payload) {
            acc.push(item);
          }
          return acc;
        }, [] as Lanche[]),
        total: state.pedido.reduce((acc, item) => {
          if (item.id !== action.payload) {
            acc += item.preco;
          }
          return acc;
        }, 0)
      };
    case 'LIMPAR_PEDIDO':
      return initialState;
    default:
      return state;
  }
};


export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const adicionarItem = (item: Lanche) => {
    dispatch({ type: 'ADICIONAR_ITEM', payload: item });
  };

  const removerItem = (id: number) => {
    dispatch({ type: 'REMOVER_ITEM', payload: id });
  };

  const handleCompraClick = () => {
    if (state.pedido.length > 0) {
      alert(`Compra realizada com sucesso!\nTotal: R$${state.total.toFixed(2)}`);
      dispatch({ type: 'LIMPAR_PEDIDO' });
    } else {
      alert('Nenhum item no pedido.');
    }
  };

  return (
    <Flex direction={"column"} p={"xl"} align={"center"} bg="orange" justify={"center"}>
      <Box w={"90%"} bg="blue">
        <div id='minititulo'>
          <img id='fotoFundo' src="../public/image.png" alt="" />
          <h1 id='titulo'>Selecione seus Lanches</h1>
        </div>
      </Box>
      <Stack w={"90%"}>

        {Lanches.map(item => (

          <Grid key={item.id} w={"100%"} style={{
            root: {
              border: "1px black solid ",
              borderRadius: "8px"
            }
          }}>
            <Grid.Col span={6} pl="lg"><Image radius="md" src={item.imagem} w={"30%"} /></Grid.Col>
            <Grid.Col span={4}><Text span>{item.nome} - R${item.preco.toFixed(2)}</Text></Grid.Col>
            <Grid.Col span={2}><Button onClick={() => adicionarItem(item)}>Adicionar</Button></Grid.Col>
          </Grid>

        ))}
      </Stack>
      <div className="pedido-lista">
        <h2 id='pedido'>Pedido:</h2>
        {state.pedido.map(item => (
          <div key={item.id} className="pedido-item">
            <img id='fotos' src={item.imagem} alt="" />
            <span>{item.nome} - R${item.preco.toFixed(2)}</span>
            <button onClick={() => removerItem(item.id)}>Remover</button>
          </div>
        ))}
      </div>
      <h2>Total: R${state.total.toFixed(2)}</h2>
      <button className="compra-button" onClick={handleCompraClick}>Comprar</button>
    </Flex>
  );
};
