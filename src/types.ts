export interface RateLimitOptions {
  windowMs: number; //60_000 for 1 minute
  max: number; 
  message?: string; 
  redis?: boolean | RedisOptions; 
}

export interface RedisOptions {
  host: string;
  port: number;
  password?: string;
}

export interface Store {
  hit: (key: string) => Promise<{ allowed: boolean; remaining: number }>;
}
