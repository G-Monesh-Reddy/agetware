// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreateLoan from "./pages/CreateLoan";
import MakePayment from "./pages/MakePayment";
import Ledger from "./pages/Ledger";
import Overview from "./pages/Overview";
import "./App.css"; // Assuming you have some global styles
import "./index.css"; // Tailwind CSS styles

export default function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-green-100 p-6">
                <nav className="flex flex-wrap gap-4 mb-8 justify-center bg-white shadow-md rounded-lg p-4">
                    <Link
                        to="/"
                        className="text-indigo-700 font-semibold hover:text-indigo-900"
                    >
                        🏠 Home
                    </Link>
                    <Link
                        to="/create-loan"
                        className="text-indigo-700 hover:text-indigo-900"
                    >
                        ➕ Create Loan
                    </Link>
                    <Link
                        to="/make-payment"
                        className="text-indigo-700 hover:text-indigo-900"
                    >
                        💰 Make Payment
                    </Link>
                    <Link
                        to="/ledger"
                        className="text-indigo-700 hover:text-indigo-900"
                    >
                        📜 Ledger
                    </Link>
                    <Link
                        to="/overview"
                        className="text-indigo-700 hover:text-indigo-900"
                    >
                        📊 Overview
                    </Link>
                </nav>
                <main className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/create-loan" element={<CreateLoan />} />
                        <Route path="/make-payment" element={<MakePayment />} />
                        <Route path="/ledger" element={<Ledger />} />
                        <Route path="/overview" element={<Overview />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
