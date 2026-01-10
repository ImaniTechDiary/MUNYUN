import { useEffect, useState } from "react";

const Quote = () => {
    const [quote, setQuote] = useState("");

    useEffect(() => {
        const fetchQuote = async () => {
        try {
            const response = await fetch("http://api.quotable.io/random"); // figure out how to use https with this api later since running into error
            const data = await response.json();
            setQuote(`${data.content} - ${data.author}`);
        } catch (error) {
            console.error("Error fetching quote:", error);
        }
        };

        fetchQuote();
    }, []);

    useEffect (() => {
        const fetchQuote = async () => {
            try {
                const response = await fetch('https://api.quotable.io/random')
                const data = await response.json()
            } catch (error) {
                console.error
            }
        }
    })





  return (
    <div className="p-4 text-center">
      <p className="text-lg font-semibold">"{quote}"</p>
    </div>
  );
};

export default Quote;
