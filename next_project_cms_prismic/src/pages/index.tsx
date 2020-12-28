import Prismic from 'prismic-javascript';
import Link from 'next/link';
import SEO from '@/components/SEO';
import { client } from '@/lib/prismic';
import { GetServerSideProps } from 'next';
import { Title } from '../styles/pages/Home';
import { Document } from 'prismic-javascript/types/documents'
import PrismicDOM from 'prismic-dom'

interface IProduct {
  id: string;
  title: string;
}

interface HomeProps {
  recommendedProducts: Document[];
}

export default function Home({ recommendedProducts }: HomeProps) {  
  return (
    <div>
      <SEO 
        title="DevCommerce, your great e-commerce!" 
        shouldExcludeTitleSuffix 
        image="nextjs-logo.svg"
      />

      <section>
      <Title>Hello World!</Title>

      <ul>
        {recommendedProducts && recommendedProducts.map(recommendedProduct => {
          return (
            <li key={recommendedProduct.id}>
              <Link href={`/catalog/products/${recommendedProduct.uid}`}>
                <a>
                  {PrismicDOM.RichText.asText(recommendedProduct.data.title)}
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
      </section>
    </div>
  )
}

// -- Server-Side rendering
/**
 * Não é executada client-side.
 * Geralmente é usado quando a informação precisa ser disponível pelos motores de busca
 * Carrega tudo ou carrega nada.
 * 
 * Por padrão, as variáveis só ficam disponíveis no "getServerSideProps" e "getStaticProps" e
 * Não conseguimos utiliá-las no browser, por questões de segurança
 */
export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at('document.type', 'product')
  ]);

  return {
    props: {
      recommendedProducts: recommendedProducts.results,
    }
  }
}