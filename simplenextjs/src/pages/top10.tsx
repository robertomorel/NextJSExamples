import { GetStaticProps } from "next";

interface IProduct {
  id: string;
  title: string;
}

interface Top10Props {
  products: IProduct[]
}

export default function Top10({ products }: Top10Props) {
  return (
    <div>
      <h1>Top 10</h1>

      <ul>
        {products && products.map(product => {
          return (
            <li key={product.id}>
              {product.title}
            </li>
          )
        })}
      </ul>
    </div>
  );
}

// -- Static-side generation
/**
 * Página que não possui conteúdo dinâmico
 * No momento que a aplicação é buildada, estas informações ficam em cache
 * pq foram gerados de forma estática, ou seja, não há nenhum tipo de carregamento
 * DEV: não faz diferença
 * PROD: dá pra ver o carregamento instantâneo das páginas estáticas
 */
export const getStaticProps: GetStaticProps<Top10Props> = async (context) => {
  const response = await fetch('http://localhost:3333/products');
  const products = await response.json();

  return {
    props: { // -- Propriedades que serão lidas no build
      products,
    },
    revalidate: 5, // -- A cada 5s, o next gera uma nova versão da página
  }
}