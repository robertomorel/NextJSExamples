import { client } from '@/lib/prismic';
import Prismic from 'prismic-javascript';
import { Document } from 'prismic-javascript/types/documents';
import PrismicDOM from 'prismic-dom'
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';


interface CategoryProps {
  products: Document[];
  category: Document;
}

export default function Category({ products, category }: CategoryProps) {
  const router = useRouter();

  // -- Para gerar as páginas não carregadas estaticamente pelo build
  // -- Com o fallback == true, qlqr página pode ser carregada, mas demora um pouco para carregar
  if(router.isFallback){
    return <h1>Carregando...</h1>
  }

  return (
    <div>
      <h1>
        {PrismicDOM.RichText.asText(category.data.title)}
      </h1>

      <ul>
        {products && products.map(product => {
          return (
            <li key={product.id}>
            <Link href={`/catalog/products/${product.uid}`}>
              <a>
                {PrismicDOM.RichText.asText(product.data.title)}
              </a>
            </Link>
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
  const categories = await client().query([
    Prismic.Predicates.at('document.type', 'category'),
  ]);

  const paths = categories.results.map(category => {
    return {
      params: { slug: category.uid }
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

  const category = await client().getByUID('category', String(slug), {});
  const products = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.at('my.product.category', category.id)
  ]);

  return {
    props: { // -- Propriedades que serão lidas no build
      products: products.results,
      category,
    },
    revalidate: 60, // -- A cada 60s, o next gera uma nova versão da página
  }
};