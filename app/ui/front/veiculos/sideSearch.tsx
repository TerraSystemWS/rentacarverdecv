import React from "react";

const SideSearch: React.FC = () => {
	return (
		<div className="vehicle-sidebar">
			<form action="#" method="get" className="advance-search-query">
				<h2 className="form-title">Filtros</h2>
				<div className="form-content available-filter">
					{/* Pesquisa Rápida */}
					<div className="form-group">
						<div className="input">
							<input
								type="text"
								placeholder="Pesquisa rápida"
								className="calendar form-controller"
							/>
						</div>
					</div>

					{/* Disponível em */}
					<div className="form-group">
						<label>Disponível em</label>
						<div className="input">
							<i className="fa fa-calendar"></i>
							<input
								type="text"
								className="date-start date-selector form-controller"
								placeholder="Início do aluguer"
							/>
						</div>
						<div className="input">
							<i className="fa fa-calendar"></i>
							<input
								type="text"
								className="date-end date-selector form-controller"
								placeholder="Fim do aluguer"
							/>
						</div>
					</div>

					{/* Preço */}
					<div className="form-group">
						<label>Preço</label>
						<div className="input">
							<div className="row">
								<div className="col-xs-6">
									<input
										type="text"
										placeholder="€12"
										className="calendar form-controller min"
									/>
								</div>
								<div className="col-xs-6">
									<input
										type="text"
										placeholder="€1500"
										className="calendar form-controller"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Filtros Avançados */}
					<div className="advance-filters">
						{/* Tipo de Carro */}
						<label>Tipo de Carro</label>
						<ul className="checkbox-content">
							<li>
								<input type="checkbox" id="cupon" name="chack" value="chack" />
								<label htmlFor="cupon">Cupê</label>
							</li>
							<li>
								<input type="checkbox" id="limo" name="chack" value="chack" />
								<label htmlFor="limo">Limusine</label>
							</li>
							<li>
								<input type="checkbox" id="sedan" name="chack" value="chack" />
								<label htmlFor="sedan">Sedan</label>
							</li>
							<li>
								<input type="checkbox" id="van" name="chack" value="chack" />
								<label htmlFor="van">Van</label>
							</li>
						</ul>

						{/* Categorias */}
						<label>Categorias</label>
						<ul className="checkbox-content">
							<li>
								<input
									type="checkbox"
									id="compact"
									name="chack"
									value="chack"
								/>
								<label htmlFor="compact">Compacto</label>
							</li>
							<li>
								<input type="checkbox" id="family" name="chack" value="chack" />
								<label htmlFor="family">Familiar</label>
							</li>
							<li>
								<input
									type="checkbox"
									id="full-size-1"
									name="chack"
									value="chack"
								/>
								<label htmlFor="full-size-1">Grande</label>
							</li>
							<li>
								<input
									type="checkbox"
									id="intermediate"
									name="chack"
									value="chack"
								/>
								<label htmlFor="intermediate">Intermediário</label>
							</li>
							<li>
								<input type="checkbox" id="mini-1" name="chack" value="chack" />
								<label htmlFor="mini-1">Mini</label>
							</li>
							<li>
								<input
									type="checkbox"
									id="standard-1"
									name="chack"
									value="chack"
								/>
								<label htmlFor="standard-1">Standard</label>
							</li>
						</ul>

						{/* Marcas */}
						<label>Marcas</label>
						<ul className="checkbox-content">
							<li>
								<input
									type="checkbox"
									id="astonmartin-1"
									name="chack"
									value="chack"
								/>
								<label htmlFor="astonmartin-1">Aston Martin</label>
							</li>
							<li>
								<input type="checkbox" id="audi-1" name="chack" value="chack" />
								<label htmlFor="audi-1">Audi</label>
							</li>
							<li>
								<input type="checkbox" id="ford-1" name="chack" value="chack" />
								<label htmlFor="ford-1">Ford</label>
							</li>
							<li>
								<input
									type="checkbox"
									id="maruti-1"
									name="chack"
									value="chack"
								/>
								<label htmlFor="maruti-1">Maruti</label>
							</li>
							<li>
								<input
									type="checkbox"
									id="mercedes-benz-1"
									name="chack"
									value="chack"
								/>
								<label htmlFor="mercedes-benz-1">Mercedes-Benz</label>
							</li>
							<li>
								<input
									type="checkbox"
									id="terasa-1"
									name="chack"
									value="chack"
								/>
								<label htmlFor="terasa-1">Terasa</label>
							</li>
						</ul>

						{/* Modelos */}
						<label>Modelos</label>
						<ul className="checkbox-content">
							<li>
								<input
									type="checkbox"
									id="audi-2007-model-1"
									name="chack"
									value="chack"
								/>
								<label htmlFor="audi-2007-model-1">Audi 2007</label>
							</li>
							<li>
								<input
									type="checkbox"
									id="audi-a9-1"
									name="chack"
									value="chack"
								/>
								<label htmlFor="audi-a9-1">Audi A9</label>
							</li>
							<li>
								<input
									type="checkbox"
									id="c-class-sedan-1"
									name="chack"
									value="chack"
								/>
								<label htmlFor="c-class-sedan-1">C-Class Sedan</label>
							</li>
							<li>
								<input
									type="checkbox"
									id="ford-t-van"
									name="chack"
									value="chack"
								/>
								<label htmlFor="ford-t-van">Ford T Van</label>
							</li>
							<li>
								<input
									type="checkbox"
									id="maruti-2008-model-1"
									name="chack"
									value="chack"
								/>
								<label htmlFor="maruti-2008-model-1">Maruti 2008</label>
							</li>
							<li>
								<input
									type="checkbox"
									id="terasa--2007-1"
									name="chack"
									value="chack"
								/>
								<label htmlFor="terasa--2007-1">Teresa 2007</label>
							</li>
						</ul>
					</div>

					{/* Botões */}
					<div className="filter-button">
						<a href="#" className="button nevy-bg">
							Filtrar
						</a>
						<a href="#" className="button nevy-bg">
							Resetar
						</a>
					</div>
				</div>
			</form>
		</div>
	);
};

export default SideSearch;
