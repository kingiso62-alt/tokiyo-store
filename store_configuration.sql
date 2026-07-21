-- ============================================================
-- TOKIYO STORE — Store Identity & Homepage Configuration Settings
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Insert/Update Store Identity & Business details
INSERT INTO settings (key, value, description)
VALUES (
  'store_identity',
  '{
    "store_name": "TOKIYO STORE",
    "tagline": "Premium Men''s Fashion",
    "email": "clientservices@tokiyostore.com",
    "phone": "+252 61 1234567",
    "whatsapp": "+252 61 1234567",
    "address": "123 Luxury Avenue, Mogadishu, Somalia",
    "working_hours_en": "Mon - Sat: 9:00 AM - 10:00 PM",
    "working_hours_so": "Isniin - Sabti: 9:00 Subaxnimo - 10:00 Habeenimo",
    "default_currency": "USD",
    "secondary_currency": "SOS",
    "sos_exchange_rate": 26000,
    "social_links": {
      "facebook": "https://facebook.com/tokiyostore",
      "instagram": "https://instagram.com/tokiyostore",
      "twitter": "https://twitter.com/tokiyostore"
    },
    "shipping": {
      "standard_fee": 15,
      "free_shipping_min": 500,
      "return_period_days": 14,
      "delivery_areas_en": "Mogadishu, Hargeisa, Garowe, Kismayo, and major cities.",
      "delivery_areas_so": "Muqdisho, Hargeysa, Garoowe, Kismaayo, iyo magaalooyinka waaweyn."
    }
  }'::jsonb,
  'Store identity, contact details, social links, and shipping metrics'
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. Insert/Update Homepage Sections configuration (reorderable, toggleable)
INSERT INTO settings (key, value, description)
VALUES (
  'homepage_sections',
  '[
    {
      "id": "hero",
      "enabled": true,
      "title_en": "AI-Curated Menswear",
      "title_so": "Dharka Labka ee AI-Curated",
      "subtitle_en": "Premium Italian tailoring meets modern digital style.",
      "subtitle_so": "Dharka talyaaniga oo leh naqshad casri ah.",
      "button_text_en": "Shop Now",
      "button_text_so": "Hadda Iibso",
      "order": 1
    },
    {
      "id": "categories",
      "enabled": true,
      "title_en": "Featured Categories",
      "title_so": "Qeybaha Muhiimka ah",
      "order": 2
    },
    {
      "id": "new_arrivals",
      "enabled": true,
      "title_en": "New Arrivals",
      "title_so": "Alaabta Cusub",
      "order": 3
    },
    {
      "id": "best_sellers",
      "enabled": true,
      "title_en": "Best Sellers",
      "title_so": "Ugu Iibinta Badan",
      "order": 4
    },
    {
      "id": "flash_sale",
      "enabled": true,
      "title_en": "Flash Sale",
      "title_so": "Qiimo Dhimis Degdeg ah",
      "order": 5
    },
    {
      "id": "promotional_banner",
      "enabled": true,
      "title_en": "Summer Collection",
      "title_so": "Ururinta Xagaaga",
      "order": 6
    },
    {
      "id": "reviews",
      "enabled": true,
      "title_en": "Customer Reviews",
      "title_so": "Fikradaha Macaamiisha",
      "order": 7
    },
    {
      "id": "newsletter",
      "enabled": true,
      "title_en": "Join The Club",
      "title_so": "Ku Soo Biir Naadiga",
      "order": 8
    }
  ]'::jsonb,
  'Enabling, disabling, renaming, and ordering of storefront homepage sections'
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
