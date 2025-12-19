import React from "react";

export interface CommentType {
	id: number;
	autor: string;
	data: string;
	mensagem: string;
	avatar: string;
	respostas?: CommentType[];
}

interface Props {
	comment: CommentType;
}

const CommentItem: React.FC<Props> = ({ comment }) => {
	return (
		<li className="comment">
			<div className="comment-body">
				<div className="comment-meta">
					<div className="comment-author vcard">
						<div className="author-img">
							<img alt="" src={comment.avatar} className="avatar photo" />
						</div>
					</div>
					<div className="comment-metadata">
						<b className="author">{comment.autor}</b>
						<span className="date">{comment.data}</span>
					</div>
				</div>
				<div className="comment-details">
					<div className="comment-content">
						<p>{comment.mensagem}</p>
					</div>

					<div className="reply">
						<a href="#" className="comment-reply-link">
							Responder
						</a>
					</div>
				</div>
			</div>
			{/* RESPOSTAS */}
			{comment.respostas && comment.respostas.length > 0 && (
				<ol className="children">
					{comment.respostas.map((resp) => (
						<CommentItem key={resp.id} comment={resp} />
					))}
				</ol>
			)}
		</li>
	);
};

export default CommentItem;
