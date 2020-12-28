import SEO from '@/components/SEO';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { Title } from '../styles/pages/Home';
import nextJsLogo from '@/assets/nextjs-logo.svg'

interface IProduct {
  id: string;
  title: string;
}

interface HomeProps {
  recommendedProducts: IProduct[];
}

export default function Home({ recommendedProducts }: HomeProps) {  
  //const [recommendedProducts, setRecommendedProducts] = useState<IProduct[]>();

  // -- Client-side fetching
  /**
   * Apenas é executada pelo client-side, ou seja, pelo browser.
   * Geralmente é usado quando a informação não precisa ser disponível pelos motores de busca
   */
  /*
  useEffect(() => {
    fetch('http://localhost:3333/recommended').then(response => {
      response.json().then(data => {
        setRecommendedProducts(data);
      })
    })
  }, []);
  */

  async function handleSum() {
    // -- Para que a função só seja importada, caso seja realmente usada
    const math = (await import('../lib/math')).default;

    console.log('Variáveis de ambiente públicas pelo next: ', process.env.NEXT_PUBLIC_API_URL)

    alert(math.sum(3, 5));
  }

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
              {recommendedProduct.title}
            </li>
          )
        })}
      </ul>
      </section>

      <button onClick={handleSum}>Sum!</button>
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
  const response = await fetch(`${process.env.API_URL}/recommended`);
  const recommendedProducts = await response.json();

  return {
    props: {
      recommendedProducts,
    }
  }
}