import { Tag } from "lucide-react";
import { useTranslations } from "next-intl";

// Faixa "Desconto de x%" — maior desconto de um voucher ativo que se aplica à
// viatura (Vehicle.discountPercent, calculado pela API). O código em si chega
// aos clientes pelo email da campanha; aqui só se anuncia que existe.
export default function DiscountRibbon({ percent, inline = false }: { percent?: number | null; inline?: boolean }) {
	const tv = useTranslations("vehicle");
	if (!percent) return null;
	return (
		<span className={`racv-discount ${inline ? "racv-discount--inline" : ""}`}>
			<Tag className="w-3.5 h-3.5" aria-hidden />
			{tv("discount", { percent })}
		</span>
	);
}
