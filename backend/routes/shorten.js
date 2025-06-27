
// import express from "express";
// import ShortUrl from "../models/ShortUrl.js";
// import { nanoid } from "nanoid";
// import QRCode from "qrcode"; 
// const router = express.Router();

// router.post("/shorten", async (req, res) => {
//   try {
//     const { originalUrl } = req.body;

//     if (!originalUrl) {
//       return res.status(400).json({ error: "Original URL is required" });
//     }

//     try {
//       new URL(originalUrl);
//     } catch (err) {
//       return res.status(400).json({ error: "Invalid URL format" });
//     }

//     const existingUrl = await ShortUrl.findOne({ originalUrl });
//     if (existingUrl) {
//       const shortUrl = `http://localhost:5000/${existingUrl.shortId}`;
//       const qrCode = await QRCode.toDataURL(shortUrl);
//       return res.json({ 
//         shortUrl,
//         existing: true,
//         qrCode
//       });
//     }

//     let shortId;
//     let isUnique = false;
//     let attempts = 0;
//     const maxAttempts = 5;

//     while (!isUnique && attempts < maxAttempts) {
//       attempts++;
//       shortId = nanoid(6);
//       const existing = await ShortUrl.findOne({ shortId });
//       if (!existing) isUnique = true;
//     }

//     if (!isUnique) {
//       throw new Error("Could not generate unique short ID");
//     }

//     const newUrl = new ShortUrl({ 
//       originalUrl, 
//       shortId,
//       createdAt: new Date(),
//       clicks: 0
//     });

//     await newUrl.save();

//     const shortUrl = `http://localhost:5000/${shortId}`;
//     const qrCode = await QRCode.toDataURL(shortUrl); 

//     res.status(201).json({
//       shortUrl,
//       originalUrl,
//       shortId,
//       qrCode 
//     });

//   } catch (error) {
//     console.error("Error shortening URL:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
 
// router.get("/:shortId", async (req, res) => {
//   const { shortId } = req.params;
//   const record = await ShortUrl.findOne({ shortId });

//   if (!record) return res.status(404).json({ error: "URL not found" });

//   res.redirect(record.originalUrl);
// });

// export default router;
import express from "express";
import ShortUrl from "../models/ShortUrl.js";
import { nanoid } from "nanoid";
import QRCode from "qrcode";

const router = express.Router();

router.post("/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: "Original URL is required" });
    }

    try {
      new URL(originalUrl);
    } catch (err) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const host = req.headers.host;
    const baseUrl = `${req.protocol}://${host}`;

    const existingUrl = await ShortUrl.findOne({ originalUrl });
    if (existingUrl) {
      const shortUrl = `${baseUrl}/${existingUrl.shortId}`;
      const qrCode = await QRCode.toDataURL(shortUrl);
      return res.json({
        shortUrl,
        existing: true,
        qrCode
      });
    }

    let shortId;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 5;

    while (!isUnique && attempts < maxAttempts) {
      attempts++;
      shortId = nanoid(6);
      const existing = await ShortUrl.findOne({ shortId });
      if (!existing) isUnique = true;
    }

    if (!isUnique) {
      throw new Error("Could not generate unique short ID");
    }

    const newUrl = new ShortUrl({
      originalUrl,
      shortId,
    });

    await newUrl.save();

    const shortUrl = `${baseUrl}/${shortId}`;
    const qrCode = await QRCode.toDataURL(shortUrl);

    res.status(201).json({
      shortUrl,
      originalUrl,
      shortId,
      qrCode
    });

  } catch (error) {
    console.error("Error shortening URL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;
  const record = await ShortUrl.findOne({ shortId });

  if (!record) return res.status(404).json({ error: "URL not found" });

  // Optionally track clicks
  record.clicks += 1;
  await record.save();

  res.redirect(record.originalUrl);
});

export default router;
