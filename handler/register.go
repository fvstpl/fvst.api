package handler

import (
	"encoding/json"
	"fvst-api/database"
	"fvst-api/model"
	"fvst-api/utility"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func Register(c *gin.Context) {
	var user model.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(400, gin.H{"error": "Invalid input"})
		return
	}

	if !utility.IsValidEmail(user.Mail) || !utility.IsValidPassword(user.Security.Password) {
		c.JSON(400, gin.H{"error": "Invalid email or password"})
		return
	}

	if utility.EmailExists(user.Mail) {
		c.JSON(400, gin.H{"error": "Email already exists"})
		return
	}

	user.SetDefaults()

	user.CreatedAt = time.Now().Unix()
	user.UUID = uuid.New().String()
	user.Security.AuthorizationToken = uuid.New().String()

	userJson, _ := json.Marshal(user)
	code := uuid.New().String()[:6]

	database.RedisClient.Set(database.RedisCtx, "code:"+code, userJson, 30*time.Minute)
	database.RedisClient.Set(database.RedisCtx, "mail:"+user.Mail, "1", 30*time.Minute)

	c.JSON(200, gin.H{"code": code})
}

func RegisterConfirm(c *gin.Context) {
	var body struct{ Code string }
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(400, gin.H{"error": "Invalid code"})
		return
	}

	userJson, _ := database.RedisClient.Get(database.RedisCtx, "code:"+body.Code).Result()
	var user model.User
	if err := json.Unmarshal([]byte(userJson), &user); err != nil {
		c.JSON(400, gin.H{"error": "Invalid user data"})
		return
	}

	database.MongoClient.Database("fvst").Collection("users").InsertOne(database.MongoCtx, user)
	database.RedisClient.Del(database.RedisCtx, "mail:"+user.Mail)
	database.RedisClient.Del(database.RedisCtx, "code:"+body.Code)
	database.RedisClient.Set(database.RedisCtx, "user:"+user.UUID, userJson, 12*time.Hour)

	c.JSON(200, gin.H{"message": "User activated"})
}
