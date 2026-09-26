import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/app/ui/front/PageHeader";
import PaymentBrands from "@/app/ui/front/payment/PaymentBrands";

export const metadata: Metadata = {
	title: "Política de Cancelamento e Reembolso | Rent a Car Verde",
	description: "Condições de pagamento online, cancelamento, reembolso, entrega e devolução das viaturas da Rent a Car Verde.",
};

// Exigida pela checklist de validação do site da SISP (ponto 6 — política de
// entrega e devolução do serviço) para aceitar pagamentos vinti4.
export default function PoliticaCancelamentoPage() {
	return (
		<div className="bg-slate-100 min-h-screen pb-20">
			<PageHeader titulo="Cancelamento e Reembolso" descricao="Pagamento online, cancelamento, entrega e devolução" />

			<div className="container mx-auto px-4 mt-10 max-w-4xl">
				<article className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-sm text-slate-700 text-[15px] leading-relaxed space-y-8">
					<section className="space-y-3">
						<h2 className="text-lg font-black text-slate-900">1. Pagamento online</h2>
						<p>
							As reservas feitas no site podem ser pagas online com cartão vinti4, Visa, Mastercard ou American Express,
							através da rede vinti4 (SISP). O pagamento é feito na página segura da SISP — os dados do cartão nunca passam
							pelo nosso site.
						</p>
						<p>
							Todos os preços são apresentados em escudos cabo-verdianos (CVE), com IVA incluído. O valor cobrado é o total
							da reserva indicado antes do pagamento (dias de aluguer, condutor adicional e descontos, quando aplicáveis).
						</p>
						<p>
							Após o pagamento com sucesso, a reserva fica confirmada e o recibo e a fatura ficam disponíveis na sua área de
							cliente. Uma reserva que não seja paga é cancelada automaticamente passado algum tempo, para libertar a viatura.
						</p>
						<PaymentBrands />
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-black text-slate-900">2. Cancelamento pelo cliente</h2>
						<ul className="list-disc pl-6 space-y-2">
							<li>
								<strong>Até 48 horas antes</strong> da data e hora de levantamento da viatura: cancelamento gratuito, com{" "}
								<strong>reembolso total</strong> do valor pago.
							</li>
							<li>
								<strong>Com menos de 48 horas</strong> de antecedência, ou em caso de <strong>não comparência</strong> no
								levantamento: <strong>não há lugar a reembolso</strong>.
							</li>
						</ul>
						<p>
							Para cancelar, contacte-nos por email para{" "}
							<a href="mailto:reservas@rentacarverde.cv" className="text-green-700 font-semibold hover:underline">
								reservas@rentacarverde.cv
							</a>{" "}
							ou pelo telefone{" "}
							<a href="tel:+2385810945" className="text-green-700 font-semibold hover:underline">
								(+238) 581 09 45
							</a>
							, indicando o número da reserva e a referência do pagamento que consta do recibo. Conta a data e hora em que
							recebemos o pedido.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-black text-slate-900">3. Reembolsos</h2>
						<p>
							Os reembolsos são feitos para o mesmo cartão usado no pagamento, no prazo máximo de{" "}
							<strong>5 dias úteis</strong> após a confirmação do cancelamento. O tempo até o valor aparecer na conta pode
							depender do banco emissor do cartão.
						</p>
						<p>
							Se a Rent a Car Verde não puder disponibilizar a viatura reservada e não for possível oferecer uma alternativa
							aceite pelo cliente, o valor pago é reembolsado na totalidade.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-black text-slate-900">4. Alterações à reserva</h2>
						<p>
							Pedidos de alteração de datas ou de viatura estão sujeitos a disponibilidade e devem ser feitos pelos mesmos
							contactos. Se a alteração implicar um valor superior, a diferença é paga antes do levantamento. O prolongamento
							de um aluguer em curso segue as <Link href="/condicoes-gerais" className="text-green-700 font-semibold hover:underline">Condições Gerais de Aluguer</Link> (ponto 6).
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-black text-slate-900">5. Entrega e devolução da viatura</h2>
						<p>
							A viatura é entregue no local e na hora de levantamento indicados na reserva, mediante apresentação de
							documento de identificação e carta de condução válidos do condutor, e assinatura do contrato de aluguer.
						</p>
						<p>
							A devolução é feita no local de aluguer e dentro do horário normal de expediente, nas mesmas condições de
							limpeza e funcionamento em que a viatura foi entregue, conforme os pontos 2 e 7 das{" "}
							<Link href="/condicoes-gerais" className="text-green-700 font-semibold hover:underline">Condições Gerais de Aluguer</Link>.
						</p>
					</section>

					<section className="space-y-3">
						<h2 className="text-lg font-black text-slate-900">6. Apoio ao cliente</h2>
						<p>
							Rent a Car Verde — Cidadela, Rua da Independência, São Filipe, Ilha do Fogo, Cabo Verde
							<br />
							Email: reservas@rentacarverde.cv · Telefone: (+238) 581 09 45
						</p>
					</section>
				</article>
			</div>
		</div>
	);
}
