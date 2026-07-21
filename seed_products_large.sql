-- ============================================================
-- TOKIYO STORE - 150 Large Premium Products Seed Data (Somali & English)
-- Run in Supabase SQL Editor AFTER database.sql
-- ============================================================

-- Create brands if they do not exist
INSERT INTO brands (name, slug, description) VALUES
  ('Tokiyo Premium', 'tokiyo-premium', 'Our exclusive in-house luxury brand'),
  ('Milano Craft', 'milano-craft', 'Italian artisan fashion since 1980'),
  ('Black Atlas', 'black-atlas', 'Modern minimalist menswear'),
  ('Sovereign', 'sovereign', 'British heritage tailoring'),
  ('Aurum', 'aurum', 'Luxury watches and accessories')
ON CONFLICT (slug) DO NOTHING;

-- Create categories if they do not exist
INSERT INTO categories (name, slug, description, is_active) VALUES
  ('Suits', 'suits', 'Premium tailored suits and blazers', true),
  ('Shirts', 'shirts', 'Dress shirts and casual shirts', true),
  ('Trousers', 'trousers', 'Formal and smart casual trousers', true),
  ('Shoes', 'shoes', 'Premium footwear collection', true),
  ('Watches', 'watches', 'Luxury timepieces', true),
  ('Accessories', 'accessories', 'Ties, belts, wallets and more', true),
  ('Outerwear', 'outerwear', 'Coats, jackets and blazers', true),
  ('Knitwear', 'knitwear', 'Sweaters, cardigans and knitwear', true)
ON CONFLICT (slug) DO NOTHING;

-- Create collections if they do not exist
INSERT INTO collections (name, slug, description, is_active) VALUES
  ('Summer 2026', 'summer-2026', 'Fresh summer essentials', true),
  ('Classic Essentials', 'classic-essentials', 'Timeless wardrobe staples', true),
  ('Black Label', 'black-label', 'Our most exclusive luxury line', true)
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
  b_tokiyo   UUID := (SELECT id FROM brands WHERE slug = 'tokiyo-premium');
  b_milano   UUID := (SELECT id FROM brands WHERE slug = 'milano-craft');
  b_atlas    UUID := (SELECT id FROM brands WHERE slug = 'black-atlas');
  b_sov      UUID := (SELECT id FROM brands WHERE slug = 'sovereign');
  b_aurum    UUID := (SELECT id FROM brands WHERE slug = 'aurum');

  c_suits    UUID := (SELECT id FROM categories WHERE slug = 'suits');
  c_shirts   UUID := (SELECT id FROM categories WHERE slug = 'shirts');
  c_trousers UUID := (SELECT id FROM categories WHERE slug = 'trousers');
  c_shoes    UUID := (SELECT id FROM categories WHERE slug = 'shoes');
  c_watches  UUID := (SELECT id FROM categories WHERE slug = 'watches');
  c_acc      UUID := (SELECT id FROM categories WHERE slug = 'accessories');
  c_outer    UUID := (SELECT id FROM categories WHERE slug = 'outerwear');
  c_knit     UUID := (SELECT id FROM categories WHERE slug = 'knitwear');

  col_summer UUID := (SELECT id FROM collections WHERE slug = 'summer-2026');
  col_classic UUID := (SELECT id FROM collections WHERE slug = 'classic-essentials');
  col_black  UUID := (SELECT id FROM collections WHERE slug = 'black-label');

  p_id UUID;
BEGIN
  -- Truncate existing product data to prevent duplicate key or space errors
  TRUNCATE TABLE product_images CASCADE;
  TRUNCATE TABLE inventory CASCADE;
  TRUNCATE TABLE products CASCADE;

  -- Product 1: Imperial Merino Wool Three-Piece Suit
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_suits, b_milano, col_classic, 'Imperial Merino Wool Three-Piece Suit', 'imperial-merino-wool-three-piece-suit', 'A masterpiece from Tokiyo design studio. Crafted from premium Super 120s Merino Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Super 120s Merino Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 675.00, 844.00, 'TK-SU-101', 'Super 120s Merino Wool', true, true, true, 4.0, 5)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-101-BLA-38', 'Black', '38', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-101-BLA-40', 'Black', '40', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-101-BLA-42', 'Black', '42', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-101-BLA-44', 'Black', '44', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-101-NAV-38', 'Navy', '38', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-101-NAV-40', 'Navy', '40', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-101-NAV-42', 'Navy', '42', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-101-NAV-44', 'Navy', '44', 10, 5);

  -- Product 2: Savile Row Silk Wool Two-Piece Suit
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_suits, b_atlas, col_black, 'Savile Row Silk Wool Two-Piece Suit', 'savile-row-silk-wool-two-piece-suit', 'A masterpiece from Tokiyo design studio. Crafted from premium Italian Silk Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Italian Silk Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 750.00, 938.00, 'TK-SU-102', 'Italian Silk Wool', true, false, false, 4.1, 8)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-102-BLA-38', 'Black', '38', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-102-BLA-40', 'Black', '40', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-102-BLA-42', 'Black', '42', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-102-BLA-44', 'Black', '44', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-102-NAV-38', 'Navy', '38', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-102-NAV-40', 'Navy', '40', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-102-NAV-42', 'Navy', '42', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-102-NAV-44', 'Navy', '44', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-102-GRE-38', 'Grey', '38', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-102-GRE-40', 'Grey', '40', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-102-GRE-42', 'Grey', '42', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-102-GRE-44', 'Grey', '44', 12, 5);

  -- Product 3: Classic Linen Wool Three-Piece Suit
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_suits, b_sov, col_summer, 'Classic Linen Wool Three-Piece Suit', 'classic-linen-wool-three-piece-suit', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Linen Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Linen Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 825.00, 1031.00, 'TK-SU-103', 'Premium Linen Wool', true, false, false, 4.2, 11)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e5?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-103-BLA-38', 'Black', '38', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-103-BLA-40', 'Black', '40', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-103-BLA-42', 'Black', '42', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-103-BLA-44', 'Black', '44', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-103-NAV-38', 'Navy', '38', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-103-NAV-40', 'Navy', '40', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-103-NAV-42', 'Navy', '42', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-103-NAV-44', 'Navy', '44', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-103-GRE-38', 'Grey', '38', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-103-GRE-40', 'Grey', '40', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-103-GRE-42', 'Grey', '42', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-103-GRE-44', 'Grey', '44', 14, 5);

  -- Product 4: Napoli Blend Wool Two-Piece Suit
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_suits, b_aurum, col_classic, 'Napoli Blend Wool Two-Piece Suit', 'napoli-blend-wool-two-piece-suit', 'A masterpiece from Tokiyo design studio. Crafted from premium Cashmere Blend Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Cashmere Blend Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 900.00, 1125.00, 'TK-SU-104', 'Cashmere Blend Wool', true, true, false, 4.3, 14)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-104-BLA-38', 'Black', '38', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-104-BLA-40', 'Black', '40', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-104-BLA-42', 'Black', '42', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-104-BLA-44', 'Black', '44', 16, 5);

  -- Product 5: Milano Merino Wool Three-Piece Suit
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_suits, b_tokiyo, col_black, 'Milano Merino Wool Three-Piece Suit', 'milano-merino-wool-three-piece-suit', 'A masterpiece from Tokiyo design studio. Crafted from premium Super 120s Merino Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Super 120s Merino Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 975.00, 1219.00, 'TK-SU-105', 'Super 120s Merino Wool', true, false, true, 4.4, 17)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1598808503742-dd34bd03927f?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-105-BLA-38', 'Black', '38', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-105-BLA-40', 'Black', '40', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-105-BLA-42', 'Black', '42', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-105-BLA-44', 'Black', '44', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-105-NAV-38', 'Navy', '38', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-105-NAV-40', 'Navy', '40', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-105-NAV-42', 'Navy', '42', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-105-NAV-44', 'Navy', '44', 18, 5);

  -- Product 6: Tuscan Silk Wool Two-Piece Suit
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_suits, b_milano, col_summer, 'Tuscan Silk Wool Two-Piece Suit', 'tuscan-silk-wool-two-piece-suit', 'A masterpiece from Tokiyo design studio. Crafted from premium Italian Silk Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Italian Silk Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1050.00, 1313.00, 'TK-SU-106', 'Italian Silk Wool', true, false, false, 4.5, 20)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1555069513-045c8677eec6?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-106-BLA-38', 'Black', '38', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-106-BLA-40', 'Black', '40', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-106-BLA-42', 'Black', '42', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-106-BLA-44', 'Black', '44', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-106-NAV-38', 'Navy', '38', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-106-NAV-40', 'Navy', '40', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-106-NAV-42', 'Navy', '42', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-106-NAV-44', 'Navy', '44', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-106-GRE-38', 'Grey', '38', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-106-GRE-40', 'Grey', '40', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-106-GRE-42', 'Grey', '42', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-106-GRE-44', 'Grey', '44', 20, 5);

  -- Product 7: Cambridge Linen Wool Three-Piece Suit
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_suits, b_atlas, col_classic, 'Cambridge Linen Wool Three-Piece Suit', 'cambridge-linen-wool-three-piece-suit', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Linen Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Linen Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1125.00, 1406.00, 'TK-SU-107', 'Premium Linen Wool', true, true, false, 4.6, 23)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-107-BLA-38', 'Black', '38', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-107-BLA-40', 'Black', '40', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-107-BLA-42', 'Black', '42', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-107-BLA-44', 'Black', '44', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-107-NAV-38', 'Navy', '38', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-107-NAV-40', 'Navy', '40', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-107-NAV-42', 'Navy', '42', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-107-NAV-44', 'Navy', '44', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-107-GRE-38', 'Grey', '38', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-107-GRE-40', 'Grey', '40', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-107-GRE-42', 'Grey', '42', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-107-GRE-44', 'Grey', '44', 22, 5);

  -- Product 8: Soho Blend Wool Two-Piece Suit
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_suits, b_sov, col_black, 'Soho Blend Wool Two-Piece Suit', 'soho-blend-wool-two-piece-suit', 'A masterpiece from Tokiyo design studio. Crafted from premium Cashmere Blend Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Cashmere Blend Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1200.00, 1500.00, 'TK-SU-108', 'Cashmere Blend Wool', true, false, false, 4.7, 26)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-108-BLA-38', 'Black', '38', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-108-BLA-40', 'Black', '40', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-108-BLA-42', 'Black', '42', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-108-BLA-44', 'Black', '44', 24, 5);

  -- Product 9: Prestige Merino Wool Three-Piece Suit
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_suits, b_aurum, col_summer, 'Prestige Merino Wool Three-Piece Suit', 'prestige-merino-wool-three-piece-suit', 'A masterpiece from Tokiyo design studio. Crafted from premium Super 120s Merino Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Super 120s Merino Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1275.00, 1594.00, 'TK-SU-109', 'Super 120s Merino Wool', true, false, true, 4.8, 29)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-109-BLA-38', 'Black', '38', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-109-BLA-40', 'Black', '40', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-109-BLA-42', 'Black', '42', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-109-BLA-44', 'Black', '44', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-109-NAV-38', 'Navy', '38', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-109-NAV-40', 'Navy', '40', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-109-NAV-42', 'Navy', '42', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-109-NAV-44', 'Navy', '44', 26, 5);

  -- Product 10: Regal Silk Wool Two-Piece Suit
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_suits, b_tokiyo, col_classic, 'Regal Silk Wool Two-Piece Suit', 'regal-silk-wool-two-piece-suit', 'A masterpiece from Tokiyo design studio. Crafted from premium Italian Silk Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Italian Silk Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1350.00, 1688.00, 'TK-SU-110', 'Italian Silk Wool', true, true, false, 4.9, 7)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-110-BLA-38', 'Black', '38', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-110-BLA-40', 'Black', '40', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-110-BLA-42', 'Black', '42', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-110-BLA-44', 'Black', '44', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-110-NAV-38', 'Navy', '38', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-110-NAV-40', 'Navy', '40', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-110-NAV-42', 'Navy', '42', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-110-NAV-44', 'Navy', '44', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-110-GRE-38', 'Grey', '38', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-110-GRE-40', 'Grey', '40', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-110-GRE-42', 'Grey', '42', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-110-GRE-44', 'Grey', '44', 28, 5);

  -- Product 11: Signature Linen Wool Three-Piece Suit
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_suits, b_milano, col_black, 'Signature Linen Wool Three-Piece Suit', 'signature-linen-wool-three-piece-suit', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Linen Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Linen Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1425.00, 1781.00, 'TK-SU-111', 'Premium Linen Wool', true, false, false, 4.0, 10)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e5?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-111-BLA-38', 'Black', '38', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-111-BLA-40', 'Black', '40', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-111-BLA-42', 'Black', '42', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-111-BLA-44', 'Black', '44', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-111-NAV-38', 'Navy', '38', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-111-NAV-40', 'Navy', '40', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-111-NAV-42', 'Navy', '42', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-111-NAV-44', 'Navy', '44', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-111-GRE-38', 'Grey', '38', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-111-GRE-40', 'Grey', '40', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-111-GRE-42', 'Grey', '42', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-111-GRE-44', 'Grey', '44', 30, 5);

  -- Product 12: Vanguard Blend Wool Two-Piece Suit
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_suits, b_atlas, col_summer, 'Vanguard Blend Wool Two-Piece Suit', 'vanguard-blend-wool-two-piece-suit', 'A masterpiece from Tokiyo design studio. Crafted from premium Cashmere Blend Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Cashmere Blend Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1500.00, 1875.00, 'TK-SU-112', 'Cashmere Blend Wool', true, false, false, 4.1, 13)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-112-BLA-38', 'Black', '38', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-112-BLA-40', 'Black', '40', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-112-BLA-42', 'Black', '42', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-112-BLA-44', 'Black', '44', 32, 5);

  -- Product 13: Legacy Merino Wool Three-Piece Suit
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_suits, b_sov, col_classic, 'Legacy Merino Wool Three-Piece Suit', 'legacy-merino-wool-three-piece-suit', 'A masterpiece from Tokiyo design studio. Crafted from premium Super 120s Merino Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Super 120s Merino Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1575.00, 1969.00, 'TK-SU-113', 'Super 120s Merino Wool', true, true, true, 4.2, 16)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1598808503742-dd34bd03927f?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-113-BLA-38', 'Black', '38', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-113-BLA-40', 'Black', '40', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-113-BLA-42', 'Black', '42', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-113-BLA-44', 'Black', '44', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-113-NAV-38', 'Navy', '38', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-113-NAV-40', 'Navy', '40', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-113-NAV-42', 'Navy', '42', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-113-NAV-44', 'Navy', '44', 34, 5);

  -- Product 14: Atelier Silk Wool Two-Piece Suit
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_suits, b_aurum, col_black, 'Atelier Silk Wool Two-Piece Suit', 'atelier-silk-wool-two-piece-suit', 'A masterpiece from Tokiyo design studio. Crafted from premium Italian Silk Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Italian Silk Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1650.00, 2063.00, 'TK-SU-114', 'Italian Silk Wool', true, false, false, 4.3, 19)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1555069513-045c8677eec6?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-114-BLA-38', 'Black', '38', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-114-BLA-40', 'Black', '40', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-114-BLA-42', 'Black', '42', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-114-BLA-44', 'Black', '44', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-114-NAV-38', 'Navy', '38', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-114-NAV-40', 'Navy', '40', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-114-NAV-42', 'Navy', '42', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-114-NAV-44', 'Navy', '44', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-114-GRE-38', 'Grey', '38', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-114-GRE-40', 'Grey', '40', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-114-GRE-42', 'Grey', '42', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-114-GRE-44', 'Grey', '44', 36, 5);

  -- Product 15: Royal Linen Wool Three-Piece Suit
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_suits, b_tokiyo, col_summer, 'Royal Linen Wool Three-Piece Suit', 'royal-linen-wool-three-piece-suit', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Linen Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Linen Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1725.00, 2156.00, 'TK-SU-115', 'Premium Linen Wool', true, false, false, 4.4, 22)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-115-BLA-38', 'Black', '38', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-115-BLA-40', 'Black', '40', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-115-BLA-42', 'Black', '42', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-115-BLA-44', 'Black', '44', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-115-NAV-38', 'Navy', '38', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-115-NAV-40', 'Navy', '40', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-115-NAV-42', 'Navy', '42', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-115-NAV-44', 'Navy', '44', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-115-GRE-38', 'Grey', '38', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-115-GRE-40', 'Grey', '40', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-115-GRE-42', 'Grey', '42', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-115-GRE-44', 'Grey', '44', 38, 5);

  -- Product 16: Imperial Blend Wool Two-Piece Suit
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_suits, b_milano, col_classic, 'Imperial Blend Wool Two-Piece Suit', 'imperial-blend-wool-two-piece-suit', 'A masterpiece from Tokiyo design studio. Crafted from premium Cashmere Blend Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Cashmere Blend Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1800.00, 2250.00, 'TK-SU-116', 'Cashmere Blend Wool', true, true, false, 4.5, 25)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-116-BLA-38', 'Black', '38', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-116-BLA-40', 'Black', '40', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-116-BLA-42', 'Black', '42', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-116-BLA-44', 'Black', '44', 40, 5);

  -- Product 17: Savile Row Merino Wool Three-Piece Suit
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_suits, b_atlas, col_black, 'Savile Row Merino Wool Three-Piece Suit', 'savile-row-merino-wool-three-piece-suit', 'A masterpiece from Tokiyo design studio. Crafted from premium Super 120s Merino Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Super 120s Merino Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1875.00, 2344.00, 'TK-SU-117', 'Super 120s Merino Wool', true, false, true, 4.6, 28)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-117-BLA-38', 'Black', '38', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-117-BLA-40', 'Black', '40', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-117-BLA-42', 'Black', '42', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-117-BLA-44', 'Black', '44', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-117-NAV-38', 'Navy', '38', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-117-NAV-40', 'Navy', '40', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-117-NAV-42', 'Navy', '42', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-117-NAV-44', 'Navy', '44', 42, 5);

  -- Product 18: Classic Silk Wool Two-Piece Suit
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_suits, b_sov, col_summer, 'Classic Silk Wool Two-Piece Suit', 'classic-silk-wool-two-piece-suit', 'A masterpiece from Tokiyo design studio. Crafted from premium Italian Silk Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Italian Silk Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1950.00, 2438.00, 'TK-SU-118', 'Italian Silk Wool', true, false, false, 4.7, 6)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-118-BLA-38', 'Black', '38', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-118-BLA-40', 'Black', '40', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-118-BLA-42', 'Black', '42', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-118-BLA-44', 'Black', '44', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-118-NAV-38', 'Navy', '38', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-118-NAV-40', 'Navy', '40', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-118-NAV-42', 'Navy', '42', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-118-NAV-44', 'Navy', '44', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-118-GRE-38', 'Grey', '38', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-118-GRE-40', 'Grey', '40', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-118-GRE-42', 'Grey', '42', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-118-GRE-44', 'Grey', '44', 44, 5);

  -- Product 19: Napoli Linen Wool Three-Piece Suit
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_suits, b_aurum, col_classic, 'Napoli Linen Wool Three-Piece Suit', 'napoli-linen-wool-three-piece-suit', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Linen Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Linen Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 2025.00, 2531.00, 'TK-SU-119', 'Premium Linen Wool', true, true, false, 4.8, 9)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e5?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-119-BLA-38', 'Black', '38', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-119-BLA-40', 'Black', '40', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-119-BLA-42', 'Black', '42', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-119-BLA-44', 'Black', '44', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-119-NAV-38', 'Navy', '38', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-119-NAV-40', 'Navy', '40', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-119-NAV-42', 'Navy', '42', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-119-NAV-44', 'Navy', '44', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-119-GRE-38', 'Grey', '38', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-119-GRE-40', 'Grey', '40', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-119-GRE-42', 'Grey', '42', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SU-119-GRE-44', 'Grey', '44', 46, 5);

  -- Product 20: Tuscan Cotton Oxford Tailored Oxford Shirt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shirts, b_atlas, col_black, 'Tuscan Cotton Oxford Tailored Oxford Shirt', 'tuscan-cotton-oxford-tailored-oxford-shirt', 'A masterpiece from Tokiyo design studio. Crafted from premium Pima Cotton Oxford designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Pima Cotton Oxford oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 100.00, 125.00, 'TK-SH-120', 'Pima Cotton Oxford', true, false, false, 4.9, 12)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-120-BLA-S', 'Black', 'S', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-120-BLA-M', 'Black', 'M', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-120-BLA-L', 'Black', 'L', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-120-BLA-XL', 'Black', 'XL', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-120-NAV-S', 'Navy', 'S', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-120-NAV-M', 'Navy', 'M', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-120-NAV-L', 'Navy', 'L', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-120-NAV-XL', 'Navy', 'XL', 48, 5);

  -- Product 21: Cambridge French Linen Classic Dress Shirt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shirts, b_sov, col_summer, 'Cambridge French Linen Classic Dress Shirt', 'cambridge-french-linen-classic-dress-shirt', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium French Linen designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium French Linen oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 115.00, 144.00, 'TK-SH-121', 'Premium French Linen', true, false, true, 4.0, 15)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1620012253295-c05518e993be?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-121-BLA-S', 'Black', 'S', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-121-BLA-M', 'Black', 'M', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-121-BLA-L', 'Black', 'L', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-121-BLA-XL', 'Black', 'XL', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-121-NAV-S', 'Navy', 'S', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-121-NAV-M', 'Navy', 'M', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-121-NAV-L', 'Navy', 'L', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-121-NAV-XL', 'Navy', 'XL', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-121-GRE-S', 'Grey', 'S', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-121-GRE-M', 'Grey', 'M', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-121-GRE-L', 'Grey', 'L', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-121-GRE-XL', 'Grey', 'XL', 10, 5);

  -- Product 22: Soho Flannel Cotton Tailored Oxford Shirt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shirts, b_aurum, col_classic, 'Soho Flannel Cotton Tailored Oxford Shirt', 'soho-flannel-cotton-tailored-oxford-shirt', 'A masterpiece from Tokiyo design studio. Crafted from premium Brushed Flannel Cotton designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Brushed Flannel Cotton oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 130.00, 163.00, 'TK-SH-122', 'Brushed Flannel Cotton', true, true, false, 4.1, 18)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-122-BLA-S', 'Black', 'S', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-122-BLA-M', 'Black', 'M', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-122-BLA-L', 'Black', 'L', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-122-BLA-XL', 'Black', 'XL', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-122-NAV-S', 'Navy', 'S', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-122-NAV-M', 'Navy', 'M', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-122-NAV-L', 'Navy', 'L', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-122-NAV-XL', 'Navy', 'XL', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-122-GRE-S', 'Grey', 'S', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-122-GRE-M', 'Grey', 'M', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-122-GRE-L', 'Grey', 'L', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-122-GRE-XL', 'Grey', 'XL', 12, 5);

  -- Product 23: Prestige Giza Cotton Classic Dress Shirt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shirts, b_tokiyo, col_black, 'Prestige Giza Cotton Classic Dress Shirt', 'prestige-giza-cotton-classic-dress-shirt', 'A masterpiece from Tokiyo design studio. Crafted from premium Egyptian Giza Cotton designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Egyptian Giza Cotton oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 145.00, 181.00, 'TK-SH-123', 'Egyptian Giza Cotton', true, false, false, 4.2, 21)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-123-BLA-S', 'Black', 'S', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-123-BLA-M', 'Black', 'M', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-123-BLA-L', 'Black', 'L', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-123-BLA-XL', 'Black', 'XL', 14, 5);

  -- Product 24: Regal Cotton Oxford Tailored Oxford Shirt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shirts, b_milano, col_summer, 'Regal Cotton Oxford Tailored Oxford Shirt', 'regal-cotton-oxford-tailored-oxford-shirt', 'A masterpiece from Tokiyo design studio. Crafted from premium Pima Cotton Oxford designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Pima Cotton Oxford oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 160.00, 200.00, 'TK-SH-124', 'Pima Cotton Oxford', true, false, false, 4.3, 24)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-124-BLA-S', 'Black', 'S', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-124-BLA-M', 'Black', 'M', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-124-BLA-L', 'Black', 'L', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-124-BLA-XL', 'Black', 'XL', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-124-NAV-S', 'Navy', 'S', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-124-NAV-M', 'Navy', 'M', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-124-NAV-L', 'Navy', 'L', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-124-NAV-XL', 'Navy', 'XL', 16, 5);

  -- Product 25: Signature French Linen Classic Dress Shirt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shirts, b_atlas, col_classic, 'Signature French Linen Classic Dress Shirt', 'signature-french-linen-classic-dress-shirt', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium French Linen designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium French Linen oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 175.00, 219.00, 'TK-SH-125', 'Premium French Linen', true, true, true, 4.4, 27)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-125-BLA-S', 'Black', 'S', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-125-BLA-M', 'Black', 'M', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-125-BLA-L', 'Black', 'L', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-125-BLA-XL', 'Black', 'XL', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-125-NAV-S', 'Navy', 'S', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-125-NAV-M', 'Navy', 'M', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-125-NAV-L', 'Navy', 'L', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-125-NAV-XL', 'Navy', 'XL', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-125-GRE-S', 'Grey', 'S', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-125-GRE-M', 'Grey', 'M', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-125-GRE-L', 'Grey', 'L', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-125-GRE-XL', 'Grey', 'XL', 18, 5);

  -- Product 26: Vanguard Flannel Cotton Tailored Oxford Shirt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shirts, b_sov, col_black, 'Vanguard Flannel Cotton Tailored Oxford Shirt', 'vanguard-flannel-cotton-tailored-oxford-shirt', 'A masterpiece from Tokiyo design studio. Crafted from premium Brushed Flannel Cotton designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Brushed Flannel Cotton oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 190.00, 238.00, 'TK-SH-126', 'Brushed Flannel Cotton', true, false, false, 4.5, 5)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-126-BLA-S', 'Black', 'S', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-126-BLA-M', 'Black', 'M', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-126-BLA-L', 'Black', 'L', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-126-BLA-XL', 'Black', 'XL', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-126-NAV-S', 'Navy', 'S', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-126-NAV-M', 'Navy', 'M', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-126-NAV-L', 'Navy', 'L', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-126-NAV-XL', 'Navy', 'XL', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-126-GRE-S', 'Grey', 'S', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-126-GRE-M', 'Grey', 'M', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-126-GRE-L', 'Grey', 'L', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-126-GRE-XL', 'Grey', 'XL', 20, 5);

  -- Product 27: Legacy Giza Cotton Classic Dress Shirt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shirts, b_aurum, col_summer, 'Legacy Giza Cotton Classic Dress Shirt', 'legacy-giza-cotton-classic-dress-shirt', 'A masterpiece from Tokiyo design studio. Crafted from premium Egyptian Giza Cotton designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Egyptian Giza Cotton oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 205.00, 256.00, 'TK-SH-127', 'Egyptian Giza Cotton', true, false, false, 4.6, 8)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-127-BLA-S', 'Black', 'S', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-127-BLA-M', 'Black', 'M', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-127-BLA-L', 'Black', 'L', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-127-BLA-XL', 'Black', 'XL', 22, 5);

  -- Product 28: Atelier Cotton Oxford Tailored Oxford Shirt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shirts, b_tokiyo, col_classic, 'Atelier Cotton Oxford Tailored Oxford Shirt', 'atelier-cotton-oxford-tailored-oxford-shirt', 'A masterpiece from Tokiyo design studio. Crafted from premium Pima Cotton Oxford designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Pima Cotton Oxford oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 220.00, 275.00, 'TK-SH-128', 'Pima Cotton Oxford', true, true, false, 4.7, 11)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-128-BLA-S', 'Black', 'S', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-128-BLA-M', 'Black', 'M', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-128-BLA-L', 'Black', 'L', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-128-BLA-XL', 'Black', 'XL', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-128-NAV-S', 'Navy', 'S', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-128-NAV-M', 'Navy', 'M', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-128-NAV-L', 'Navy', 'L', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-128-NAV-XL', 'Navy', 'XL', 24, 5);

  -- Product 29: Royal French Linen Classic Dress Shirt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shirts, b_milano, col_black, 'Royal French Linen Classic Dress Shirt', 'royal-french-linen-classic-dress-shirt', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium French Linen designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium French Linen oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 235.00, 294.00, 'TK-SH-129', 'Premium French Linen', true, false, true, 4.8, 14)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1620012253295-c05518e993be?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-129-BLA-S', 'Black', 'S', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-129-BLA-M', 'Black', 'M', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-129-BLA-L', 'Black', 'L', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-129-BLA-XL', 'Black', 'XL', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-129-NAV-S', 'Navy', 'S', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-129-NAV-M', 'Navy', 'M', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-129-NAV-L', 'Navy', 'L', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-129-NAV-XL', 'Navy', 'XL', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-129-GRE-S', 'Grey', 'S', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-129-GRE-M', 'Grey', 'M', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-129-GRE-L', 'Grey', 'L', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-129-GRE-XL', 'Grey', 'XL', 26, 5);

  -- Product 30: Imperial Flannel Cotton Tailored Oxford Shirt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shirts, b_atlas, col_summer, 'Imperial Flannel Cotton Tailored Oxford Shirt', 'imperial-flannel-cotton-tailored-oxford-shirt', 'A masterpiece from Tokiyo design studio. Crafted from premium Brushed Flannel Cotton designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Brushed Flannel Cotton oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 250.00, 313.00, 'TK-SH-130', 'Brushed Flannel Cotton', true, false, false, 4.9, 17)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-130-BLA-S', 'Black', 'S', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-130-BLA-M', 'Black', 'M', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-130-BLA-L', 'Black', 'L', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-130-BLA-XL', 'Black', 'XL', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-130-NAV-S', 'Navy', 'S', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-130-NAV-M', 'Navy', 'M', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-130-NAV-L', 'Navy', 'L', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-130-NAV-XL', 'Navy', 'XL', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-130-GRE-S', 'Grey', 'S', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-130-GRE-M', 'Grey', 'M', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-130-GRE-L', 'Grey', 'L', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-130-GRE-XL', 'Grey', 'XL', 28, 5);

  -- Product 31: Savile Row Giza Cotton Classic Dress Shirt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shirts, b_sov, col_classic, 'Savile Row Giza Cotton Classic Dress Shirt', 'savile-row-giza-cotton-classic-dress-shirt', 'A masterpiece from Tokiyo design studio. Crafted from premium Egyptian Giza Cotton designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Egyptian Giza Cotton oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 265.00, 331.00, 'TK-SH-131', 'Egyptian Giza Cotton', true, true, false, 4.0, 20)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-131-BLA-S', 'Black', 'S', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-131-BLA-M', 'Black', 'M', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-131-BLA-L', 'Black', 'L', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-131-BLA-XL', 'Black', 'XL', 30, 5);

  -- Product 32: Classic Cotton Oxford Tailored Oxford Shirt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shirts, b_aurum, col_black, 'Classic Cotton Oxford Tailored Oxford Shirt', 'classic-cotton-oxford-tailored-oxford-shirt', 'A masterpiece from Tokiyo design studio. Crafted from premium Pima Cotton Oxford designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Pima Cotton Oxford oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 280.00, 350.00, 'TK-SH-132', 'Pima Cotton Oxford', true, false, false, 4.1, 23)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-132-BLA-S', 'Black', 'S', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-132-BLA-M', 'Black', 'M', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-132-BLA-L', 'Black', 'L', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-132-BLA-XL', 'Black', 'XL', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-132-NAV-S', 'Navy', 'S', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-132-NAV-M', 'Navy', 'M', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-132-NAV-L', 'Navy', 'L', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-132-NAV-XL', 'Navy', 'XL', 32, 5);

  -- Product 33: Napoli French Linen Classic Dress Shirt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shirts, b_tokiyo, col_summer, 'Napoli French Linen Classic Dress Shirt', 'napoli-french-linen-classic-dress-shirt', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium French Linen designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium French Linen oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 295.00, 369.00, 'TK-SH-133', 'Premium French Linen', true, false, true, 4.2, 26)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-133-BLA-S', 'Black', 'S', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-133-BLA-M', 'Black', 'M', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-133-BLA-L', 'Black', 'L', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-133-BLA-XL', 'Black', 'XL', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-133-NAV-S', 'Navy', 'S', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-133-NAV-M', 'Navy', 'M', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-133-NAV-L', 'Navy', 'L', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-133-NAV-XL', 'Navy', 'XL', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-133-GRE-S', 'Grey', 'S', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-133-GRE-M', 'Grey', 'M', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-133-GRE-L', 'Grey', 'L', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-133-GRE-XL', 'Grey', 'XL', 34, 5);

  -- Product 34: Milano Flannel Cotton Tailored Oxford Shirt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shirts, b_milano, col_classic, 'Milano Flannel Cotton Tailored Oxford Shirt', 'milano-flannel-cotton-tailored-oxford-shirt', 'A masterpiece from Tokiyo design studio. Crafted from premium Brushed Flannel Cotton designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Brushed Flannel Cotton oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 310.00, 388.00, 'TK-SH-134', 'Brushed Flannel Cotton', true, true, false, 4.3, 29)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-134-BLA-S', 'Black', 'S', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-134-BLA-M', 'Black', 'M', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-134-BLA-L', 'Black', 'L', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-134-BLA-XL', 'Black', 'XL', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-134-NAV-S', 'Navy', 'S', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-134-NAV-M', 'Navy', 'M', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-134-NAV-L', 'Navy', 'L', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-134-NAV-XL', 'Navy', 'XL', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-134-GRE-S', 'Grey', 'S', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-134-GRE-M', 'Grey', 'M', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-134-GRE-L', 'Grey', 'L', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-134-GRE-XL', 'Grey', 'XL', 36, 5);

  -- Product 35: Tuscan Giza Cotton Classic Dress Shirt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shirts, b_atlas, col_black, 'Tuscan Giza Cotton Classic Dress Shirt', 'tuscan-giza-cotton-classic-dress-shirt', 'A masterpiece from Tokiyo design studio. Crafted from premium Egyptian Giza Cotton designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Egyptian Giza Cotton oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 325.00, 406.00, 'TK-SH-135', 'Egyptian Giza Cotton', true, false, false, 4.4, 7)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-135-BLA-S', 'Black', 'S', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-135-BLA-M', 'Black', 'M', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-135-BLA-L', 'Black', 'L', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-135-BLA-XL', 'Black', 'XL', 38, 5);

  -- Product 36: Cambridge Cotton Oxford Tailored Oxford Shirt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shirts, b_sov, col_summer, 'Cambridge Cotton Oxford Tailored Oxford Shirt', 'cambridge-cotton-oxford-tailored-oxford-shirt', 'A masterpiece from Tokiyo design studio. Crafted from premium Pima Cotton Oxford designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Pima Cotton Oxford oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 340.00, 425.00, 'TK-SH-136', 'Pima Cotton Oxford', true, false, false, 4.5, 10)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-136-BLA-S', 'Black', 'S', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-136-BLA-M', 'Black', 'M', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-136-BLA-L', 'Black', 'L', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-136-BLA-XL', 'Black', 'XL', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-136-NAV-S', 'Navy', 'S', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-136-NAV-M', 'Navy', 'M', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-136-NAV-L', 'Navy', 'L', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-136-NAV-XL', 'Navy', 'XL', 40, 5);

  -- Product 37: Soho French Linen Classic Dress Shirt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shirts, b_aurum, col_classic, 'Soho French Linen Classic Dress Shirt', 'soho-french-linen-classic-dress-shirt', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium French Linen designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium French Linen oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 355.00, 444.00, 'TK-SH-137', 'Premium French Linen', true, true, true, 4.6, 13)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1620012253295-c05518e993be?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-137-BLA-S', 'Black', 'S', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-137-BLA-M', 'Black', 'M', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-137-BLA-L', 'Black', 'L', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-137-BLA-XL', 'Black', 'XL', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-137-NAV-S', 'Navy', 'S', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-137-NAV-M', 'Navy', 'M', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-137-NAV-L', 'Navy', 'L', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-137-NAV-XL', 'Navy', 'XL', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-137-GRE-S', 'Grey', 'S', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-137-GRE-M', 'Grey', 'M', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-137-GRE-L', 'Grey', 'L', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-137-GRE-XL', 'Grey', 'XL', 42, 5);

  -- Product 38: Prestige Flannel Cotton Tailored Oxford Shirt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shirts, b_tokiyo, col_black, 'Prestige Flannel Cotton Tailored Oxford Shirt', 'prestige-flannel-cotton-tailored-oxford-shirt', 'A masterpiece from Tokiyo design studio. Crafted from premium Brushed Flannel Cotton designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Brushed Flannel Cotton oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 370.00, 463.00, 'TK-SH-138', 'Brushed Flannel Cotton', true, false, false, 4.7, 16)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-138-BLA-S', 'Black', 'S', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-138-BLA-M', 'Black', 'M', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-138-BLA-L', 'Black', 'L', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-138-BLA-XL', 'Black', 'XL', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-138-NAV-S', 'Navy', 'S', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-138-NAV-M', 'Navy', 'M', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-138-NAV-L', 'Navy', 'L', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-138-NAV-XL', 'Navy', 'XL', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-138-GRE-S', 'Grey', 'S', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-138-GRE-M', 'Grey', 'M', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-138-GRE-L', 'Grey', 'L', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-138-GRE-XL', 'Grey', 'XL', 44, 5);

  -- Product 39: Signature Cotton Chino Smart Fit Chinos
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_trousers, b_sov, col_summer, 'Signature Cotton Chino Smart Fit Chinos', 'signature-cotton-chino-smart-fit-chinos', 'A masterpiece from Tokiyo design studio. Crafted from premium Stretch Cotton Chino designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Stretch Cotton Chino oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 140.00, 175.00, 'TK-TR-139', 'Stretch Cotton Chino', true, false, false, 4.8, 19)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-139-BLA-30', 'Black', '30', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-139-BLA-32', 'Black', '32', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-139-BLA-34', 'Black', '34', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-139-BLA-36', 'Black', '36', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-139-NAV-30', 'Navy', '30', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-139-NAV-32', 'Navy', '32', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-139-NAV-34', 'Navy', '34', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-139-NAV-36', 'Navy', '36', 46, 5);

  -- Product 40: Vanguard Linen Blend Formal Pleated Trousers
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_trousers, b_aurum, col_classic, 'Vanguard Linen Blend Formal Pleated Trousers', 'vanguard-linen-blend-formal-pleated-trousers', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Linen Blend designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Linen Blend oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 160.00, 200.00, 'TK-TR-140', 'Premium Linen Blend', true, true, false, 4.9, 22)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-140-BLA-30', 'Black', '30', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-140-BLA-32', 'Black', '32', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-140-BLA-34', 'Black', '34', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-140-BLA-36', 'Black', '36', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-140-NAV-30', 'Navy', '30', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-140-NAV-32', 'Navy', '32', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-140-NAV-34', 'Navy', '34', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-140-NAV-36', 'Navy', '36', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-140-GRE-30', 'Grey', '30', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-140-GRE-32', 'Grey', '32', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-140-GRE-34', 'Grey', '34', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-140-GRE-36', 'Grey', '36', 48, 5);

  -- Product 41: Legacy Silk Wool Smart Fit Chinos
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_trousers, b_tokiyo, col_black, 'Legacy Silk Wool Smart Fit Chinos', 'legacy-silk-wool-smart-fit-chinos', 'A masterpiece from Tokiyo design studio. Crafted from premium Luxurious Silk Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Luxurious Silk Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 180.00, 225.00, 'TK-TR-141', 'Luxurious Silk Wool', true, false, true, 4.0, 25)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1584865288642-42078afe6942?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-141-BLA-30', 'Black', '30', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-141-BLA-32', 'Black', '32', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-141-BLA-34', 'Black', '34', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-141-BLA-36', 'Black', '36', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-141-NAV-30', 'Navy', '30', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-141-NAV-32', 'Navy', '32', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-141-NAV-34', 'Navy', '34', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-141-NAV-36', 'Navy', '36', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-141-GRE-30', 'Grey', '30', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-141-GRE-32', 'Grey', '32', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-141-GRE-34', 'Grey', '34', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-141-GRE-36', 'Grey', '36', 10, 5);

  -- Product 42: Atelier Gabardine Wool Formal Pleated Trousers
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_trousers, b_milano, col_summer, 'Atelier Gabardine Wool Formal Pleated Trousers', 'atelier-gabardine-wool-formal-pleated-trousers', 'A masterpiece from Tokiyo design studio. Crafted from premium Fine Gabardine Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Fine Gabardine Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 200.00, 250.00, 'TK-TR-142', 'Fine Gabardine Wool', true, false, false, 4.1, 28)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1625182630526-83633aa384e7?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-142-BLA-30', 'Black', '30', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-142-BLA-32', 'Black', '32', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-142-BLA-34', 'Black', '34', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-142-BLA-36', 'Black', '36', 12, 5);

  -- Product 43: Royal Cotton Chino Smart Fit Chinos
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_trousers, b_atlas, col_classic, 'Royal Cotton Chino Smart Fit Chinos', 'royal-cotton-chino-smart-fit-chinos', 'A masterpiece from Tokiyo design studio. Crafted from premium Stretch Cotton Chino designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Stretch Cotton Chino oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 220.00, 275.00, 'TK-TR-143', 'Stretch Cotton Chino', true, true, false, 4.2, 6)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-143-BLA-30', 'Black', '30', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-143-BLA-32', 'Black', '32', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-143-BLA-34', 'Black', '34', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-143-BLA-36', 'Black', '36', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-143-NAV-30', 'Navy', '30', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-143-NAV-32', 'Navy', '32', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-143-NAV-34', 'Navy', '34', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-143-NAV-36', 'Navy', '36', 14, 5);

  -- Product 44: Imperial Linen Blend Formal Pleated Trousers
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_trousers, b_sov, col_black, 'Imperial Linen Blend Formal Pleated Trousers', 'imperial-linen-blend-formal-pleated-trousers', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Linen Blend designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Linen Blend oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 240.00, 300.00, 'TK-TR-144', 'Premium Linen Blend', true, false, false, 4.3, 9)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-144-BLA-30', 'Black', '30', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-144-BLA-32', 'Black', '32', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-144-BLA-34', 'Black', '34', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-144-BLA-36', 'Black', '36', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-144-NAV-30', 'Navy', '30', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-144-NAV-32', 'Navy', '32', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-144-NAV-34', 'Navy', '34', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-144-NAV-36', 'Navy', '36', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-144-GRE-30', 'Grey', '30', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-144-GRE-32', 'Grey', '32', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-144-GRE-34', 'Grey', '34', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-144-GRE-36', 'Grey', '36', 16, 5);

  -- Product 45: Savile Row Silk Wool Smart Fit Chinos
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_trousers, b_aurum, col_summer, 'Savile Row Silk Wool Smart Fit Chinos', 'savile-row-silk-wool-smart-fit-chinos', 'A masterpiece from Tokiyo design studio. Crafted from premium Luxurious Silk Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Luxurious Silk Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 260.00, 325.00, 'TK-TR-145', 'Luxurious Silk Wool', true, false, true, 4.4, 12)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-145-BLA-30', 'Black', '30', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-145-BLA-32', 'Black', '32', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-145-BLA-34', 'Black', '34', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-145-BLA-36', 'Black', '36', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-145-NAV-30', 'Navy', '30', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-145-NAV-32', 'Navy', '32', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-145-NAV-34', 'Navy', '34', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-145-NAV-36', 'Navy', '36', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-145-GRE-30', 'Grey', '30', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-145-GRE-32', 'Grey', '32', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-145-GRE-34', 'Grey', '34', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-145-GRE-36', 'Grey', '36', 18, 5);

  -- Product 46: Classic Gabardine Wool Formal Pleated Trousers
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_trousers, b_tokiyo, col_classic, 'Classic Gabardine Wool Formal Pleated Trousers', 'classic-gabardine-wool-formal-pleated-trousers', 'A masterpiece from Tokiyo design studio. Crafted from premium Fine Gabardine Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Fine Gabardine Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 280.00, 350.00, 'TK-TR-146', 'Fine Gabardine Wool', true, true, false, 4.5, 15)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-146-BLA-30', 'Black', '30', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-146-BLA-32', 'Black', '32', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-146-BLA-34', 'Black', '34', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-146-BLA-36', 'Black', '36', 20, 5);

  -- Product 47: Napoli Cotton Chino Smart Fit Chinos
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_trousers, b_milano, col_black, 'Napoli Cotton Chino Smart Fit Chinos', 'napoli-cotton-chino-smart-fit-chinos', 'A masterpiece from Tokiyo design studio. Crafted from premium Stretch Cotton Chino designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Stretch Cotton Chino oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 300.00, 375.00, 'TK-TR-147', 'Stretch Cotton Chino', true, false, false, 4.6, 18)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-147-BLA-30', 'Black', '30', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-147-BLA-32', 'Black', '32', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-147-BLA-34', 'Black', '34', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-147-BLA-36', 'Black', '36', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-147-NAV-30', 'Navy', '30', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-147-NAV-32', 'Navy', '32', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-147-NAV-34', 'Navy', '34', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-147-NAV-36', 'Navy', '36', 22, 5);

  -- Product 48: Milano Linen Blend Formal Pleated Trousers
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_trousers, b_atlas, col_summer, 'Milano Linen Blend Formal Pleated Trousers', 'milano-linen-blend-formal-pleated-trousers', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Linen Blend designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Linen Blend oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 320.00, 400.00, 'TK-TR-148', 'Premium Linen Blend', true, false, false, 4.7, 21)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-148-BLA-30', 'Black', '30', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-148-BLA-32', 'Black', '32', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-148-BLA-34', 'Black', '34', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-148-BLA-36', 'Black', '36', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-148-NAV-30', 'Navy', '30', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-148-NAV-32', 'Navy', '32', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-148-NAV-34', 'Navy', '34', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-148-NAV-36', 'Navy', '36', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-148-GRE-30', 'Grey', '30', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-148-GRE-32', 'Grey', '32', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-148-GRE-34', 'Grey', '34', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-148-GRE-36', 'Grey', '36', 24, 5);

  -- Product 49: Tuscan Silk Wool Smart Fit Chinos
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_trousers, b_sov, col_classic, 'Tuscan Silk Wool Smart Fit Chinos', 'tuscan-silk-wool-smart-fit-chinos', 'A masterpiece from Tokiyo design studio. Crafted from premium Luxurious Silk Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Luxurious Silk Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 340.00, 425.00, 'TK-TR-149', 'Luxurious Silk Wool', true, true, true, 4.8, 24)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1584865288642-42078afe6942?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-149-BLA-30', 'Black', '30', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-149-BLA-32', 'Black', '32', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-149-BLA-34', 'Black', '34', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-149-BLA-36', 'Black', '36', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-149-NAV-30', 'Navy', '30', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-149-NAV-32', 'Navy', '32', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-149-NAV-34', 'Navy', '34', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-149-NAV-36', 'Navy', '36', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-149-GRE-30', 'Grey', '30', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-149-GRE-32', 'Grey', '32', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-149-GRE-34', 'Grey', '34', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-149-GRE-36', 'Grey', '36', 26, 5);

  -- Product 50: Cambridge Gabardine Wool Formal Pleated Trousers
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_trousers, b_aurum, col_black, 'Cambridge Gabardine Wool Formal Pleated Trousers', 'cambridge-gabardine-wool-formal-pleated-trousers', 'A masterpiece from Tokiyo design studio. Crafted from premium Fine Gabardine Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Fine Gabardine Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 360.00, 450.00, 'TK-TR-150', 'Fine Gabardine Wool', true, false, false, 4.9, 27)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1625182630526-83633aa384e7?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-150-BLA-30', 'Black', '30', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-150-BLA-32', 'Black', '32', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-150-BLA-34', 'Black', '34', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-150-BLA-36', 'Black', '36', 28, 5);

  -- Product 51: Soho Cotton Chino Smart Fit Chinos
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_trousers, b_tokiyo, col_summer, 'Soho Cotton Chino Smart Fit Chinos', 'soho-cotton-chino-smart-fit-chinos', 'A masterpiece from Tokiyo design studio. Crafted from premium Stretch Cotton Chino designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Stretch Cotton Chino oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 380.00, 475.00, 'TK-TR-151', 'Stretch Cotton Chino', true, false, false, 4.0, 5)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-151-BLA-30', 'Black', '30', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-151-BLA-32', 'Black', '32', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-151-BLA-34', 'Black', '34', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-151-BLA-36', 'Black', '36', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-151-NAV-30', 'Navy', '30', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-151-NAV-32', 'Navy', '32', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-151-NAV-34', 'Navy', '34', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-151-NAV-36', 'Navy', '36', 30, 5);

  -- Product 52: Prestige Linen Blend Formal Pleated Trousers
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_trousers, b_milano, col_classic, 'Prestige Linen Blend Formal Pleated Trousers', 'prestige-linen-blend-formal-pleated-trousers', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Linen Blend designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Linen Blend oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 400.00, 500.00, 'TK-TR-152', 'Premium Linen Blend', true, true, false, 4.1, 8)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-152-BLA-30', 'Black', '30', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-152-BLA-32', 'Black', '32', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-152-BLA-34', 'Black', '34', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-152-BLA-36', 'Black', '36', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-152-NAV-30', 'Navy', '30', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-152-NAV-32', 'Navy', '32', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-152-NAV-34', 'Navy', '34', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-152-NAV-36', 'Navy', '36', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-152-GRE-30', 'Grey', '30', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-152-GRE-32', 'Grey', '32', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-152-GRE-34', 'Grey', '34', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-152-GRE-36', 'Grey', '36', 32, 5);

  -- Product 53: Regal Silk Wool Smart Fit Chinos
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_trousers, b_atlas, col_black, 'Regal Silk Wool Smart Fit Chinos', 'regal-silk-wool-smart-fit-chinos', 'A masterpiece from Tokiyo design studio. Crafted from premium Luxurious Silk Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Luxurious Silk Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 420.00, 525.00, 'TK-TR-153', 'Luxurious Silk Wool', true, false, true, 4.2, 11)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-153-BLA-30', 'Black', '30', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-153-BLA-32', 'Black', '32', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-153-BLA-34', 'Black', '34', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-153-BLA-36', 'Black', '36', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-153-NAV-30', 'Navy', '30', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-153-NAV-32', 'Navy', '32', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-153-NAV-34', 'Navy', '34', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-153-NAV-36', 'Navy', '36', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-153-GRE-30', 'Grey', '30', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-153-GRE-32', 'Grey', '32', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-153-GRE-34', 'Grey', '34', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-153-GRE-36', 'Grey', '36', 34, 5);

  -- Product 54: Signature Gabardine Wool Formal Pleated Trousers
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_trousers, b_sov, col_summer, 'Signature Gabardine Wool Formal Pleated Trousers', 'signature-gabardine-wool-formal-pleated-trousers', 'A masterpiece from Tokiyo design studio. Crafted from premium Fine Gabardine Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Fine Gabardine Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 440.00, 550.00, 'TK-TR-154', 'Fine Gabardine Wool', true, false, false, 4.3, 14)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-154-BLA-30', 'Black', '30', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-154-BLA-32', 'Black', '32', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-154-BLA-34', 'Black', '34', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-154-BLA-36', 'Black', '36', 36, 5);

  -- Product 55: Vanguard Cotton Chino Smart Fit Chinos
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_trousers, b_aurum, col_classic, 'Vanguard Cotton Chino Smart Fit Chinos', 'vanguard-cotton-chino-smart-fit-chinos', 'A masterpiece from Tokiyo design studio. Crafted from premium Stretch Cotton Chino designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Stretch Cotton Chino oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 460.00, 575.00, 'TK-TR-155', 'Stretch Cotton Chino', true, true, false, 4.4, 17)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-155-BLA-30', 'Black', '30', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-155-BLA-32', 'Black', '32', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-155-BLA-34', 'Black', '34', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-155-BLA-36', 'Black', '36', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-155-NAV-30', 'Navy', '30', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-155-NAV-32', 'Navy', '32', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-155-NAV-34', 'Navy', '34', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-155-NAV-36', 'Navy', '36', 38, 5);

  -- Product 56: Legacy Linen Blend Formal Pleated Trousers
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_trousers, b_tokiyo, col_black, 'Legacy Linen Blend Formal Pleated Trousers', 'legacy-linen-blend-formal-pleated-trousers', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Linen Blend designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Linen Blend oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 480.00, 600.00, 'TK-TR-156', 'Premium Linen Blend', true, false, false, 4.5, 20)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-156-BLA-30', 'Black', '30', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-156-BLA-32', 'Black', '32', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-156-BLA-34', 'Black', '34', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-156-BLA-36', 'Black', '36', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-156-NAV-30', 'Navy', '30', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-156-NAV-32', 'Navy', '32', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-156-NAV-34', 'Navy', '34', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-156-NAV-36', 'Navy', '36', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-156-GRE-30', 'Grey', '30', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-156-GRE-32', 'Grey', '32', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-156-GRE-34', 'Grey', '34', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-156-GRE-36', 'Grey', '36', 40, 5);

  -- Product 57: Atelier Silk Wool Smart Fit Chinos
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_trousers, b_milano, col_summer, 'Atelier Silk Wool Smart Fit Chinos', 'atelier-silk-wool-smart-fit-chinos', 'A masterpiece from Tokiyo design studio. Crafted from premium Luxurious Silk Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Luxurious Silk Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 500.00, 625.00, 'TK-TR-157', 'Luxurious Silk Wool', true, false, true, 4.6, 23)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1584865288642-42078afe6942?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-157-BLA-30', 'Black', '30', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-157-BLA-32', 'Black', '32', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-157-BLA-34', 'Black', '34', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-157-BLA-36', 'Black', '36', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-157-NAV-30', 'Navy', '30', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-157-NAV-32', 'Navy', '32', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-157-NAV-34', 'Navy', '34', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-157-NAV-36', 'Navy', '36', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-157-GRE-30', 'Grey', '30', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-157-GRE-32', 'Grey', '32', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-157-GRE-34', 'Grey', '34', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-TR-157-GRE-36', 'Grey', '36', 42, 5);

  -- Product 58: Imperial Tuscan Suede Derby Leather Shoes
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shoes, b_aurum, col_classic, 'Imperial Tuscan Suede Derby Leather Shoes', 'imperial-tuscan-suede-derby-leather-shoes', 'A masterpiece from Tokiyo design studio. Crafted from premium Genuine Tuscan Suede designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Genuine Tuscan Suede oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 225.00, 281.00, 'TK-SH-158', 'Genuine Tuscan Suede', true, true, false, 4.7, 26)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-158-BLA-8', 'Black', '8', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-158-BLA-9', 'Black', '9', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-158-BLA-10', 'Black', '10', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-158-BLA-11', 'Black', '11', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-158-NAV-8', 'Navy', '8', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-158-NAV-9', 'Navy', '9', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-158-NAV-10', 'Navy', '10', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-158-NAV-11', 'Navy', '11', 44, 5);

  -- Product 59: Savile Row Calf Leather Oxford Dress Shoes
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shoes, b_tokiyo, col_black, 'Savile Row Calf Leather Oxford Dress Shoes', 'savile-row-calf-leather-oxford-dress-shoes', 'A masterpiece from Tokiyo design studio. Crafted from premium Hand-Burnished Calf Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Hand-Burnished Calf Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 270.00, 338.00, 'TK-SH-159', 'Hand-Burnished Calf Leather', true, false, false, 4.8, 29)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-159-BLA-8', 'Black', '8', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-159-BLA-9', 'Black', '9', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-159-BLA-10', 'Black', '10', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-159-BLA-11', 'Black', '11', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-159-NAV-8', 'Navy', '8', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-159-NAV-9', 'Navy', '9', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-159-NAV-10', 'Navy', '10', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-159-NAV-11', 'Navy', '11', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-159-GRE-8', 'Grey', '8', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-159-GRE-9', 'Grey', '9', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-159-GRE-10', 'Grey', '10', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-159-GRE-11', 'Grey', '11', 46, 5);

  -- Product 60: Classic Cordovan Leather Derby Leather Shoes
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shoes, b_milano, col_summer, 'Classic Cordovan Leather Derby Leather Shoes', 'classic-cordovan-leather-derby-leather-shoes', 'A masterpiece from Tokiyo design studio. Crafted from premium Cordovan Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Cordovan Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 315.00, 394.00, 'TK-SH-160', 'Cordovan Leather', true, false, false, 4.9, 7)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-160-BLA-8', 'Black', '8', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-160-BLA-9', 'Black', '9', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-160-BLA-10', 'Black', '10', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-160-BLA-11', 'Black', '11', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-160-NAV-8', 'Navy', '8', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-160-NAV-9', 'Navy', '9', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-160-NAV-10', 'Navy', '10', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-160-NAV-11', 'Navy', '11', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-160-GRE-8', 'Grey', '8', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-160-GRE-9', 'Grey', '9', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-160-GRE-10', 'Grey', '10', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-160-GRE-11', 'Grey', '11', 48, 5);

  -- Product 61: Napoli Calfskin Leather Oxford Dress Shoes
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shoes, b_atlas, col_classic, 'Napoli Calfskin Leather Oxford Dress Shoes', 'napoli-calfskin-leather-oxford-dress-shoes', 'A masterpiece from Tokiyo design studio. Crafted from premium Full-Grain Calfskin Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Full-Grain Calfskin Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 360.00, 450.00, 'TK-SH-161', 'Full-Grain Calfskin Leather', true, true, true, 4.0, 10)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1478186272116-c74477c9b8a5?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-161-BLA-8', 'Black', '8', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-161-BLA-9', 'Black', '9', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-161-BLA-10', 'Black', '10', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-161-BLA-11', 'Black', '11', 10, 5);

  -- Product 62: Milano Tuscan Suede Derby Leather Shoes
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shoes, b_sov, col_black, 'Milano Tuscan Suede Derby Leather Shoes', 'milano-tuscan-suede-derby-leather-shoes', 'A masterpiece from Tokiyo design studio. Crafted from premium Genuine Tuscan Suede designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Genuine Tuscan Suede oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 405.00, 506.00, 'TK-SH-162', 'Genuine Tuscan Suede', true, false, false, 4.1, 13)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-162-BLA-8', 'Black', '8', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-162-BLA-9', 'Black', '9', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-162-BLA-10', 'Black', '10', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-162-BLA-11', 'Black', '11', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-162-NAV-8', 'Navy', '8', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-162-NAV-9', 'Navy', '9', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-162-NAV-10', 'Navy', '10', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-162-NAV-11', 'Navy', '11', 12, 5);

  -- Product 63: Tuscan Calf Leather Oxford Dress Shoes
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shoes, b_aurum, col_summer, 'Tuscan Calf Leather Oxford Dress Shoes', 'tuscan-calf-leather-oxford-dress-shoes', 'A masterpiece from Tokiyo design studio. Crafted from premium Hand-Burnished Calf Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Hand-Burnished Calf Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 450.00, 563.00, 'TK-SH-163', 'Hand-Burnished Calf Leather', true, false, false, 4.2, 16)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-163-BLA-8', 'Black', '8', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-163-BLA-9', 'Black', '9', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-163-BLA-10', 'Black', '10', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-163-BLA-11', 'Black', '11', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-163-NAV-8', 'Navy', '8', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-163-NAV-9', 'Navy', '9', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-163-NAV-10', 'Navy', '10', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-163-NAV-11', 'Navy', '11', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-163-GRE-8', 'Grey', '8', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-163-GRE-9', 'Grey', '9', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-163-GRE-10', 'Grey', '10', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-163-GRE-11', 'Grey', '11', 14, 5);

  -- Product 64: Cambridge Cordovan Leather Derby Leather Shoes
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shoes, b_tokiyo, col_classic, 'Cambridge Cordovan Leather Derby Leather Shoes', 'cambridge-cordovan-leather-derby-leather-shoes', 'A masterpiece from Tokiyo design studio. Crafted from premium Cordovan Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Cordovan Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 495.00, 619.00, 'TK-SH-164', 'Cordovan Leather', true, true, false, 4.3, 19)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-164-BLA-8', 'Black', '8', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-164-BLA-9', 'Black', '9', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-164-BLA-10', 'Black', '10', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-164-BLA-11', 'Black', '11', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-164-NAV-8', 'Navy', '8', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-164-NAV-9', 'Navy', '9', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-164-NAV-10', 'Navy', '10', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-164-NAV-11', 'Navy', '11', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-164-GRE-8', 'Grey', '8', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-164-GRE-9', 'Grey', '9', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-164-GRE-10', 'Grey', '10', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-164-GRE-11', 'Grey', '11', 16, 5);

  -- Product 65: Soho Calfskin Leather Oxford Dress Shoes
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shoes, b_milano, col_black, 'Soho Calfskin Leather Oxford Dress Shoes', 'soho-calfskin-leather-oxford-dress-shoes', 'A masterpiece from Tokiyo design studio. Crafted from premium Full-Grain Calfskin Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Full-Grain Calfskin Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 540.00, 675.00, 'TK-SH-165', 'Full-Grain Calfskin Leather', true, false, true, 4.4, 22)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-165-BLA-8', 'Black', '8', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-165-BLA-9', 'Black', '9', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-165-BLA-10', 'Black', '10', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-165-BLA-11', 'Black', '11', 18, 5);

  -- Product 66: Prestige Tuscan Suede Derby Leather Shoes
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shoes, b_atlas, col_summer, 'Prestige Tuscan Suede Derby Leather Shoes', 'prestige-tuscan-suede-derby-leather-shoes', 'A masterpiece from Tokiyo design studio. Crafted from premium Genuine Tuscan Suede designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Genuine Tuscan Suede oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 585.00, 731.00, 'TK-SH-166', 'Genuine Tuscan Suede', true, false, false, 4.5, 25)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-166-BLA-8', 'Black', '8', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-166-BLA-9', 'Black', '9', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-166-BLA-10', 'Black', '10', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-166-BLA-11', 'Black', '11', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-166-NAV-8', 'Navy', '8', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-166-NAV-9', 'Navy', '9', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-166-NAV-10', 'Navy', '10', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-166-NAV-11', 'Navy', '11', 20, 5);

  -- Product 67: Regal Calf Leather Oxford Dress Shoes
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shoes, b_sov, col_classic, 'Regal Calf Leather Oxford Dress Shoes', 'regal-calf-leather-oxford-dress-shoes', 'A masterpiece from Tokiyo design studio. Crafted from premium Hand-Burnished Calf Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Hand-Burnished Calf Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 630.00, 788.00, 'TK-SH-167', 'Hand-Burnished Calf Leather', true, true, false, 4.6, 28)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-167-BLA-8', 'Black', '8', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-167-BLA-9', 'Black', '9', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-167-BLA-10', 'Black', '10', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-167-BLA-11', 'Black', '11', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-167-NAV-8', 'Navy', '8', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-167-NAV-9', 'Navy', '9', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-167-NAV-10', 'Navy', '10', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-167-NAV-11', 'Navy', '11', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-167-GRE-8', 'Grey', '8', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-167-GRE-9', 'Grey', '9', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-167-GRE-10', 'Grey', '10', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-167-GRE-11', 'Grey', '11', 22, 5);

  -- Product 68: Signature Cordovan Leather Derby Leather Shoes
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shoes, b_aurum, col_black, 'Signature Cordovan Leather Derby Leather Shoes', 'signature-cordovan-leather-derby-leather-shoes', 'A masterpiece from Tokiyo design studio. Crafted from premium Cordovan Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Cordovan Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 675.00, 844.00, 'TK-SH-168', 'Cordovan Leather', true, false, false, 4.7, 6)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-168-BLA-8', 'Black', '8', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-168-BLA-9', 'Black', '9', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-168-BLA-10', 'Black', '10', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-168-BLA-11', 'Black', '11', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-168-NAV-8', 'Navy', '8', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-168-NAV-9', 'Navy', '9', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-168-NAV-10', 'Navy', '10', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-168-NAV-11', 'Navy', '11', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-168-GRE-8', 'Grey', '8', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-168-GRE-9', 'Grey', '9', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-168-GRE-10', 'Grey', '10', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-168-GRE-11', 'Grey', '11', 24, 5);

  -- Product 69: Vanguard Calfskin Leather Oxford Dress Shoes
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shoes, b_tokiyo, col_summer, 'Vanguard Calfskin Leather Oxford Dress Shoes', 'vanguard-calfskin-leather-oxford-dress-shoes', 'A masterpiece from Tokiyo design studio. Crafted from premium Full-Grain Calfskin Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Full-Grain Calfskin Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 720.00, 900.00, 'TK-SH-169', 'Full-Grain Calfskin Leather', true, false, true, 4.8, 9)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1478186272116-c74477c9b8a5?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-169-BLA-8', 'Black', '8', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-169-BLA-9', 'Black', '9', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-169-BLA-10', 'Black', '10', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-169-BLA-11', 'Black', '11', 26, 5);

  -- Product 70: Legacy Tuscan Suede Derby Leather Shoes
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shoes, b_milano, col_classic, 'Legacy Tuscan Suede Derby Leather Shoes', 'legacy-tuscan-suede-derby-leather-shoes', 'A masterpiece from Tokiyo design studio. Crafted from premium Genuine Tuscan Suede designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Genuine Tuscan Suede oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 765.00, 956.00, 'TK-SH-170', 'Genuine Tuscan Suede', true, true, false, 4.9, 12)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-170-BLA-8', 'Black', '8', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-170-BLA-9', 'Black', '9', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-170-BLA-10', 'Black', '10', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-170-BLA-11', 'Black', '11', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-170-NAV-8', 'Navy', '8', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-170-NAV-9', 'Navy', '9', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-170-NAV-10', 'Navy', '10', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-170-NAV-11', 'Navy', '11', 28, 5);

  -- Product 71: Atelier Calf Leather Oxford Dress Shoes
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shoes, b_atlas, col_black, 'Atelier Calf Leather Oxford Dress Shoes', 'atelier-calf-leather-oxford-dress-shoes', 'A masterpiece from Tokiyo design studio. Crafted from premium Hand-Burnished Calf Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Hand-Burnished Calf Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 810.00, 1013.00, 'TK-SH-171', 'Hand-Burnished Calf Leather', true, false, false, 4.0, 15)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-171-BLA-8', 'Black', '8', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-171-BLA-9', 'Black', '9', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-171-BLA-10', 'Black', '10', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-171-BLA-11', 'Black', '11', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-171-NAV-8', 'Navy', '8', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-171-NAV-9', 'Navy', '9', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-171-NAV-10', 'Navy', '10', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-171-NAV-11', 'Navy', '11', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-171-GRE-8', 'Grey', '8', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-171-GRE-9', 'Grey', '9', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-171-GRE-10', 'Grey', '10', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-171-GRE-11', 'Grey', '11', 30, 5);

  -- Product 72: Royal Cordovan Leather Derby Leather Shoes
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shoes, b_sov, col_summer, 'Royal Cordovan Leather Derby Leather Shoes', 'royal-cordovan-leather-derby-leather-shoes', 'A masterpiece from Tokiyo design studio. Crafted from premium Cordovan Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Cordovan Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 855.00, 1069.00, 'TK-SH-172', 'Cordovan Leather', true, false, false, 4.1, 18)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-172-BLA-8', 'Black', '8', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-172-BLA-9', 'Black', '9', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-172-BLA-10', 'Black', '10', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-172-BLA-11', 'Black', '11', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-172-NAV-8', 'Navy', '8', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-172-NAV-9', 'Navy', '9', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-172-NAV-10', 'Navy', '10', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-172-NAV-11', 'Navy', '11', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-172-GRE-8', 'Grey', '8', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-172-GRE-9', 'Grey', '9', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-172-GRE-10', 'Grey', '10', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-172-GRE-11', 'Grey', '11', 32, 5);

  -- Product 73: Imperial Calfskin Leather Oxford Dress Shoes
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shoes, b_aurum, col_classic, 'Imperial Calfskin Leather Oxford Dress Shoes', 'imperial-calfskin-leather-oxford-dress-shoes', 'A masterpiece from Tokiyo design studio. Crafted from premium Full-Grain Calfskin Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Full-Grain Calfskin Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 900.00, 1125.00, 'TK-SH-173', 'Full-Grain Calfskin Leather', true, true, true, 4.2, 21)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-173-BLA-8', 'Black', '8', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-173-BLA-9', 'Black', '9', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-173-BLA-10', 'Black', '10', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-173-BLA-11', 'Black', '11', 34, 5);

  -- Product 74: Savile Row Tuscan Suede Derby Leather Shoes
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shoes, b_tokiyo, col_black, 'Savile Row Tuscan Suede Derby Leather Shoes', 'savile-row-tuscan-suede-derby-leather-shoes', 'A masterpiece from Tokiyo design studio. Crafted from premium Genuine Tuscan Suede designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Genuine Tuscan Suede oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 945.00, 1181.00, 'TK-SH-174', 'Genuine Tuscan Suede', true, false, false, 4.3, 24)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-174-BLA-8', 'Black', '8', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-174-BLA-9', 'Black', '9', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-174-BLA-10', 'Black', '10', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-174-BLA-11', 'Black', '11', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-174-NAV-8', 'Navy', '8', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-174-NAV-9', 'Navy', '9', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-174-NAV-10', 'Navy', '10', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-174-NAV-11', 'Navy', '11', 36, 5);

  -- Product 75: Classic Calf Leather Oxford Dress Shoes
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shoes, b_milano, col_summer, 'Classic Calf Leather Oxford Dress Shoes', 'classic-calf-leather-oxford-dress-shoes', 'A masterpiece from Tokiyo design studio. Crafted from premium Hand-Burnished Calf Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Hand-Burnished Calf Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 990.00, 1238.00, 'TK-SH-175', 'Hand-Burnished Calf Leather', true, false, false, 4.4, 27)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-175-BLA-8', 'Black', '8', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-175-BLA-9', 'Black', '9', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-175-BLA-10', 'Black', '10', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-175-BLA-11', 'Black', '11', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-175-NAV-8', 'Navy', '8', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-175-NAV-9', 'Navy', '9', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-175-NAV-10', 'Navy', '10', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-175-NAV-11', 'Navy', '11', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-175-GRE-8', 'Grey', '8', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-175-GRE-9', 'Grey', '9', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-175-GRE-10', 'Grey', '10', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-175-GRE-11', 'Grey', '11', 38, 5);

  -- Product 76: Napoli Cordovan Leather Derby Leather Shoes
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_shoes, b_atlas, col_classic, 'Napoli Cordovan Leather Derby Leather Shoes', 'napoli-cordovan-leather-derby-leather-shoes', 'A masterpiece from Tokiyo design studio. Crafted from premium Cordovan Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Cordovan Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1035.00, 1294.00, 'TK-SH-176', 'Cordovan Leather', true, true, false, 4.5, 5)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-176-BLA-8', 'Black', '8', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-176-BLA-9', 'Black', '9', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-176-BLA-10', 'Black', '10', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-176-BLA-11', 'Black', '11', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-176-NAV-8', 'Navy', '8', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-176-NAV-9', 'Navy', '9', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-176-NAV-10', 'Navy', '10', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-176-NAV-11', 'Navy', '11', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-176-GRE-8', 'Grey', '8', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-176-GRE-9', 'Grey', '9', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-176-GRE-10', 'Grey', '10', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-SH-176-GRE-11', 'Grey', '11', 40, 5);

  -- Product 77: Tuscan Plated Steel Classic Dress Watch
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_watches, b_tokiyo, col_black, 'Tuscan Plated Steel Classic Dress Watch', 'tuscan-plated-steel-classic-dress-watch', 'A masterpiece from Tokiyo design studio. Crafted from premium 18k Rose Gold Plated Steel designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay 18k Rose Gold Plated Steel oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1070.00, 1338.00, 'TK-WA-177', '18k Rose Gold Plated Steel', true, false, true, 4.6, 8)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-177-BLA-One Size', 'Black', 'One Size', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-177-NAV-One Size', 'Navy', 'One Size', 42, 5);

  -- Product 78: Cambridge Stainless Steel Chronograph Automatic Watch
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_watches, b_milano, col_summer, 'Cambridge Stainless Steel Chronograph Automatic Watch', 'cambridge-stainless-steel-chronograph-automatic-watch', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Surgical Stainless Steel designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Surgical Stainless Steel oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1290.00, 1613.00, 'TK-WA-178', 'Premium Surgical Stainless Steel', true, false, false, 4.7, 11)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-178-BLA-One Size', 'Black', 'One Size', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-178-NAV-One Size', 'Navy', 'One Size', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-178-GRE-One Size', 'Grey', 'One Size', 44, 5);

  -- Product 79: Soho Ceramic Carbon Classic Dress Watch
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_watches, b_atlas, col_classic, 'Soho Ceramic Carbon Classic Dress Watch', 'soho-ceramic-carbon-classic-dress-watch', 'A masterpiece from Tokiyo design studio. Crafted from premium Polished Ceramic Carbon designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Polished Ceramic Carbon oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1510.00, 1888.00, 'TK-WA-179', 'Polished Ceramic Carbon', true, true, false, 4.8, 14)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-179-BLA-One Size', 'Black', 'One Size', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-179-NAV-One Size', 'Navy', 'One Size', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-179-GRE-One Size', 'Grey', 'One Size', 46, 5);

  -- Product 80: Prestige 5 Titanium Chronograph Automatic Watch
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_watches, b_sov, col_black, 'Prestige 5 Titanium Chronograph Automatic Watch', 'prestige-5-titanium-chronograph-automatic-watch', 'A masterpiece from Tokiyo design studio. Crafted from premium Grade 5 Titanium designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Grade 5 Titanium oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1730.00, 2163.00, 'TK-WA-180', 'Grade 5 Titanium', true, false, false, 4.9, 17)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-180-BLA-One Size', 'Black', 'One Size', 48, 5);

  -- Product 81: Regal Plated Steel Classic Dress Watch
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_watches, b_aurum, col_summer, 'Regal Plated Steel Classic Dress Watch', 'regal-plated-steel-classic-dress-watch', 'A masterpiece from Tokiyo design studio. Crafted from premium 18k Rose Gold Plated Steel designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay 18k Rose Gold Plated Steel oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1950.00, 2438.00, 'TK-WA-181', '18k Rose Gold Plated Steel', true, false, true, 4.0, 20)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-181-BLA-One Size', 'Black', 'One Size', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-181-NAV-One Size', 'Navy', 'One Size', 10, 5);

  -- Product 82: Signature Stainless Steel Chronograph Automatic Watch
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_watches, b_tokiyo, col_classic, 'Signature Stainless Steel Chronograph Automatic Watch', 'signature-stainless-steel-chronograph-automatic-watch', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Surgical Stainless Steel designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Surgical Stainless Steel oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 2170.00, 2713.00, 'TK-WA-182', 'Premium Surgical Stainless Steel', true, true, false, 4.1, 23)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-182-BLA-One Size', 'Black', 'One Size', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-182-NAV-One Size', 'Navy', 'One Size', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-182-GRE-One Size', 'Grey', 'One Size', 12, 5);

  -- Product 83: Vanguard Ceramic Carbon Classic Dress Watch
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_watches, b_milano, col_black, 'Vanguard Ceramic Carbon Classic Dress Watch', 'vanguard-ceramic-carbon-classic-dress-watch', 'A masterpiece from Tokiyo design studio. Crafted from premium Polished Ceramic Carbon designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Polished Ceramic Carbon oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 2390.00, 2988.00, 'TK-WA-183', 'Polished Ceramic Carbon', true, false, false, 4.2, 26)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-183-BLA-One Size', 'Black', 'One Size', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-183-NAV-One Size', 'Navy', 'One Size', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-183-GRE-One Size', 'Grey', 'One Size', 14, 5);

  -- Product 84: Legacy 5 Titanium Chronograph Automatic Watch
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_watches, b_atlas, col_summer, 'Legacy 5 Titanium Chronograph Automatic Watch', 'legacy-5-titanium-chronograph-automatic-watch', 'A masterpiece from Tokiyo design studio. Crafted from premium Grade 5 Titanium designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Grade 5 Titanium oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 2610.00, 3263.00, 'TK-WA-184', 'Grade 5 Titanium', true, false, false, 4.3, 29)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1434056886845-dac89ffd9b5d?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-184-BLA-One Size', 'Black', 'One Size', 16, 5);

  -- Product 85: Atelier Plated Steel Classic Dress Watch
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_watches, b_sov, col_classic, 'Atelier Plated Steel Classic Dress Watch', 'atelier-plated-steel-classic-dress-watch', 'A masterpiece from Tokiyo design studio. Crafted from premium 18k Rose Gold Plated Steel designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay 18k Rose Gold Plated Steel oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 2830.00, 3538.00, 'TK-WA-185', '18k Rose Gold Plated Steel', true, true, true, 4.4, 7)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-185-BLA-One Size', 'Black', 'One Size', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-185-NAV-One Size', 'Navy', 'One Size', 18, 5);

  -- Product 86: Royal Stainless Steel Chronograph Automatic Watch
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_watches, b_aurum, col_black, 'Royal Stainless Steel Chronograph Automatic Watch', 'royal-stainless-steel-chronograph-automatic-watch', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Surgical Stainless Steel designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Surgical Stainless Steel oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 3050.00, 3813.00, 'TK-WA-186', 'Premium Surgical Stainless Steel', true, false, false, 4.5, 10)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-186-BLA-One Size', 'Black', 'One Size', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-186-NAV-One Size', 'Navy', 'One Size', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-186-GRE-One Size', 'Grey', 'One Size', 20, 5);

  -- Product 87: Imperial Ceramic Carbon Classic Dress Watch
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_watches, b_tokiyo, col_summer, 'Imperial Ceramic Carbon Classic Dress Watch', 'imperial-ceramic-carbon-classic-dress-watch', 'A masterpiece from Tokiyo design studio. Crafted from premium Polished Ceramic Carbon designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Polished Ceramic Carbon oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 3270.00, 4088.00, 'TK-WA-187', 'Polished Ceramic Carbon', true, false, false, 4.6, 13)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-187-BLA-One Size', 'Black', 'One Size', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-187-NAV-One Size', 'Navy', 'One Size', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-187-GRE-One Size', 'Grey', 'One Size', 22, 5);

  -- Product 88: Savile Row 5 Titanium Chronograph Automatic Watch
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_watches, b_milano, col_classic, 'Savile Row 5 Titanium Chronograph Automatic Watch', 'savile-row-5-titanium-chronograph-automatic-watch', 'A masterpiece from Tokiyo design studio. Crafted from premium Grade 5 Titanium designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Grade 5 Titanium oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 3490.00, 4363.00, 'TK-WA-188', 'Grade 5 Titanium', true, true, false, 4.7, 16)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-188-BLA-One Size', 'Black', 'One Size', 24, 5);

  -- Product 89: Classic Plated Steel Classic Dress Watch
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_watches, b_atlas, col_black, 'Classic Plated Steel Classic Dress Watch', 'classic-plated-steel-classic-dress-watch', 'A masterpiece from Tokiyo design studio. Crafted from premium 18k Rose Gold Plated Steel designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay 18k Rose Gold Plated Steel oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 3710.00, 4638.00, 'TK-WA-189', '18k Rose Gold Plated Steel', true, false, true, 4.8, 19)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-189-BLA-One Size', 'Black', 'One Size', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-189-NAV-One Size', 'Navy', 'One Size', 26, 5);

  -- Product 90: Napoli Stainless Steel Chronograph Automatic Watch
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_watches, b_sov, col_summer, 'Napoli Stainless Steel Chronograph Automatic Watch', 'napoli-stainless-steel-chronograph-automatic-watch', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Surgical Stainless Steel designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Surgical Stainless Steel oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 3930.00, 4913.00, 'TK-WA-190', 'Premium Surgical Stainless Steel', true, false, false, 4.9, 22)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-190-BLA-One Size', 'Black', 'One Size', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-190-NAV-One Size', 'Navy', 'One Size', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-190-GRE-One Size', 'Grey', 'One Size', 28, 5);

  -- Product 91: Milano Ceramic Carbon Classic Dress Watch
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_watches, b_aurum, col_classic, 'Milano Ceramic Carbon Classic Dress Watch', 'milano-ceramic-carbon-classic-dress-watch', 'A masterpiece from Tokiyo design studio. Crafted from premium Polished Ceramic Carbon designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Polished Ceramic Carbon oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 4150.00, 5188.00, 'TK-WA-191', 'Polished Ceramic Carbon', true, true, false, 4.0, 25)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-191-BLA-One Size', 'Black', 'One Size', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-191-NAV-One Size', 'Navy', 'One Size', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-191-GRE-One Size', 'Grey', 'One Size', 30, 5);

  -- Product 92: Tuscan 5 Titanium Chronograph Automatic Watch
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_watches, b_tokiyo, col_black, 'Tuscan 5 Titanium Chronograph Automatic Watch', 'tuscan-5-titanium-chronograph-automatic-watch', 'A masterpiece from Tokiyo design studio. Crafted from premium Grade 5 Titanium designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Grade 5 Titanium oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 4370.00, 5463.00, 'TK-WA-192', 'Grade 5 Titanium', true, false, false, 4.1, 28)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1434056886845-dac89ffd9b5d?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-192-BLA-One Size', 'Black', 'One Size', 32, 5);

  -- Product 93: Cambridge Plated Steel Classic Dress Watch
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_watches, b_milano, col_summer, 'Cambridge Plated Steel Classic Dress Watch', 'cambridge-plated-steel-classic-dress-watch', 'A masterpiece from Tokiyo design studio. Crafted from premium 18k Rose Gold Plated Steel designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay 18k Rose Gold Plated Steel oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 4590.00, 5738.00, 'TK-WA-193', '18k Rose Gold Plated Steel', true, false, true, 4.2, 6)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-193-BLA-One Size', 'Black', 'One Size', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-193-NAV-One Size', 'Navy', 'One Size', 34, 5);

  -- Product 94: Soho Stainless Steel Chronograph Automatic Watch
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_watches, b_atlas, col_classic, 'Soho Stainless Steel Chronograph Automatic Watch', 'soho-stainless-steel-chronograph-automatic-watch', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Surgical Stainless Steel designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Surgical Stainless Steel oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 4810.00, 6013.00, 'TK-WA-194', 'Premium Surgical Stainless Steel', true, true, false, 4.3, 9)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-194-BLA-One Size', 'Black', 'One Size', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-194-NAV-One Size', 'Navy', 'One Size', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-194-GRE-One Size', 'Grey', 'One Size', 36, 5);

  -- Product 95: Prestige Ceramic Carbon Classic Dress Watch
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_watches, b_sov, col_black, 'Prestige Ceramic Carbon Classic Dress Watch', 'prestige-ceramic-carbon-classic-dress-watch', 'A masterpiece from Tokiyo design studio. Crafted from premium Polished Ceramic Carbon designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Polished Ceramic Carbon oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 5030.00, 6288.00, 'TK-WA-195', 'Polished Ceramic Carbon', true, false, false, 4.4, 12)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-195-BLA-One Size', 'Black', 'One Size', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-195-NAV-One Size', 'Navy', 'One Size', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-WA-195-GRE-One Size', 'Grey', 'One Size', 38, 5);

  -- Product 96: Signature Bridle Leather Full-Grain Leather Belt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_acc, b_milano, col_summer, 'Signature Bridle Leather Full-Grain Leather Belt', 'signature-bridle-leather-full-grain-leather-belt', 'A masterpiece from Tokiyo design studio. Crafted from premium Full-Grain Bridle Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Full-Grain Bridle Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 55.00, 69.00, 'TK-AC-196', 'Full-Grain Bridle Leather', true, false, false, 4.5, 15)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-196-BLA-One Size', 'Black', 'One Size', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-196-NAV-One Size', 'Navy', 'One Size', 40, 5);

  -- Product 97: Vanguard Plated Gold Silk Necktie
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_acc, b_atlas, col_classic, 'Vanguard Plated Gold Silk Necktie', 'vanguard-plated-gold-silk-necktie', 'A masterpiece from Tokiyo design studio. Crafted from premium Solid Brass Plated Gold designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Solid Brass Plated Gold oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 65.00, 81.00, 'TK-AC-197', 'Solid Brass Plated Gold', true, true, true, 4.6, 18)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-197-BLA-One Size', 'Black', 'One Size', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-197-NAV-One Size', 'Navy', 'One Size', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-197-GRE-One Size', 'Grey', 'One Size', 42, 5);

  -- Product 98: Legacy Premium Cashmere Full-Grain Leather Belt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_acc, b_sov, col_black, 'Legacy Premium Cashmere Full-Grain Leather Belt', 'legacy-premium-cashmere-full-grain-leather-belt', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Cashmere designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Cashmere oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 75.00, 94.00, 'TK-AC-198', 'Premium Cashmere', true, false, false, 4.7, 21)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-198-BLA-One Size', 'Black', 'One Size', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-198-NAV-One Size', 'Navy', 'One Size', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-198-GRE-One Size', 'Grey', 'One Size', 44, 5);

  -- Product 99: Atelier Mulberry Silk Silk Necktie
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_acc, b_aurum, col_summer, 'Atelier Mulberry Silk Silk Necktie', 'atelier-mulberry-silk-silk-necktie', 'A masterpiece from Tokiyo design studio. Crafted from premium 100% Mulberry Silk designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay 100% Mulberry Silk oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 85.00, 106.00, 'TK-AC-199', '100% Mulberry Silk', true, false, false, 4.8, 24)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-199-BLA-One Size', 'Black', 'One Size', 46, 5);

  -- Product 100: Royal Bridle Leather Full-Grain Leather Belt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_acc, b_tokiyo, col_classic, 'Royal Bridle Leather Full-Grain Leather Belt', 'royal-bridle-leather-full-grain-leather-belt', 'A masterpiece from Tokiyo design studio. Crafted from premium Full-Grain Bridle Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Full-Grain Bridle Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 95.00, 119.00, 'TK-AC-200', 'Full-Grain Bridle Leather', true, true, false, 4.9, 27)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-200-BLA-One Size', 'Black', 'One Size', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-200-NAV-One Size', 'Navy', 'One Size', 48, 5);

  -- Product 101: Imperial Plated Gold Silk Necktie
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_acc, b_milano, col_black, 'Imperial Plated Gold Silk Necktie', 'imperial-plated-gold-silk-necktie', 'A masterpiece from Tokiyo design studio. Crafted from premium Solid Brass Plated Gold designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Solid Brass Plated Gold oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 105.00, 131.00, 'TK-AC-201', 'Solid Brass Plated Gold', true, false, true, 4.0, 5)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-201-BLA-One Size', 'Black', 'One Size', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-201-NAV-One Size', 'Navy', 'One Size', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-201-GRE-One Size', 'Grey', 'One Size', 10, 5);

  -- Product 102: Savile Row Premium Cashmere Full-Grain Leather Belt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_acc, b_atlas, col_summer, 'Savile Row Premium Cashmere Full-Grain Leather Belt', 'savile-row-premium-cashmere-full-grain-leather-belt', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Cashmere designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Cashmere oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 115.00, 144.00, 'TK-AC-202', 'Premium Cashmere', true, false, false, 4.1, 8)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-202-BLA-One Size', 'Black', 'One Size', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-202-NAV-One Size', 'Navy', 'One Size', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-202-GRE-One Size', 'Grey', 'One Size', 12, 5);

  -- Product 103: Classic Mulberry Silk Silk Necktie
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_acc, b_sov, col_classic, 'Classic Mulberry Silk Silk Necktie', 'classic-mulberry-silk-silk-necktie', 'A masterpiece from Tokiyo design studio. Crafted from premium 100% Mulberry Silk designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay 100% Mulberry Silk oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 125.00, 156.00, 'TK-AC-203', '100% Mulberry Silk', true, true, false, 4.2, 11)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e5?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-203-BLA-One Size', 'Black', 'One Size', 14, 5);

  -- Product 104: Napoli Bridle Leather Full-Grain Leather Belt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_acc, b_aurum, col_black, 'Napoli Bridle Leather Full-Grain Leather Belt', 'napoli-bridle-leather-full-grain-leather-belt', 'A masterpiece from Tokiyo design studio. Crafted from premium Full-Grain Bridle Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Full-Grain Bridle Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 135.00, 169.00, 'TK-AC-204', 'Full-Grain Bridle Leather', true, false, false, 4.3, 14)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-204-BLA-One Size', 'Black', 'One Size', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-204-NAV-One Size', 'Navy', 'One Size', 16, 5);

  -- Product 105: Milano Plated Gold Silk Necktie
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_acc, b_tokiyo, col_summer, 'Milano Plated Gold Silk Necktie', 'milano-plated-gold-silk-necktie', 'A masterpiece from Tokiyo design studio. Crafted from premium Solid Brass Plated Gold designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Solid Brass Plated Gold oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 145.00, 181.00, 'TK-AC-205', 'Solid Brass Plated Gold', true, false, true, 4.4, 17)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-205-BLA-One Size', 'Black', 'One Size', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-205-NAV-One Size', 'Navy', 'One Size', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-205-GRE-One Size', 'Grey', 'One Size', 18, 5);

  -- Product 106: Tuscan Premium Cashmere Full-Grain Leather Belt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_acc, b_milano, col_classic, 'Tuscan Premium Cashmere Full-Grain Leather Belt', 'tuscan-premium-cashmere-full-grain-leather-belt', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Cashmere designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Cashmere oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 155.00, 194.00, 'TK-AC-206', 'Premium Cashmere', true, true, false, 4.5, 20)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-206-BLA-One Size', 'Black', 'One Size', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-206-NAV-One Size', 'Navy', 'One Size', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-206-GRE-One Size', 'Grey', 'One Size', 20, 5);

  -- Product 107: Cambridge Mulberry Silk Silk Necktie
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_acc, b_atlas, col_black, 'Cambridge Mulberry Silk Silk Necktie', 'cambridge-mulberry-silk-silk-necktie', 'A masterpiece from Tokiyo design studio. Crafted from premium 100% Mulberry Silk designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay 100% Mulberry Silk oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 165.00, 206.00, 'TK-AC-207', '100% Mulberry Silk', true, false, false, 4.6, 23)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-207-BLA-One Size', 'Black', 'One Size', 22, 5);

  -- Product 108: Soho Bridle Leather Full-Grain Leather Belt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_acc, b_sov, col_summer, 'Soho Bridle Leather Full-Grain Leather Belt', 'soho-bridle-leather-full-grain-leather-belt', 'A masterpiece from Tokiyo design studio. Crafted from premium Full-Grain Bridle Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Full-Grain Bridle Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 175.00, 219.00, 'TK-AC-208', 'Full-Grain Bridle Leather', true, false, false, 4.7, 26)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-208-BLA-One Size', 'Black', 'One Size', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-208-NAV-One Size', 'Navy', 'One Size', 24, 5);

  -- Product 109: Prestige Plated Gold Silk Necktie
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_acc, b_aurum, col_classic, 'Prestige Plated Gold Silk Necktie', 'prestige-plated-gold-silk-necktie', 'A masterpiece from Tokiyo design studio. Crafted from premium Solid Brass Plated Gold designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Solid Brass Plated Gold oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 185.00, 231.00, 'TK-AC-209', 'Solid Brass Plated Gold', true, true, true, 4.8, 29)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-209-BLA-One Size', 'Black', 'One Size', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-209-NAV-One Size', 'Navy', 'One Size', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-209-GRE-One Size', 'Grey', 'One Size', 26, 5);

  -- Product 110: Regal Premium Cashmere Full-Grain Leather Belt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_acc, b_tokiyo, col_black, 'Regal Premium Cashmere Full-Grain Leather Belt', 'regal-premium-cashmere-full-grain-leather-belt', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Cashmere designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Cashmere oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 195.00, 244.00, 'TK-AC-210', 'Premium Cashmere', true, false, false, 4.9, 7)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-210-BLA-One Size', 'Black', 'One Size', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-210-NAV-One Size', 'Navy', 'One Size', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-210-GRE-One Size', 'Grey', 'One Size', 28, 5);

  -- Product 111: Signature Mulberry Silk Silk Necktie
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_acc, b_milano, col_summer, 'Signature Mulberry Silk Silk Necktie', 'signature-mulberry-silk-silk-necktie', 'A masterpiece from Tokiyo design studio. Crafted from premium 100% Mulberry Silk designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay 100% Mulberry Silk oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 205.00, 256.00, 'TK-AC-211', '100% Mulberry Silk', true, false, false, 4.0, 10)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e5?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-211-BLA-One Size', 'Black', 'One Size', 30, 5);

  -- Product 112: Vanguard Bridle Leather Full-Grain Leather Belt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_acc, b_atlas, col_classic, 'Vanguard Bridle Leather Full-Grain Leather Belt', 'vanguard-bridle-leather-full-grain-leather-belt', 'A masterpiece from Tokiyo design studio. Crafted from premium Full-Grain Bridle Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Full-Grain Bridle Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 215.00, 269.00, 'TK-AC-212', 'Full-Grain Bridle Leather', true, true, false, 4.1, 13)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-212-BLA-One Size', 'Black', 'One Size', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-212-NAV-One Size', 'Navy', 'One Size', 32, 5);

  -- Product 113: Legacy Plated Gold Silk Necktie
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_acc, b_sov, col_black, 'Legacy Plated Gold Silk Necktie', 'legacy-plated-gold-silk-necktie', 'A masterpiece from Tokiyo design studio. Crafted from premium Solid Brass Plated Gold designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Solid Brass Plated Gold oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 225.00, 281.00, 'TK-AC-213', 'Solid Brass Plated Gold', true, false, true, 4.2, 16)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-213-BLA-One Size', 'Black', 'One Size', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-213-NAV-One Size', 'Navy', 'One Size', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-213-GRE-One Size', 'Grey', 'One Size', 34, 5);

  -- Product 114: Atelier Premium Cashmere Full-Grain Leather Belt
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_acc, b_aurum, col_summer, 'Atelier Premium Cashmere Full-Grain Leather Belt', 'atelier-premium-cashmere-full-grain-leather-belt', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Cashmere designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Cashmere oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 235.00, 294.00, 'TK-AC-214', 'Premium Cashmere', true, false, false, 4.3, 19)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-214-BLA-One Size', 'Black', 'One Size', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-214-NAV-One Size', 'Navy', 'One Size', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-AC-214-GRE-One Size', 'Grey', 'One Size', 36, 5);

  -- Product 115: Imperial Suede Leather Double-Breasted Blazer
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_outer, b_atlas, col_classic, 'Imperial Suede Leather Double-Breasted Blazer', 'imperial-suede-leather-double-breasted-blazer', 'A masterpiece from Tokiyo design studio. Crafted from premium Shearling-Lined Suede Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Shearling-Lined Suede Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 380.00, 475.00, 'TK-OU-215', 'Shearling-Lined Suede Leather', true, true, false, 4.4, 22)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-215-BLA-S', 'Black', 'S', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-215-BLA-M', 'Black', 'M', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-215-BLA-L', 'Black', 'L', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-215-BLA-XL', 'Black', 'XL', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-215-NAV-S', 'Navy', 'S', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-215-NAV-M', 'Navy', 'M', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-215-NAV-L', 'Navy', 'L', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-215-NAV-XL', 'Navy', 'XL', 38, 5);

  -- Product 116: Savile Row Lambskin Leather Trench Coat
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_outer, b_sov, col_black, 'Savile Row Lambskin Leather Trench Coat', 'savile-row-lambskin-leather-trench-coat', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Lambskin Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Lambskin Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 440.00, 550.00, 'TK-OU-216', 'Premium Lambskin Leather', true, false, false, 4.5, 25)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-216-BLA-S', 'Black', 'S', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-216-BLA-M', 'Black', 'M', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-216-BLA-L', 'Black', 'L', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-216-BLA-XL', 'Black', 'XL', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-216-NAV-S', 'Navy', 'S', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-216-NAV-M', 'Navy', 'M', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-216-NAV-L', 'Navy', 'L', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-216-NAV-XL', 'Navy', 'XL', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-216-GRE-S', 'Grey', 'S', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-216-GRE-M', 'Grey', 'M', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-216-GRE-L', 'Grey', 'L', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-216-GRE-XL', 'Grey', 'XL', 40, 5);

  -- Product 117: Classic Cashmere Wool Double-Breasted Blazer
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_outer, b_aurum, col_summer, 'Classic Cashmere Wool Double-Breasted Blazer', 'classic-cashmere-wool-double-breasted-blazer', 'A masterpiece from Tokiyo design studio. Crafted from premium Double-Face Cashmere Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Double-Face Cashmere Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 500.00, 625.00, 'TK-OU-217', 'Double-Face Cashmere Wool', true, false, true, 4.6, 28)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-217-BLA-S', 'Black', 'S', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-217-BLA-M', 'Black', 'M', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-217-BLA-L', 'Black', 'L', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-217-BLA-XL', 'Black', 'XL', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-217-NAV-S', 'Navy', 'S', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-217-NAV-M', 'Navy', 'M', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-217-NAV-L', 'Navy', 'L', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-217-NAV-XL', 'Navy', 'XL', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-217-GRE-S', 'Grey', 'S', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-217-GRE-M', 'Grey', 'M', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-217-GRE-L', 'Grey', 'L', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-217-GRE-XL', 'Grey', 'XL', 42, 5);

  -- Product 118: Napoli Wool Blend Trench Coat
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_outer, b_tokiyo, col_classic, 'Napoli Wool Blend Trench Coat', 'napoli-wool-blend-trench-coat', 'A masterpiece from Tokiyo design studio. Crafted from premium Water-Resistant Wool Blend designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Water-Resistant Wool Blend oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 560.00, 700.00, 'TK-OU-218', 'Water-Resistant Wool Blend', true, true, false, 4.7, 6)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-218-BLA-S', 'Black', 'S', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-218-BLA-M', 'Black', 'M', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-218-BLA-L', 'Black', 'L', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-218-BLA-XL', 'Black', 'XL', 44, 5);

  -- Product 119: Milano Suede Leather Double-Breasted Blazer
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_outer, b_milano, col_black, 'Milano Suede Leather Double-Breasted Blazer', 'milano-suede-leather-double-breasted-blazer', 'A masterpiece from Tokiyo design studio. Crafted from premium Shearling-Lined Suede Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Shearling-Lined Suede Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 620.00, 775.00, 'TK-OU-219', 'Shearling-Lined Suede Leather', true, false, false, 4.8, 9)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-219-BLA-S', 'Black', 'S', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-219-BLA-M', 'Black', 'M', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-219-BLA-L', 'Black', 'L', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-219-BLA-XL', 'Black', 'XL', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-219-NAV-S', 'Navy', 'S', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-219-NAV-M', 'Navy', 'M', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-219-NAV-L', 'Navy', 'L', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-219-NAV-XL', 'Navy', 'XL', 46, 5);

  -- Product 120: Tuscan Lambskin Leather Trench Coat
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_outer, b_atlas, col_summer, 'Tuscan Lambskin Leather Trench Coat', 'tuscan-lambskin-leather-trench-coat', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Lambskin Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Lambskin Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 680.00, 850.00, 'TK-OU-220', 'Premium Lambskin Leather', true, false, false, 4.9, 12)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-220-BLA-S', 'Black', 'S', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-220-BLA-M', 'Black', 'M', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-220-BLA-L', 'Black', 'L', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-220-BLA-XL', 'Black', 'XL', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-220-NAV-S', 'Navy', 'S', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-220-NAV-M', 'Navy', 'M', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-220-NAV-L', 'Navy', 'L', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-220-NAV-XL', 'Navy', 'XL', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-220-GRE-S', 'Grey', 'S', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-220-GRE-M', 'Grey', 'M', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-220-GRE-L', 'Grey', 'L', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-220-GRE-XL', 'Grey', 'XL', 48, 5);

  -- Product 121: Cambridge Cashmere Wool Double-Breasted Blazer
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_outer, b_sov, col_classic, 'Cambridge Cashmere Wool Double-Breasted Blazer', 'cambridge-cashmere-wool-double-breasted-blazer', 'A masterpiece from Tokiyo design studio. Crafted from premium Double-Face Cashmere Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Double-Face Cashmere Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 740.00, 925.00, 'TK-OU-221', 'Double-Face Cashmere Wool', true, true, true, 4.0, 15)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-221-BLA-S', 'Black', 'S', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-221-BLA-M', 'Black', 'M', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-221-BLA-L', 'Black', 'L', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-221-BLA-XL', 'Black', 'XL', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-221-NAV-S', 'Navy', 'S', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-221-NAV-M', 'Navy', 'M', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-221-NAV-L', 'Navy', 'L', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-221-NAV-XL', 'Navy', 'XL', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-221-GRE-S', 'Grey', 'S', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-221-GRE-M', 'Grey', 'M', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-221-GRE-L', 'Grey', 'L', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-221-GRE-XL', 'Grey', 'XL', 10, 5);

  -- Product 122: Soho Wool Blend Trench Coat
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_outer, b_aurum, col_black, 'Soho Wool Blend Trench Coat', 'soho-wool-blend-trench-coat', 'A masterpiece from Tokiyo design studio. Crafted from premium Water-Resistant Wool Blend designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Water-Resistant Wool Blend oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 800.00, 1000.00, 'TK-OU-222', 'Water-Resistant Wool Blend', true, false, false, 4.1, 18)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-222-BLA-S', 'Black', 'S', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-222-BLA-M', 'Black', 'M', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-222-BLA-L', 'Black', 'L', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-222-BLA-XL', 'Black', 'XL', 12, 5);

  -- Product 123: Prestige Suede Leather Double-Breasted Blazer
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_outer, b_tokiyo, col_summer, 'Prestige Suede Leather Double-Breasted Blazer', 'prestige-suede-leather-double-breasted-blazer', 'A masterpiece from Tokiyo design studio. Crafted from premium Shearling-Lined Suede Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Shearling-Lined Suede Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 860.00, 1075.00, 'TK-OU-223', 'Shearling-Lined Suede Leather', true, false, false, 4.2, 21)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-223-BLA-S', 'Black', 'S', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-223-BLA-M', 'Black', 'M', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-223-BLA-L', 'Black', 'L', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-223-BLA-XL', 'Black', 'XL', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-223-NAV-S', 'Navy', 'S', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-223-NAV-M', 'Navy', 'M', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-223-NAV-L', 'Navy', 'L', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-223-NAV-XL', 'Navy', 'XL', 14, 5);

  -- Product 124: Regal Lambskin Leather Trench Coat
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_outer, b_milano, col_classic, 'Regal Lambskin Leather Trench Coat', 'regal-lambskin-leather-trench-coat', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Lambskin Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Lambskin Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 920.00, 1150.00, 'TK-OU-224', 'Premium Lambskin Leather', true, true, false, 4.3, 24)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-224-BLA-S', 'Black', 'S', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-224-BLA-M', 'Black', 'M', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-224-BLA-L', 'Black', 'L', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-224-BLA-XL', 'Black', 'XL', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-224-NAV-S', 'Navy', 'S', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-224-NAV-M', 'Navy', 'M', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-224-NAV-L', 'Navy', 'L', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-224-NAV-XL', 'Navy', 'XL', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-224-GRE-S', 'Grey', 'S', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-224-GRE-M', 'Grey', 'M', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-224-GRE-L', 'Grey', 'L', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-224-GRE-XL', 'Grey', 'XL', 16, 5);

  -- Product 125: Signature Cashmere Wool Double-Breasted Blazer
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_outer, b_atlas, col_black, 'Signature Cashmere Wool Double-Breasted Blazer', 'signature-cashmere-wool-double-breasted-blazer', 'A masterpiece from Tokiyo design studio. Crafted from premium Double-Face Cashmere Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Double-Face Cashmere Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 980.00, 1225.00, 'TK-OU-225', 'Double-Face Cashmere Wool', true, false, true, 4.4, 27)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-225-BLA-S', 'Black', 'S', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-225-BLA-M', 'Black', 'M', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-225-BLA-L', 'Black', 'L', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-225-BLA-XL', 'Black', 'XL', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-225-NAV-S', 'Navy', 'S', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-225-NAV-M', 'Navy', 'M', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-225-NAV-L', 'Navy', 'L', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-225-NAV-XL', 'Navy', 'XL', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-225-GRE-S', 'Grey', 'S', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-225-GRE-M', 'Grey', 'M', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-225-GRE-L', 'Grey', 'L', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-225-GRE-XL', 'Grey', 'XL', 18, 5);

  -- Product 126: Vanguard Wool Blend Trench Coat
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_outer, b_sov, col_summer, 'Vanguard Wool Blend Trench Coat', 'vanguard-wool-blend-trench-coat', 'A masterpiece from Tokiyo design studio. Crafted from premium Water-Resistant Wool Blend designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Water-Resistant Wool Blend oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1040.00, 1300.00, 'TK-OU-226', 'Water-Resistant Wool Blend', true, false, false, 4.5, 5)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-226-BLA-S', 'Black', 'S', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-226-BLA-M', 'Black', 'M', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-226-BLA-L', 'Black', 'L', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-226-BLA-XL', 'Black', 'XL', 20, 5);

  -- Product 127: Legacy Suede Leather Double-Breasted Blazer
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_outer, b_aurum, col_classic, 'Legacy Suede Leather Double-Breasted Blazer', 'legacy-suede-leather-double-breasted-blazer', 'A masterpiece from Tokiyo design studio. Crafted from premium Shearling-Lined Suede Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Shearling-Lined Suede Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1100.00, 1375.00, 'TK-OU-227', 'Shearling-Lined Suede Leather', true, true, false, 4.6, 8)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-227-BLA-S', 'Black', 'S', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-227-BLA-M', 'Black', 'M', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-227-BLA-L', 'Black', 'L', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-227-BLA-XL', 'Black', 'XL', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-227-NAV-S', 'Navy', 'S', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-227-NAV-M', 'Navy', 'M', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-227-NAV-L', 'Navy', 'L', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-227-NAV-XL', 'Navy', 'XL', 22, 5);

  -- Product 128: Atelier Lambskin Leather Trench Coat
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_outer, b_tokiyo, col_black, 'Atelier Lambskin Leather Trench Coat', 'atelier-lambskin-leather-trench-coat', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Lambskin Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Lambskin Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1160.00, 1450.00, 'TK-OU-228', 'Premium Lambskin Leather', true, false, false, 4.7, 11)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-228-BLA-S', 'Black', 'S', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-228-BLA-M', 'Black', 'M', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-228-BLA-L', 'Black', 'L', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-228-BLA-XL', 'Black', 'XL', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-228-NAV-S', 'Navy', 'S', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-228-NAV-M', 'Navy', 'M', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-228-NAV-L', 'Navy', 'L', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-228-NAV-XL', 'Navy', 'XL', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-228-GRE-S', 'Grey', 'S', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-228-GRE-M', 'Grey', 'M', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-228-GRE-L', 'Grey', 'L', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-228-GRE-XL', 'Grey', 'XL', 24, 5);

  -- Product 129: Royal Cashmere Wool Double-Breasted Blazer
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_outer, b_milano, col_summer, 'Royal Cashmere Wool Double-Breasted Blazer', 'royal-cashmere-wool-double-breasted-blazer', 'A masterpiece from Tokiyo design studio. Crafted from premium Double-Face Cashmere Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Double-Face Cashmere Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1220.00, 1525.00, 'TK-OU-229', 'Double-Face Cashmere Wool', true, false, true, 4.8, 14)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-229-BLA-S', 'Black', 'S', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-229-BLA-M', 'Black', 'M', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-229-BLA-L', 'Black', 'L', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-229-BLA-XL', 'Black', 'XL', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-229-NAV-S', 'Navy', 'S', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-229-NAV-M', 'Navy', 'M', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-229-NAV-L', 'Navy', 'L', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-229-NAV-XL', 'Navy', 'XL', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-229-GRE-S', 'Grey', 'S', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-229-GRE-M', 'Grey', 'M', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-229-GRE-L', 'Grey', 'L', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-229-GRE-XL', 'Grey', 'XL', 26, 5);

  -- Product 130: Imperial Wool Blend Trench Coat
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_outer, b_atlas, col_classic, 'Imperial Wool Blend Trench Coat', 'imperial-wool-blend-trench-coat', 'A masterpiece from Tokiyo design studio. Crafted from premium Water-Resistant Wool Blend designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Water-Resistant Wool Blend oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1280.00, 1600.00, 'TK-OU-230', 'Water-Resistant Wool Blend', true, true, false, 4.9, 17)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-230-BLA-S', 'Black', 'S', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-230-BLA-M', 'Black', 'M', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-230-BLA-L', 'Black', 'L', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-230-BLA-XL', 'Black', 'XL', 28, 5);

  -- Product 131: Savile Row Suede Leather Double-Breasted Blazer
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_outer, b_sov, col_black, 'Savile Row Suede Leather Double-Breasted Blazer', 'savile-row-suede-leather-double-breasted-blazer', 'A masterpiece from Tokiyo design studio. Crafted from premium Shearling-Lined Suede Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Shearling-Lined Suede Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1340.00, 1675.00, 'TK-OU-231', 'Shearling-Lined Suede Leather', true, false, false, 4.0, 20)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-231-BLA-S', 'Black', 'S', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-231-BLA-M', 'Black', 'M', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-231-BLA-L', 'Black', 'L', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-231-BLA-XL', 'Black', 'XL', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-231-NAV-S', 'Navy', 'S', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-231-NAV-M', 'Navy', 'M', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-231-NAV-L', 'Navy', 'L', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-231-NAV-XL', 'Navy', 'XL', 30, 5);

  -- Product 132: Classic Lambskin Leather Trench Coat
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_outer, b_aurum, col_summer, 'Classic Lambskin Leather Trench Coat', 'classic-lambskin-leather-trench-coat', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Lambskin Leather designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Lambskin Leather oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1400.00, 1750.00, 'TK-OU-232', 'Premium Lambskin Leather', true, false, false, 4.1, 23)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-232-BLA-S', 'Black', 'S', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-232-BLA-M', 'Black', 'M', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-232-BLA-L', 'Black', 'L', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-232-BLA-XL', 'Black', 'XL', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-232-NAV-S', 'Navy', 'S', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-232-NAV-M', 'Navy', 'M', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-232-NAV-L', 'Navy', 'L', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-232-NAV-XL', 'Navy', 'XL', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-232-GRE-S', 'Grey', 'S', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-232-GRE-M', 'Grey', 'M', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-232-GRE-L', 'Grey', 'L', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-232-GRE-XL', 'Grey', 'XL', 32, 5);

  -- Product 133: Napoli Cashmere Wool Double-Breasted Blazer
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_outer, b_tokiyo, col_classic, 'Napoli Cashmere Wool Double-Breasted Blazer', 'napoli-cashmere-wool-double-breasted-blazer', 'A masterpiece from Tokiyo design studio. Crafted from premium Double-Face Cashmere Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Double-Face Cashmere Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 1460.00, 1825.00, 'TK-OU-233', 'Double-Face Cashmere Wool', true, true, true, 4.2, 26)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-233-BLA-S', 'Black', 'S', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-233-BLA-M', 'Black', 'M', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-233-BLA-L', 'Black', 'L', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-233-BLA-XL', 'Black', 'XL', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-233-NAV-S', 'Navy', 'S', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-233-NAV-M', 'Navy', 'M', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-233-NAV-L', 'Navy', 'L', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-233-NAV-XL', 'Navy', 'XL', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-233-GRE-S', 'Grey', 'S', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-233-GRE-M', 'Grey', 'M', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-233-GRE-L', 'Grey', 'L', 34, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-OU-233-GRE-XL', 'Grey', 'XL', 34, 5);

  -- Product 134: Tuscan Mongolian Cashmere Merino Wool Turtleneck
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_knit, b_sov, col_black, 'Tuscan Mongolian Cashmere Merino Wool Turtleneck', 'tuscan-mongolian-cashmere-merino-wool-turtleneck', 'A masterpiece from Tokiyo design studio. Crafted from premium Grade-A Mongolian Cashmere designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Grade-A Mongolian Cashmere oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 175.00, 219.00, 'TK-KN-234', 'Grade-A Mongolian Cashmere', true, false, false, 4.3, 29)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-234-BLA-S', 'Black', 'S', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-234-BLA-M', 'Black', 'M', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-234-BLA-L', 'Black', 'L', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-234-BLA-XL', 'Black', 'XL', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-234-NAV-S', 'Navy', 'S', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-234-NAV-M', 'Navy', 'M', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-234-NAV-L', 'Navy', 'L', 36, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-234-NAV-XL', 'Navy', 'XL', 36, 5);

  -- Product 135: Cambridge Premium Lambswool Cashmere V-Neck Sweater
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_knit, b_aurum, col_summer, 'Cambridge Premium Lambswool Cashmere V-Neck Sweater', 'cambridge-premium-lambswool-cashmere-v-neck-sweater', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Lambswool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Lambswool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 210.00, 263.00, 'TK-KN-235', 'Premium Lambswool', true, false, false, 4.4, 7)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1593672715438-d88a70629abe?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-235-BLA-S', 'Black', 'S', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-235-BLA-M', 'Black', 'M', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-235-BLA-L', 'Black', 'L', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-235-BLA-XL', 'Black', 'XL', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-235-NAV-S', 'Navy', 'S', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-235-NAV-M', 'Navy', 'M', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-235-NAV-L', 'Navy', 'L', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-235-NAV-XL', 'Navy', 'XL', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-235-GRE-S', 'Grey', 'S', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-235-GRE-M', 'Grey', 'M', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-235-GRE-L', 'Grey', 'L', 38, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-235-GRE-XL', 'Grey', 'XL', 38, 5);

  -- Product 136: Soho Alpaca Blend Merino Wool Turtleneck
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_knit, b_tokiyo, col_classic, 'Soho Alpaca Blend Merino Wool Turtleneck', 'soho-alpaca-blend-merino-wool-turtleneck', 'A masterpiece from Tokiyo design studio. Crafted from premium Super-Soft Alpaca Blend designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Super-Soft Alpaca Blend oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 245.00, 306.00, 'TK-KN-236', 'Super-Soft Alpaca Blend', true, true, false, 4.5, 10)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-236-BLA-S', 'Black', 'S', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-236-BLA-M', 'Black', 'M', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-236-BLA-L', 'Black', 'L', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-236-BLA-XL', 'Black', 'XL', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-236-NAV-S', 'Navy', 'S', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-236-NAV-M', 'Navy', 'M', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-236-NAV-L', 'Navy', 'L', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-236-NAV-XL', 'Navy', 'XL', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-236-GRE-S', 'Grey', 'S', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-236-GRE-M', 'Grey', 'M', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-236-GRE-L', 'Grey', 'L', 40, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-236-GRE-XL', 'Grey', 'XL', 40, 5);

  -- Product 137: Prestige Merino Wool Cashmere V-Neck Sweater
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_knit, b_milano, col_black, 'Prestige Merino Wool Cashmere V-Neck Sweater', 'prestige-merino-wool-cashmere-v-neck-sweater', 'A masterpiece from Tokiyo design studio. Crafted from premium Extra-Fine Merino Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Extra-Fine Merino Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 280.00, 350.00, 'TK-KN-237', 'Extra-Fine Merino Wool', true, false, true, 4.6, 13)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-237-BLA-S', 'Black', 'S', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-237-BLA-M', 'Black', 'M', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-237-BLA-L', 'Black', 'L', 42, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-237-BLA-XL', 'Black', 'XL', 42, 5);

  -- Product 138: Regal Mongolian Cashmere Merino Wool Turtleneck
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_knit, b_atlas, col_summer, 'Regal Mongolian Cashmere Merino Wool Turtleneck', 'regal-mongolian-cashmere-merino-wool-turtleneck', 'A masterpiece from Tokiyo design studio. Crafted from premium Grade-A Mongolian Cashmere designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Grade-A Mongolian Cashmere oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 315.00, 394.00, 'TK-KN-238', 'Grade-A Mongolian Cashmere', true, false, false, 4.7, 16)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-238-BLA-S', 'Black', 'S', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-238-BLA-M', 'Black', 'M', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-238-BLA-L', 'Black', 'L', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-238-BLA-XL', 'Black', 'XL', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-238-NAV-S', 'Navy', 'S', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-238-NAV-M', 'Navy', 'M', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-238-NAV-L', 'Navy', 'L', 44, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-238-NAV-XL', 'Navy', 'XL', 44, 5);

  -- Product 139: Signature Premium Lambswool Cashmere V-Neck Sweater
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_knit, b_sov, col_classic, 'Signature Premium Lambswool Cashmere V-Neck Sweater', 'signature-premium-lambswool-cashmere-v-neck-sweater', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Lambswool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Lambswool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 350.00, 438.00, 'TK-KN-239', 'Premium Lambswool', true, true, false, 4.8, 19)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-239-BLA-S', 'Black', 'S', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-239-BLA-M', 'Black', 'M', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-239-BLA-L', 'Black', 'L', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-239-BLA-XL', 'Black', 'XL', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-239-NAV-S', 'Navy', 'S', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-239-NAV-M', 'Navy', 'M', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-239-NAV-L', 'Navy', 'L', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-239-NAV-XL', 'Navy', 'XL', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-239-GRE-S', 'Grey', 'S', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-239-GRE-M', 'Grey', 'M', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-239-GRE-L', 'Grey', 'L', 46, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-239-GRE-XL', 'Grey', 'XL', 46, 5);

  -- Product 140: Vanguard Alpaca Blend Merino Wool Turtleneck
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_knit, b_aurum, col_black, 'Vanguard Alpaca Blend Merino Wool Turtleneck', 'vanguard-alpaca-blend-merino-wool-turtleneck', 'A masterpiece from Tokiyo design studio. Crafted from premium Super-Soft Alpaca Blend designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Super-Soft Alpaca Blend oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 385.00, 481.00, 'TK-KN-240', 'Super-Soft Alpaca Blend', true, false, false, 4.9, 22)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1598808503742-dd34bd03927f?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-240-BLA-S', 'Black', 'S', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-240-BLA-M', 'Black', 'M', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-240-BLA-L', 'Black', 'L', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-240-BLA-XL', 'Black', 'XL', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-240-NAV-S', 'Navy', 'S', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-240-NAV-M', 'Navy', 'M', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-240-NAV-L', 'Navy', 'L', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-240-NAV-XL', 'Navy', 'XL', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-240-GRE-S', 'Grey', 'S', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-240-GRE-M', 'Grey', 'M', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-240-GRE-L', 'Grey', 'L', 48, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-240-GRE-XL', 'Grey', 'XL', 48, 5);

  -- Product 141: Legacy Merino Wool Cashmere V-Neck Sweater
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_knit, b_tokiyo, col_summer, 'Legacy Merino Wool Cashmere V-Neck Sweater', 'legacy-merino-wool-cashmere-v-neck-sweater', 'A masterpiece from Tokiyo design studio. Crafted from premium Extra-Fine Merino Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Extra-Fine Merino Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 420.00, 525.00, 'TK-KN-241', 'Extra-Fine Merino Wool', true, false, true, 4.0, 25)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-241-BLA-S', 'Black', 'S', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-241-BLA-M', 'Black', 'M', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-241-BLA-L', 'Black', 'L', 10, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-241-BLA-XL', 'Black', 'XL', 10, 5);

  -- Product 142: Atelier Mongolian Cashmere Merino Wool Turtleneck
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_knit, b_milano, col_classic, 'Atelier Mongolian Cashmere Merino Wool Turtleneck', 'atelier-mongolian-cashmere-merino-wool-turtleneck', 'A masterpiece from Tokiyo design studio. Crafted from premium Grade-A Mongolian Cashmere designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Grade-A Mongolian Cashmere oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 455.00, 569.00, 'TK-KN-242', 'Grade-A Mongolian Cashmere', true, true, false, 4.1, 28)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-242-BLA-S', 'Black', 'S', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-242-BLA-M', 'Black', 'M', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-242-BLA-L', 'Black', 'L', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-242-BLA-XL', 'Black', 'XL', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-242-NAV-S', 'Navy', 'S', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-242-NAV-M', 'Navy', 'M', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-242-NAV-L', 'Navy', 'L', 12, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-242-NAV-XL', 'Navy', 'XL', 12, 5);

  -- Product 143: Royal Premium Lambswool Cashmere V-Neck Sweater
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_knit, b_atlas, col_black, 'Royal Premium Lambswool Cashmere V-Neck Sweater', 'royal-premium-lambswool-cashmere-v-neck-sweater', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Lambswool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Lambswool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 490.00, 613.00, 'TK-KN-243', 'Premium Lambswool', true, false, false, 4.2, 6)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1593672715438-d88a70629abe?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-243-BLA-S', 'Black', 'S', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-243-BLA-M', 'Black', 'M', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-243-BLA-L', 'Black', 'L', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-243-BLA-XL', 'Black', 'XL', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-243-NAV-S', 'Navy', 'S', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-243-NAV-M', 'Navy', 'M', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-243-NAV-L', 'Navy', 'L', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-243-NAV-XL', 'Navy', 'XL', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-243-GRE-S', 'Grey', 'S', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-243-GRE-M', 'Grey', 'M', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-243-GRE-L', 'Grey', 'L', 14, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-243-GRE-XL', 'Grey', 'XL', 14, 5);

  -- Product 144: Imperial Alpaca Blend Merino Wool Turtleneck
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_knit, b_sov, col_summer, 'Imperial Alpaca Blend Merino Wool Turtleneck', 'imperial-alpaca-blend-merino-wool-turtleneck', 'A masterpiece from Tokiyo design studio. Crafted from premium Super-Soft Alpaca Blend designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Super-Soft Alpaca Blend oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 525.00, 656.00, 'TK-KN-244', 'Super-Soft Alpaca Blend', true, false, false, 4.3, 9)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-244-BLA-S', 'Black', 'S', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-244-BLA-M', 'Black', 'M', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-244-BLA-L', 'Black', 'L', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-244-BLA-XL', 'Black', 'XL', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-244-NAV-S', 'Navy', 'S', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-244-NAV-M', 'Navy', 'M', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-244-NAV-L', 'Navy', 'L', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-244-NAV-XL', 'Navy', 'XL', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-244-GRE-S', 'Grey', 'S', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-244-GRE-M', 'Grey', 'M', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-244-GRE-L', 'Grey', 'L', 16, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-244-GRE-XL', 'Grey', 'XL', 16, 5);

  -- Product 145: Savile Row Merino Wool Cashmere V-Neck Sweater
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_knit, b_aurum, col_classic, 'Savile Row Merino Wool Cashmere V-Neck Sweater', 'savile-row-merino-wool-cashmere-v-neck-sweater', 'A masterpiece from Tokiyo design studio. Crafted from premium Extra-Fine Merino Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Extra-Fine Merino Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 560.00, 700.00, 'TK-KN-245', 'Extra-Fine Merino Wool', true, true, true, 4.4, 12)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-245-BLA-S', 'Black', 'S', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-245-BLA-M', 'Black', 'M', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-245-BLA-L', 'Black', 'L', 18, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-245-BLA-XL', 'Black', 'XL', 18, 5);

  -- Product 146: Classic Mongolian Cashmere Merino Wool Turtleneck
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_knit, b_tokiyo, col_black, 'Classic Mongolian Cashmere Merino Wool Turtleneck', 'classic-mongolian-cashmere-merino-wool-turtleneck', 'A masterpiece from Tokiyo design studio. Crafted from premium Grade-A Mongolian Cashmere designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Grade-A Mongolian Cashmere oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 595.00, 744.00, 'TK-KN-246', 'Grade-A Mongolian Cashmere', true, false, false, 4.5, 15)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-246-BLA-S', 'Black', 'S', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-246-BLA-M', 'Black', 'M', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-246-BLA-L', 'Black', 'L', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-246-BLA-XL', 'Black', 'XL', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-246-NAV-S', 'Navy', 'S', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-246-NAV-M', 'Navy', 'M', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-246-NAV-L', 'Navy', 'L', 20, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-246-NAV-XL', 'Navy', 'XL', 20, 5);

  -- Product 147: Napoli Premium Lambswool Cashmere V-Neck Sweater
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_knit, b_milano, col_summer, 'Napoli Premium Lambswool Cashmere V-Neck Sweater', 'napoli-premium-lambswool-cashmere-v-neck-sweater', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Lambswool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Lambswool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 630.00, 788.00, 'TK-KN-247', 'Premium Lambswool', true, false, false, 4.6, 18)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-247-BLA-S', 'Black', 'S', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-247-BLA-M', 'Black', 'M', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-247-BLA-L', 'Black', 'L', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-247-BLA-XL', 'Black', 'XL', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-247-NAV-S', 'Navy', 'S', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-247-NAV-M', 'Navy', 'M', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-247-NAV-L', 'Navy', 'L', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-247-NAV-XL', 'Navy', 'XL', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-247-GRE-S', 'Grey', 'S', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-247-GRE-M', 'Grey', 'M', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-247-GRE-L', 'Grey', 'L', 22, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-247-GRE-XL', 'Grey', 'XL', 22, 5);

  -- Product 148: Milano Alpaca Blend Merino Wool Turtleneck
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_knit, b_atlas, col_classic, 'Milano Alpaca Blend Merino Wool Turtleneck', 'milano-alpaca-blend-merino-wool-turtleneck', 'A masterpiece from Tokiyo design studio. Crafted from premium Super-Soft Alpaca Blend designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Super-Soft Alpaca Blend oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 665.00, 831.00, 'TK-KN-248', 'Super-Soft Alpaca Blend', true, true, false, 4.7, 21)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1598808503742-dd34bd03927f?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-248-BLA-S', 'Black', 'S', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-248-BLA-M', 'Black', 'M', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-248-BLA-L', 'Black', 'L', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-248-BLA-XL', 'Black', 'XL', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-248-NAV-S', 'Navy', 'S', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-248-NAV-M', 'Navy', 'M', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-248-NAV-L', 'Navy', 'L', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-248-NAV-XL', 'Navy', 'XL', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-248-GRE-S', 'Grey', 'S', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-248-GRE-M', 'Grey', 'M', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-248-GRE-L', 'Grey', 'L', 24, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-248-GRE-XL', 'Grey', 'XL', 24, 5);

  -- Product 149: Tuscan Merino Wool Cashmere V-Neck Sweater
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_knit, b_sov, col_black, 'Tuscan Merino Wool Cashmere V-Neck Sweater', 'tuscan-merino-wool-cashmere-v-neck-sweater', 'A masterpiece from Tokiyo design studio. Crafted from premium Extra-Fine Merino Wool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Extra-Fine Merino Wool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 700.00, 875.00, 'TK-KN-249', 'Extra-Fine Merino Wool', true, false, true, 4.8, 24)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-249-BLA-S', 'Black', 'S', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-249-BLA-M', 'Black', 'M', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-249-BLA-L', 'Black', 'L', 26, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-249-BLA-XL', 'Black', 'XL', 26, 5);

  -- Product 150: Cambridge Mongolian Cashmere Merino Wool Turtleneck
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_knit, b_aurum, col_summer, 'Cambridge Mongolian Cashmere Merino Wool Turtleneck', 'cambridge-mongolian-cashmere-merino-wool-turtleneck', 'A masterpiece from Tokiyo design studio. Crafted from premium Grade-A Mongolian Cashmere designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Grade-A Mongolian Cashmere oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 735.00, 919.00, 'TK-KN-250', 'Grade-A Mongolian Cashmere', true, false, false, 4.9, 27)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-250-BLA-S', 'Black', 'S', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-250-BLA-M', 'Black', 'M', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-250-BLA-L', 'Black', 'L', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-250-BLA-XL', 'Black', 'XL', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-250-NAV-S', 'Navy', 'S', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-250-NAV-M', 'Navy', 'M', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-250-NAV-L', 'Navy', 'L', 28, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-250-NAV-XL', 'Navy', 'XL', 28, 5);

  -- Product 151: Soho Premium Lambswool Cashmere V-Neck Sweater
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_knit, b_tokiyo, col_classic, 'Soho Premium Lambswool Cashmere V-Neck Sweater', 'soho-premium-lambswool-cashmere-v-neck-sweater', 'A masterpiece from Tokiyo design studio. Crafted from premium Premium Lambswool designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Premium Lambswool oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 770.00, 963.00, 'TK-KN-251', 'Premium Lambswool', true, true, false, 4.0, 5)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1593672715438-d88a70629abe?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-251-BLA-S', 'Black', 'S', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-251-BLA-M', 'Black', 'M', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-251-BLA-L', 'Black', 'L', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-251-BLA-XL', 'Black', 'XL', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-251-NAV-S', 'Navy', 'S', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-251-NAV-M', 'Navy', 'M', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-251-NAV-L', 'Navy', 'L', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-251-NAV-XL', 'Navy', 'XL', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-251-GRE-S', 'Grey', 'S', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-251-GRE-M', 'Grey', 'M', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-251-GRE-L', 'Grey', 'L', 30, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-251-GRE-XL', 'Grey', 'XL', 30, 5);

  -- Product 152: Prestige Alpaca Blend Merino Wool Turtleneck
  INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
  VALUES (c_knit, b_milano, col_black, 'Prestige Alpaca Blend Merino Wool Turtleneck', 'prestige-alpaca-blend-merino-wool-turtleneck', 'A masterpiece from Tokiyo design studio. Crafted from premium Super-Soft Alpaca Blend designed for maximum style, longevity and comfort. Ideal for styling with clean cuts and luxury accents.
---
Naqshad heer sare ah oo ka timid Tokiyo. Waxaa laga sameeyay Super-Soft Alpaca Blend oo loogu talagalay qaab quruxsan, adkeysi dheeraad ah iyo raaxo buuxda. Waxaa si fiican loogu lamaanayn karaa surwaalada iyo kootooyinka dukaanka.', 805.00, 1006.00, 'TK-KN-252', 'Super-Soft Alpaca Blend', true, false, false, 4.1, 8)
  RETURNING id INTO p_id;
  INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=600&q=80', true, 1);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-252-BLA-S', 'Black', 'S', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-252-BLA-M', 'Black', 'M', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-252-BLA-L', 'Black', 'L', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-252-BLA-XL', 'Black', 'XL', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-252-NAV-S', 'Navy', 'S', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-252-NAV-M', 'Navy', 'M', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-252-NAV-L', 'Navy', 'L', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-252-NAV-XL', 'Navy', 'XL', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-252-GRE-S', 'Grey', 'S', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-252-GRE-M', 'Grey', 'M', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-252-GRE-L', 'Grey', 'L', 32, 5);
  INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES (p_id, 'TK-KN-252-GRE-XL', 'Grey', 'XL', 32, 5);

  RAISE NOTICE 'Large scale seed complete: 152 premium products populated successfully.';
END $$;
