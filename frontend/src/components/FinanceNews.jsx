import React, { useEffect, useState } from 'react'

function FinanceNews() {
    const [news, setNews] = useState([])

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(
                    `https://finnhub.io/api/v1/news?category=general&token=cv7r0mpr01qpecih6h5gcv7r0mpr01qpecih6h60` //api key
                )
                const data = await response.json()
                setNews(data.slice(0,3)); // limit to 3 news headlines 
            } catch (error) {
                console.error('Error fetching news:', error)
            }
        }
        fetchNews()
    }, [])

    return (
        <div className='finance-news'>
            <h2>Latest Finance News</h2>
            <hr></hr>
            <ul>
                {news.map((article, index) => (
                    <li key={index}>
                        <a href={article.url} target='_blank' rel='noopener noreferrer'>
                            {article.headline}
                        </a>
                        <p>{article.summary}</p>
                        <hr></hr>
                    </li>
                    
                ))}
            </ul>
        </div>
    )
}

export default FinanceNews