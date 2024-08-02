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
            <span className="text-center text-sm">expires in</span>
            <p className="text-center text-2xl pt-0 mt-0">{formatTime(listenTimer)}</p>
            <div className="mx-auto w-fit m-4 border-2 rounded-lg bg-white p-2 cursor-pointer hover:opacity-75" onClick={copyToClipboard}>
                <QRCodeSVG size={350} value={invoice} />
                {/* Only show first 5 chars and last 5 chars with ... in the middle */}
                <p className="text-black text-center my-0 text-xl">{invoice.slice(0, 10) + "..." + invoice.slice(-10)}</p>
                <p className="text-center text-xs pt-0 text-black">Click to copy</p>
            </div>
        </div>
    );
};

export default TippingDisplay;
