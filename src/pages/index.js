import React, { useState, useEffect } from "react";
import axios from "axios";
import TippingComponent from "@/components/TippingComponent";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useToast } from "@/hooks/useToast";

// Environment variables for API configuration
const MACAROON = process.env.NEXT_PUBLIC_READ_MACAROON;
const HOST = process.env.NEXT_PUBLIC_HOST;

export default function Home() {
  // State variables for node info, LNURL, and current URL
  const [nodeInfo, setNodeInfo] = useState({});
  const [lnurl, setLnurl] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");

  // Custom hook for displaying toast notifications
  const { showToast } = useToast();

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('success', 'Copied', 'Copied to clipboard');
    }).catch((err) => {
      console.log(err);
    })
  };

  // Fetch node information on component mount
  useEffect(() => {
    axios.get(`${HOST}/v1/getinfo`, {
      headers: {
        "Grpc-Metadata-macaroon": MACAROON
      }
    }).then((res) => {
      setNodeInfo(res.data)
    }).catch((err) => {
      console.log(err)
    })
  }, []);

  // Fetch LNURL and set current URL when node info is available
  useEffect(() => {
    axios.get('/api/getlnurl')
      .then((res) => {
        setLnurl(res.data.lnurl)
      })
      .catch((err) => {
        console.log(err)
      })

    // Format the current URL for lightning address display
    const currentUrl = window.location.href.trim().replace('http://', '').replace('https://', '').replace(/\/$/, '');
    setCurrentUrl(currentUrl);
  }, [nodeInfo]);

  return (
    <main
      className={"flex min-h-screen flex-col items-center"}
    >
      {nodeInfo?.alias && lnurl && currentUrl && (
        <>
          {/* Header section with node alias */}
          <div className="text-center mb-8 w-full max-w-2xl">
            <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              {nodeInfo?.alias}&apos;s Tipping Page
            </h1>
            <div className="w-full mx-auto max-sm:w-[90vw] space-y-4">
              {/* Lightning Address display and copy button */}
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-sm mb-2">Lightning Address:</span>
                <div className="p-inputgroup">
                  <InputText
                    value={`${nodeInfo?.alias}@${currentUrl}`}
                    readOnly
                    className="w-full"
                  />
                  <Button
                    icon="pi pi-copy"
                    onClick={() => copyToClipboard(`${nodeInfo?.alias}@${currentUrl}`)}
                    className="p-button-warning"
                  />
                </div>
              </div>
              {/* LNURL display and copy button */}
              <div className="flex flex-col items-center">
                <span className="text-gray-400 text-sm mb-2">LNURL:</span>
                <div className="p-inputgroup">
                  <InputText
                    value={lnurl}
                    readOnly
                    className="w-full"
                  />
                  <Button
                    icon="pi pi-copy"
                    onClick={() => copyToClipboard(lnurl)}
                    className="p-button-warning"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Tipping component */}
          <TippingComponent />
        </>
      )}
    </main>
  );
}