import Header from "./Header";

function Layout({ children }) {
    return (
        <div className="min-h-screen min-w-screen bg-gray-50">
            <Header />
            <main className="container mx-auto px-4 py-6 md:px-6 md:py-8">
                {children}
            </main>
        </div>
    );
}

export default Layout;