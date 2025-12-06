"use client";

interface FSideBarProps {
	isOpen: boolean;
	onToggleSidebar: () => void;
}

const FSideBar = ({ isOpen, onToggleSidebar }: FSideBarProps) => {
	return (
		<div className="overlay-sidebar">
			<div className={isOpen ? "author-area open" : "author-area"}>
				<button className="closebtn" onClick={onToggleSidebar}>
					&times;
				</button>

				<div className="author-area-content">
					<div className="login-author">
						<div className="author-info">
							<div className="author-image yellow-border">
								<img
									src="/assets/images/driver/driver-03.png"
									alt="author-image"
								/>
							</div>

							<div className="author-des">
								<h4 className="author-name">Ailton M. Duarte</h4>
								<p className="author-description">Programmer</p>
							</div>
						</div>

						{/* MENU */}
						<div className="author-menu">
							<ul className="yellow-color">
								<li>
									<a href="#">
										<i className="fa fa-user-circle-o"></i> Author Dashboard
									</a>
								</li>
								<li>
									<a href="#">
										<i className="fa fa-envelope-open"></i> Your Inbox
									</a>
								</li>
								<li>
									<a href="#">
										<i className="fa fa-location-arrow"></i> Track your taxi
									</a>
								</li>
								<li>
									<a href="#">
										<i className="fa fa-area-chart"></i> Your Bookings Status
									</a>
								</li>
								<li>
									<a href="#">
										<i className="fa fa-automobile"></i> New Bookings
									</a>
								</li>
								<li>
									<a href="#">
										<i className="fa fa-archive"></i> Your Bookings
									</a>
								</li>
								<li>
									<a href="#">
										<i className="fa fa-money"></i> Your Deposit - $150.00
									</a>
								</li>
								<li>
									<a href="#">
										<i className="fa fa-sign-out"></i> Sign Out
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FSideBar;
