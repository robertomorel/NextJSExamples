import { GetStaticPaths, GetStaticProps } from 'next';
import { route } from 'next/dist/next-server/server/router';
import { Router, useRouter } from 'next/router'

interface IProduct {
  id: string;
  title: string;
}

interface CategoryProps {
  products: IProduct[]
}

export default function Category({ products }: CategoryProps) {
  const router = useRouter();

  // -- Para gerar as páginas não carregadas estaticamente pelo build
  // -- Com o fallback == true, qlqr página pode ser carregada, mas demora um pouco para carregar
  if(router.isFallback){
    return <h1>Carregando...</h1>
  }

  return (
    <div>
      <h1>{router.query.slug}</h1>

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

/**
 * Método necessário para limitar alguns parâmetros de path para o next
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch('http://localhost:3333/categories');
  const categories = await response.json();

  const paths = categories.map(category => {
    return {
      params: { slug: category.id }
    }
  });

  //console.log('Categorie: ', JSON.stringify(paths, null, 2))

  return {
    paths,
    // -- true: Sempre que o user tentar acessar uma rota que ainda não foi acessada estaticamente, o next vai gerar automaticamente
    // -- false: Se o user tentar acessar uma rota que ainda não foi acessada estaticamente (pelo build), o next não vai reconhecer o path
    fallback: true, 
  }
};

// -- Static-side generation
/**
 * Página que não possui conteúdo dinâmico
 * No momento que a aplicação é buildada, estas informações ficam em cache
 * pq foram gerados de forma estática, ou seja, não há nenhum tipo de carregamento
 * DEV: não faz diferença
 * PROD: dá pra ver o carregamento instantâneo das páginas estáticas
 */
export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
  // -- Pegar o slug nos parâmetros da rota
  const { slug } = context.params

  const response = await fetch(`http://localhost:3333/products?category_id=${slug}`);
  const products = await response.json();

  return {
    props: { // -- Propriedades que serão lidas no build
      products,
    },
    revalidate: 60, // -- A cada 60s, o next gera uma nova versão da página
  }
};