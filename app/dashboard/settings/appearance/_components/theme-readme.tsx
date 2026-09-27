"use client";

import { useState } from "react";
import { BookOpen, Copy, Download, Check } from "lucide-react";
import { THEME_DEFAULTS, THEME_FILE_FORMAT, THEME_FILE_VERSION, THEME_TOKENS } from "@/lib/theme/tokens";

// "Leia-me" da página Aparência: como criar o ficheiro de um tema e como o
// importar. O exemplo e a tabela saem de THEME_TOKENS (lib/theme/tokens.ts),
// por isso acompanham sempre as cores que o site conhece.
const example = {
	format: THEME_FILE_FORMAT,
	version: THEME_FILE_VERSION,
	name: "O meu tema",
	description: "Descrição curta (opcional)",
	colors: THEME_DEFAULTS,
};
const exampleJson = JSON.stringify(example, null, 2);

export default function ThemeReadme() {
	const [copied, setCopied] = useState(false);

	function downloadTemplate() {
		const url = URL.createObjectURL(new Blob([exampleJson], { type: "application/json" }));
		const a = document.createElement("a");
		a.href = url;
		a.download = "modelo-tema.json";
		a.click();
		URL.revokeObjectURL(url);
	}

	async function copyExample() {
		try {
			await navigator.clipboard.writeText(exampleJson);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			/* sem acesso à área de transferência: o exemplo continua visível para copiar à mão */
		}
	}

	const groups = Array.from(new Set(THEME_TOKENS.map((t) => t.group)));

	return (
		<details className="group rounded-3xl border border-gray-100 bg-white shadow-sm">
			<summary className="flex cursor-pointer list-none items-center gap-3 px-6 py-4 [&::-webkit-details-marker]:hidden">
				<span className="rounded-xl bg-sky-50 p-2 text-sky-600"><BookOpen size={20} aria-hidden="true" /></span>
				<span className="flex-1">
					<span className="block text-base font-black text-gray-900">Leia-me: como criar e importar um tema</span>
					<span className="block text-xs text-gray-500">Formato do ficheiro, lista das cores e modelo para descarregar</span>
				</span>
				<span className="text-xs font-bold text-primary group-open:hidden">Abrir</span>
				<span className="hidden text-xs font-bold text-primary group-open:inline">Fechar</span>
			</summary>

			<div className="space-y-8 border-t border-gray-100 px-6 py-6 text-sm leading-relaxed text-gray-700">
				<section className="space-y-2">
					<h3 className="text-base font-black text-gray-900">O que é um tema</h3>
					<p>
						Um tema é só um conjunto de cores com nomes fixos (a lista abaixo). Não muda textos, imagens nem a
						forma dos elementos — só as cores do site público: barra do topo, cabeçalho das páginas, títulos,
						botões, fundos e rodapé. Os temas de base (Atlântico e Verde) não se alteram; para os mudar,
						use «Duplicar».
					</p>
				</section>

				<section className="space-y-2">
					<h3 className="text-base font-black text-gray-900">Criar um tema sem ficheiro</h3>
					<ol className="list-decimal space-y-1 pl-5">
						<li>Carregue em <strong>Duplicar</strong> no tema mais parecido com o que quer (ou em <strong>Novo tema</strong>).</li>
						<li>Mude as cores com os seletores; a pré-visualização à direita mostra o resultado e avisa se algum texto fica difícil de ler.</li>
						<li>Carregue em <strong>Criar tema</strong>. Para o ver no site antes de o ativar, use <strong>Pré-visualizar</strong>; para o pôr em uso, <strong>Usar no site</strong>.</li>
					</ol>
				</section>

				<section className="space-y-2">
					<h3 className="text-base font-black text-gray-900">Criar o ficheiro de um tema (.json)</h3>
					<p>
						Serve para guardar um tema, levá-lo para outro site ou recebê-lo de um designer. O ficheiro é
						texto simples com a extensão <code className="rounded bg-gray-100 px-1">.json</code>, e pode ser
						editado em qualquer editor de texto (Bloco de Notas, VS Code…).
					</p>
					<ol className="list-decimal space-y-1 pl-5">
						<li>O mais fácil: carregue em <strong>Exportar</strong> num tema (ou em «Descarregar modelo» abaixo) — fica com um ficheiro já no formato certo.</li>
						<li>Abra-o num editor de texto e mude o <code className="rounded bg-gray-100 px-1">name</code> e as cores que quiser.</li>
						<li>Cada cor escreve-se no formato <code className="rounded bg-gray-100 px-1">#rrggbb</code> (ex.: <code className="rounded bg-gray-100 px-1">#3baa4e</code>). Para escolher cores, use um seletor de cores (por exemplo o do próprio editor de temas) e copie o código.</li>
						<li>Guarde o ficheiro com a extensão <code className="rounded bg-gray-100 px-1">.json</code>.</li>
					</ol>
					<p><strong>Regras do ficheiro:</strong></p>
					<ul className="list-disc space-y-1 pl-5">
						<li><code className="rounded bg-gray-100 px-1">&quot;format&quot;: &quot;{THEME_FILE_FORMAT}&quot;</code> é obrigatório — sem ele o ficheiro é recusado.</li>
						<li>Não é preciso ter todas as cores: as que faltarem ficam com as do tema Atlântico (o dashboard diz quais).</li>
						<li>Cores noutro formato (<code className="rounded bg-gray-100 px-1">red</code>, <code className="rounded bg-gray-100 px-1">rgb(…)</code>, <code className="rounded bg-gray-100 px-1">#abc</code>) e nomes de cores desconhecidos são ignorados.</li>
						<li>O nome do tema tem no máximo 80 caracteres e não pode repetir o de outro tema.</li>
					</ul>

					<div className="mt-3 overflow-hidden rounded-2xl border border-gray-200">
						<div className="flex items-center justify-between gap-2 border-b border-gray-200 bg-gray-50 px-4 py-2">
							<span className="text-xs font-bold text-gray-500">Exemplo completo (tema Atlântico)</span>
							<div className="flex gap-2">
								<button type="button" onClick={copyExample} className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100">
									{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copiado" : "Copiar exemplo"}
								</button>
								<button type="button" onClick={downloadTemplate} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary/90">
									<Download size={14} /> Descarregar modelo
								</button>
							</div>
						</div>
						<pre className="max-h-80 overflow-auto bg-white p-4 font-mono text-xs leading-5 text-gray-800">{exampleJson}</pre>
					</div>
				</section>

				<section className="space-y-2">
					<h3 className="text-base font-black text-gray-900">Importar o ficheiro</h3>
					<ol className="list-decimal space-y-1 pl-5">
						<li>Carregue em <strong>Importar tema</strong> (no topo da página) e escolha o ficheiro <code className="rounded bg-gray-100 px-1">.json</code>.</li>
						<li>O tema abre no editor para rever: se faltarem cores aparece um aviso com a lista, e os avisos de contraste mostram textos difíceis de ler.</li>
						<li>Carregue em <strong>Criar tema</strong> para o gravar. Nada muda no site até carregar em <strong>Usar no site</strong>.</li>
					</ol>
				</section>

				<section className="space-y-3">
					<h3 className="text-base font-black text-gray-900">As cores de um tema</h3>
					{groups.map((g) => (
						<div key={g}>
							<p className="mb-1 text-xs font-black uppercase tracking-wider text-gray-400">{g}</p>
							<div className="overflow-x-auto rounded-xl border border-gray-100">
								<table className="w-full text-left text-xs">
									<thead className="bg-gray-50 text-gray-500">
										<tr>
											<th className="px-3 py-2 font-bold">Nome no ficheiro</th>
											<th className="px-3 py-2 font-bold">O que muda</th>
											<th className="px-3 py-2 font-bold">Atlântico</th>
										</tr>
									</thead>
									<tbody>
										{THEME_TOKENS.filter((t) => t.group === g).map((t) => (
											<tr key={t.key} className="border-t border-gray-100">
												<td className="px-3 py-2 font-mono text-gray-900">{t.key}</td>
												<td className="px-3 py-2">
													<span className="font-semibold text-gray-800">{t.label}</span>
													{t.hint && <span className="block text-gray-500">{t.hint}</span>}
												</td>
												<td className="whitespace-nowrap px-3 py-2">
													<span className="inline-flex items-center gap-2 font-mono">
														<span className="h-4 w-4 rounded border border-gray-300" style={{ background: t.default }} aria-hidden="true" />
														{t.default}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					))}
				</section>
			</div>
		</details>
	);
}
