"use client";

import React, { useEffect, useState } from "react";
import CommentItem from "./comentItem";
import { PostComment } from "@/lib/api/types";
import { endpoints, API_BASE_URL } from "@/lib/api/endpoints";
import { useTranslations } from "next-intl";

interface Props {
	postSlug: string;
}

const Comments: React.FC<Props> = ({ postSlug }) => {
	const t = useTranslations("comments");
	const [comments, setComments] = useState<PostComment[]>([]);

	useEffect(() => {
		let cancelled = false;
		fetch(`${API_BASE_URL}${endpoints.comments.list(postSlug)}`)
			.then((res) => (res.ok ? res.json() : []))
			.then((data: PostComment[]) => {
				if (!cancelled) setComments(data || []);
			})
			.catch(() => { /* sem comentários se falhar */ });
		return () => { cancelled = true; };
	}, [postSlug]);

	return (
		<div id="comments" className="comments-area color-white">
			<div className="comments-main-content">
				<div className="row">
					<div className="col-md-12">
						<h3 className="comments-title">{t("count", { count: comments.length })}</h3>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12">
						{comments.length === 0 ? (
							<p className="opacity-70">{t("first")}</p>
						) : (
							<ol className="comment-list">
								{comments.map((c) => (
									<CommentItem key={c.id} comment={c} />
								))}
							</ol>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Comments;
