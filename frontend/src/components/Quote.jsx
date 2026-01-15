import { useEffect, useState } from "react";

const Quote = () => {
    const [quote, setQuote] = useState("");

    useEffect(() => {
        const fetchQuote = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/quote");
            const data = await response.json();
            setQuote(`${data[0].q} - ${data[0].a}`);
        } catch (error) {
            console.error("Error fetching quote:", error);
            setQuote('Quotes currently unavailable.')
        }
        };

        fetchQuote();
    }, []);





  return (
    <div className="p-4 text-center quoteDiv">
      <p className="text-lg font-semibold quoteText">"{quote}"</p>
    </div>
  );
};

export default Quote;
