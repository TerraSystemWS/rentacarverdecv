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
