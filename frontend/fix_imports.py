import os

def replace_in_file(path, old, new):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if old in content:
        content = content.replace(old, new)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)

base_dir = 'c:/Users/hp/Desktop/TOKIYO STORE/frontend/src'
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith('.ts') or file.endswith('.tsx'):
            path = os.path.join(root, file)
            replace_in_file(path, "import { Product } from './useWishlistStore';", "import type { Product } from './useWishlistStore';")
            replace_in_file(path, 'import { Product } from "@/store/useWishlistStore";', 'import type { Product } from "@/store/useWishlistStore";')
            replace_in_file(path, 'import { useWishlistStore, Product } from "@/store/useWishlistStore";', 'import { useWishlistStore, type Product } from "@/store/useWishlistStore";')
