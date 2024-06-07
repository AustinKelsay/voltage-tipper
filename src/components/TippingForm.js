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
                    // prepend the memo with voltage-tipper to identify all payments from this app
                    memo: "voltage-tipper" + " " + memo,
                    // invoices expires in 1 hour
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
        <div className="w-full flex flex-col justify-center">
            <p className="text-base">Amount</p>
            <InputNumber placeholder="sats" value={amount} onValueChange={(e) => setAmount(e.value)} />
            <p className="text-base">Memo (optional)</p>
            <InputText placeholder="memo" value={memo} onChange={(e) => setMemo(e.target.value)} />
            <Button disabled={invoice} className="mt-4" label="Submit" severity="success" onClick={handleSubmit} />
        </div>
    );
};

export default TippingForm;
