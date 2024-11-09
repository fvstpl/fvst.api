package database

import (
	"context"
	"fmt"
	"fvst-api/src/config"

	"github.com/redis/go-redis/v9"
)

var (
	RedisCtx    = context.Background()
	RedisClient *redis.Client
)

func NewRedisClient(cfg *config.Config) (*redis.Client, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     cfg.RedisURI,
		Username: cfg.RedisUser,
		Password: cfg.RedisPass,
		DB:       0,
	})

	_, err := client.Ping(RedisCtx).Result()
	if err != nil {
		return nil, fmt.Errorf("could not connect to Redis: %v", err)
	}

	RedisClient = client
	return client, nil
}
