import React from "react";
import { CommentType } from "./comentItem";
import CommentItem from "./comentItem";

interface Props {
	comentarios: CommentType[];
}

const Comments: React.FC<Props> = ({ comentarios }) => {
	return (
		<div id="comments" className="comments-area color-white">
			<div className="comments-main-content">
				<div className="row">
					<div className="col-md-12">
						<h3 className="comments-title">{comentarios.length} Comentários</h3>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12">
						<ol className="comment-list">
							{comentarios.map((c) => (
								<CommentItem key={c.id} comment={c} />
							))}
						</ol>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Comments;
