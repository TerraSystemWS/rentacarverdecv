import Head from "next/head";
import React from "react";

// Define a interface para as propriedades do componente Head
interface HeadProps {
	title?: string;
	description?: string;
	keywords?: string;
	author?: string;
}

// O componente Head para metadados dinâmicos
const Headi: React.FC<HeadProps> = ({
	title = "Rent a car Verde",
	description = "Rentacarverde, rent your car in the easy way",
	keywords = "car, ecommerce, Car Rent",
	author = "Your Company Name",
}) => {
	return (
		<Head>
			{/* Títulos */}
			<title>{title}</title>

			{/* Meta tags */}
			<meta charSet="utf-8" />
			<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1, maximum-scale=1"
			/>
			<meta name="description" content={description} />
			<meta name="keywords" content={keywords} />
			<meta name="author" content={author} />
		</Head>
	);
};

// Componente principal da aplicação que usa o componente Headi
// const App = () => {
//     // Exemplo de como usar o componente Headi com props dinâmicas
//     return (
//         <>
//             <Headi
//                 title="Melhores Carros em Cabo Verde - Rent a car Verde"
//                 description="Alugue o seu carro ideal em Cabo Verde com a Rent a car Verde. Frota moderna e serviço de alta qualidade."
//                 keywords="aluguer de carro, cabo verde, rent a car, turismo"
//             />

//             <main>
//                 <h1>Bem-vindo à Rent a car Verde</h1>
//                 <p>Aqui você encontra os melhores carros para a sua aventura em Cabo Verde.</p>
//             </main>
//         </>
//     );
// };

export default Headi;

// ### Como funciona

// 1.  **Tipagem com Interface**: A interface `HeadProps` garante que as propriedades esperadas (`title`, `description`, etc.) sejam passadas com o tipo correto (`string`). Todas as propriedades são opcionais, indicadas pelo `?`.
// 2.  **Valores Padrão**: As propriedades têm valores padrão (`title = 'Rent a car Verde'`, etc.). Se você chamar o componente `<Headi />` sem passar nenhuma prop, ele usará estes valores padrão.
// 3.  **Uso no JSX**: Os valores das props são usados para preencher dinamicamente as tags `<title>` e `<meta>`.

// Agora, você pode usar o componente em diferentes páginas, passando apenas as informações que precisam ser alteradas. Por exemplo, em uma página de contato, você pode fazer algo como:

// ```jsx
// <Headi
//     title="Contacto - Rent a car Verde"
//     description="Entre em contato connosco para alugar um carro em Cabo Verde."
// />
