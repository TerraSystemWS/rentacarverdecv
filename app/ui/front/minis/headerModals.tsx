const headerModals = () => {
	return (
		<>
			<div className="header-modal-area">
				<div className="overlay overlay-scale">
					<button type="button" className="overlay-close">
						&#x2716;
					</button>
					<div className="overlay__content">
						<form
							id="search-form"
							className="search-form outer"
							action="#"
							method="post"
						>
							<div className="input-group">
								<input
									type="text"
									className=" input--full"
									placeholder="search text here ..."
								/>
							</div>
							<button className="btn text-uppercase search-button">
								Pesquisar
							</button>
						</form>
					</div>
				</div>

				<div className="overlay-sidebar">
					<div className="author-area">
						<a href="#" className="closebtn">
							&times;
						</a>
						<div className="author-area-content">
							<div className="login-author">
								<div className="author-info">
									<div className="author-image yellow-border">
										<img
											src="assets/images/driver/driver-03.png"
											alt="author-image"
										/>
									</div>
									<div className="author-des">
										<h4 className="author-name">Mr. Johan Smith</h4>
										<p className="author-description">Programmer</p>
									</div>
								</div>
								<div className="author-menu">
									<ul className="yellow-color">
										<li>
											<a href="">
												<i className="fa fa-user-circle-o"></i>Author Dashboard
											</a>
										</li>
										<li>
											<a href="">
												<i className="fa fa-envelope-open"></i>Your Inbox
											</a>
										</li>
										<li>
											<a href="">
												<i className="fa fa-location-arrow"></i>Track your texi
											</a>
										</li>
										<li>
											<a href="">
												<i className="fa fa-area-chart"></i>Your Bookings Status
											</a>
										</li>
										<li>
											<a href="">
												<i className="fa fa-automobile"></i>New Bookings
											</a>
										</li>
										<li>
											<a href="">
												<i className="fa fa-archive"></i>Your Bookings
											</a>
										</li>
										<li>
											<a href="">
												<i className="fa fa-money"></i>Your Deposit - $150.00
											</a>
										</li>
										<li>
											<a href="">
												<i className="fa fa-sign-out"></i>Sign Out
											</a>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default headerModals;
