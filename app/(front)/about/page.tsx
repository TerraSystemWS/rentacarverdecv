"use client";

import PageHeader from "../../ui/front/PageHeader";
import DriverBlock from "../../ui/front/DriverBlock";
import AboutMainContent from "../../ui/front/about/AboutMainContent";
import { useContent } from "@/app/context/ContentContext";
import { useTranslations } from "next-intl";

const About = () => {
	const { content } = useContent();
	const t = useTranslations("about");

	return (
		<>
			<PageHeader
				titulo={content?.about.headerTitle || t("headerTitle")}
				descricao={content?.about.headerDesc || t("headerDesc")}
			/>
			<AboutMainContent content={content?.about} />
			<DriverBlock />
		</>
	);
};

export default About;
