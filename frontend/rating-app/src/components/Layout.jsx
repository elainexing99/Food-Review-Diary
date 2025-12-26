import { Link, Outlet } from 'react-router-dom';
import "./Layout.css";

export default function Layout() {

    function getYear() {
        const year = new Date().getFullYear();
        return year;
    }

    return (
        <>
            <header>
                <Link to="/" className="link">Overview</Link>
                <Link to="/new-entry" className="link">New Review</Link>
            </header>
            <main>
                <Outlet/>
            </main>
            <footer>
                Food Review Diary &copy; {getYear()}
            </footer>
        </>
    
    )
}