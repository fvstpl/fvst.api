package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	MongoURI  string
	RedisURI  string
	RedisUser string
	RedisPass string
}

func LoadConfig() (*Config, error) {
	godotenv.Load()

	config := &Config{}

	var missingVars []string

	if config.MongoURI = os.Getenv("MONGO_URI"); config.MongoURI == "" {
		missingVars = append(missingVars, "MONGO_URI")
	}
	if config.RedisURI = os.Getenv("REDIS_URI"); config.RedisURI == "" {
		missingVars = append(missingVars, "REDIS_URI")
	}
	if config.RedisUser = os.Getenv("REDIS_USER"); config.RedisUser == "" {
		missingVars = append(missingVars, "REDIS_USER")
	}
	if config.RedisPass = os.Getenv("REDIS_PASS"); config.RedisPass == "" {
		missingVars = append(missingVars, "REDIS_PASS")
	}

	if len(missingVars) > 0 {
		return nil, fmt.Errorf("missing required environment variables: %v", missingVars)
	}

	return config, nil
}
