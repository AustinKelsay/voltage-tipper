// Import necessary dependencies
import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primeicons/primeicons.css';

// Get environment variables for LND node connection
const HOST = process.env.NEXT_PUBLIC_HOST; // The host address of the LND node
const INVOICE_MACAROON = process.env.NEXT_PUBLIC_READ_MACAROON; // Macaroon for authentication with read-only permissions

const PastTips = () => {
    // State to store the list of tips
    const [tips, setTips] = useState([]);

    useEffect(() => {
        const fetchTips = async () => {
            try {
                // Make a GET request to the LND invoices endpoint
                const response = await axios.get(`${HOST}/v1/invoices`, {
                    headers: {
                        // Include the macaroon in the request headers for authentication
                        "Grpc-Metadata-macaroon": INVOICE_MACAROON
                    },
                    params: {
                        // Request parameters for the LND API
                        pending_only: false, // Include both settled and unsettled invoices
                        num_max_invoices: 1000, // Request up to 1000 invoices (adjust as needed)
                        reversed: true // Get most recent invoices first
                    }
                });

                // Check if invoices were returned in the response
                if (response.data.invoices && response.data.invoices.length > 0) {
                    // Process and filter the invoices
                    const filteredTips = response.data.invoices
                        // Filter for settled invoices with the "voltage-tipper" memo
                        .filter(inv => inv.state === "SETTLED" && inv.memo.includes("voltage-tipper"))
                        .reverse()
                        .map(inv => ({
                            ...inv,
                            // Remove the "voltage-tipper" text from the memo
                            memo: inv.memo.replace("voltage-tipper", "").trim()
                        }));
                    
                    // Update the state with the filtered tips
                    setTips(filteredTips);
                }
            } catch (err) {
                console.error("Error fetching invoices from LND:", err);
            }
        };

        // Initial fetch of tips
        fetchTips();

        // Set up an interval to fetch tips every minute
        const intervalId = setInterval(fetchTips, 60000);

        // Clean up the interval when the component unmounts
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
                        // Convert the Unix timestamp to a readable date string
                        body={(rowData) => new Date(rowData.creation_date * 1000).toLocaleString()}
                    ></Column>
                </DataTable>
            )}
        </div>
    )
}

export default PastTips;