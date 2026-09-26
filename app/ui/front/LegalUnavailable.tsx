// Mostrado se a API não responder ao carregar uma página legal editável.
export default function LegalUnavailable() {
	return (
		<p className="text-slate-600">
			Não foi possível carregar este documento neste momento. Tente de novo dentro de instantes ou contacte-nos
			por <a href="mailto:reservas@rentacarverde.cv" className="text-green-700 font-semibold underline">reservas@rentacarverde.cv</a> ou
			pelo telefone (+238) 581 09 45.
		</p>
	);
}
