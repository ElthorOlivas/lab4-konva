import express from "express";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

type LeaderboardEntry = { score: number; timestamp: string };
const LEADERBOARD_FILE = new URL("./leaderboard.json", import.meta.url);
const app = express();
app.use(express.json());

function loadLeaderboard(): LeaderboardEntry[] {
    if (!existsSync(LEADERBOARD_FILE)) {
        return [];
    }
    const text = readFileSync(LEADERBOARD_FILE, "utf8");
    return JSON.parse(text) as LeaderboardEntry[];
}


function saveLeaderboard(entries: LeaderboardEntry[]): void {
    const jsonString = JSON.stringify(entries);
    writeFileSync(LEADERBOARD_FILE, jsonString, "utf8");
}


app.get("/api/leaderboard", (_req, res) => {
    const entries = loadLeaderboard();
    res.json(entries);
});

app.post("/api/leaderboard", (req, res) => {
    saveLeaderboard(req.body);
    res.json({ message: "Saved" });
});

app.listen(3001, () => console.log("Server running on port 3001"));