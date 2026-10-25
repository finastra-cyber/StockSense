
import os
from datetime import datetime, timedelta, timezone

import pandas as pd
import requests
from dotenv import load_dotenv
from transformers import pipeline


# --------------------------------------------------
# 1. LOAD API KEY
# --------------------------------------------------

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

if not NEWS_API_KEY or NEWS_API_KEY == " 09459f6a3c4d417e88c6f0eeddc409cd":
    raise ValueError(
        "NewsAPI key missing. Add your key to the .env file."
    )


# --------------------------------------------------
# 2. INDIAN STOCKS AVAILABLE FOR SEARCH
# --------------------------------------------------

STOCKS = {
    "1": "Reliance Industries",
    "2": "Tata Consultancy Services",
    "3": "Infosys",
    "4": "HDFC Bank",
    "5": "ICICI Bank",
    "6": "State Bank of India",
    "7": "Bharti Airtel",
    "8": "Larsen & Toubro",
}


# --------------------------------------------------
# 3. FETCH NEWS FROM NEWSAPI
# --------------------------------------------------

def fetch_news(company_name, page_size=30):
    url = "https://newsapi.org/v2/everything"

    # Fetch news from the last 7 days.
    today = datetime.now(timezone.utc).date()
    start_date = today - timedelta(days=7)

    params = {
        "q": f'"{company_name}"',
        "searchIn": "title,description",
        "from": start_date.isoformat(),
        "to": today.isoformat(),
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": page_size,
        "apiKey": NEWS_API_KEY,
    }

    response = requests.get(url, params=params, timeout=30)
    response.raise_for_status()

    data = response.json()

    if data.get("status") != "ok":
        raise RuntimeError(
            f"NewsAPI error: {data.get('message', 'Unknown error')}"
        )

    articles = []

    for article in data.get("articles", []):
        title = article.get("title") or ""
        description = article.get("description") or ""

        # Ignore removed articles and empty headlines.
        if not title.strip() or title == "[Removed]":
            continue

        # Combine the headline and description for analysis.
        text = f"{title}. {description}".strip()

        articles.append({
            "company": company_name,
            "source": (article.get("source") or {}).get("name", ""),
            "published_at": article.get("publishedAt", ""),
            "title": title,
            "description": description,
            "url": article.get("url", ""),
            "text_for_analysis": text,
        })

    # Remove duplicate articles with the same URL.
    unique_articles = []
    seen_urls = set()

    for article in articles:
        article_url = article["url"]

        if article_url and article_url in seen_urls:
            continue

        if article_url:
            seen_urls.add(article_url)

        unique_articles.append(article)

    return unique_articles


# --------------------------------------------------
# 4. LOAD FINBERT
# --------------------------------------------------

def load_sentiment_model():
    print("\nLoading FinBERT...")
    print("The first run may take several minutes.")

    model = pipeline(
        "text-classification",
        model="ProsusAI/finbert",
        top_k=None,
    )

    print("FinBERT is ready.")
    return model


# --------------------------------------------------
# 5. ANALYSE THE SENTIMENT OF EACH ARTICLE
# --------------------------------------------------

def analyse_sentiment(articles, model):
    if not articles:
        return []

    texts = [
        article["text_for_analysis"]
        for article in articles
    ]

    predictions = model(
        texts,
        batch_size=8,
        truncation=True,
        max_length=256,
    )

    results = []

    for article, prediction in zip(articles, predictions):
        # FinBERT returns a probability for each sentiment.
        # Convert the results into a label-to-score dictionary.
        if isinstance(prediction, dict):
            prediction = [prediction]

        scores = {
            item["label"].lower(): float(item["score"])
            for item in prediction
        }

        positive = scores.get("positive", 0.0)
        negative = scores.get("negative", 0.0)
        neutral = scores.get("neutral", 0.0)

        predicted_label = max(scores, key=scores.get)

        # Score range is approximately -1 to +1.
        sentiment_score = positive - negative

        results.append({
            **article,
            "sentiment": predicted_label,
            "positive_probability": round(positive, 4),
            "negative_probability": round(negative, 4),
            "neutral_probability": round(neutral, 4),
            "sentiment_score": round(sentiment_score, 4),
        })

    return results


# --------------------------------------------------
# 6. CALCULATE OVERALL NEWS SENTIMENT
# --------------------------------------------------

def calculate_overall_sentiment(results):
    if not results:
        return None

    scores = [
        item["sentiment_score"]
        for item in results
    ]

    average_score = sum(scores) / len(scores)

    # These are simple project-defined thresholds.
    if average_score > 0.05:
        overall_label = "Positive"
    elif average_score < -0.05:
        overall_label = "Negative"
    else:
        overall_label = "Neutral"

    return {
        "overall_sentiment": overall_label,
        "average_sentiment_score": round(average_score, 4),
        "articles_analysed": len(results),
        "positive_articles": sum(
            item["sentiment"] == "positive" for item in results
        ),
        "negative_articles": sum(
            item["sentiment"] == "negative" for item in results
        ),
        "neutral_articles": sum(
            item["sentiment"] == "neutral" for item in results
        ),
    }


# --------------------------------------------------
# 7. MAIN PROGRAM
# --------------------------------------------------

def main():
    print("\n===================================")
    print(" INDIAN STOCK NEWS SENTIMENT ANALYSIS")
    print("===================================\n")

    for number, company in STOCKS.items():
        print(f"{number}. {company}")

    choice = input("\nSelect a stock number: ").strip()

    if choice not in STOCKS:
        print("Invalid selection. Run the program again.")
        return

    company_name = STOCKS[choice]

    try:
        print(f"\nFetching news for {company_name}...")

        articles = fetch_news(company_name)

        if not articles:
            print("No matching news articles were found.")
            print("Try again later or choose another stock.")
            return

        print(f"Found {len(articles)} articles.")

        model = load_sentiment_model()

        print("\nAnalysing news sentiment...")
        results = analyse_sentiment(articles, model)

        summary = calculate_overall_sentiment(results)

        # Save article-level results to CSV.
        output_file = "sentiment_results.csv"

        dataframe = pd.DataFrame(results)
        dataframe.drop(
            columns=["text_for_analysis"],
            errors="ignore",
        ).to_csv(output_file, index=False, encoding="utf-8-sig")

        # Display overall summary.
        print("\n========== SENTIMENT SUMMARY ==========")
        print(f"Company: {company_name}")
        print(f"Overall sentiment: {summary['overall_sentiment']}")
        print(
            "Average sentiment score: "
            f"{summary['average_sentiment_score']}"
        )
        print(f"Articles analysed: {summary['articles_analysed']}")
        print(f"Positive articles: {summary['positive_articles']}")
        print(f"Negative articles: {summary['negative_articles']}")
        print(f"Neutral articles: {summary['neutral_articles']}")

        # Display article-level predictions.
        print("\n========== ARTICLE RESULTS ==========")

        for index, item in enumerate(results, start=1):
            print(f"\n{index}. {item['title']}")
            print(f"Source: {item['source']}")
            print(f"Sentiment: {item['sentiment'].upper()}")
            print(f"Score: {item['sentiment_score']}")
            print(f"Published: {item['published_at']}")
            print(f"URL: {item['url']}")

        print(f"\nResults saved to: {output_file}")

    except requests.exceptions.HTTPError as error:
        print(f"\nNewsAPI HTTP error: {error}")
        print("Check your API key, plan limits, and request parameters.")

        if error.response is not None:
            print(f"API response: {error.response.text[:500]}")

    except requests.exceptions.RequestException as error:
        print(f"\nCould not connect to NewsAPI: {error}")

    except Exception as error:
        print(f"\nAn error occurred: {error}")
        print(
            "Check the error message and installed library versions."
        )


if __name__ == "__main__":
    main()
