// urlModel.js
const { pool } = require("./dbConfig");
const nanoid = require("nanoid");

const generateShortId = () => {
  // Implement your logic for generating short IDs (e.g., using nanoid)
  return nanoid(8);
};

const createShortUrl = async (fullUrl, userId) => {
  const shortUrl = generateShortId();

  try {
    const result = await pool.query(
      "INSERT INTO short_links (full_url, short_url, user_id) VALUES ($1, $2, $3) RETURNING *",
      [fullUrl, shortUrl, userId]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error creating short URL:", error);
    throw error;
  }
};

const getAllShortUrls = async (userId) => {
  try {
    const result = await pool.query(
      "SELECT * FROM short_links WHERE user_id = $1",
      [userId]
    );

    return result.rows;
  } catch (error) {
    console.error("Error fetching short URLs:", error);
    throw error;
  }
};

const getShortUrlByShortUrl = async (shortUrl) => {
  try {
    const result = await pool.query(
      "SELECT * FROM short_links WHERE short_url = $1",
      [shortUrl]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error fetching short URL:", error);
    throw error;
  }
};

module.exports = {
  createShortUrl,
  getAllShortUrls,
  getShortUrlByShortUrl,
};
