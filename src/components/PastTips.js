// Import necessary dependencies
import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primeicons/primeicons.css';

// Get environment variables
const HOST = process.env.NEXT_PUBLIC_HOST;
const INVOICE_MACAROON = process.env.NEXT_PUBLIC_READ_MACAROON;

const PastTips = () => {
    // State to store the list of tips
    const [tips, setTips] = useState([]);

    useEffect(() => {
        // Function to fetch tips from the API
        const fetchTips = async () => {
            try {
                // Get the last processed index from local storage
                const lastProcessedIndex = localStorage.getItem('lastProcessedIndex') || '0';
                // Calculate the timestamp for 1 month ago
                const oneMonthAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;

                // Make API request to get invoices
                const response = await axios.get(`${HOST}/v1/invoices`, {
                    headers: {
                        "Grpc-Metadata-macaroon": INVOICE_MACAROON
                    },
                    params: {
                        index_offset: lastProcessedIndex,
                        num_max_invoices: 1000,
                        reversed: true,
                        creation_date_start: oneMonthAgo
                    }
                });

                if (response.data.invoices && response.data.invoices.length > 0) {
                    // Filter and process the invoices
                    const filteredTips = response.data.invoices
                        .filter(inv => inv.memo.includes("voltage-tipper") && inv.state === "SETTLED")
                        .map(inv => ({
                            ...inv,
                            memo: inv.memo.replace("voltage-tipper", "").trim()
                        }));
                    // Sort tips by creation date
                    const sortedTips = filteredTips.sort((a, b) => b.creation_date - a.creation_date);
                    setTips(sortedTips);
                    
                    // Update the last processed index in local storage
                    if (response.data.last_index_offset) {
                        localStorage.setItem('lastProcessedIndex', response.data.last_index_offset);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };

        // Fetch tips initially and set up an interval to fetch every 30 seconds
        fetchTips();
        const intervalId = setInterval(fetchTips, 30000);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col justify-start">
            {tips.length > 0 && (
                // Display the tips in a DataTable
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