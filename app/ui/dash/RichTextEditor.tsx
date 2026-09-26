"use client";

import { useEffect } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	Bold, Italic, Underline, Strikethrough, Heading2, Heading3, List, ListOrdered,
	Quote, Link2, Link2Off, Undo2, Redo2, Pilcrow,
} from "lucide-react";

// Editor de texto rico (Tiptap) para a gestão de conteúdos estáticos. Produz
// HTML, que o backend sanitiza ao gravar (DynamicContentService.sanitize) e o
// site mostra com o componente RichText.
export default function RichTextEditor({
	value,
	onChange,
	minHeight = 180,
}: {
	value: string;
	onChange: (html: string) => void;
	minHeight?: number;
}) {
	const editor = useEditor({
		// Next.js (SSR): renderizar só no browser, senão dá erro de hidratação.
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				heading: { levels: [2, 3] },
				link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
			}),
		],
		content: value,
		editorProps: {
			attributes: {
				class: "rich-text focus:outline-none px-5 py-4",
				style: `min-height:${minHeight}px`,
			},
		},
		onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
	});

	// Conteúdo carregado depois de o editor existir (ex: fetch do dashboard).
	useEffect(() => {
		if (editor && value !== editor.getHTML() && !editor.isFocused) {
			editor.commands.setContent(value || "", { emitUpdate: false });
		}
	}, [editor, value]);

	return (
		<div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all">
			{editor && <Toolbar editor={editor} />}
			<EditorContent editor={editor} className="bg-white" />
		</div>
	);
}

function Toolbar({ editor }: { editor: Editor }) {
	// Re-render da barra quando a seleção muda (botões ativos/inativos).
	const state = useEditorState({
		editor,
		selector: ({ editor: e }) => ({
			bold: e.isActive("bold"),
			italic: e.isActive("italic"),
			underline: e.isActive("underline"),
			strike: e.isActive("strike"),
			h2: e.isActive("heading", { level: 2 }),
			h3: e.isActive("heading", { level: 3 }),
			paragraph: e.isActive("paragraph"),
			bullet: e.isActive("bulletList"),
			ordered: e.isActive("orderedList"),
			quote: e.isActive("blockquote"),
			link: e.isActive("link"),
			canUndo: e.can().undo(),
			canRedo: e.can().redo(),
		}),
	});

	function setLink() {
		const previous = editor.getAttributes("link").href as string | undefined;
		const url = window.prompt("Endereço do link (ex: https://..., /contact, mailto:...)", previous || "");
		if (url === null) return;
		if (url.trim() === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
			return;
		}
		editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
	}

	const c = () => editor.chain().focus();
	const buttons: { icon: React.ElementType; label: string; active?: boolean; disabled?: boolean; run: () => void }[] = [
		{ icon: Pilcrow, label: "Parágrafo", active: state.paragraph, run: () => c().setParagraph().run() },
		{ icon: Heading2, label: "Título", active: state.h2, run: () => c().toggleHeading({ level: 2 }).run() },
		{ icon: Heading3, label: "Subtítulo", active: state.h3, run: () => c().toggleHeading({ level: 3 }).run() },
		{ icon: Bold, label: "Negrito", active: state.bold, run: () => c().toggleBold().run() },
		{ icon: Italic, label: "Itálico", active: state.italic, run: () => c().toggleItalic().run() },
		{ icon: Underline, label: "Sublinhado", active: state.underline, run: () => c().toggleUnderline().run() },
		{ icon: Strikethrough, label: "Riscado", active: state.strike, run: () => c().toggleStrike().run() },
		{ icon: List, label: "Lista", active: state.bullet, run: () => c().toggleBulletList().run() },
		{ icon: ListOrdered, label: "Lista numerada", active: state.ordered, run: () => c().toggleOrderedList().run() },
		{ icon: Quote, label: "Citação", active: state.quote, run: () => c().toggleBlockquote().run() },
		{ icon: Link2, label: "Inserir link", active: state.link, run: setLink },
		{ icon: Link2Off, label: "Remover link", disabled: !state.link, run: () => c().unsetLink().run() },
		{ icon: Undo2, label: "Desfazer", disabled: !state.canUndo, run: () => c().undo().run() },
		{ icon: Redo2, label: "Refazer", disabled: !state.canRedo, run: () => c().redo().run() },
	];

	return (
		<div className="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 px-2 py-2">
			{buttons.map((b) => (
				<button
					key={b.label}
					type="button"
					title={b.label}
					aria-label={b.label}
					aria-pressed={b.active}
					disabled={b.disabled}
					onClick={b.run}
					className={`p-2 rounded-lg transition-colors disabled:opacity-30 ${b.active ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-200"}`}
				>
					<b.icon size={16} />
				</button>
			))}
		</div>
	);
}
