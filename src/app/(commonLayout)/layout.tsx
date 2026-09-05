import NewsletterSection from "@/components/Home/NewsLetterSection";
import Footer from "@/components/shared/Footer";
import AnnouncementBar from "@/components/shared/Navbar/AnnouncementBar";
import PublicNavbar from "@/components/shared/Navbar/PublicNavbar";

const commonLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <AnnouncementBar/>
            <PublicNavbar />
            {children}
            <NewsletterSection/>
            <Footer/>
        </div>
    );
};

export default commonLayout;