import React from "react";
import { PostComment } from "@/lib/api/types";

interface Props {
	comment: PostComment;
}

const CommentItem: React.FC<Props> = ({ comment }) => {
	return (
		<li className="comment">
			<div className="comment-body">
				<div className="comment-meta">
					<div className="comment-author vcard">
						<div className="author-img">
							<img alt="" src="/assets/images/default-avatar.png" className="avatar photo" />
						</div>
					</div>
					<div className="comment-metadata">
						<b className="author">{comment.authorName}</b>
						<span className="date">{new Date(comment.createdAt).toLocaleDateString("pt-PT")}</span>
					</div>
				</div>
				<div className="comment-details">
					<div className="comment-content">
						<p>{comment.message}</p>
					</div>
				</div>
			</div>
		</li>
	);
};

export default CommentItem;
