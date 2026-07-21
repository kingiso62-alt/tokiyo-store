-- ============================================================
-- TOKIYO STORE - 50 Products Seed Data
-- Run in Supabase SQL Editor AFTER database.sql
-- User can update images and prices later via Admin Panel
-- ============================================================

-- -------------------------------------------------------
-- 1. BRANDS
-- -------------------------------------------------------
INSERT INTO brands (name, slug, description) VALUES
  ('Tokiyo Premium', 'tokiyo-premium', 'Our exclusive in-house luxury brand'),
  ('Milano Craft', 'milano-craft', 'Italian artisan fashion since 1980'),
  ('Black Atlas', 'black-atlas', 'Modern minimalist menswear'),
  ('Sovereign', 'sovereign', 'British heritage tailoring'),
  ('Aurum', 'aurum', 'Luxury watches and accessories')
ON CONFLICT (slug) DO NOTHING;

-- -------------------------------------------------------
-- 2. CATEGORIES
-- -------------------------------------------------------
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

-- -------------------------------------------------------
-- 3. COLLECTIONS
-- -------------------------------------------------------
INSERT INTO collections (name, slug, description, is_active) VALUES
  ('Summer 2026', 'summer-2026', 'Fresh summer essentials', true),
  ('Classic Essentials', 'classic-essentials', 'Timeless wardrobe staples', true),
  ('Black Label', 'black-label', 'Our most exclusive luxury line', true)
ON CONFLICT (slug) DO NOTHING;

-- -------------------------------------------------------
-- 4. HELPER: get IDs into variables
-- -------------------------------------------------------
DO $$
DECLARE
  -- Brand IDs
  b_tokiyo   UUID := (SELECT id FROM brands WHERE slug = 'tokiyo-premium');
  b_milano   UUID := (SELECT id FROM brands WHERE slug = 'milano-craft');
  b_atlas    UUID := (SELECT id FROM brands WHERE slug = 'black-atlas');
  b_sov      UUID := (SELECT id FROM brands WHERE slug = 'sovereign');
  b_aurum    UUID := (SELECT id FROM brands WHERE slug = 'aurum');

  -- Category IDs
  c_suits    UUID := (SELECT id FROM categories WHERE slug = 'suits');
  c_shirts   UUID := (SELECT id FROM categories WHERE slug = 'shirts');
  c_trousers UUID := (SELECT id FROM categories WHERE slug = 'trousers');
  c_shoes    UUID := (SELECT id FROM categories WHERE slug = 'shoes');
  c_watches  UUID := (SELECT id FROM categories WHERE slug = 'watches');
  c_acc      UUID := (SELECT id FROM categories WHERE slug = 'accessories');
  c_outer    UUID := (SELECT id FROM categories WHERE slug = 'outerwear');
  c_knit     UUID := (SELECT id FROM categories WHERE slug = 'knitwear');

  -- Collection IDs
  col_summer UUID := (SELECT id FROM collections WHERE slug = 'summer-2026');
  col_classic UUID := (SELECT id FROM collections WHERE slug = 'classic-essentials');
  col_black  UUID := (SELECT id FROM collections WHERE slug = 'black-label');

  -- Product IDs (temp)
  p_id UUID;

BEGIN

-- ============================================================
-- SUITS (8 products)
-- ============================================================

-- 1
INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending)
VALUES (c_suits, b_milano, col_black, 'Italian Wool Two-Piece Suit', 'italian-wool-two-piece-suit', 'A masterpiece of Italian tailoring. Double-twisted wool with a subtle herringbone weave. Slim cut with natural shoulders. Perfect for boardrooms and black-tie events.', 1200.00, 1600.00, 'TK-SU-001', '100% Italian Merino Wool', true, true, false)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES
  (p_id, 'TK-SU-001-NVY-38', 'Navy', '38', 15, 3),
  (p_id, 'TK-SU-001-NVY-40', 'Navy', '40', 20, 3),
  (p_id, 'TK-SU-001-NVY-42', 'Navy', '42', 18, 3),
  (p_id, 'TK-SU-001-NVY-44', 'Navy', '44', 10, 3),
  (p_id, 'TK-SU-001-CHR-40', 'Charcoal', '40', 12, 3),
  (p_id, 'TK-SU-001-CHR-42', 'Charcoal', '42', 14, 3);

-- 2
INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending)
VALUES (c_suits, b_sov, col_classic, 'British Heritage Three-Piece Suit', 'british-heritage-three-piece-suit', 'Crafted in England from finest Yorkshire wool. Full canvas construction for exceptional shape retention. A suit that speaks before you do.', 1800.00, NULL, 'TK-SU-002', 'Yorkshire Wool', true, true, false)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES
  (p_id, 'TK-SU-002-BLK-40', 'Black', '40', 8, 2),
  (p_id, 'TK-SU-002-BLK-42', 'Black', '42', 10, 2),
  (p_id, 'TK-SU-002-NVY-42', 'Navy', '42', 6, 2);

-- 3
INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending)
VALUES (c_suits, b_tokiyo, col_summer, 'Linen Summer Suit', 'linen-summer-suit', 'Light and breathable Italian linen. Relaxed silhouette perfect for summer weddings, garden parties and warm-weather business.', 780.00, 950.00, 'TK-SU-003', 'Italian Linen', true, false, true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES
  (p_id, 'TK-SU-003-BEI-38', 'Beige', '38', 20, 4),
  (p_id, 'TK-SU-003-BEI-40', 'Beige', '40', 25, 4),
  (p_id, 'TK-SU-003-WHT-40', 'Ivory', '40', 15, 4),
  (p_id, 'TK-SU-003-WHT-42', 'Ivory', '42', 12, 4);

-- 4
INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_featured)
VALUES (c_suits, b_atlas, 'Slim-Fit Tuxedo', 'slim-fit-tuxedo', 'Peak-lapel tuxedo with satin trim. Slim fit for the modern gentleman. Includes matching trousers with satin side stripe.', 1100.00, 'TK-SU-004', 'Wool-Silk Blend', true, true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1445605917765-60e5b5bbb5a4?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity, low_stock_threshold) VALUES
  (p_id, 'TK-SU-004-BLK-38', 'Black', '38', 10, 3),
  (p_id, 'TK-SU-004-BLK-40', 'Black', '40', 15, 3),
  (p_id, 'TK-SU-004-BLK-42', 'Black', '42', 12, 3);

-- 5
INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_featured)
VALUES (c_suits, b_milano, 'Double-Breasted Pinstripe Suit', 'double-breasted-pinstripe-suit', 'A bold statement in fine wool. Classic pinstripe double-breasted jacket with matching tapered trousers.', 1400.00, 'TK-SU-005', 'Super 120s Wool', true, false)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1564594736011-d959a69b8f5a?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-SU-005-NVY-40', 'Navy', '40', 12),
  (p_id, 'TK-SU-005-GRY-40', 'Grey', '40', 10),
  (p_id, 'TK-SU-005-GRY-42', 'Grey', '42', 8);

-- 6
INSERT INTO products (category_id, brand_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_trending)
VALUES (c_suits, b_atlas, 'Casual Blazer', 'casual-blazer', 'Smart-casual tailored blazer in stretch cotton. Wear it with jeans or chinos for effortless style.', 480.00, 600.00, 'TK-SU-006', 'Stretch Cotton', true, true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-SU-006-NVY-S', 'Navy', 'S', 20),
  (p_id, 'TK-SU-006-NVY-M', 'Navy', 'M', 25),
  (p_id, 'TK-SU-006-NVY-L', 'Navy', 'L', 20),
  (p_id, 'TK-SU-006-BLK-M', 'Black', 'M', 18),
  (p_id, 'TK-SU-006-BLK-L', 'Black', 'L', 15);

-- 7
INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_featured)
VALUES (c_suits, b_sov, 'Windowpane Check Suit', 'windowpane-check-suit', 'Bold windowpane check in fine wool. A contemporary classic for the confident dresser.', 1350.00, 'TK-SU-007', 'Pure Wool', true, false)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e5?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-SU-007-TAN-40', 'Tan', '40', 8),
  (p_id, 'TK-SU-007-TAN-42', 'Tan', '42', 6);

-- 8
INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_featured)
VALUES (c_suits, b_tokiyo, 'Velvet Evening Jacket', 'velvet-evening-jacket', 'Midnight navy velvet smoking jacket. Peak lapels and jet buttons. Luxury evening wear.', 950.00, 'TK-SU-008', 'Silk Velvet', true, true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-SU-008-NVY-S', 'Midnight Navy', 'S', 5),
  (p_id, 'TK-SU-008-NVY-M', 'Midnight Navy', 'M', 8),
  (p_id, 'TK-SU-008-NVY-L', 'Midnight Navy', 'L', 6);

-- ============================================================
-- SHIRTS (8 products)
-- ============================================================

-- 9
INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending)
VALUES (c_shirts, b_tokiyo, col_classic, 'Sea Island Cotton Dress Shirt', 'sea-island-cotton-dress-shirt', 'Woven from the finest Sea Island cotton. Exceptional softness and a natural sheen. Two-fold fabric for extra durability and refined appearance.', 320.00, 400.00, 'TK-SH-001', 'Sea Island Cotton', true, true, false)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-SH-001-WHT-S', 'White', 'S', 30),
  (p_id, 'TK-SH-001-WHT-M', 'White', 'M', 35),
  (p_id, 'TK-SH-001-WHT-L', 'White', 'L', 28),
  (p_id, 'TK-SH-001-WHT-XL', 'White', 'XL', 20),
  (p_id, 'TK-SH-001-BLU-M', 'Light Blue', 'M', 25),
  (p_id, 'TK-SH-001-BLU-L', 'Light Blue', 'L', 20);

-- 10
INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_featured)
VALUES (c_shirts, b_milano, 'Italian Linen Shirt', 'italian-linen-shirt', 'Lightweight Italian linen in a relaxed fit. Perfect for warm days and casual summer events.', 180.00, 'TK-SH-002', 'Italian Linen', true, false)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-SH-002-WHT-S', 'White', 'S', 25), (p_id, 'TK-SH-002-WHT-M', 'White', 'M', 30),
  (p_id, 'TK-SH-002-BEI-M', 'Beige', 'M', 22), (p_id, 'TK-SH-002-BLU-L', 'Sky Blue', 'L', 18);

-- 11
INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_trending)
VALUES (c_shirts, b_atlas, 'Oxford Button-Down Shirt', 'oxford-button-down-shirt', 'Classic American-style Oxford cloth button-down. Versatile, durable and timeless.', 145.00, 'TK-SH-003', 'Oxford Cotton', true, true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-SH-003-WHT-S', 'White', 'S', 40), (p_id, 'TK-SH-003-WHT-M', 'White', 'M', 45),
  (p_id, 'TK-SH-003-BLU-M', 'Blue', 'M', 35), (p_id, 'TK-SH-003-BLU-L', 'Blue', 'L', 30),
  (p_id, 'TK-SH-003-PNK-M', 'Pink', 'M', 20);

-- 12
INSERT INTO products (category_id, brand_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured)
VALUES (c_shirts, b_sov, 'Twill Dress Shirt', 'twill-dress-shirt', 'Two-ply Egyptian cotton twill. Double cuff for cufflinks. Tailored fit with spread collar.', 260.00, 320.00, 'TK-SH-004', 'Egyptian Cotton', true, false)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-SH-004-WHT-M', 'White', 'M', 20), (p_id, 'TK-SH-004-WHT-L', 'White', 'L', 18),
  (p_id, 'TK-SH-004-BLU-M', 'Blue', 'M', 15);

-- 13
INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_trending)
VALUES (c_shirts, b_tokiyo, 'Flannel Check Shirt', 'flannel-check-shirt', 'Soft brushed flannel check shirt in relaxed fit. Ideal for weekend smart-casual.', 130.00, 'TK-SH-005', 'Brushed Flannel', true, true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-SH-005-RED-S', 'Red Check', 'S', 20), (p_id, 'TK-SH-005-RED-M', 'Red Check', 'M', 25),
  (p_id, 'TK-SH-005-GRN-M', 'Green Check', 'M', 18), (p_id, 'TK-SH-005-GRN-L', 'Green Check', 'L', 15);

-- 14-16: More shirts (compact)
INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published)
VALUES (c_shirts, b_atlas, 'Poplin Slim-Fit Shirt', 'poplin-slim-fit-shirt', 'Crisp cotton poplin in slim fit. Ideal for formal occasions.', 160.00, 'TK-SH-006', 'Cotton Poplin', true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-SH-006-WHT-M', 'White', 'M', 30), (p_id, 'TK-SH-006-WHT-L', 'White', 'L', 25), (p_id, 'TK-SH-006-BLK-M', 'Black', 'M', 20);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published)
VALUES (c_shirts, b_milano, 'Silk Blend Evening Shirt', 'silk-blend-evening-shirt', 'Silk-cotton blend with subtle sheen. Perfect for evening events.', 380.00, 'TK-SH-007', 'Silk-Cotton Blend', true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-SH-007-WHT-M', 'White', 'M', 10), (p_id, 'TK-SH-007-CRM-L', 'Cream', 'L', 8);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published)
VALUES (c_shirts, b_tokiyo, 'Jersey Polo Shirt', 'jersey-polo-shirt', 'Luxury piqué polo in fine mercerised cotton. Timeless weekend essential.', 120.00, 'TK-SH-008', 'Mercerised Cotton', true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-SH-008-NVY-S', 'Navy', 'S', 30), (p_id, 'TK-SH-008-NVY-M', 'Navy', 'M', 35),
  (p_id, 'TK-SH-008-NVY-L', 'Navy', 'L', 25), (p_id, 'TK-SH-008-WHT-M', 'White', 'M', 20),
  (p_id, 'TK-SH-008-BLK-M', 'Black', 'M', 18);

-- ============================================================
-- TROUSERS (6 products)
-- ============================================================

INSERT INTO products (category_id, brand_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured)
VALUES (c_trousers, b_milano, 'Wool Flannel Trousers', 'wool-flannel-trousers', 'Soft Italian wool flannel trousers with a regular rise. Hook fastening at waist with side adjusters.', 420.00, 520.00, 'TK-TR-001', 'Wool Flannel', true, true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-TR-001-CHR-30', 'Charcoal', '30', 20), (p_id, 'TK-TR-001-CHR-32', 'Charcoal', '32', 25),
  (p_id, 'TK-TR-001-CHR-34', 'Charcoal', '34', 20), (p_id, 'TK-TR-001-NVY-32', 'Navy', '32', 18);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_trending)
VALUES (c_trousers, b_atlas, 'Slim-Fit Chinos', 'slim-fit-chinos', 'Garment-dyed slim-fit chinos in stretch cotton. From office to weekend in one easy move.', 160.00, 'TK-TR-002', 'Stretch Cotton', true, true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-TR-002-KHA-30', 'Khaki', '30', 30), (p_id, 'TK-TR-002-KHA-32', 'Khaki', '32', 35),
  (p_id, 'TK-TR-002-NVY-32', 'Navy', '32', 28), (p_id, 'TK-TR-002-OLV-32', 'Olive', '32', 20),
  (p_id, 'TK-TR-002-BLK-34', 'Black', '34', 25);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_featured)
VALUES (c_trousers, b_sov, 'Formal Suit Trousers', 'formal-suit-trousers', 'Precision-cut formal trousers. Full canvas and hand-finished. Matches our Heritage suit jacket perfectly.', 380.00, 'TK-TR-003', 'Super 120s Wool', true, false)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-TR-003-CHR-32', 'Charcoal', '32', 15), (p_id, 'TK-TR-003-NVY-32', 'Navy', '32', 12);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published)
VALUES (c_trousers, b_tokiyo, 'Jogger Trousers', 'jogger-trousers', 'Smart jogger trousers in fine jersey. Elasticated waist and cuffs with a slim silhouette.', 140.00, 'TK-TR-004', 'Fine Jersey', true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1593030103066-0093718efeb9?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-TR-004-BLK-S', 'Black', 'S', 25), (p_id, 'TK-TR-004-BLK-M', 'Black', 'M', 30),
  (p_id, 'TK-TR-004-GRY-M', 'Grey', 'M', 22);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published)
VALUES (c_trousers, b_atlas, 'Cargo Trousers', 'cargo-trousers', 'Utility cargo trousers with multiple pockets. Smart-casual versatility.', 180.00, 'TK-TR-005', 'Cotton Twill', true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1626491029497-cc7fc0cd0551?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-TR-005-OLV-30', 'Olive', '30', 20), (p_id, 'TK-TR-005-OLV-32', 'Olive', '32', 25),
  (p_id, 'TK-TR-005-BLK-32', 'Black', '32', 18);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_trending)
VALUES (c_trousers, b_milano, 'Tailored Linen Trousers', 'tailored-linen-trousers', 'Relaxed tailored trousers in Italian linen. Easy summer dressing.', 230.00, 'TK-TR-006', 'Italian Linen', true, true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1614786269829-d24616faf56d?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-TR-006-BEI-30', 'Beige', '30', 15), (p_id, 'TK-TR-006-BEI-32', 'Beige', '32', 20),
  (p_id, 'TK-TR-006-WHT-32', 'White', '32', 12);

-- ============================================================
-- SHOES (7 products)
-- ============================================================

INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending)
VALUES (c_shoes, b_sov, col_black, 'Oxford Leather Derby Shoes', 'oxford-leather-derby-shoes', 'Brogue-detailed Oxford Derby in full-grain calf leather. Leather sole with rubber heel unit. Handmade in England.', 850.00, 1000.00, 'TK-SX-001', 'Full-Grain Calf Leather', true, true, false)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-SX-001-BLK-8', 'Black', '8 UK', 15), (p_id, 'TK-SX-001-BLK-9', 'Black', '9 UK', 20),
  (p_id, 'TK-SX-001-BLK-10', 'Black', '10 UK', 18), (p_id, 'TK-SX-001-TAN-9', 'Tan', '9 UK', 12);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_featured)
VALUES (c_shoes, b_milano, 'Loafer in Suede', 'loafer-in-suede', 'Penny loafer in butter-soft Italian suede. Leather lining and leather sole. A wardrobe essential.', 620.00, 'TK-SX-002', 'Italian Suede', true, true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-SX-002-TAN-8', 'Tan', '8 UK', 10), (p_id, 'TK-SX-002-TAN-9', 'Tan', '9 UK', 12),
  (p_id, 'TK-SX-002-NVY-9', 'Navy', '9 UK', 8);

INSERT INTO products (category_id, brand_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_trending)
VALUES (c_shoes, b_tokiyo, 'White Leather Sneakers', 'white-leather-sneakers', 'Minimalist white leather sneakers with a premium cupsole. Everyday luxury footwear.', 290.00, 360.00, 'TK-SX-003', 'Full-Grain Leather', true, true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-SX-003-WHT-8', 'White', '8 UK', 25), (p_id, 'TK-SX-003-WHT-9', 'White', '9 UK', 30),
  (p_id, 'TK-SX-003-WHT-10', 'White', '10 UK', 22), (p_id, 'TK-SX-003-BLK-9', 'Black', '9 UK', 18);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_featured)
VALUES (c_shoes, b_sov, 'Chelsea Boot in Leather', 'chelsea-boot-in-leather', 'Classic Chelsea boot in polished calf leather with elastic side panels. A British icon.', 740.00, 'TK-SX-004', 'Polished Calf Leather', true, true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-SX-004-BLK-8', 'Black', '8 UK', 12), (p_id, 'TK-SX-004-BLK-9', 'Black', '9 UK', 15),
  (p_id, 'TK-SX-004-BRN-9', 'Dark Brown', '9 UK', 10);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published)
VALUES (c_shoes, b_atlas, 'Derby Brogues', 'derby-brogues', 'Full brogue Derby shoes with punched detailing in antiqued leather.', 480.00, 'TK-SX-005', 'Antiqued Leather', true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-SX-005-TAN-8', 'Tan', '8 UK', 8), (p_id, 'TK-SX-005-TAN-9', 'Tan', '9 UK', 10);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_trending)
VALUES (c_shoes, b_milano, 'Moccasin Loafer', 'moccasin-loafer', 'Hand-sewn moccasin loafer in soft nappa leather. Exceptional comfort.', 360.00, 'TK-SX-006', 'Nappa Leather', true, true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-SX-006-BRN-8', 'Brown', '8 UK', 15), (p_id, 'TK-SX-006-BRN-9', 'Brown', '9 UK', 18);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published)
VALUES (c_shoes, b_tokiyo, 'Sport Luxe Trainer', 'sport-luxe-trainer', 'Performance-inspired luxury trainer. Premium materials with athletic styling.', 320.00, 'TK-SX-007', 'Premium Mesh & Leather', true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-SX-007-WHT-8', 'White', '8 UK', 20), (p_id, 'TK-SX-007-WHT-9', 'White', '9 UK', 25),
  (p_id, 'TK-SX-007-BLK-9', 'Black', '9 UK', 15);

-- ============================================================
-- WATCHES (7 products)
-- ============================================================

INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending, rating, reviews_count)
VALUES (c_watches, b_aurum, col_black, 'Midnight Onyx Chronograph', 'midnight-onyx-chronograph', 'Swiss automatic chronograph with a brushed titanium case. Scratch-resistant sapphire crystal. Water-resistant to 100m. A statement piece for the modern gentleman.', 8500.00, NULL, 'TK-WA-001', 'Titanium & Sapphire Crystal', true, true, true, 4.9, 48)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-WA-001-BLK-OS', 'Black', 'One Size', 5),
  (p_id, 'TK-WA-001-SLV-OS', 'Silver', 'One Size', 4);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_featured, rating, reviews_count)
VALUES (c_watches, b_aurum, 'Rose Gold Dress Watch', 'rose-gold-dress-watch', 'Ultra-slim Swiss quartz dress watch. 18K rose gold plated case with alligator leather strap. The pinnacle of elegance.', 3200.00, 'TK-WA-002', '18K Rose Gold Plate', true, true, 4.8, 32)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-WA-002-RG-OS', 'Rose Gold', 'One Size', 8);

INSERT INTO products (category_id, brand_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending)
VALUES (c_watches, b_tokiyo, 'Pilot Steel Automatic', 'pilot-steel-automatic', 'Aviator-inspired automatic watch. Large 42mm steel case with anti-reflective glass. Robust and stylish.', 1800.00, 2200.00, 'TK-WA-003', 'Stainless Steel', true, false, true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-WA-003-BLK-OS', 'Black Dial', 'One Size', 10),
  (p_id, 'TK-WA-003-WHT-OS', 'White Dial', 'One Size', 8);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published)
VALUES (c_watches, b_aurum, 'Skeleton Tourbillon', 'skeleton-tourbillon', 'Hand-assembled tourbillon movement visible through the open-worked dial. The ultimate horological achievement.', 22000.00, 'TK-WA-004', 'Platinum Case', true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1587836374828-cb4387df3c5c?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES (p_id, 'TK-WA-004-PT-OS', 'Platinum', 'One Size', 2);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_trending)
VALUES (c_watches, b_tokiyo, 'Diver Sport Watch', 'diver-sport-watch', 'Professional dive watch rated to 300m. Ceramic bezel and helium escape valve. Sporty and precise.', 1200.00, 'TK-WA-005', 'Ceramic & Steel', true, true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1558507676-ba1d3c98d56a?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-WA-005-BLU-OS', 'Blue', 'One Size', 15),
  (p_id, 'TK-WA-005-BLK-OS', 'Black', 'One Size', 12);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published)
VALUES (c_watches, b_aurum, 'Monaco Square Chronograph', 'monaco-square-chronograph', 'Iconic square-cased chronograph. Hand-wound movement with column wheel visible through caseback.', 6500.00, 'TK-WA-006', 'Steel & Blue Dial', true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1618245318763-a15156d6b23c?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES (p_id, 'TK-WA-006-BLU-OS', 'Blue', 'One Size', 4);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_featured)
VALUES (c_watches, b_tokiyo, 'GMT Traveller Watch', 'gmt-traveller-watch', 'Multi-timezone GMT watch for the jet-setting professional. Two time zones at a glance.', 2400.00, 'TK-WA-007', 'Stainless Steel', true, false)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1548171561-0531f40e0d68?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-WA-007-BLK-OS', 'Black', 'One Size', 8),
  (p_id, 'TK-WA-007-GRN-OS', 'Green', 'One Size', 6);

-- ============================================================
-- ACCESSORIES (7 products)
-- ============================================================

INSERT INTO products (category_id, brand_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending)
VALUES (c_acc, b_tokiyo, 'Silk Repp Tie', 'silk-repp-tie', 'Hand-rolled seven-fold silk tie in classic repp stripe. Made in Como, Italy.', 185.00, 220.00, 'TK-AC-001', 'Pure Silk', true, false, true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1614170043822-4b78fd9d3e5c?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-AC-001-NVY-OS', 'Navy Stripe', 'One Size', 25),
  (p_id, 'TK-AC-001-BRG-OS', 'Burgundy', 'One Size', 20);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_featured)
VALUES (c_acc, b_sov, 'Leather Bifold Wallet', 'leather-bifold-wallet', 'Handmade bifold wallet in vegetable-tanned calf leather. 8 card slots and a coin pouch.', 280.00, 'TK-AC-002', 'Vegetable-Tanned Leather', true, true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-AC-002-BRN-OS', 'Brown', 'One Size', 30),
  (p_id, 'TK-AC-002-BLK-OS', 'Black', 'One Size', 25);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_trending)
VALUES (c_acc, b_tokiyo, 'Cashmere Pocket Square', 'cashmere-pocket-square', 'Hand-rolled cashmere pocket square in seasonal colourways. The finishing touch to any outfit.', 95.00, 'TK-AC-003', 'Pure Cashmere', true, false)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1608228088998-57828365d486?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-AC-003-WHT-OS', 'White', 'One Size', 40),
  (p_id, 'TK-AC-003-BRG-OS', 'Burgundy', 'One Size', 30);

INSERT INTO products (category_id, brand_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured)
VALUES (c_acc, b_milano, 'Leather Messenger Bag', 'leather-messenger-bag', 'Italian leather messenger bag. Padded laptop compartment and multiple organiser pockets. Aged brass hardware.', 680.00, 850.00, 'TK-AC-004', 'Full-Grain Leather', true, true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-AC-004-TAN-OS', 'Tan', 'One Size', 8),
  (p_id, 'TK-AC-004-BRN-OS', 'Dark Brown', 'One Size', 6);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published)
VALUES (c_acc, b_sov, 'Leather Belt', 'leather-belt', 'Vegetable-tanned leather dress belt with solid brass buckle. Hand-stitched edges.', 195.00, 'TK-AC-005', 'Vegetable-Tanned Leather', true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-AC-005-BRN-32', 'Brown', '32', 20), (p_id, 'TK-AC-005-BRN-34', 'Brown', '34', 25),
  (p_id, 'TK-AC-005-BLK-34', 'Black', '34', 20);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_trending)
VALUES (c_acc, b_tokiyo, 'Wool Bow Tie', 'wool-bow-tie', 'Self-tie bow tie in pure wool flannel. Adds texture and personality to formal looks.', 75.00, 'TK-AC-006', 'Wool Flannel', true, false)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1589756823695-278bc923f962?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-AC-006-NVY-OS', 'Navy', 'One Size', 20),
  (p_id, 'TK-AC-006-BRG-OS', 'Burgundy', 'One Size', 15);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published)
VALUES (c_acc, b_aurum, 'Gold Cufflinks', 'gold-cufflinks', '18K yellow gold-plated cufflinks with mother-of-pearl inlay. Presented in a luxury box.', 420.00, 'TK-AC-007', '18K Gold Plate', true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES (p_id, 'TK-AC-007-GLD-OS', 'Gold', 'One Size', 12);

-- ============================================================
-- OUTERWEAR (4 products)
-- ============================================================

INSERT INTO products (category_id, brand_id, collection_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending)
VALUES (c_outer, b_sov, col_classic, 'Camel Overcoat', 'camel-overcoat', 'Single-breasted overcoat in pure camel hair. Notched lapels, welt pockets and a single vent. An investment piece.', 2200.00, 2800.00, 'TK-OW-001', 'Pure Camel Hair', true, true, false)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-OW-001-CML-S', 'Camel', 'S', 5), (p_id, 'TK-OW-001-CML-M', 'Camel', 'M', 8),
  (p_id, 'TK-OW-001-CML-L', 'Camel', 'L', 6);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_featured)
VALUES (c_outer, b_atlas, 'Technical Field Jacket', 'technical-field-jacket', 'Water-resistant technical jacket with multiple pockets. Smart-casual versatility for all weathers.', 480.00, 'TK-OW-002', 'Water-Resistant Nylon', true, false)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-OW-002-OLV-S', 'Olive', 'S', 12), (p_id, 'TK-OW-002-OLV-M', 'Olive', 'M', 15),
  (p_id, 'TK-OW-002-BLK-M', 'Black', 'M', 10), (p_id, 'TK-OW-002-BLK-L', 'Black', 'L', 8);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_trending)
VALUES (c_outer, b_tokiyo, 'Navy Peacoat', 'navy-peacoat', 'Military-inspired double-breasted peacoat. Heavyweight wool melton for exceptional warmth and structure.', 650.00, 'TK-OW-003', 'Wool Melton', true, true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-OW-003-NVY-S', 'Navy', 'S', 10), (p_id, 'TK-OW-003-NVY-M', 'Navy', 'M', 15),
  (p_id, 'TK-OW-003-NVY-L', 'Navy', 'L', 12);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published)
VALUES (c_outer, b_milano, 'Leather Biker Jacket', 'leather-biker-jacket', 'Italian full-grain leather biker jacket with asymmetric zip and silver hardware. Edge meets elegance.', 1800.00, 'TK-OW-004', 'Italian Lambskin', true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-OW-004-BLK-S', 'Black', 'S', 4), (p_id, 'TK-OW-004-BLK-M', 'Black', 'M', 6),
  (p_id, 'TK-OW-004-BRN-M', 'Brown', 'M', 4);

-- ============================================================
-- KNITWEAR (3 products)
-- ============================================================

INSERT INTO products (category_id, brand_id, title, slug, description, price, compare_at_price, sku, material, is_published, is_featured, is_trending)
VALUES (c_knit, b_sov, 'Cashmere Crew-Neck Sweater', 'cashmere-crew-neck-sweater', 'Two-ply Scottish cashmere crew-neck sweater. Ribbed cuffs and hem. Effortlessly elegant.', 580.00, 720.00, 'TK-KN-001', 'Scottish Cashmere', true, true, true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-KN-001-NVY-S', 'Navy', 'S', 15), (p_id, 'TK-KN-001-NVY-M', 'Navy', 'M', 20),
  (p_id, 'TK-KN-001-GRY-M', 'Grey', 'M', 18), (p_id, 'TK-KN-001-CRM-L', 'Cream', 'L', 12);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_featured)
VALUES (c_knit, b_tokiyo, 'Merino Turtleneck', 'merino-turtleneck', 'Fine-gauge merino turtleneck. Slim fit with a contemporary feel. Office to evening in one move.', 320.00, 'TK-KN-002', 'Extra-Fine Merino Wool', true, false)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1593672715438-d88a70629abe?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-KN-002-BLK-S', 'Black', 'S', 20), (p_id, 'TK-KN-002-BLK-M', 'Black', 'M', 25),
  (p_id, 'TK-KN-002-BLK-L', 'Black', 'L', 18), (p_id, 'TK-KN-002-WHT-M', 'White', 'M', 15);

INSERT INTO products (category_id, brand_id, title, slug, description, price, sku, material, is_published, is_trending)
VALUES (c_knit, b_atlas, 'Cable-Knit Cardigan', 'cable-knit-cardigan', 'Heritage cable-knit cardigan in pure lambswool. Button front with patch pockets. Weekend wardrobe hero.', 260.00, 'TK-KN-003', 'Pure Lambswool', true, true)
RETURNING id INTO p_id;
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (p_id, 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1200', true, 1);
INSERT INTO inventory (product_id, sku, color, size, stock_quantity) VALUES
  (p_id, 'TK-KN-003-OAT-S', 'Oatmeal', 'S', 15), (p_id, 'TK-KN-003-OAT-M', 'Oatmeal', 'M', 20),
  (p_id, 'TK-KN-003-NVY-M', 'Navy', 'M', 12), (p_id, 'TK-KN-003-GRN-L', 'Forest Green', 'L', 10);

-- Done!
RAISE NOTICE 'Seed complete: 50 products with variants inserted successfully.';

END $$;

-- ============================================================
-- Verify
-- ============================================================
SELECT
  c.name AS category,
  COUNT(p.id) AS products,
  SUM((SELECT SUM(stock_quantity) FROM inventory WHERE product_id = p.id)) AS total_stock
FROM products p
JOIN categories c ON c.id = p.category_id
GROUP BY c.name
ORDER BY c.name;
