import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

import * as d3 from 'd3'



const Reports = () => {
   
    const [data, setData] = useState([])

    useEffect(() => {
        fetch('http://localhost:8000/api/expenses/report') // Update w/ backend url
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.error('Error fetching data', error))
    }, [])


    const getPinkPurplePalette = (index, totalColors) => {
        // function to generate multiple pink shades for the pie chart without repeating the same color pink. starting from lightpink to darkpink
        const pinkPalatte = d3.interpolateRgb('#ff8da1', '#8b005e') // medium pink to dark pink
        const purplePalette = d3.interpolateRgb('#d88fd8', '#4b0082') // light purple to dark purple

        // create a color palette that combines both pink and purple palettes
        const combinedColorPalette = d3.scaleSequential((t) => 
            t<0.5 ? pinkPalatte(t * 2) : purplePalette((t - 0.5) * 2)
        ).domain([0, 1])

        return combinedColorPalette(index / (totalColors - 1))
    }

    return (
        <div>
            {/* <h2 className='text-2xl font-bold mb-4'> Expense Report</h2> */}
            <PieChart width={400} height={400}>
                {/* Main Pie Chart */}
                <Pie
                data={data}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={150}
                // fill="#8884d8"
                label
                isAnimationActive={true} // enables animation to fade in smoothly when page loads
                animationDuration={800} // customize the animation speed
                >
                {/* Map through the data and assign colors dynamically */}
                {data.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        fill={getPinkPurplePalette(index, data.length)} 
                        style={{
                            filter: 'drop-shadow(6px 5px 8px rgba(195, 21, 152, 0.71))', // adds a shadow effect to each pie slice
                            // transform: `scale(${index % 2 === 0 ? 1.1 : 1})`, // helps for each pie slice to stand out
                        }}
                    />
                ))}
                </Pie>
                
                {/* Tooltip for detailed hover information */}
                <Tooltip 
                    content={({ payload }) => {
                    if (!payload || payload.length === 0) return null;
                    return (
                    <div style={{
                        backgroundColor: "#fff",
                        padding: "10px",
                        borderRadius: "8px",
                        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)"
                    }}>
                        <p style={{ fontWeight: "bold", color: payload[0].payload.fill }}>
                        {payload[0].payload.category}: ${payload[0].value.toFixed(2)}
                        </p>
                    </div>
                    );
                }}  
                />
                
                {/* Legend to describe the categories */}
                <Legend 
                    style={{
                        marginBottom: '20px'
                    }}
                />
            </PieChart>
        </div>
    )
}



export default Reports;