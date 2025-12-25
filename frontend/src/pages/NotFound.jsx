import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

function NotFound() {
    return (
        <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="space-y-4">
                    <h1 className="text-9xl font-bold text-gray-200">404</h1>
                    <h2 className="text-3xl font-bold">Page Not Found</h2>
                    <p className="text-muted-foreground">Sorry, we couldn't find the page you're looking for</p>
                </div>

                <div className="flex gap-4 justify-center">
                    <Button onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                    <Link to="/dashboard">
                        <Button>
                            <Home className="mr-2 h-4 w-4" />
                            Go to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NotFound;