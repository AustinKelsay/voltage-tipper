import React, { useState, useEffect } from "react";
import axios from "axios";
import TippingComponent from "@/components/TippingComponent";

const MACAROON = process.env.NEXT_PUBLIC_READ_MACAROON;
const HOST = process.env.NEXT_PUBLIC_HOST;

export default function Home() {
  const [nodeInfo, setNodeInfo] = useState({});

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

  return (
    <main
      className={"flex min-h-screen flex-col items-center"}
    >
      {
        nodeInfo?.alias && (
          <>
            <h1 className="text-4xl font-bold">{nodeInfo?.alias}&apos;s tipping page</h1>
            <TippingComponent />
          </>
        )
      }
    </main>
  );
}
