-- Update default currency from USD to INR (Rupees)
ALTER TABLE market_prices ALTER COLUMN currency SET DEFAULT 'INR';