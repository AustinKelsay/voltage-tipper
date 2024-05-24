import React, { useState, useEffect } from "react"
import axios from "axios";
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from "@/hooks/useToast";

const HOST = process.env.NEXT_PUBLIC_HOST;
const MACAROON = process.env.NEXT_PUBLIC_MACAROON;

const TippingComponent = () => {
    const [amount, setAmount] = useState(null);
    const [memo, setMemo] = useState("");
    const [invoice, setInvoice] = useState("")
    const [invoiceSettled, setInvoiceSettled] = useState(false)
    const [listenTimer, setListenTimer] = useState(60)

    const { showToast } = useToast();

    const handleSubmit = () => {
        if (amount <= 0) {
            return
        }

        axios.post(`${HOST}/v1/invoices`,
            {
                value: amount,
                memo: memo
            },
            {
                headers: {
                    "Grpc-Metadata-macaroon": MACAROON
                }
            }).then((res) => {
                setInvoice(res.data.payment_request)
                console.log(res.data.payment_request)
                const currentUnixTimestamp = Math.floor(Date.now() / 1000);
                startPolling(currentUnixTimestamp);
            }).catch((err) => {
                console.log(err)
            })
    }

    const listenForPayment = (currentUnixTimestamp) => {
        axios.get(`${HOST}/v1/invoices?creation_date_start=${currentUnixTimestamp}`, {
            headers: {
                "Grpc-Metadata-macaroon": MACAROON
            }
        }).then((res) => {
            if (res.data.invoices) {
                res.data.invoices.forEach((invoice) => {
                    if (invoice.settled) {
                        showToast('success', 'Payment Settled', 'The payment has been settled');
                        setInvoiceSettled(true)
                        clearInterval(pollingInterval);
                        setInvoice("")
                        setAmount(null)
                        setMemo("")
                    } else {
                        console.log("payment not settled")
                    }
                })
            }
            setInvoiceSettled(res.data.settled)
        }).catch((err) => {
            console.log(err)
        })
    }

    let pollingInterval;

    const startPolling = (currentUnixTimestamp) => {
        pollingInterval = setInterval(() => {
            listenForPayment(currentUnixTimestamp);
        }, 2000);

        setInterval(() => {
            setListenTimer((prev) => prev - 1);
        }, 1000);

        setTimeout(() => {
            clearInterval(pollingInterval);
            setListenTimer(0);
            setInvoice("")
            setAmount(null)
            setMemo("")
        }, 60000);
    }

    const copyToClipboard = () => {
        if (invoice !== "") {
            navigator.clipboard.writeText(invoice)
            showToast('success', 'Copied', 'Invoice copied to clipboard');
        }
    }

    return (
        <div className="flex flex-col justify-center p-4">
            <div className="w-full flex flex-col justify-center">
                <p className="text-base">amount</p>
                <InputNumber placeholder="sats" value={amount} onValueChange={(e) => setAmount(e.value)} />
                <p className="text-base">memo (optional)</p>
                <InputText placeholder="memo" value={memo} onChange={(e) => setMemo(e.target.value)} />
            </div>
            <Button className="mt-4" label="Submit" severity="success" onClick={handleSubmit} />
            {invoice &&
                <div className="flex flex-col justify-center bg-slate-600 rounded-md p-2">
                    <p className="text-center text-2xl">{listenTimer}</p>
                    <div className="m-4 border-2 rounded-lg bg-white p-2">
                        <QRCodeSVG className="cursor-pointer hover:opacity-75" onClick={copyToClipboard} size={264} value={invoice} />
                    </div>
                </div>
            }
        </div>
    )
}

export default TippingComponent