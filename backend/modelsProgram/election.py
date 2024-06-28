import sys
import json
import pickle
import numpy as np
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer

nltk.download("punkt")

# Load the models
model = pickle.load(open("models/election_pred_word2vec.sav", "rb"))
rf = pickle.load(open("models/elction_pred_senti.sav", "rb"))
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

# Main prediction function
def predict(text):
    processed_text = preprocess(text)
    doc_vector = document_con(processed_text)
    prediction = rf.predict([doc_vector])
    return prediction.tolist()

# Read input data from command-line arguments
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <text>")
        sys.exit(1)
        
    value = sys.argv[1]
    result = predict(value)
    print(json.dumps({'prediction': result}))
