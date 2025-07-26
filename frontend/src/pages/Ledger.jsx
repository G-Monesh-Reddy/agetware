import React, { useState } from "react";

export default function Ledger() {
    const [loanId, setLoanId] = useState("");
    const [ledger, setLedger] = useState(null);
    const [error, setError] = useState("");

    const fetchLedger = async () => {
        setError("");
        setLedger(null);
        try {
            const res = await fetch(
                `http://localhost:5000/api/v1/loans/${loanId}/ledger`
            );
            const result = await res.json();
            console.log("Ledger result:", result);

            if (result.error) {
                setError(result.error);
            } else {
                setLedger(result); // directly use result (not result.data)
            }
        } catch (err) {
            console.error("Error fetching ledger:", err);
            setError("Failed to fetch ledger");
        }
    };

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                📚 Loan Ledger
            </h2>

            <div className="flex gap-2 mb-4">
                <input
                    className="border p-2 rounded w-full"
                    placeholder="Enter Loan ID"
                    value={loanId}
                    onChange={(e) => setLoanId(e.target.value)}
                />
                <button
                    className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
                    onClick={fetchLedger}
                >
                    Fetch
                </button>
            </div>

            {error && (
                <div className="text-red-500 bg-red-100 p-2 rounded">
                    {error}
                </div>
            )}

            {ledger && (
                <div className="bg-gray-50 p-4 rounded shadow">
                    <h3 className="text-lg font-semibold mb-2 text-indigo-800">
                        Loan Info
                    </h3>
                    <p>
                        <strong>Loan ID:</strong> {ledger.loan_id}
                    </p>
                    <p>
                        <strong>Customer ID:</strong> {ledger.customer_id}
                    </p>
                    <p>
                        <strong>Loan Amount:</strong> ₹{ledger.loan_amount}
                    </p>
                    <p>
                        <strong>Total Interest:</strong> ₹
                        {ledger.total_interest}
                    </p>
                    <p>
                        <strong>Total Payable:</strong> ₹{ledger.total_payable}
                    </p>
                    <p>
                        <strong>Total Paid:</strong> ₹{ledger.total_paid}
                    </p>
                    <p>
                        <strong>Remaining Balance:</strong> ₹
                        {ledger.remaining_balance}
                    </p>

                    <h4 className="mt-4 font-semibold text-indigo-700">
                        Payments
                    </h4>
                    {ledger.payments.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {ledger.payments.map((p, i) => (
                                <li key={i}>
                                    ₹{p.amount} - {p.payment_type} on{" "}
                                    {new Date(p.paid_at).toLocaleString()}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No payments recorded.</p>
                    )}
                </div>
            )}
        </div>
    );
}
