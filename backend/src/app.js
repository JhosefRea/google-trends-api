// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const SerpApi = require("google-search-results-nodejs");

dotenv.config();
const app = express();
const port = process.env.SERVER_PORT || 3001;

const search = new SerpApi.GoogleSearch(process.env.API_KEY);

app.use(cors());

app.get("/trends", async (req, res) => {
  try {
    const searchQueries = ["cavani", "zlatan", "messi", "ronaldo"];
    const dataTypesSingle = [
      //"TIMESERIES",
      //"GEO_MAP_0",
      "RELATED_TOPICS",
      "RELATED_QUERIES",
    ];

    const params = {
      engine: "google_trends",
      q: searchQueries,
      //country_code: "US",
      //gl: "US",
      location: "Mexico",
    };

    const getJson = () => {
      return new Promise((resolve) => {
        search.json(params, resolve);
      });
    };

    const getResults = async () => {
      const trendsResults = {};
      for (const type of dataTypesSingle) {
        params.data_type = type;
        const searchResult = await getJson();
        //if (type === "TIMESERIES")
        //  trendsResults.interestOverTime = searchResult.interest_over_time;
        //else if (type === "GEO_MAP_0")
          //trendsResults.interestByRegion = searchResult.interest_by_region;
        if (type === "RELATED_TOPICS")
          trendsResults.relatedTopics = searchResult.related_topics;
        else if (type === "RELATED_QUERIES")
          trendsResults.relatedQueries = searchResult.related_queries;
      }
      return trendsResults;
    };

    const result = await getResults();
    res.json(result);
  } catch (error) {
    console.error("Error en la solicitud:", error);
    res.status(500).json({ error: "Error en la solicitud" });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
