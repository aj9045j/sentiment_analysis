# Twitter Sentiment Analysis

A full-stack application for analyzing sentiment in tweets, featuring a machine learning model built with Python, a React.js frontend, and an Express.js backend.

## Project Overview
This project performs sentiment analysis on tweets using natural language processing and machine learning techniques. The system classifies tweets as either positive or negative based on their content.

## Repository Structure
```
sentiment_analysis/
├── backend/              # Express.js server
├── frontend/             # React.js application
├── .gitattributes        
├── .gitignore
└── tweet_sentiment.ipynb # Core sentiment analysis notebook
```

## Features
- Tweet sentiment classification (positive/negative)
- User-friendly interface to input and analyze tweets
- Visualization of sentiment analysis results
- Fast and accurate sentiment predictions

## Technologies Used

### Machine Learning (Python)
- **Natural Language Processing**: NLTK for text processing
- **Word Embeddings**: Word2Vec for text representation
- **Machine Learning**: Random Forest Regressor for sentiment classification
- **Data Preprocessing**: Custom cleaning, lemmatization, stopword removal
- **Dependencies**: pandas, numpy, nltk, spellchecker, emoji, gensim, scikit-learn

### Frontend (React)
- React.js for building the user interface
- Responsive design for mobile and desktop
- Interactive visualizations for sentiment results
- Form handling for tweet submission

### Backend (Express)
- Express.js for API endpoints
- Integration with the trained machine learning model
- RESTful API design


## Installation and Setup


### Machine Learning Model
The core machine learning model is developed in the Jupyter notebook:
```
tweet_sentiment.ipynb
```

### Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the server
node server.js
```

### Frontend Setup
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

## Model Training Process
The sentiment analysis model was trained using a dataset of 1.6 million tweets. The training process includes:

1. **Data Preprocessing**:
   - Removing URLs, mentions, HTML tags, punctuation, and emojis
   - Converting text to lowercase
   - Lemmatization
   - Stopword removal

2. **Feature Engineering**:
   - Word2Vec embeddings (300-dimensional vectors)
   - Document vector representation through mean embedding values

3. **Model Training**:
   - Random Forest Regressor model
   - Binary classification (0 for negative, 4 for positive sentiment)

4. **Model Evaluation**:
   - Accuracy metrics to evaluate performance


## Usage
1. Navigate to the application in your web browser
2. Enter a tweet in the text input field
3. Click "Analyze" to get the sentiment prediction
4. View the analysis results and visualizations

## Future Improvements
- Support for multi-class sentiment classification
- Real-time Twitter integration
- Enhanced visualizations and analytics
- Support for multiple languages
- User authentication system

