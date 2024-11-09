package utility

import (
	"encoding/json"
	"fvst-api/src/database"
	"fvst-api/src/model"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
)

func IsValidEmail(email string) bool {
	return strings.Contains(email, "@")
}

func IsValidPassword(password string) bool {
	return len(password) >= 6 &&
		strings.ContainsAny(password, "ABCDEFGHIJKLMNOPQRSTUVWXYZ") &&
		strings.ContainsAny(password, "abcdefghijklmnopqrstuvwxyz") &&
		strings.ContainsAny(password, "!@#$%^&*()_+-=[]{}|;:,.<>?") &&
		strings.ContainsAny(password, "0123456789")
}

func EmailExists(email string) bool {
	if result, _ := database.RedisClient.Get(database.RedisCtx, "mail:"+email).Result(); result == "1" {
		return true
	}

	var user model.User
	if err := database.MongoClient.Database("fvst").Collection("users").FindOne(database.MongoCtx, bson.M{"mail": email}).Decode(&user); err == nil {
		userJson, _ := json.Marshal(user)
		database.RedisClient.Set(database.RedisCtx, "user:"+email, userJson, 30*time.Minute)
		return true
	}
	return false
}
