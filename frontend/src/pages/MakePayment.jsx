import React, { useState } from "react";
export default function MakePayment() {
    const [loanId, setLoanId] = useState("");
    const [form, setForm] = useState({ amount: "", payment_type: "EMI" });
    const [message, setMessage] = useState(null);

    const submitPayment = async (e) => {
        e.preventDefault();
        const res = await fetch(
            `http://localhost:5000/api/v1/loans/${loanId}/payments`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            }
        );
        const data = await res.json();
        setMessage(data.message || data.error);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                💸 Make a Payment
            </h2>
            <form onSubmit={submitPayment} className="grid gap-3 max-w-md">
                <input
                    className="border p-2 rounded"
                    placeholder="Loan ID"
                    value={loanId}
                    onChange={(e) => setLoanId(e.target.value)}
                />
                <input
                    className="border p-2 rounded"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={(e) =>
                        setForm({ ...form, amount: e.target.value })
                    }
                />
                <select
                    className="border p-2 rounded"
                    value={form.payment_type}
                    onChange={(e) =>
                        setForm({ ...form, payment_type: e.target.value })
                    }
                >
                    <option value="EMI">EMI</option>
                    <option value="LUMP_SUM">LUMP_SUM</option>
                </select>
                <button
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                    type="submit"
                >
                    Submit
                </button>
            </form>
            {message && (
                <div className="mt-4 text-green-700 font-semibold">
                    {message}
                </div>
            )}
        </div>
    );
}
