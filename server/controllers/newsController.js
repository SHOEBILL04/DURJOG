import News from "../models/News.js"; 

export const getNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createNews = async (req, res) => {
  try {
    const { title, content} = req.body;
    const news = new News({ title, content});
    await news.save();
    res.status(201).json(news);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};