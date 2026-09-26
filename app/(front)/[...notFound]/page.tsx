import { notFound } from "next/navigation";

// Rota "apanha-tudo": qualquer endereço que não corresponda a nenhuma página
// passa por aqui e mostra app/(front)/not-found.tsx — com o cabeçalho, o
// rodapé e o CSS do site — em vez do not-found da raiz, que fica fora do
// layout público. As rotas específicas (/cars, /dashboard, /posts/…,
// sitemap.xml, ficheiros de public/) têm sempre prioridade. Responde 404.
export default function CatchAllNotFound() {
	notFound();
}
