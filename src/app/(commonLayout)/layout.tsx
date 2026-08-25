import AnnouncementBar from "@/components/shared/Navbar/AnnouncementBar";
import PublicNavbar from "@/components/shared/Navbar/PublicNavbar";

const commonLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <AnnouncementBar/>
            <PublicNavbar />
            {children}
        </div>
    );
};

export default commonLayout;