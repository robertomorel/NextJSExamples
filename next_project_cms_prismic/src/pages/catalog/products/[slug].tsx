import { client } from '@/lib/prismic';
import { Document } from 'prismic-javascript/types/documents';
import PrismicDOM from 'prismic-dom'
import { GetStaticPaths, GetStaticProps } from 'next';

interface ProductProps {
  product: Document;
}

export default function Product({ product }: ProductProps) {

  return(
    <div>
      <h1>
        {PrismicDOM.RichText.asText(product.data.title)}
      </h1>

      <div dangerouslySetInnerHTML={{ __html: PrismicDOM.RichText.asHtml(product.data.description) }}></div>

      <p>Price: ${product.data.price}</p>

      <img src={product.data.thumbnail.url} width="600" alt="" />
    </div>
  )
}

/**
 * Método necessário para limitar alguns parâmetros de path para o next
 */
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // -- Para que as páginas de produtos serem geradas conforme acesso dos usuários
    paths: [],
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
export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
  // -- Pegar o slug nos parâmetros da rota
  const { slug } = context.params

  const product = await client().getByUID('product', String(slug), {});

  return {
    props: { // -- Propriedades que serão lidas no build
      product,
    },
    revalidate: 10, // -- A cada 60s, o next gera uma nova versão da página
  }
};