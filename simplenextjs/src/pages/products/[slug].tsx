// Rota: http://localhost:3000/products/any
// --- Exemplo: http://localhost:3000/products/camiseta-front-end

import { useRouter } from 'next/router'
import { useState } from 'react';
import dynamic from 'next/dynamic';

/**
 * Lasy load de componente
 * Para que o componente inteiro apenas seja importado caso seja necessária
 * sua renderização em tela
 * 
 * Usamos o dynamic para a importação
 *    Loading é para enviar uma mensagem de carregamento
 */
const AddToCartModal = dynamic(
  () => import('../../components/AddToCartModal'),
  {
    loading: () => <p>Loading...</p>,
    ssr: false, // -- Para o componente NUNCA seja renderiado no lado do servidor, mas apenas do lado cliente (browser)
  }
);

export default function PAgDinamica() {
  const router = useRouter();
  const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false);

  function handleAddToCart() {
    setIsAddToCartModalVisible(true);
  }

  return(
    <div>
      <h1>{router.query.slug}</h1>

      <button onClick={handleAddToCart}>Add to cart</button>

      {isAddToCartModalVisible && <AddToCartModal />}
    </div>
  )
}