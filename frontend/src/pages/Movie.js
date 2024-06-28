import React, { useState } from 'react';
import WordCloud from 'react-wordcloud';
import { Chart } from 'react-google-charts';
import Tesseract from 'tesseract.js';
 // Make sure to import the CSS file

export default function Amazon() {
    const [wordFrequencies, setWordFrequencies] = useState([]);
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');
    const [counts, setCounts] = useState(null); 
    const [loading, setLoading] = useState(false); 
    const [image, setImage] = useState(null);
    const [text, setText] = useState('');
    const [prediction, setPrediction] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        setLoading(true); 

        try {
            const res = await fetch('http://localhost:5000/movie', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                setResponse(JSON.stringify(data, null, 2));
                setError('');
                const words = Object.entries(data.word_frequencies).map(([text, value]) => ({ text, value }));
                setWordFrequencies(words);
                setCounts(data.counts);
            } else {
                const errorText = await res.text();
                setError(`Error: ${res.status} ${res.statusText} - ${errorText}`);
                setResponse('');
                setWordFrequencies([]);
                setCounts(null); 
            }
        } catch (error) {
            setError(`Fetch error: ${error.message}`);
            setResponse('');
            setWordFrequencies([]);
            setCounts(null); 
        } finally {
            setLoading(false); 
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setLoading(true); 
            setImage(URL.createObjectURL(file));
            await extractTextFromImage(file);
            setLoading(false); 
        }
    };

    const extractTextFromImage = async (imageFile) => {
        try {
            const { data: { text } } = await Tesseract.recognize(imageFile, 'eng');
            setText(text);
        } catch (error) {
            console.error(error);
        }
    };

    const handleTextPrediction = async () => {
        setLoading(true); 
        try {
            const res = await fetch('http://localhost:5000/moviepred', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }), 
            });
            if (res.ok) {
                const data = await res.json();
                setPrediction(data.prediction);
            } else {
                setError(`Prediction Error: ${res.status} ${res.statusText}`);
                setPrediction('');
            }
        } catch (error) {
            setError(`Prediction Fetch error: ${error.message}`);
            setPrediction('');
        } finally {
            setLoading(false); 
        }
    };

    const options = {
        rotations: 2,
        rotationAngles: [-90, 0],
        fontSizes: [35, 65],  
        colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#ff0000"], 
        fontWeight: 'bold', 
        enableOptimizations: true,
        deterministic: false,
    };

    const chartData = [
        ['Sentiment', 'Count', { role: 'style' }],
        ['Positive ( > 0.5 )', counts?.greater_than_0_5 || 0, '#4caf50'],
        ['Negative ( < 0.5 )', counts?.less_than_0_5 || 0, '#f44336'],
    ];

    const chartOptions = {
        title: 'Sentiment Analysis',
        chartArea: { width: '50%' },
        hAxis: {
            title: 'Count',
            minValue: 0,
        },
        vAxis: {
            title: 'Sentiment',
        },
    };

    return (
        <div className="container">
            <h1>Sentiment Analysis</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="file" name="file" accept=".csv" />
                <button type="submit">Upload</button>
            </form>
            <div className="input-container">
                <input type="file" onChange={handleFileChange} />
                {loading && <p>Loading...</p>}
                {image && <img src={image} alt="Uploaded" className="image-preview" />}
            </div>
            <div className="prediction-container">
                <h2>Enter Text for Prediction</h2>
                <textarea value={text} onChange={(e) => setText(e.target.value)}></textarea>
                <button onClick={handleTextPrediction}>Predict</button>
                {prediction && <p>Prediction: {prediction}</p>}
            </div>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {wordFrequencies.length > 0 && (
                <div className="WordCloud">
                    <WordCloud words={wordFrequencies} options={options} />
                </div>
            )}
            {counts && (
                <div className="Chart">
                    <Chart
                        chartType="BarChart"
                        width="100%"
                        height="400px"
                        data={chartData}
                        options={chartOptions}
                    />
                </div>
            )}
        </div>
    );
}
