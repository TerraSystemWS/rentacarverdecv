// // app/data/postsAdapted.ts

// export const posts = [
// 	{
// 		id: 1,
// 		title: "Como escolher o carro ideal para viajar em Cabo Verde",
// 		url: "/blog/como-escolher-o-carro-ideal",
// 		imageUrl: "/assets/images/blog/blog-1.jpg",
// 		date: "10 Jan 2025",
// 		authorName: "Ailton Duarte",
// 		views: 120,
// 		likes: 18,
// 		comments: 6,
// 	},
// 	{
// 		id: 2,
// 		title: "Os 5 erros mais comuns ao alugar um carro",
// 		url: "/blog/erros-comuns-alugar-carro",
// 		imageUrl: "/assets/images/blog/blog-2.jpg",
// 		date: "14 Jan 2025",
// 		authorName: "Maria Andrade",
// 		views: 98,
// 		likes: 15,
// 		comments: 3,
// 	},
// 	{
// 		id: 3,
// 		title: "SUV vs Citadino: qual é melhor para ti?",
// 		url: "/blog/suv-vs-citadino",
// 		imageUrl: "/assets/images/blog/blog-3.jpg",
// 		date: "20 Jan 2025",
// 		authorName: "João Pereira",
// 		views: 87,
// 		likes: 11,
// 		comments: 1,
// 	},
// 	{
// 		id: 4,
// 		title: "Guia completo para conduzir na ilha de Santiago",
// 		url: "/blog/guia-conduzir-santiago",
// 		imageUrl: "/assets/images/blog/blog-4.jpg",
// 		date: "02 Feb 2025",
// 		authorName: "Elisa Silva",
// 		views: 130,
// 		likes: 22,
// 		comments: 8,
// 	},
// 	{
// 		id: 5,
// 		title: "Como poupar combustível com técnicas simples",
// 		url: "/blog/poupar-combustivel",
// 		imageUrl: "/assets/images/blog/blog-5.jpg",
// 		date: "05 Feb 2025",
// 		authorName: "Rui Semedo",
// 		views: 76,
// 		likes: 9,
// 		comments: 2,
// 	},
// 	{
// 		id: 6,
// 		title: "Checklist essencial antes de levares o carro",
// 		url: "/blog/checklist-essencial",
// 		imageUrl: "/assets/images/blog/blog-6.jpg",
// 		date: "10 Feb 2025",
// 		authorName: "Tatiana Vieira",
// 		views: 155,
// 		likes: 25,
// 		comments: 10,
// 	},
// 	{
// 		id: 7,
// 		title: "Diferenças entre seguro básico e premium",
// 		url: "/blog/seguro-basico-vs-premium",
// 		imageUrl: "/assets/images/blog/blog-7.jpg",
// 		date: "18 Feb 2025",
// 		authorName: "Carlos Teixeira",
// 		views: 92,
// 		likes: 13,
// 		comments: 4,
// 	},
// 	{
// 		id: 8,
// 		title: "Porque as manutenções preventivas são importantes",
// 		url: "/blog/manutencao-preventiva-importante",
// 		imageUrl: "/assets/images/blog/blog-8.jpg",
// 		date: "25 Feb 2025",
// 		authorName: "Ailton Duarte",
// 		views: 101,
// 		likes: 17,
// 		comments: 5,
// 	},
// 	{
// 		id: 9,
// 		title: "Melhores rotas para explorar a ilha do Fogo",
// 		url: "/blog/melhores-rotas-fogo",
// 		imageUrl: "/assets/images/blog/blog-9.jpg",
// 		date: "02 Mar 2025",
// 		authorName: "Fátima Lopes",
// 		views: 142,
// 		likes: 27,
// 		comments: 12,
// 	},
// 	{
// 		id: 10,
// 		title: "Como evitar multas comuns em Cabo Verde",
// 		url: "/blog/evitar-multas-cabo-verde",
// 		imageUrl: "/assets/images/blog/blog-10.jpg",
// 		date: "05 Mar 2025",
// 		authorName: "Nelson Barros",
// 		views: 88,
// 		likes: 10,
// 		comments: 2,
// 	},
// ];

// app/data/fullPosts.ts

export const posts = [
	{
		id: 1,
		slug: "como-escolher-carro-ideal",
		title: "Como escolher o carro ideal para viajar em Cabo Verde",

		author: {
			name: "Ailton Duarte",
			role: "Autor",
			avatarUrl: "/assets/images/author.jpg",
		},

		coverImageUrl: "/assets/images/blog/blog-1.jpg",
		date: "10 Jan 2025",

		categories: [{ label: "Guia", href: "#" }],
		tags: [
			{ label: "viagem", href: "#" },
			{ label: "carros", href: "#" },
		],

		firstParagraph:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vehicula nisi ac nibh semper...",
		secondParagraph:
			"Aenean at odio ac massa fermentum tincidunt. Curabitur id ligula nec justo laoreet...",

		gallery: [
			{ src: "/assets/images/blog/blog-1.jpg" },
			{ src: "/assets/images/blog/blog-2.jpg" },
			{ src: "/assets/images/blog/blog-3.jpg" },
		],

		views: 120,
		likes: 18,
		comments: 6,

		navigation: {
			prevUrl: "/blog/post-anterior",
			nextUrl: "/blog/post-seguinte",
		},

		socialLinks: {
			facebook: "#",
			instagram: "#",
		},
	},

	// continue for ALL other posts...
];
