import { useEffect, useReducer, useState } from 'react';
import { Button, Flex, Grid, Image, Stack, Title } from '@mantine/core';
import { api } from './services/api';

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


// const Lanches: Lanche[] = [

//   { id: 1, nome: 'Hambúrguer', preco: 15.00, imagem: "../public/burguer.png" },
//   { id: 2, nome: 'Batata Frita', preco: 7.50, imagem: "../public/batata.png" },
//   { id: 3, nome: 'Cachorro Quente', preco: 10.00, imagem: "../public/cachorro.png" },
//   { id: 4, nome: 'Refrigerante', preco: 5.00, imagem: "../public/refri.png" },
//   { id: 5, nome: 'Sorvete', preco: 8.00, imagem: "../public/sorvete.png" }
// ];
let didInit = false;

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
  const [lanches, setLanches] = useState([] as Lanche[]);
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

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await api.get("/produtos", {
        headers: {
          "Content-Type": "application/json"
        }
      });
      console.log(data);
      setLanches(data);
    }
    if (!didInit) {
      didInit = true;
      fetchData();
    }
  }, []);

  return (
    <Flex direction={"column"} p={"xl"} align={"center"} justify={"center"}>

      <Flex
        direction={"column"}
        justify={'center'}
        align={'center'}
        p={"xl"}
        gap={"xl"}
        w={"90%"}
      >
        <Image w={"30vw"} src="/senac-logo.png" alt="" />
        <Title id='titulo'>Selecione seus Lanches</Title>
      </Flex>
      <Stack w={"90%"}>
        {lanches.map(item => (

          <Grid key={item.id} w={"100%"} p={"xl"} styles={{
            root: {
              border: "2px black solid ",
              borderRadius: "8px"
            }
          }}
          >
            <Grid.Col span={2} pl="lg"><Image radius="md" src={item.imagem} w={"100%"} /></Grid.Col>
            <Grid.Col span={8}><Title>{item.nome} - R${item.preco.toFixed(2)}</Title></Grid.Col>
            <Grid.Col span={2}><Button size={"xl"} variant={"filled"} onClick={() => adicionarItem(item)}>Adicionar</Button></Grid.Col>
          </Grid>

        ))}
      </Stack>
      <Stack w={"90%"} >
        <Title id='pedido'>Pedido:</Title>
        {state.pedido.map(item => (
          <Grid key={item.id} w={"100%"} p={"xl"} styles={{
            root: {
              border: "2px black solid ",
              borderRadius: "8px"
            }
          }}
          >
            <Grid.Col span={2} pl="lg"><Image radius="md" src={item.imagem} w={"100%"} /></Grid.Col>
            <Grid.Col span={8}><Title>{item.nome} - R${item.preco.toFixed(2)}</Title></Grid.Col>
            <Grid.Col span={2}><Button size={"xl"} variant={"filled"} onClick={() => removerItem(item.id)}>Remover</Button></Grid.Col>
          </Grid>
        ))}
        <Flex
          direction={"column"}
          justify={'center'}
          align={'center'}
          p={"xl"}
          gap={"xl"}
          w={"90%"}
        >
          <Title>Total: R${state.total.toFixed(2)}</Title>
          <Button
            size={"xl"}
            variant={"filled"}
            color={"green"}
            onClick={handleCompraClick}
          >Comprar</Button>
        </Flex>

      </Stack>
    </Flex>
  );
};
