import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primeicons/primeicons.css';

const HOST = process.env.NEXT_PUBLIC_HOST;
const INVOICE_MACAROON = process.env.NEXT_PUBLIC_READ_MACAROON;

const PastTips = () => {
    const [tips, setTips] = useState([]);

    useEffect(() => {
        const fetchTips = () => {
            axios.get(`${HOST}/v1/invoices`, {
                headers: {
                    "Grpc-Metadata-macaroon": INVOICE_MACAROON
                }
            }).then((res) => {
                if (res.data.invoices && res.data.invoices.length > 0) {
                    const filteredTips = res.data.invoices
                        .filter(inv => inv.memo.includes("voltage-tipper") && inv.state === "SETTLED")
                        .map(inv => ({
                            ...inv,
                            memo: inv.memo.replace("voltage-tipper", "").trim()
                        }));
                    console.log("poll", filteredTips);
                    const sortedTips = filteredTips.sort((a, b) => b.creation_date - a.creation_date);
                    setTips(sortedTips);
                }
            }).catch((err) => {
                console.log(err);
            });
        };

        // Fetch tips immediately when component mounts
        fetchTips();

        // Set interval to fetch tips every 5 seconds
        const intervalId = setInterval(fetchTips, 5000);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col justify-start">
            {tips.length > 0 && (
                <DataTable value={tips} paginator rows={5} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="value" header="Amount"></Column>
                    <Column field="memo" header="Memo"></Column>
                    <Column 
                        field="creation_date" 
                        header="Date" 
                        body={(rowData) => new Date(rowData.creation_date * 1000).toLocaleString()}
                    ></Column>
                </DataTable>
            )}
        </div>
    )
}

export default PastTips;
