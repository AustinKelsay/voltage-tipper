import React, { useState, useEffect } from "react";
import axios from "axios";
import TippingComponent from "@/components/TippingComponent";

const MACAROON = process.env.NEXT_PUBLIC_READ_MACAROON;
const HOST = process.env.NEXT_PUBLIC_HOST;

export default function Home() {
  const [nodeInfo, setNodeInfo] = useState({});
  const [lnurl, setLnurl] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");

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

  useEffect(() => {
    axios.get('/api/getlnurl')
      .then((res) => {
        setLnurl(res.data.lnurl)
      })
      .catch((err) => {
        console.log(err)
      })

      // grab the current url and format it for our lightning address display
      const currentUrl = window.location.href.trim().replace('http://', '').replace('https://', '').replace(/\/$/, '');
      setCurrentUrl(currentUrl);
  }, [nodeInfo]);

  return (
    <main
      className={"flex min-h-screen flex-col items-center"}
    >
      {
        nodeInfo?.alias && lnurl && currentUrl && (
          <>
            <h1 className="text-4xl font-bold">{nodeInfo?.alias}&apos;s tipping page</h1>
            <div className="flex flex-col mx-auto">
              <span className="text-center text-sm">Lightning Address:</span>
              <p className="text-center mt-0 pt-0">{nodeInfo?.alias}@{currentUrl}</p>
              <span className="text-center text-sm">LNURL:</span>
              <p className="text-center mt-0 pt-0">{lnurl}</p>
            </div>
            <TippingComponent />
          </>
        )
      }
    </main>
  );
}
