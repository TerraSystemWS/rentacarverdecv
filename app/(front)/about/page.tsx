import PageHeader from "../../ui/front/PageHeader";
import DriverBlock from "../../ui/front/DriverBlock";
import AboutMainContent from "../../ui/front/about/AboutMainContent";

const About = () => {
	return (
		<>
			<PageHeader titulo="Sobre Nós" descricao="Sobre a Rent-A-Car Verde" />
			<AboutMainContent />
			<DriverBlock />
		</>
	);
};

export default About;
