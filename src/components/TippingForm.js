import React, { useState } from "react";
import axios from "axios";
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const HOST = process.env.NEXT_PUBLIC_HOST;
const INVOICE_MACAROON = process.env.NEXT_PUBLIC_INVOICE_MACAROON;

const TippingForm = ({ setInvoice, invoice, startPolling }) => {
    const [amount, setAmount] = useState(null);
    const [memo, setMemo] = useState("");

    const handleSubmit = async () => {
        if (amount <= 0) return;
        try {
            const { data } = await axios.post(`${HOST}/v1/invoices`,
                {
                    value: amount,
                    memo: "voltage-tipper" + " " + memo,
                    expiry: 3600
                },
                {
                    headers: { "Grpc-Metadata-macaroon": INVOICE_MACAROON }
                });
            setInvoice(data.payment_request);
            const currentUnixTimestamp = Math.floor(Date.now() / 1000);
            startPolling(currentUnixTimestamp);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-col gap-2">
                <label htmlFor="amount" className="font-bold">Amount (sats)</label>
                <div className="p-inputgroup">
                    <Button icon="pi pi-minus" onClick={() => setAmount(prev => Math.max(0, prev - 1))} />
                    <InputNumber
                        id="amount"
                        value={amount}
                        onValueChange={(e) => setAmount(e.value)}
                        min={0}
                        placeholder="Enter amount"
                        className="flex-1"
                    />
                    <Button icon="pi pi-plus" onClick={() => setAmount(prev => prev + 1)} />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="memo" className="font-bold">Memo (optional)</label>
                <InputText
                    id="memo"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="Enter a memo"
                />
            </div>
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