import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TippingForm from "./TippingForm";
import TippingDisplay from "./TippingDisplay";
import PastTips from "./PastTips";
import { useToast } from "@/hooks/useToast";
import { Card } from 'primereact/card';

const HOST = process.env.NEXT_PUBLIC_HOST;
const INVOICE_MACAROON = process.env.NEXT_PUBLIC_INVOICE_MACAROON;

const TippingComponent = () => {
    const [invoice, setInvoice] = useState("");
    const [listenTimer, setListenTimer] = useState(3600);

    const pollingIntervalRef = useRef(null);
    const timerIntervalRef = useRef(null);

    const { showToast } = useToast();

    const listenForPayment = async (currentUnixTimestamp) => {
        try {
            const { data } = await axios.get(`${HOST}/v1/invoices?creation_date_start=${currentUnixTimestamp}`, {
                headers: { "Grpc-Metadata-macaroon": INVOICE_MACAROON }
            });
            data.invoices?.forEach((inv) => {
                if (inv.settled) {
                    showToast('success', 'Payment Settled', 'The payment has been settled');
                    resetState();
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    const startPolling = (currentUnixTimestamp) => {
        pollingIntervalRef.current = setInterval(() => listenForPayment(currentUnixTimestamp), 2000);
        timerIntervalRef.current = setInterval(() => setListenTimer((prev) => prev - 1), 1000);

        setTimeout(() => {
            clearInterval(pollingIntervalRef.current);
            clearInterval(timerIntervalRef.current);
            resetState();
        }, 3600000);
    };

    const resetState = () => {
        clearInterval(pollingIntervalRef.current);
        clearInterval(timerIntervalRef.current);
        setListenTimer(3600);
        setInvoice("");
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    useEffect(() => {
        return () => {
            clearInterval(pollingIntervalRef.current);
            clearInterval(timerIntervalRef.current);
        };
    }, []);

    return (
        <Card className="md:w-[70vw] lg:w-[50vw] w-[90vw] flex flex-col justify-center p-4">
            <TippingForm setInvoice={setInvoice} invoice={invoice} startPolling={startPolling} />
            {invoice ? (
                <TippingDisplay
                    invoice={invoice}
                    listenTimer={listenTimer}
                    formatTime={formatTime}
                />
            ) : (
                <PastTips />
            )}
        </Card>
    );
};

export default TippingComponent;
