import React, { useState, useEffect } from "react";
import "./App.css";

interface NewsItem {
  id: number;
  content: string;
}

const App: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [content, setContent] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const savedNews = localStorage.getItem("news");

    if (savedNews) {
      try {
        const parsedNews: NewsItem[] = JSON.parse(savedNews);

        if (Array.isArray(parsedNews)) {
          setNews(parsedNews);
        }
      } catch (error) {
        console.error("Ошибка:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("news", JSON.stringify(news));
    }
  }, [news, isLoaded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if ( !content.trim()) return;

    if (editingId) {
      setNews(
        news.map((item) =>
          item.id === editingId ? { ...item, content } : item
        )
      );
      setEditingId(null);
    } else {
      const newNewsItem: NewsItem = {
          id: Date.now(),
          content,
      };
      setNews((prevNews) => [newNewsItem, ...prevNews]);
    }


    setContent("");
  };

  const handleEdit = (newsItem: NewsItem) => {
    setContent(newsItem.content);
    setEditingId(newsItem.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    setNews(news.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setContent("");
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Новостной блог</h1>
      </header>

      <main className="app-main">
        <form onSubmit={handleSubmit} className="news-form">
          <h2>{editingId ? "Редактировать новость" : "Добавить новость"}</h2>
                  <div className="form-group">
            <textarea
              placeholder="Содержание"
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setContent(e.target.value)
              }
              className="form-textarea"
              rows={4}
            />
          </div>
          <button
          className="bnt-submit"
            type="submit"
          >
            {editingId ? "Обновить" : "Добавить"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setContent("");
              }}
            >
              Отмена
            </button>
          )}
        </form>

        <div className="news-list">
          {news.length === 0 ? (
            <p className="no-news">Новостей не найдено</p>
          ) : (
            news.map((newsItem) => (
              <div key={newsItem.id} className="news-card">
                <p className="news-content">{newsItem.content}</p>
                <div className="news-actions">
                  <button onClick={() => handleEdit(newsItem)}>
                    Редактировать
                  </button>
                  <button onClick={() => handleDelete(newsItem.id)}>
                    Удалить
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
