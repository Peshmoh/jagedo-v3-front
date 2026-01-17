export default function GenericFooter() {
    return (
        <footer className="bg-gray-100 border-t border-gray-200 py-6">
            <div className="container text-center text-sm text-gray-600 mx-auto">
                © {new Date().getFullYear()} JAGEDO. All rights reserved.
            </div>
        </footer>
    )
}