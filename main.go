package main

import (
	"fvst-api/src/config"
	"fvst-api/src/database"
	"fvst-api/src/handler"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	database.NewMongoClient(cfg)
	if err != nil {
		log.Fatalf("Error initializing MongoDB: %v", err)
	}

	database.NewRedisClient(cfg)
	if err != nil {
		log.Fatalf("Error initializing Redis: %v", err)
	}

	r := gin.Default()

	v1 := r.Group("/v1")

	v1.POST("/auth/register", handler.Register)
	v1.POST("/auth/register/confirm", handler.RegisterConfirm)

	if err := r.Run(); err != nil {
		log.Fatalf("Error starting Gin server: %v", err)
	}
}
