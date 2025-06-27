


import React, { useState } from "react";
import axios from "axios";

const ShortenForm = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortened, setShortened] = useState("");
  const [qrCode, setQrCode] = useState(""); // ✅ new
  const [error, setError] = useState("");

 const handleShorten = async () => {
  try {
    const response = await axios.post("http://localhost:5000/shorten", { originalUrl });

    setShortened(response.data.shortUrl);
    setQrCode(response.data.qrCode);
    setError("");
  } catch (error) {
    setShortened("");
    setQrCode("");
    setError(error.response?.data?.error || "Something went wrong");
  }
};8
  return (
    <div style={{ padding: "20px" }}>
      <h2>URL Shortener</h2>
      <input
        type="text"
        placeholder="Enter URL"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        style={{ width: "300px", padding: "8px" }}
      />
      <button onClick={handleShorten} style={{ marginLeft: "10px", padding: "8px 12px" }}>
        Shorten
      </button>

      {shortened && (
        <div style={{ marginTop: "20px" }}>
          <strong>Shortened URL:</strong>{" "}
          <a href={shortened} target="_blank" rel="noopener noreferrer">
            {shortened}
          </a>
          <div style={{ marginTop: "10px" }}>
            <strong>QR Code:</strong><br />
            <img src={qrCode} alt="QR Code" style={{ marginTop: "10px" }} />
          </div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "20px", color: "red" }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default ShortenForm;
