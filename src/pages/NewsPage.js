import { useEffect, useState } from "react";
import axios from "axios";
import "./NewsPage.css"; 

export default function NewsPage() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/updates") 
      .then(res => setNews(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="news-container">
      <h2>Latest News</h2>
      <ul className="news-list">
        {news.map(item => (
          <li key={item._id} className="news-item">
            <h3>{item.title}</h3>
            <p>{item.content}</p>
            {item.link && <a href={item.link} target="_blank" rel="noreferrer">Read more</a>}
          </li>
        ))}
      </ul>
    </div>
  );
}