// Mostra HTML vindo do editor de texto rico da gestão de conteúdos. O HTML é
// sanitizado no backend ao gravar (DynamicContentService.sanitize — só tags de
// formatação, sem scripts nem atributos de eventos), por isso é seguro aqui.
export default function RichText({ html, className = "" }: { html: string | null | undefined; className?: string }) {
	if (!html) return null;
	return <div className={`rich-text ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}
