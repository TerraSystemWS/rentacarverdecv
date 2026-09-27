import React from "react";
import { PostComment } from "@/lib/api/types";
import { useFormatter } from "next-intl";

interface Props {
	comment: PostComment;
}

const CommentItem: React.FC<Props> = ({ comment }) => {
	const format = useFormatter();
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
						<span className="date">{format.dateTime(new Date(comment.createdAt), { dateStyle: "medium" })}</span>
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
