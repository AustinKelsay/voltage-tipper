import React, { useEffect } from "react";
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from "@/hooks/useToast";

// Component for displaying tipping information and QR code
const TippingDisplay = ({ invoice, listenTimer, formatTime }) => {
    // Hook for showing toast notifications
    const { showToast } = useToast();

    // Function to copy invoice to clipboard and handle WebLN payment
    const copyToClipboard = async () => {
        try {
            // Copy invoice to clipboard
            await navigator.clipboard.writeText(invoice);
            showToast('success', 'Copied', 'Invoice copied to clipboard');

            // Check if WebLN is available and attempt to pay
            // https://webln.guide/
            if (window && window?.webln && window?.webln?.sendPayment) {
                showToast('info', 'Opening WebLN Wallet', 'Opening WebLN Wallet to pay invoice');
                await window.webln.enable();
                const result = await window.webln.sendPayment(invoice);
                if (result && result?.preimage) {
                    showToast('success', 'Success', 'Invoice paid');
                }
            }
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        // Main container for the tipping display
        <div className="flex flex-col justify-center bg-slate-600 rounded-md p-2">
            {/* Timer display */}
            <span className="text-center text-sm">expires in</span>
            <p className="text-center text-2xl pt-0 mt-0">{formatTime(listenTimer)}</p>
            
            {/* QR code container */}
            <div className="mx-auto w-fit m-2 border-2 rounded-lg bg-white p-2 cursor-pointer hover:opacity-75" onClick={copyToClipboard}>
                {/* QR code for the invoice */}
                <QRCodeSVG size={300} value={invoice} />
                {/* Display truncated invoice string */}
                {/* Only show first 5 chars and last 5 chars with ... in the middle */}
                <p className="text-black text-center my-0 text-xl">{invoice.slice(0, 10) + "..." + invoice.slice(-10)}</p>
                <p className="text-center text-xs pt-0 text-black">Click to copy</p>
            </div>
        </div>
    );
};

export default TippingDisplay;