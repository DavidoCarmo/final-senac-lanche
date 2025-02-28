import React, { useReducer } from 'react';
import './App.css';

interface Lanche {
  id: number;
  nome: string;
  preco: number;
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
  { id: 1, nome: 'Hambúrguer', preco: 15.00 },
  { id: 2, nome: 'Batata Frita', preco: 7.50 },
  { id: 3, nome: 'Cachorro Quente', preco: 10.00 },
  { id: 4, nome: 'Refrigerante', preco: 5.00 },
  { id: 5, nome: 'Sorvete', preco: 8.00 }
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

const App: React.FC = () => {
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
    <div className="container">
      <h1>Selecione seus Lanches</h1>
      <div className="lanches-lista">
        {Lanches.map(item => (
          <div key={item.id} className="lanche-item">
            <span>{item.nome} - R${item.preco.toFixed(2)}</span>
            <button onClick={() => adicionarItem(item)}>Adicionar</button>
          </div>
        ))}
      </div>
      <h2>Pedido:</h2>
      <div className="pedido-lista">
        {state.pedido.map(item => (
          <div key={item.id} className="pedido-item">
            <span>{item.nome} - R${item.preco.toFixed(2)}</span>
            <button onClick={() => removerItem(item.id)}>Remover</button>
          </div>
        ))}
      </div>
      <h2>Total: R${state.total.toFixed(2)}</h2>
      <button className="compra-button" onClick={handleCompraClick}>Comprar</button>
    </div>
  );
};

export default App;
