-- Supabase table for Auto1 market data
-- Run this SQL in Supabase dashboard

CREATE TABLE IF NOT EXISTS auto1_market_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  mileage INTEGER,
  price INTEGER NOT NULL,
  color VARCHAR(50),
  fuel_type VARCHAR(50),
  transmission VARCHAR(50),
  engine_power INTEGER,
  listing_url TEXT,
  source VARCHAR(50) DEFAULT 'auto1',
  scraped_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_auto1_brand_model ON auto1_market_data(brand, model);
CREATE INDEX idx_auto1_year ON auto1_market_data(year);
CREATE INDEX idx_auto1_price ON auto1_market_data(price);
CREATE INDEX idx_auto1_scraped_at ON auto1_market_data(scraped_at DESC);

-- View for market analysis
CREATE OR REPLACE VIEW market_price_estimates AS
SELECT
  brand,
  model,
  year,
  COUNT(*) as count,
  AVG(price) as avg_price,
  MIN(price) as min_price,
  MAX(price) as max_price,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY price) as median_price,
  AVG(price / NULLIF(mileage, 0)) as avg_price_per_km,
  MAX(scraped_at) as last_update
FROM auto1_market_data
GROUP BY brand, model, year
ORDER BY brand, model, year DESC;
