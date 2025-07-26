const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const { v4: uuid } = require("uuid");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// SQLite DB Setup
const db = new sqlite3.Database("data.db");

db.serialize(() => {
    db.run(`
    CREATE TABLE customers (
      id TEXT PRIMARY KEY,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

    db.run(`
    CREATE TABLE loans (
      id TEXT PRIMARY KEY,
      customer_id TEXT,
      loan_amount REAL,
      loan_period_years INTEGER,
      interest_rate_yearly REAL,
      status TEXT DEFAULT 'ACTIVE',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(customer_id) REFERENCES customers(id)
    )
  `);

    db.run(`
    CREATE TABLE payments (
      id TEXT PRIMARY KEY,
      loan_id TEXT,
      amount REAL,
      payment_type TEXT,
      payment_date TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(loan_id) REFERENCES loans(id)
    )
  `);
});

// Helper: Simple Interest
const calculateEMI = (P, R, N) => {
    const interest = (P * R * N) / 100;
    const total = P + interest;
    const emi = total / (N * 12);
    return { interest, total, emi };
};

// ✅ API: Create Loan
app.post("/api/v1/loans", (req, res) => {
    const {
        customer_id,
        loan_amount,
        loan_period_years,
        interest_rate_yearly,
    } = req.body;

    if (
        !customer_id ||
        !loan_amount ||
        !loan_period_years ||
        !interest_rate_yearly
    )
        return res.status(400).json({ error: "All fields are required" });

    // Insert customer if not exist
    db.get(
        "SELECT * FROM customers WHERE id = ?",
        [customer_id],
        (err, row) => {
            if (err) return res.status(500).json({ error: "DB error" });

            const insertLoan = () => {
                const loan_id = customer_id;
                db.run(
                    `INSERT INTO loans (id, customer_id, loan_amount, loan_period_years, interest_rate_yearly) VALUES (?, ?, ?, ?, ?)`,
                    [
                        loan_id,
                        customer_id,
                        loan_amount,
                        loan_period_years,
                        interest_rate_yearly,
                    ],
                    (err2) => {
                        if (err2)
                            return res
                                .status(500)
                                .json({ error: "Loan creation failed" });
                        res.status(201).json({
                            message: `Loan created successfully:${loan_id}`,
                            loan_id,
                        });
                    }
                );
            };

            if (!row) {
                db.run(
                    "INSERT INTO customers (id) VALUES (?)",
                    [customer_id],
                    (err2) => {
                        if (err2)
                            return res
                                .status(500)
                                .json({ error: "Customer creation failed" });
                        insertLoan();
                    }
                );
            } else {
                insertLoan();
            }
        }
    );
});

// ✅ API: Make Payment
app.post("/api/v1/loans/:loanId/payments", (req, res) => {
    const { loanId } = req.params;
    const { amount, payment_type } = req.body;

    if (!amount || !payment_type)
        return res
            .status(400)
            .json({ error: "Amount and payment_type required" });

    db.get("SELECT * FROM loans WHERE id = ?", [loanId], (err, loan) => {
        if (err || !loan)
            return res.status(404).json({ error: "Loan not found" });

        const paymentId = uuid();
        db.run(
            `INSERT INTO payments (id, loan_id, amount, payment_type) VALUES (?, ?, ?, ?)`,
            [paymentId, loanId, amount, payment_type],
            (err2) => {
                if (err2)
                    return res.status(500).json({ error: "Payment failed" });
                res.json({
                    message: "Payment recorded",
                    payment_id: paymentId,
                });
            }
        );
    });
});

// ✅ API: Ledger View
app.get("/api/v1/loans/:loanId/ledger", (req, res) => {
    const { loanId } = req.params;

    db.get("SELECT * FROM loans WHERE id = ?", [loanId], (err, loan) => {
        if (err || !loan)
            return res.status(404).json({ error: "Loan not found" });

        db.all(
            "SELECT * FROM payments WHERE loan_id = ?",
            [loanId],
            (err2, payments) => {
                if (err2)
                    return res
                        .status(500)
                        .json({ error: "Failed to get payments" });

                const { interest, total } = calculateEMI(
                    loan.loan_amount,
                    loan.interest_rate_yearly,
                    loan.loan_period_years
                );
                const totalPaid = payments.reduce(
                    (sum, p) => sum + p.amount,
                    0
                );

                res.json({
                    loan_id: loan.id,
                    customer_id: loan.customer_id,
                    loan_amount: loan.loan_amount,
                    total_interest: interest,
                    total_payable: total,
                    total_paid: totalPaid,
                    remaining_balance: total - totalPaid,
                    payments,
                });
            }
        );
    });
});

// ✅ API: Customer Overview
app.get("/api/v1/customers/:customerId/overview", (req, res) => {
    const { customerId } = req.params;

    db.all(
        "SELECT * FROM loans WHERE customer_id = ?",
        [customerId],
        (err, loans) => {
            if (err) return res.status(500).json({ error: "DB error" });
            if (!loans.length)
                return res.status(404).json({ error: "No loans found" });

            const result = [];
            let loanCount = 0;

            const getPayments = (loan) =>
                new Promise((resolve) => {
                    db.all(
                        "SELECT * FROM payments WHERE loan_id = ?",
                        [loan.id],
                        (err, payments) => {
                            const { interest, total } = calculateEMI(
                                loan.loan_amount,
                                loan.interest_rate_yearly,
                                loan.loan_period_years
                            );
                            const paid = payments.reduce(
                                (sum, p) => sum + p.amount,
                                0
                            );
                            result.push({
                                loan_id: loan.id,
                                loan_amount: loan.loan_amount,
                                interest_rate_yearly: loan.interest_rate_yearly,
                                loan_period_years: loan.loan_period_years,
                                status: loan.status,
                                total_payable: total,
                                total_paid: paid,
                                remaining: total - paid,
                            });
                            resolve();
                        }
                    );
                });

            Promise.all(loans.map((loan) => getPayments(loan))).then(() =>
                res.json(result)
            );
        }
    );
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
