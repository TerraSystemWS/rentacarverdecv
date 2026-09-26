// lib/utils/legacyText.ts
// Conteúdos antigos (ex: posts escritos antes do editor de texto rico) estão em
// texto simples, com parágrafos por linhas e **negrito** estilo Markdown. Esta
// função converte-os para HTML — para mostrar no site e para abrir no editor
// sem perder a formatação. HTML já existente é devolvido tal como está.
export function textToHtml(value: string | null | undefined): string {
	if (!value) return "";
	if (/<(p|h[1-6]|ul|ol|li|strong|em|a|br|blockquote|div)[\s>/]/i.test(value)) return value;
	const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	const inline = (s: string) =>
		escape(s)
			.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
			.replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, "$1<em>$2</em>");
	return value
		.replace(/\r\n/g, "\n")
		.split(/\n{2,}/)
		.map((block) => block.trim())
		.filter(Boolean)
		.map((block) => {
			const lines = block.split("\n");
			// Blocos só com linhas "- item" / "* item" -> lista
			if (lines.every((l) => /^\s*[-*•]\s+/.test(l))) {
				return `<ul>${lines.map((l) => `<li><p>${inline(l.replace(/^\s*[-*•]\s+/, ""))}</p></li>`).join("")}</ul>`;
			}
			if (/^#{1,3}\s+/.test(block) && lines.length === 1) {
				return `<h2>${inline(block.replace(/^#{1,3}\s+/, ""))}</h2>`;
			}
			return `<p>${lines.map(inline).join("<br>")}</p>`;
		})
		.join("");
}
