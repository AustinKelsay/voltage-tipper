import React, { useEffect } from "react";
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from "@/hooks/useToast";

const TippingDisplay = ({ invoice, listenTimer, formatTime }) => {
    const { showToast } = useToast();

    const copyToClipboard = () => {
        if (invoice) {
            navigator.clipboard.writeText(invoice);
            showToast('success', 'Copied', 'Invoice copied to clipboard');
        }
    };

    return (
        <div className="flex flex-col justify-center bg-slate-600 rounded-md p-2">
            <p className="text-center text-2xl">{formatTime(listenTimer)}</p>
            <div className="mx-auto w-fit m-4 border-2 rounded-lg bg-white p-2">
                <QRCodeSVG className="cursor-pointer hover:opacity-75" onClick={copyToClipboard} size={400} value={invoice} />
            </div>
        </div>
    );
};

export default TippingDisplay;
