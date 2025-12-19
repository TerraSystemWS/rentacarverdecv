import { CommentType } from "@/app/ui/front/blog/postItem/comentItem";

export const comentariosMock: CommentType[] = [
	{
		id: 1,
		autor: "João Silva",
		data: "10:35 - 17 Jan 2025",
		mensagem: "Muito bom artigo! Aprendi bastante.",
		avatar: "/assets/images/comment/comment-one.png",
		respostas: [
			{
				id: 2,
				autor: "Maria Santos",
				data: "11:02 - 17 Jan 2025",
				mensagem: "Concordo contigo, também gostei.",
				avatar: "/assets/images/comment/comment-two.png",
			},
		],
	},
	{
		id: 3,
		autor: "Carlos Mendes",
		data: "13:15 - 17 Jan 2025",
		mensagem: "Não concordo com alguns pontos, mas está bem escrito.",
		avatar: "/assets/images/comment/comment-three.png",
		respostas: [],
	},
];
