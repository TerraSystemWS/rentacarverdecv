"use client";

import PageHeader from "../../ui/front/PageHeader";
import DriverBlock from "../../ui/front/DriverBlock";
import AboutMainContent from "../../ui/front/about/AboutMainContent";
import { useContent } from "@/app/context/ContentContext";

const About = () => {
	const { content, loading } = useContent();

	return (
		<>
			<PageHeader
				titulo={content?.about.headerTitle || "Sobre Nós"}
				descricao={content?.about.headerDesc || "Sobre a Rent-A-Car Verde"}
			/>
			<AboutMainContent content={content?.about} />
			<DriverBlock />
		</>
	);
};

export default About;
