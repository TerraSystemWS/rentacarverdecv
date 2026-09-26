import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/app/ui/front/PageHeader";

export const metadata: Metadata = {
	title: "Condições Gerais de Aluguer | Rent a Car Verde",
	description: "Termos do contrato de aluguer de viaturas celebrado entre a Rent a Car Verde e o locatário.",
};

// Transcrição fiel do documento físico "Condições Gerais de Aluguer" que
// acompanha o contrato (condiçõesGerais_de_Aluguer.jpeg, raiz do projeto).
// Alterações ao texto devem ser feitas no documento em papel também — são o
// mesmo contrato.
const SECTIONS: { title: string; body: React.ReactNode }[] = [
	{
		title: "1. Utilização da viatura",
		body: (
			<>
				<p>O locatário compromete-se a não permitir que o veículo seja conduzido senão por ele próprio. É-lhe proibido:</p>
				<p>Participar em competições desportivas; utilizar o veículo para fins ilícitos; transportar mercadorias; exceder a lotação da viatura.</p>
			</>
		),
	},
	{
		title: "2. Estado do automóvel",
		body: (
			<p>
				A viatura é entregue ao cliente em perfeito estado de limpeza e funcionamento. A sua devolução deverá ser feita nas
				mesmas circunstâncias. Qualquer deterioração resultante do uso anormal, atos de vandalismo e outros, são de exclusiva
				responsabilidade do cliente, que deverá liquidar prontamente os custos dos danos.
			</p>
		),
	},
	{
		title: "3. Combustível e óleos",
		body: (
			<>
				<p>O combustível é por conta do cliente.</p>
				<p>
					O locatário compromete-se a estar atento aos indicadores internos e a verificar com a necessária regularidade os
					níveis de óleo no motor, água no radiador e bateria.
				</p>
				<p>Danos resultantes da falta de cumprimento desta norma são também da responsabilidade do cliente.</p>
			</>
		),
	},
	{
		title: "4. Conservação e reparação",
		body: (
			<>
				<p>O cliente compromete-se a zelar pela boa conservação da viatura.</p>
				<p>É da conta da RENT A CAR VERDE toda a reparação de avarias proveniente de desgaste mecânico normal da viatura.</p>
				<p>
					A reparação de avarias ocasionadas por uso anormal da viatura, negligência do cliente ou outras causas acidentais
					são da responsabilidade e da conta do cliente.
				</p>
				<p>
					É ainda da conta do cliente os danos causados aos pneus que não sejam meramente decorrentes do seu uso normal,
					desgaste ou furos acidentais.
				</p>
				<p>
					Toda e qualquer reparação a fazer nas viaturas motivada por qualquer avaria ou sinistro só pode ser ordenada e
					efetuada pelos nossos serviços. No caso de o cliente pretender efetuar qualquer das reparações acima referidas,
					ficará penalizado na mesma.
				</p>
				<p>
					Para além do pagamento das reparações por avarias ou sinistro que sejam imputáveis ao cliente, este ficará ainda
					obrigado a pagar uma importância diária equivalente a 90% do valor de aluguer destinado à RENT A CAR VERDE pela
					imobilização da viatura até completa reparação ou substituição da mesma, independentemente do valor da caução /
					franquia.
				</p>
			</>
		),
	},
	{
		title: "5. Seguros e acidentes",
		body: (
			<>
				<p>A tarifa de aluguer inclui o seguro obrigatório automóvel em vigor em Cabo Verde.</p>
				<p>
					Os danos cujo valor seja inferior à <strong>franquia de 130.000$00</strong> serão da responsabilidade do cliente,
					qualquer que seja a natureza do evento que tenha dado lugar ao dano.
				</p>
				<p>
					<strong>Para sinistro</strong> cujo valor da reparação ou substituição seja <strong>inferior à franquia de
					130.000$00</strong>, o cliente pagará o valor correspondente ao custo de reparação ou substituição.
				</p>
				<p>
					A responsabilidade da RENT A CAR VERDE nunca poderá ser invocada em caso de acidente resultante de defeitos de
					construção ou reparações anteriores.
				</p>
				<p>As despesas com reboque e guarda de viaturas acidentadas, quando o cliente for culpado, são da conta do mesmo.</p>
				<p>
					A responsabilidade civil facultativa é exclusivamente do locatário / cliente em casos de qualquer infração ou
					atropelamento.
				</p>
			</>
		),
	},
	{
		title: "6. Aluguer, caução e prolongamento do aluguer",
		body: (
			<>
				<p>
					Os preços de aluguer e caução devem ser pagos antecipadamente. Se o cliente prolongar o aluguer, deverá, com acordo
					da RENT A CAR VERDE, pagar o valor de aluguer complementar 48 horas antes de expirar o tempo do 1.º aluguer.
				</p>
				<p>
					O dia de aluguer é contado a partir da hora de entrega e toda a fração superior a 6 horas conta como dia inteiro.
					As horas até ao limite de 6 horas são liquidadas na base de uma taxa fixa, resultante da divisão da tarifa diária
					por 24 horas, multiplicado pelo número de horas extra.
				</p>
				<p>
					Em caso de acidente ou danos ocasionados ao veículo, a caução só será restituída ao cliente após verificação da
					situação e o apuramento de responsabilidade.
				</p>
			</>
		),
	},
	{
		title: "7. Devolução do automóvel",
		body: (
			<p>
				O cliente compromete-se a fazer a entrega da viatura no local de aluguer e nas horas normais de expediente. Não
				poderá abandonar o veículo, sob pena de ser responsabilizado pelos prejuízos ou gastos decorrentes desse ato.
			</p>
		),
	},
	{
		title: "8. Responsabilidades",
		body: (
			<>
				<p>
					O cliente locatário que se apresentar na RENT A CAR VERDE para contratar o aluguer da viatura não pode entregar a
					viatura a um terceiro, sob pena de ser responsabilizado pelos danos que possam ocorrer na viatura por culpa
					imputada ao terceiro.
				</p>
				<p>
					<strong>O locatário é responsável pelas multas e contravenções levantadas contra si.</strong>
				</p>
				<p>
					A RENT A CAR VERDE proíbe o aluguer a menores de 25 anos de idade, a indivíduos que tenham obtido a carta de
					condução há menos de 2 anos ou ainda a pessoa cuja experiência de condução seja duvidosa.
				</p>
				<p>
					<strong>
						As multas resultantes da infração do código da estrada, uso de telemóvel durante a condução e não uso do cinto
						de segurança
					</strong>{" "}
					são também da inteira responsabilidade do locatário / cliente, que deve assumi-las prontamente no ato da
					devolução da viatura ou apresentar comprovativo da regularização.
				</p>
				<p>
					<strong>8.1.</strong> O locatário, quer seja ele pessoa individual ou coletiva, obriga-se especialmente a que a
					viatura alugada seja conduzida apenas pelo(s) condutor(es) devidamente autorizado(s), especificado(s) no contrato
					de locação, sob pena de responder por perdas e danos, em caso de acidente, perante a locadora ou terceiros lesados,
					independentemente de a pessoa que conduzia o carro, fora das condições do contrato de locação, no momento do
					acidente, possuir ou não carta ou licença de condução.
				</p>
				<p>
					<strong>8.2.</strong> O locatário obriga-se, sob pena de responder por perdas e danos perante a locadora ou
					terceiros lesados, a tomar todas as medidas ao seu alcance a fim de que o condutor devidamente autorizado a
					conduzir a viatura, ao abrigo deste contrato de locação, não o faça com infração ou inobservância grosseira das
					regras do Código da Estrada, designadamente em manifesto excesso de velocidade ou sob efeito de álcool ou outros
					produtos tóxicos.
				</p>
				<p>
					<strong>8.3.</strong> Fica acordado entre as partes intervenientes no presente contrato que o foro judicial
					competente para as ações dele emergentes é o Tribunal da Comarca da Praia, com expressa renúncia de qualquer outro.
				</p>
			</>
		),
	},
];

export default function CondicoesGeraisPage() {
	return (
		<div className="bg-slate-100 min-h-screen pb-20">
			<PageHeader titulo="Condições Gerais de Aluguer" descricao="Termos do contrato de aluguer" />

			<div className="container mx-auto px-4 mt-10 max-w-4xl">
				<article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-sm text-slate-700 text-[15px] leading-relaxed">
					<p className="mb-8">
						O presente documento contém todos os termos do contrato de aluguer celebrado entre a{" "}
						<strong>RENT A CAR VERDE</strong> e o locatário, devendo este lê-lo cuidadosamente. Caso o locatário não
						compreenda qualquer disposição contida neste documento, deverá solicitar os respetivos esclarecimentos ao
						agente da <strong>RENT A CAR VERDE</strong> que o está a assistir, ou através dos nossos{" "}
						<Link href="/contact" className="text-green-700 font-semibold hover:underline">contactos</Link>.
					</p>

					{SECTIONS.map((s) => (
						<section key={s.title} className="mb-8 space-y-3">
							<h2 className="text-lg font-black text-slate-900">{s.title}</h2>
							{s.body}
						</section>
					))}

					<p className="text-sm text-slate-500 border-t border-slate-200 pt-6">
						Consulte também a nossa{" "}
						<Link href="/politica-cancelamento" className="text-green-700 font-semibold hover:underline">
							Política de Cancelamento e Reembolso
						</Link>{" "}
						para reservas pagas online.
					</p>
				</article>
			</div>
		</div>
	);
}
