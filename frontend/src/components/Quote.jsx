import { useEffect, useState } from "react";
import { API_BASE_URL } from "../lib/api";

const Quote = () => {
    const [quote, setQuote] = useState("");
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/quote`);
                if (!response.ok) {
                    throw new Error(`Quote request failed: ${response.status}`);
                }
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    setQuote(`${data[0].q} - ${data[0].a}`);
                    setStatus("ready");
                } else {
                    setQuote("Quotes currently unavailable.");
                    setStatus("error");
                }
            } catch (error) {
                console.error("Error fetching quote:", error);
                setQuote("Quotes currently unavailable.");
                setStatus("error");
            }
        };

        fetchQuote();
    }, []);





  return (
    <div className="p-4 text-center quoteDiv">
      <p className="text-lg font-semibold quoteText">
        {status === "loading" ? "Loading quote..." : `"${quote}"`}
      </p>
    </div>
  );
};

export default Quote;
