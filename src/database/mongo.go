package database

import (
	"context"
	"fmt"
	"fvst-api/src/config"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	MongoCtx    = context.Background()
	MongoClient *mongo.Client
)

func NewMongoClient(cfg *config.Config) (*mongo.Client, error) {
	clientOptions := options.Client().ApplyURI(cfg.MongoURI)
	client, err := mongo.Connect(MongoCtx, clientOptions)
	if err != nil {
		return nil, fmt.Errorf("could not connect to MongoDB: %v", err)
	}

	err = client.Ping(MongoCtx, nil)
	if err != nil {
		return nil, fmt.Errorf("could not ping MongoDB: %v", err)
	}

	MongoClient = client
	return client, nil
}
