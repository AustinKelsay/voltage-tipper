import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import TippingForm from "./TippingForm";
import TippingDisplay from "./TippingDisplay";
import PastTips from "./PastTips";
import { useToast } from "@/hooks/useToast";
import { Card } from 'primereact/card';

// Environment variables for API configuration
const HOST = process.env.NEXT_PUBLIC_HOST;
const INVOICE_MACAROON = process.env.NEXT_PUBLIC_INVOICE_MACAROON;

const TippingComponent = () => {
    // State for storing the invoice and timer
    const [invoice, setInvoice] = useState("");
    const [listenTimer, setListenTimer] = useState(3600);

    // Refs for storing interval IDs
    const pollingIntervalRef = useRef(null);
    const timerIntervalRef = useRef(null);

    // Custom hook for displaying toast notifications
    const { showToast } = useToast();

    // Function to check for payment settlement
    const listenForPayment = async (currentUnixTimestamp) => {
        try {
            // Fetch invoices from the API
            const { data } = await axios.get(`${HOST}/v1/invoices?creation_date_start=${currentUnixTimestamp}`, {
                headers: { "Grpc-Metadata-macaroon": INVOICE_MACAROON }
            });
            // Check if any invoice is settled
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

    // Function to start polling for payment and update timer
    const startPolling = (currentUnixTimestamp) => {
        // Start polling for payment every 2 seconds
        pollingIntervalRef.current = setInterval(() => listenForPayment(currentUnixTimestamp), 2000);
        // Update timer every second
        timerIntervalRef.current = setInterval(() => setListenTimer((prev) => prev - 1), 1000);

        // Stop polling and reset state after 1 hour
        setTimeout(() => {
            clearInterval(pollingIntervalRef.current);
            clearInterval(timerIntervalRef.current);
            resetState();
        }, 3600000);
    };

    // Function to reset component state
    const resetState = () => {
        clearInterval(pollingIntervalRef.current);
        clearInterval(timerIntervalRef.current);
        setListenTimer(3600);
        setInvoice("");
        resetForm(); // Call resetForm here
    };

    // Function to reset form
    const resetForm = () => {
        // This function will be passed to TippingForm
    };

    // Function to format time in HH:MM:SS
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Cleanup intervals on component unmount
    useEffect(() => {
        return () => {
            clearInterval(pollingIntervalRef.current);
            clearInterval(timerIntervalRef.current);
        };
    }, []);

    return (
        <Card className="md:w-[70vw] lg:w-[50vw] w-[90vw] flex flex-col justify-center p-4">
            {/* Form for creating a new invoice */}
            <TippingForm setInvoice={setInvoice} invoice={invoice} startPolling={startPolling} resetForm={resetForm} />
            {invoice ? (
                // Display invoice and timer when an invoice exists
                <TippingDisplay
                    invoice={invoice}
                    listenTimer={listenTimer}
                    formatTime={formatTime}
                />
            ) : (
                // Display past tips when no current invoice
                <PastTips />
            )}
        </Card>
    );
};

export default TippingComponent;