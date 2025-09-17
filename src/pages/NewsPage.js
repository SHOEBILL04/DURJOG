import { useEffect, useState } from "react";
import axios from "axios";

export default function NewsPage() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/updates")
      .then(res => setNews(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Latest News</h2>
      <ul>
        {news.map(item => (
          <li key={item._id}>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
            {item.link && <a href={item.link} target="_blank" rel="noreferrer">Read more</a>}
          </li>
        ))}
      </ul>
    </div>
  );
}
