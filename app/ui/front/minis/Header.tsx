const Header = () => {
	return (
		<>
			<header className="header-top-area bg-nero">
				<div className="container">
					<div className="row">
						<div className="col-md-6 col-sm-7 hidden-xs">
							<div className="header-content-left">
								<ul className="header-top-menu">
									<li>
										<a href="#" className="top-left-menu">
											<i className="fa fa-phone"></i>
											<span>Contate - 000 000 000</span>
										</a>
									</li>
									<li>
										<a
											href="mailto:reservas@rentacarverde.cv"
											className="top-left-menu"
										>
											<i className="fa fa-envelope"></i>
											<span>reservas@rentacarverde.cv</span>
										</a>
									</li>
								</ul>
							</div>
						</div>

						<div className="col-md-6 col-sm-5">
							<div className="header-content-right">
								<ul className="header-top-menu">
									<li>
										<a href="#" className="language">
											<i className="fa fa-language"></i>
											<span>Language</span>
										</a>
										<ul className="sub-menu">
											<li>
												<a href="#">English</a>
											</li>
											<li>
												<a href="#">Español</a>
											</li>
											<li>
												<a href="#">Français</a>
											</li>
											<li>
												<a href="#">Português</a>
											</li>
										</ul>
									</li>
								</ul>
								<ul className="header-top-menu">
									<li>
										<a href="#" className="search-open">
											<i className="fa fa-search"></i>
										</a>
									</li>
									<li>
										<a href="#" className="trigger-overlay">
											<i className="fa fa-bars"></i>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</header>
		</>
	);
};
export default Header;
