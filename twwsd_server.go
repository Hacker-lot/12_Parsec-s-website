package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	// Import the SQLite driver
	_ "github.com/mattn/go-sqlite3"
)

// Global state for the destruction event and database
var (
	db              *sql.DB
	destructionTime time.Time
	mu              sync.Mutex // Mutex for state synchronization
)

// DestructionStatus holds the time data to be sent to the client
type DestructionStatus struct {
	RemainingSeconds float64 `json:"remainingSeconds"`
}

// LogEntry structure for data transfer and SQLite interaction
type LogEntry struct {
	Text     string `json:"text"`
	AuthorID string `json:"authorId"`
	IsPublic bool   `json:"isPublic"`
	// Timestamp is only used for server insertion, not client input
}

// initDestructionTime sets the initial destruction time 1 day from now.
func initDestructionTime() {
	mu.Lock()
	destructionTime = time.Now().Add(24 * time.Hour)
	mu.Unlock()
	log.Printf("Destruction time set to: %s", destructionTime.Format(time.RFC3339))
}

// initDB connects to or creates the SQLite database and ensures the table exists.
func initDB() {
	var err error
	// Open the SQLite file. It will be created if it doesn't exist.
	db, err = sql.Open("sqlite3", "./wasteland.db")
	if err != nil {
		log.Fatal("Failed to open SQLite database:", err)
	}

	// Create the logs table if it doesn't exist.
	sqlStmt := `
	CREATE TABLE IF NOT EXISTS logs (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		text TEXT,
		author_id TEXT,
		is_public BOOLEAN,
		timestamp DATETIME
	);`
	_, err = db.Exec(sqlStmt)
	if err != nil {
		log.Fatalf("Error creating SQLite table: %s", err)
	}

	log.Println("SQLite database 'wasteland.db' initialized.")
}

// handleTime endpoint calculates and returns the remaining time (same as before).
func handleTime(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	remaining := destructionTime.Sub(time.Now())
	mu.Unlock()

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	seconds := remaining.Seconds()
	if seconds < 0 {
		seconds = 0
	}

	status := DestructionStatus{
		RemainingSeconds: seconds,
	}

	if err := json.NewEncoder(w).Encode(status); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		log.Println("Error encoding JSON:", err)
		return
	}
}

// handleDestruct simulates the self-destruction action and resets the clock (same as before).
func handleDestruct(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	destructionTime = time.Now().Add(24 * time.Hour)
	mu.Unlock()

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Destruction sequence terminated. New countdown initiated."}`))
	log.Println("Destruction endpoint triggered. Timer reset for 24 hours.")
}

// handleSaveLog handles POST requests to save a new log entry.
func handleSaveLog(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is supported", http.StatusMethodNotAllowed)
		return
	}

	var logEntry LogEntry
	if err := json.NewDecoder(r.Body).Decode(&logEntry); err != nil {
		http.Error(w, "Invalid log format", http.StatusBadRequest)
		log.Println("JSON decode error:", err)
		return
	}

	if logEntry.Text == "" {
		http.Error(w, "Log text cannot be empty", http.StatusBadRequest)
		return
	}

	// Insert into SQLite
	sqlStmt := `INSERT INTO logs (text, author_id, is_public, timestamp) VALUES (?, ?, ?, datetime('now'));`
	_, err := db.Exec(sqlStmt, logEntry.Text, logEntry.AuthorID, logEntry.IsPublic)
	if err != nil {
		http.Error(w, "Failed to save log to database", http.StatusInternalServerError)
		log.Println("SQLite insertion error:", err)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(`{"message": "Log saved successfully"}`))
	log.Printf("Log saved. Public: %t, User: %s", logEntry.IsPublic, logEntry.AuthorID)
}

// handlePublicLogs handles GET requests to retrieve the latest 5 public logs.
func handlePublicLogs(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	// Query for the latest 5 public logs
	rows, err := db.Query(`SELECT text, author_id, timestamp FROM logs WHERE is_public = true ORDER BY timestamp DESC LIMIT 5;`)
	if err != nil {
		http.Error(w, "Failed to retrieve logs", http.StatusInternalServerError)
		log.Println("SQLite query error:", err)
		return
	}
	defer rows.Close()

	var logs []map[string]interface{}
	for rows.Next() {
		var text, authorID, timestamp string
		if err := rows.Scan(&text, &authorID, &timestamp); err != nil {
			log.Println("SQLite row scan error:", err)
			continue
		}
		
		// Create a map to return the data structure expected by the frontend
		logData := map[string]interface{}{
			"text": text,
			"authorId": authorID,
			"timestamp": timestamp,
		}
		logs = append(logs, logData)
	}

	if err := json.NewEncoder(w).Encode(logs); err != nil {
		http.Error(w, "Failed to encode logs response", http.StatusInternalServerError)
		return
	}
}

func main() {
	initDB()
	initDestructionTime()

	// Timer API Endpoints
	http.HandleFunc("/api/time", handleTime)
	http.HandleFunc("/api/destruct", handleDestruct)
	
	// Log API Endpoints
	http.HandleFunc("/api/logs/submit", handleSaveLog)
	http.HandleFunc("/api/logs/public", handlePublicLogs)

	port := ":8080"
	log.Printf("Waste Punk API listening on http://localhost%s", port)
	
	// NOTE: If you run this Go code locally, you should use:
	// log.Fatal(http.ListenAndServe(port, nil))
}