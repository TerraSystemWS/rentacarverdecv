"use client";

import { useEffect, useState } from "react";
import { FileText, Plus, Pencil, Trash2, Eye, Calendar } from "lucide-react";
import TopNav from "@/app/ui/dash/topNav";
import PageShell from "@/app/ui/dash/PageShell";
import DataTable from "@/app/ui/dash/DataTable";
import PostDialog from "./_components/post-dialog";
import PostForm from "./_components/post-form";
import { useAuth } from "@/app/auth/AuthContext";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { Post } from "@/lib/api/types";
import Link from "next/link";

export default function PostsPage() {
    const { authFetch } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    async function fetchPosts() {
        setLoading(true);
        setErr(null);
        try {
            const res = await authFetch("/dashboard/posts");
            if (!res.ok) throw new Error("Erro ao carregar posts.");
            const data = await res.json();
            setPosts(data);
        } catch (e: any) {
            setErr(e?.message || "Erro ao carregar posts.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleOpenCreate = () => {
        setEditingPost(null);
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (post: Post) => {
        setEditingPost(post);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Tem a certeza que deseja eliminar este post?")) return;

        try {
            const res = await authFetch(`/dashboard/posts/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Erro ao eliminar post.");
            setPosts(prev => prev.filter(p => p.id !== id));
        } catch (e: any) {
            alert(e?.message || "Erro ao eliminar post.");
        }
    };

    const handleSubmit = async (data: Post, image?: File) => {
        setIsSubmitting(true);
        try {
            const isEdit = !!editingPost;
            const url = isEdit ? `/dashboard/posts/${editingPost.id}` : "/dashboard/posts";
            const method = isEdit ? "PUT" : "POST";

            const formData = new FormData();
            formData.append("post", new Blob([JSON.stringify(data)], { type: "application/json" }));

            if (image) {
                formData.append("file", image);
            }

            const res = await authFetch(url, {
                method,
                body: formData,
            });

            if (!res.ok) throw new Error("Erro ao guardar post.");
            const result = await res.json();

            if (isEdit) {
                setPosts(prev => prev.map(p => p.id === result.id ? result : p));
            } else {
                setPosts(prev => [result, ...prev]);
            }

            setIsDialogOpen(false);
        } catch (e: any) {
            alert(e?.message || "Erro ao guardar post.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getImageSrc = (url: string) => {
        if (!url) return "";
        if (url.startsWith('/uploads')) {
            return `${API_BASE_URL}${url}`;
        }
        return url;
    };

    if (loading) {
        return (
            <div>
                <TopNav title="Blog" subtitle="Gestão de notícias e novidades" />
                <PageShell>
                    <div className="flex flex-col h-[60vh] items-center justify-center gap-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                        <FileText className="w-10 h-10 text-primary animate-pulse" />
                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Listando Posts...</p>
                    </div>
                </PageShell>
            </div>
        );
    }

    return (
        <div>
            <TopNav
                title="Blog"
                subtitle="Gestão de notícias"
                right={
                    <button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-extrabold uppercase tracking-tight text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                        <Plus size={16} />
                        <span>Novo Post</span>
                    </button>
                }
            />

            <PageShell>
                <div className="max-w-7xl mx-auto">
                    <DataTable
                        columns={[
                            {
                                key: "imageUrl",
                                label: "Imagem",
                                render: (row: Post) => (
                                    <div className="w-16 aspect-video rounded overflow-hidden bg-zinc-50 border border-zinc-200 flex items-center justify-center">
                                        {row.imageUrl ? (
                                            <img src={getImageSrc(row.imageUrl)} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <FileText className="w-4 h-4 text-zinc-300" />
                                        )}
                                    </div>
                                )
                            },
                            {
                                key: "title",
                                label: "Post",
                                render: (row: Post) => (
                                    <div className="max-w-md">
                                        <div className="font-bold text-zinc-900 truncate">{row.title}</div>
                                        <div className="text-xs text-zinc-400 font-mono truncate">/{row.slug}</div>
                                    </div>
                                )
                            },
                            { key: "author", label: "Autor" },
                            {
                                key: "status",
                                label: "Estado",
                                render: (row: Post) => (
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${row.status === 'PUBLISHED'
                                        ? "bg-green-100 text-green-700"
                                        : "bg-amber-100 text-amber-700"
                                        }`}>
                                        {row.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho'}
                                    </span>
                                )
                            },
                            {
                                key: "createdAt",
                                label: "Data",
                                render: (row: Post) => (
                                    <div className="flex items-center gap-2 text-zinc-500 text-xs">
                                        <Calendar size={12} />
                                        {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'}
                                    </div>
                                )
                            },
                            {
                                key: "actions",
                                label: "Ações",
                                render: (row: Post) => (
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/posts/${row.slug}`}
                                            target="_blank"
                                            className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-blue-600 transition-colors"
                                            title="Ver no Site"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleOpenEdit(row)}
                                            className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-primary transition-colors"
                                            title="Editar"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(row.id!)}
                                            className="p-2 hover:bg-red-50 rounded-lg text-zinc-500 hover:text-red-600 transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )
                            }
                        ]}
                        rows={posts}
                    />
                </div>
            </PageShell>

            <PostDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title={editingPost ? "Editar Post" : "Novo Post"}
            >
                <PostForm
                    initialData={editingPost || undefined}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsDialogOpen(false)}
                    isSubmitting={isSubmitting}
                />
            </PostDialog>
        </div>
    );
}
