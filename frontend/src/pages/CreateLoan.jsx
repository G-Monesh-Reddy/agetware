import React, { useState } from "react";
export default function CreateLoan() {
    const [form, setForm] = useState({
        customer_id: "",
        loan_amount: "",
        loan_period_years: "",
        interest_rate_yearly: "",
    });
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("http://localhost:5000/api/v1/loans", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        const data = await res.json();
        setMessage(data.message || data.error);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">
                📝 Create Loan
            </h2>
            <form onSubmit={handleSubmit} className="grid gap-3 max-w-md">
                {[
                    "customer_id",
                    "loan_amount",
                    "loan_period_years",
                    "interest_rate_yearly",
                ].map((field) => (
                    <input
                        key={field}
                        className="border p-2 rounded focus:ring-2 focus:ring-indigo-400"
                        placeholder={field.replace(/_/g, " ")}
                        value={form[field]}
                        onChange={(e) =>
                            setForm({ ...form, [field]: e.target.value })
                        }
                    />
                ))}
                <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded"
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
