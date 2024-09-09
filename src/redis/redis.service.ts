import { Injectable, Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: 'redis://localhost:6379' // Ustaw odpowiedni URL, jeśli jest inny
    });

    this.client.on('error', (err) => this.logger.error('Redis Client Error', err));
    this.client.connect().catch((err) => this.logger.error('Failed to connect to Redis', err));
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async quit(): Promise<void> {
    await this.client.quit();
  }
}
