import sys
import json
import pickle
import numpy as np
import pandas as pd
import re
import nltk
from collections import Counter
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer

nltk.download("punkt")

def main(file_path):
    # Load the data
    df = pd.read_csv(file_path)
    df1 = df.tail(50)
    df2 = df.head(50)
    df = pd.concat([df1, df2])  # Limiting to the first 10 rows for testing

    # Load the models
    model = pickle.load(open("models/tweet_pred_word2vec.sav", "rb"))
    rf = pickle.load(open("models/tweet_pred_senti.sav", "rb"))

    eng_stopwords = stopwords.words("english")

    # Define preprocessing functions
    def con_low(text):
        return text.lower()

    def remove_pun(text):
        punctuation_pattern = r"[^\w\s]"
        text_no_punct = re.sub(punctuation_pattern, "", text)
        return text_no_punct

    def remove_stopwords(text):
        words = text.split()
        new_word = [word for word in words if word not in eng_stopwords]
        new_text = " ".join(new_word)
        return new_text

    def stem(text):
        stemmer = PorterStemmer()
        stemmed_text = " ".join(stemmer.stem(word) for word in text.split())
        return stemmed_text

    def remove_html_tags(text):
        clean_text = re.sub(r"<[^>]+>", "", text)
        return clean_text

    def preprocess(value):
        value = con_low(value)
        value = remove_pun(value)
        value = remove_stopwords(value)
        value = remove_html_tags(value)
        value = stem(value)
        return value

    def document_con(doc):
        doc = [word for word in doc.split() if word in model.wv.index_to_key]
        if not doc:
            return np.zeros(model.vector_size)
        return np.mean(model.wv[doc], axis=0)

    def predict(text):
        processed_text = preprocess(text)
        doc_vector = document_con(processed_text)
        prediction = rf.predict([doc_vector])
        return prediction[0]

    # Apply prediction to each row in the CSV
    predictions = []
    for value in df['tweet']:  # Replace 'tweet' with the actual name of the column containing text data
        result = predict(value)
        predictions.append(result)

# Count the predictions
    count_greater_than_0_5 = sum(1 for p in predictions if p > 0.5)
    count_less_than_0_5 = sum(1 for p in predictions if p < 0.5)

    # Combine all text for word frequency analysis
    all_text = ' '.join(df['tweet'])
    all_text = preprocess(all_text)
    word_list = all_text.split()
    word_counts = Counter(word_list)

    # Get the most common words
    most_common_words = word_counts.most_common(20)  # Adjust the number as needed
    word_freq = {word: count for word, count in most_common_words}

    # Output the results
    result = {
        'counts': {
            'greater_than_0_5': count_greater_than_0_5,
            'less_than_0_5': count_less_than_0_5
        },
        'word_frequencies': word_freq
    }

    print(json.dumps(result))


if __name__ == "__main__":
    file_path = sys.argv[1]
    main(file_path)
