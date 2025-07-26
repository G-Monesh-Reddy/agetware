import React, { useState } from "react";

export default function Overview() {
    const [customerId, setCustomerId] = useState("");
    const [loans, setLoans] = useState([]);
    const [error, setError] = useState("");

    const fetchOverview = async () => {
        setError("");
        setLoans([]);
        try {
            const res = await fetch(
                `http://localhost:5000/api/v1/customers/${customerId}/overview`
            );
            const result = await res.json();
            console.log("Overview result:", result);
            if (result.error) {
                setError(result.error);
            } else {
                setLoans(result); // result is an array of loan objects
            }
        } catch (err) {
            console.error("Error fetching overview:", err);
            setError("Failed to fetch overview");
        }
    };

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                📊 Customer Overview
            </h2>
            <div className="flex gap-2 mb-4">
                <input
                    className="border p-2 rounded w-full"
                    placeholder="Enter Customer ID"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                />
                <button
                    className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
                    onClick={fetchOverview}
                >
                    Fetch
                </button>
            </div>
            {error && (
                <div className="text-red-500 bg-red-100 p-2 rounded">
                    {error}
                </div>
            )}
            {loans.length > 0 && (
                <div className="space-y-4">
                    {loans.map((loan, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 p-4 rounded shadow"
                        >
                            <p>
                                <strong>Loan ID:</strong> {loan.loan_id}
                            </p>
                            <p>
                                <strong>Status:</strong> {loan.status}
                            </p>
                            <p>
                                <strong>Loan Amount:</strong> ₹
                                {loan.loan_amount}
                            </p>
                            <p>
                                <strong>Interest Rate (Yearly):</strong>{" "}
                                {loan.interest_rate_yearly}%
                            </p>
                            <p>
                                <strong>Loan Period (Years):</strong>{" "}
                                {loan.loan_period_years}
                            </p>
                            <p>
                                <strong>Total Payable:</strong> ₹
                                {loan.total_payable}
                            </p>
                            <p>
                                <strong>Total Paid:</strong> ₹{loan.total_paid}
                            </p>
                            <p>
                                <strong>Remaining:</strong> ₹{loan.remaining}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
