import React, { useState } from "react";
import axios from "axios";
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

// Environment variables for API configuration
const HOST = process.env.NEXT_PUBLIC_HOST;
const INVOICE_MACAROON = process.env.NEXT_PUBLIC_INVOICE_MACAROON;

const TippingForm = ({ setInvoice, invoice, startPolling, resetForm }) => {
    // State for amount and memo
    const [amount, setAmount] = useState(null);
    const [memo, setMemo] = useState("");

    // Function to handle form submission
    const handleSubmit = async () => {
        if (amount <= 0) return;
        try {
            // Create a new invoice using the API
            const { data } = await axios.post(`${HOST}/v1/invoices`,
                {
                    value: amount,
                    memo: "voltage-tipper" + " " + memo,
                    expiry: 3600
                },
                {
                    headers: { "Grpc-Metadata-macaroon": INVOICE_MACAROON }
                });
            // Set the invoice and start polling for payment
            setInvoice(data.payment_request);
            const currentUnixTimestamp = Math.floor(Date.now() / 1000);
            startPolling(currentUnixTimestamp);
            // Reset the form
            setAmount(null);
            setMemo("");
            resetForm();
        } catch (error) {
            console.error(error);
        }
    };

    // Update resetForm to include the local state reset
    resetForm = () => {
        setAmount(null);
        setMemo("");
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* Amount input section */}
            <div className="flex flex-col gap-2">
                <label htmlFor="amount" className="font-bold">Amount (sats)</label>
                <div className="p-inputgroup">
                    {/* Decrease amount button */}
                    <Button icon="pi pi-minus" onClick={() => setAmount(prev => Math.max(0, prev - 1))} />
                    {/* Amount input field */}
                    <InputNumber
                        id="amount"
                        value={amount}
                        onValueChange={(e) => setAmount(e.value)}
                        min={0}
                        placeholder="Enter amount"
                        className="flex-1"
                    />
                    {/* Increase amount button */}
                    <Button icon="pi pi-plus" onClick={() => setAmount(prev => prev + 1)} />
                </div>
            </div>
            {/* Memo input section */}
            <div className="flex flex-col gap-2">
                <label htmlFor="memo" className="font-bold">Memo (optional)</label>
                <InputText
                    id="memo"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="Enter a memo"
                />
            </div>
            {/* Create Invoice button */}
            <Button
                label="Create Invoice"
                icon="pi pi-bolt"
                disabled={invoice || !amount || amount <= 0}
                onClick={handleSubmit}
                className="w-fit self-end my-4"
            />
        </div>
    );
};

export default TippingForm;