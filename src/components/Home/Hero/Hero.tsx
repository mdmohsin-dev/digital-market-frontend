import { heroSlides } from "@/Data/hero-slides";
import HeroSlider from "./HeroSlider";

const Hero = () => {
    
    return (
        <div>
         <HeroSlider slides={heroSlides}/>
        </div>
    );
};

export default Hero;