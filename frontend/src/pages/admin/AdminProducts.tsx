import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import {
  fetchAllProducts, createProduct, updateProduct, deleteProduct,
  fetchAllCategories, fetchAllBrands,
  createInventoryVariant, deleteInventoryVariant,
  createProductImage, deleteProductImage
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Save, Eye, Trash2, Edit, Plus, FileSpreadsheet, Download, Upload,
  AlertCircle, Check, Loader2, ArrowLeft, Image as ImageIcon, X
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  category_id?: string;
  brand_id?: string;
  collection_id?: string;
  title: string;
  slug: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  cost_per_item?: number;
  sku?: string;
  barcode?: string;
  material?: string;
  care_instructions?: string;
  is_published: boolean;
  is_featured: boolean;
  is_trending: boolean;
  metadata?: Record<string, any>;
  inventory?: any[];
  images?: any[];
}

export function AdminProducts() {
  const queryClient = useQueryClient();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [showCsvModal, setShowCsvModal] = useState(false);

  // Categories and Brands
  const { data: categories = [] } = useQuery({ queryKey: ["admin_categories"], queryFn: fetchAllCategories });
  const { data: brands = [] } = useQuery({ queryKey: ["admin_brands"], queryFn: fetchAllBrands });

  // Main Products Query
  const { data: dbProducts = [], isLoading } = useQuery({
    queryKey: ["admin_products"],
    queryFn: fetchAllProducts,
    retry: 1
  });

  // Bulk operation states
  const [bulkPricePercent, setBulkPricePercent] = useState("");
  const [bulkStockQuantity, setBulkStockQuantity] = useState("");
  const [bulkCategoryId, setBulkCategoryId] = useState("");
  const [bulkActionMsg, setBulkActionMsg] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [titleSo, setTitleSo] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionSo, setDescriptionSo] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [costPerItem, setCostPerItem] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [material, setMaterial] = useState("");
  const [careInstructions, setCareInstructions] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);

  // Sizing/Color Variant rows
  const [variants, setVariants] = useState<any[]>([]);
  // Gallery images list
  const [productImages, setProductImages] = useState<any[]>([]);

  // Validation messages
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const resetForm = () => {
    setTitle("");
    setTitleSo("");
    setDescription("");
    setDescriptionSo("");
    setCategoryId("");
    setBrandId("");
    setPrice("");
    setCompareAtPrice("");
    setCostPerItem("");
    setSku("");
    setBarcode("");
    setMaterial("");
    setCareInstructions("");
    setIsPublished(false);
    setIsFeatured(false);
    setIsTrending(false);
    setVariants([]);
    setProductImages([]);
    setValidationErrors([]);
    setEditId(null);
  };

  const handleAddNew = () => {
    resetForm();
    setIsEditing(true);
  };

  const handleEditClick = (product: any) => {
    resetForm();
    setEditId(product.id);
    setTitle(product.title || "");
    setTitleSo(product.metadata?.title_so || "");
    setDescription(product.description || "");
    setDescriptionSo(product.metadata?.description_so || "");
    setCategoryId(product.category_id || "");
    setBrandId(product.brand_id || "");
    setPrice(product.price ? product.price.toString() : "");
    setCompareAtPrice(product.compare_at_price ? product.compare_at_price.toString() : "");
    setCostPerItem(product.cost_per_item ? product.cost_per_item.toString() : "");
    setSku(product.sku || "");
    setBarcode(product.barcode || "");
    setMaterial(product.material || "");
    setCareInstructions(product.care_instructions || "");
    setIsPublished(product.is_published || false);
    setIsFeatured(product.is_featured || false);
    setIsTrending(product.is_trending || false);

    // Map existing variants
    const mappedVariants = (product.inventory || []).map((v: any) => ({
      id: v.id,
      size: v.size || "",
      color: v.color || "",
      stock: v.stock_quantity || 0,
      sku: v.sku || "",
      price: v.price || null,
      low_stock_threshold: v.low_stock_threshold || 5
    }));
    setVariants(mappedVariants);

    // Map existing images
    const mappedImages = (product.images || []).map((img: any) => ({
      id: img.id,
      image_url: img.image_url,
      alt_text: img.alt_text || "",
      is_primary: img.is_primary || false,
      display_order: img.display_order || 0
    }));
    setProductImages(mappedImages);

    setIsEditing(true);
  };

  const validateProduct = (): boolean => {
    const errors: string[] = [];
    if (!title.trim()) errors.push("Product title is required.");
    if (!categoryId) errors.push("Please select a category.");
    if (!price || parseFloat(price) <= 0) errors.push("Please enter a valid regular price greater than zero.");
    if (compareAtPrice && parseFloat(compareAtPrice) < parseFloat(price)) {
      errors.push("Sale price (Compare At Price) cannot be less than regular price.");
    }
    if (productImages.length === 0) {
      errors.push("Please add at least one image URL for the product.");
    }
    if (isPublished) {
      // publishing validation
      const totalStock = variants.reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0);
      if (totalStock <= 0) {
        errors.push("Cannot publish product with zero stock across all variants.");
      }
    }
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSaveProduct = async () => {
    if (!validateProduct()) return;

    // Generate unique slug
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Math.random().toString(36).substring(2, 6);

    const profitAmt = parseFloat(price) - (parseFloat(costPerItem) || 0);
    const profitPct = parseFloat(price) > 0 ? (profitAmt / parseFloat(price)) * 100 : 0;

    const metadata = {
      title_so: titleSo,
      description_so: descriptionSo,
      gender: "men",
      profit_amount: profitAmt,
      profit_margin: profitPct,
      seo_title: `${title} | TOKIYO STORE`,
      seo_description: description.substring(0, 150)
    };

    const productData = {
      title,
      slug,
      description,
      category_id: categoryId || null,
      brand_id: brandId || null,
      price: parseFloat(price),
      compare_at_price: compareAtPrice ? parseFloat(compareAtPrice) : null,
      cost_per_item: costPerItem ? parseFloat(costPerItem) : null,
      sku: sku || null,
      barcode: barcode || null,
      material: material || null,
      care_instructions: careInstructions || null,
      is_published: isPublished,
      is_featured: isFeatured,
      is_trending: isTrending,
      metadata
    };

    try {
      let savedProduct: any;
      if (editId) {
        // Edit existing product
        savedProduct = await updateProduct(editId, productData);
      } else {
        // Create new product
        savedProduct = await createProduct(productData);
      }

      const prodId = savedProduct.id;

      // Handle variants (Inventory) sync
      if (variants.length > 0) {
        for (const variant of variants) {
          const varData = {
            product_id: prodId,
            size: variant.size,
            color: variant.color,
            stock_quantity: parseInt(variant.stock) || 0,
            sku: variant.sku || `${sku}-${variant.size}-${variant.color}`,
            low_stock_threshold: parseInt(variant.low_stock_threshold) || 5
          };

          if (variant.id) {
            // update
            await supabase.from("inventory").update(varData).eq("id", variant.id);
          } else {
            // insert
            await createInventoryVariant(varData);
          }
        }
      }

      // Handle images sync
      if (productImages.length > 0) {
        for (let i = 0; i < productImages.length; i++) {
          const img = productImages[i];
          const imgData = {
            product_id: prodId,
            image_url: img.image_url,
            alt_text: img.alt_text || title,
            is_primary: i === 0,
            display_order: i
          };

          if (img.id) {
            await supabase.from("product_images").update(imgData).eq("id", img.id);
          } else {
            await createProductImage(imgData);
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
      setIsEditing(false);
      resetForm();
    } catch (err: any) {
      alert("Error saving product: " + err.message);
    }
  };

  const handleAddVariantRow = () => {
    setVariants([...variants, { size: "M", color: "Black", stock: 10, sku: "", low_stock_threshold: 5 }]);
  };

  const handleRemoveVariantRow = async (index: number, varId?: string) => {
    if (varId) {
      if (!window.confirm("Remove variant from database?")) return;
      await deleteInventoryVariant(varId);
    }
    const updated = [...variants];
    updated.splice(index, 1);
    setVariants(updated);
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleAddImageRow = () => {
    setProductImages([...productImages, { image_url: "", alt_text: "", is_primary: false }]);
  };

  const handleRemoveImageRow = async (index: number, imgId?: string) => {
    if (imgId) {
      if (!window.confirm("Remove image from database?")) return;
      await deleteProductImage(imgId);
    }
    const updated = [...productImages];
    updated.splice(index, 1);
    setProductImages(updated);
  };

  const handleImageChange = (index: number, field: string, value: any) => {
    const updated = [...productImages];
    updated[index][field] = value;
    setProductImages(updated);
  };

  // Bulk Actions
  const handleBulkUpdatePrices = async () => {
    if (!bulkPricePercent) return;
    const factor = 1 + parseFloat(bulkPricePercent) / 100;
    try {
      const { error } = await supabase.rpc("bulk_update_product_prices", { percent_factor: factor });
      if (error) throw error;
      setBulkActionMsg("Successfully updated product prices! / Qiimaha alaabta waa la beddelay!");
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleBulkUpdateStock = async () => {
    if (!bulkStockQuantity) return;
    try {
      const qty = parseInt(bulkStockQuantity);
      const { error } = await supabase.from("inventory").update({ stock_quantity: qty }).gt("stock_quantity", -1);
      if (error) throw error;
      setBulkActionMsg("Successfully updated stock levels! / Kaydka guud waa la cusboonaysiiyay!");
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,ID,Title,Category,Price,SKU,Stock\n";
    dbProducts.forEach((p: any) => {
      const cat = p.category?.name || "Uncategorized";
      const totalStock = p.inventory?.reduce((sum: number, item: any) => sum + (item.stock_quantity || 0), 0) || 0;
      csvContent += `"${p.id}","${p.title}","${cat}",${p.price},"${p.sku || ""}",${totalStock}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tokiyo_store_products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import CSV text area
  const handleImportCSV = async () => {
    if (!csvText) return;
    const lines = csvText.split("\n");
    let count = 0;
    try {
      for (const line of lines) {
        if (!line.trim() || line.startsWith("Title")) continue;
        const [titleVal, priceVal, categoryName] = line.split(",");
        if (!titleVal || !priceVal) continue;

        // find matching category
        const cat = categories.find(c => c.name.toLowerCase() === categoryName?.trim().toLowerCase());
        const catId = cat ? cat.id : null;

        const slug = titleVal.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Math.random().toString(36).substring(2, 6);

        await createProduct({
          title: titleVal.trim(),
          slug,
          price: parseFloat(priceVal),
          category_id: catId,
          is_published: true
        });
        count++;
      }
      setShowCsvModal(false);
      setCsvText("");
      setBulkActionMsg(`Imported ${count} products successfully!`);
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
    } catch (err: any) {
      alert("Error importing products: " + err.message);
    }
  };

  // Render Table Columns
  const columns = [
    {
      key: "name",
      header: "Product",
      render: (row: any) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <img className="h-10 w-10 rounded-md object-cover border border-gray-200" src={row.image} alt="" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-bold text-gray-900 line-clamp-1">{row.name}</div>
            <div className="text-xs text-gray-500 font-mono">{row.sku || "NO SKU"}</div>
          </div>
        </div>
      )
    },
    { key: "category", header: "Category" },
    {
      key: "price",
      header: "Price",
      render: (row: any) => <div className="font-bold">${row.price.toFixed(2)}</div>
    },
    { key: "stock", header: "Stock" },
    {
      key: "status",
      header: "Status",
      render: (row: any) => {
        let color = "bg-green-100 text-green-800";
        if (row.status === "Low Stock") color = "bg-yellow-100 text-yellow-800";
        if (row.status === "Out of Stock") color = "bg-red-100 text-red-800";
        if (row.status === "Draft") color = "bg-gray-100 text-gray-800";

        return (
          <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full uppercase tracking-wider ${color}`}>
            {row.status}
          </span>
        );
      }
    }
  ];

  const productsList = dbProducts.map(p => {
    const totalStock = p.inventory?.reduce((sum: number, item: any) => sum + (item.stock_quantity || 0), 0) || 0;
    let status = "Active";
    if (totalStock === 0) status = "Out of Stock";
    else if (totalStock < 5) status = "Low Stock";

    return {
      id: p.id,
      name: p.title,
      category: p.category?.name || "Uncategorized",
      price: p.price,
      stock: totalStock,
      sku: p.sku,
      status: p.is_published ? status : "Draft",
      image: p.images?.[0]?.image_url || "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100&q=80",
      raw: p
    };
  });

  const handleDeleteProduct = async (id: string | number) => {
    if (window.confirm("Are you sure you want to delete this product? / Ma hubtaa in aad tirtirto alaabtan?")) {
      await deleteProduct(id.toString());
      queryClient.invalidateQueries({ queryKey: ["admin_products"] });
    }
  };

  const inputCls = "w-full border-gray-300 rounded-lg py-2.5 px-3 border focus:ring-black focus:border-black sm:text-sm outline-none";
  const labelCls = "block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* 1. EDIT/CREATE FORM VIEW */}
      {isEditing ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <button onClick={() => setIsEditing(false)} className="flex items-center text-sm font-semibold text-gray-600 hover:text-black gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to List
            </button>
            <div className="flex gap-3">
              <Button type="button" onClick={() => setShowPreview(true)} className="bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-lg uppercase tracking-wider text-xs px-5 h-11 gap-1.5">
                <Eye className="h-4 w-4" /> Preview
              </Button>
              <Button type="button" onClick={handleSaveProduct} className="bg-black text-white hover:bg-gray-800 rounded-lg uppercase tracking-wider text-xs px-5 h-11 gap-1.5">
                <Save className="h-4 w-4" /> Save Product
              </Button>
            </div>
          </div>

          {validationErrors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm space-y-1">
              <div className="font-bold flex items-center gap-1"><AlertCircle className="h-4 w-4" /> Validation errors:</div>
              {validationErrors.map((err, i) => <div key={i}>• {err}</div>)}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Fields */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Identity */}
              <div className="p-5 border border-gray-100 rounded-xl bg-gray-50/30 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b pb-2">Product Identity</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Title (EN)</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="e.g. Italian Wool Suit" />
                  </div>
                  <div>
                    <label className={labelCls}>Title (SO)</label>
                    <input type="text" value={titleSo} onChange={(e) => setTitleSo(e.target.value)} className={inputCls} placeholder="e.g. Suudh Talyaani ah" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Description (EN)</label>
                    <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Description (SO)</label>
                    <textarea rows={4} value={descriptionSo} onChange={(e) => setDescriptionSo(e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Pricing & Profit */}
              <div className="p-5 border border-gray-100 rounded-xl bg-gray-50/30 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b pb-2">Pricing & Margins</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Regular Price ($)</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Compare At Price ($)</label>
                    <input type="number" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Cost Per Item ($)</label>
                    <input type="number" value={costPerItem} onChange={(e) => setCostPerItem(e.target.value)} className={inputCls} />
                  </div>
                </div>

                {price && (
                  <div className="p-4 bg-black text-white rounded-xl flex justify-around text-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Profit Amount</span>
                      <span className="text-lg font-bold">${(parseFloat(price) - (parseFloat(costPerItem) || 0)).toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Profit Margin</span>
                      <span className="text-lg font-bold">
                        {(((parseFloat(price) - (parseFloat(costPerItem) || 0)) / parseFloat(price)) * 100 || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Sizing & Stock Matrix */}
              <div className="p-5 border border-gray-100 rounded-xl bg-gray-50/30 space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Variants Matrix</h3>
                  <button type="button" onClick={handleAddVariantRow} className="text-xs font-bold text-black flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add Variant
                  </button>
                </div>

                {variants.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4">No size or color variants defined. Add one below.</p>
                ) : (
                  <div className="space-y-3">
                    {variants.map((v, i) => (
                      <div key={i} className="flex gap-2 items-center bg-white p-3 rounded-lg border border-gray-200">
                        <input type="text" placeholder="Size" value={v.size} onChange={(e) => handleVariantChange(i, "size", e.target.value)} className="w-16 border rounded p-1.5 text-xs outline-none" />
                        <input type="text" placeholder="Color" value={v.color} onChange={(e) => handleVariantChange(i, "color", e.target.value)} className="w-24 border rounded p-1.5 text-xs outline-none" />
                        <input type="number" placeholder="Stock" value={v.stock} onChange={(e) => handleVariantChange(i, "stock", e.target.value)} className="w-16 border rounded p-1.5 text-xs outline-none" />
                        <input type="text" placeholder="SKU" value={v.sku} onChange={(e) => handleVariantChange(i, "sku", e.target.value)} className="flex-1 border rounded p-1.5 text-xs outline-none" />
                        <button type="button" onClick={() => handleRemoveVariantRow(i, v.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Settings & Images */}
            <div className="space-y-6">
              {/* Basic Meta */}
              <div className="p-5 border border-gray-100 rounded-xl bg-gray-50/30 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b pb-2">Classification</h3>
                <div>
                  <label className={labelCls}>Category</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputCls}>
                    <option value="">Select Category</option>
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Brand</label>
                  <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className={inputCls}>
                    <option value="">Select Brand</option>
                    {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>SKU Code</label>
                  <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Barcode</label>
                  <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Material</label>
                  <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} className={inputCls} />
                </div>
              </div>

              {/* Status Toggles */}
              <div className="p-5 border border-gray-100 rounded-xl bg-gray-50/30 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 border-b pb-2">Status & Badges</h3>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-700 uppercase">Publish Product</span>
                  <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="accent-black h-4 w-4 cursor-pointer" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-700 uppercase">Featured status</span>
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="accent-black h-4 w-4 cursor-pointer" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-700 uppercase">New Arrival status</span>
                  <input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} className="accent-black h-4 w-4 cursor-pointer" />
                </div>
              </div>

              {/* Image urls */}
              <div className="p-5 border border-gray-100 rounded-xl bg-gray-50/30 space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Images</h3>
                  <button type="button" onClick={handleAddImageRow} className="text-xs font-bold text-black flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add Image
                  </button>
                </div>

                <div className="space-y-3">
                  {productImages.map((img, i) => (
                    <div key={i} className="flex gap-2 items-center bg-white p-2 rounded-lg border border-gray-200">
                      <input type="text" placeholder="Image URL" value={img.image_url} onChange={(e) => handleImageChange(i, "image_url", e.target.value)} className="flex-1 border rounded p-1.5 text-xs outline-none" />
                      <button type="button" onClick={() => handleRemoveImageRow(i, img.id)} className="text-red-500 hover:text-red-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 2. CATALOG & LIST VIEW */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <PageHeader 
              title="Products Inventory" 
              description="Manage your menswear variants, pricing, bulk exports, and CSV imports."
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setShowCsvModal(true)} className="bg-white border text-gray-800 hover:bg-gray-100 rounded-lg gap-2 h-11 px-4 text-xs font-bold uppercase tracking-wider">
                <Upload className="h-4 w-4" /> Import CSV
              </Button>
              <Button onClick={handleExportCSV} className="bg-white border text-gray-800 hover:bg-gray-100 rounded-lg gap-2 h-11 px-4 text-xs font-bold uppercase tracking-wider">
                <Download className="h-4 w-4" /> Export CSV
              </Button>
              <Button onClick={handleAddNew} className="bg-black text-white hover:bg-gray-800 rounded-lg gap-2 h-11 px-5 text-xs font-bold uppercase tracking-wider">
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </div>
          </div>

          {bulkActionMsg && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" /> {bulkActionMsg}
            </div>
          )}

          {/* Bulk Update Controls widget */}
          <div className="bg-gray-50 border rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-b pb-1.5">Bulk Price Adjustments</h4>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="e.g. 10 (Increases by 10%)" 
                  value={bulkPricePercent} 
                  onChange={(e) => setBulkPricePercent(e.target.value)} 
                  className="flex-1 border rounded-lg px-3 py-1.5 text-xs outline-none" 
                />
                <Button onClick={handleBulkUpdatePrices} className="bg-black text-white hover:bg-gray-800 text-xs px-4 h-9">
                  Adjust Prices
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-b pb-1.5">Bulk Inventory Overwrites</h4>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="e.g. 50 (Sets stock to 50)" 
                  value={bulkStockQuantity} 
                  onChange={(e) => setBulkStockQuantity(e.target.value)} 
                  className="flex-1 border rounded-lg px-3 py-1.5 text-xs outline-none" 
                />
                <Button onClick={handleBulkUpdateStock} className="bg-black text-white hover:bg-gray-800 text-xs px-4 h-9">
                  Update Stock
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
              <Loader2 className="animate-spin h-8 w-8 text-black" />
            </div>
          ) : (
            <DataTable 
              columns={columns} 
              data={productsList} 
              onEdit={(id) => {
                const prod = productsList.find(p => p.id === id);
                if (prod) handleEditClick(prod.raw);
              }}
              onDelete={handleDeleteProduct}
            />
          )}
        </div>
      )}

      {/* 3. CSV IMPORT MODAL */}
      {showCsvModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border rounded-2xl w-full max-w-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900 text-lg uppercase tracking-wider">Bulk CSV Import</h3>
              <button onClick={() => setShowCsvModal(false)} className="text-gray-400 hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Paste product rows below in the following format (No quotes needed around category, columns separated by comma):
              <br />
              <code className="bg-gray-100 p-1 block mt-2 font-mono text-[10px]">Title,Price,Category</code>
              <code className="bg-gray-100 p-1 block mt-1 font-mono text-[10px]">Italian Suit,350.00,Suits</code>
            </p>
            <textarea 
              rows={8} 
              value={csvText} 
              onChange={(e) => setCsvText(e.target.value)} 
              placeholder="Title,Price,Category&#10;Italian Blazer,220.00,Blazers&#10;Leather Shoes,180.00,Shoes"
              className="w-full border border-gray-300 rounded-lg p-3 text-xs font-mono outline-none focus:ring-2 focus:ring-black"
            />
            <div className="flex justify-end gap-3 border-t pt-4">
              <Button onClick={() => setShowCsvModal(false)} className="bg-gray-100 text-gray-800 hover:bg-gray-200 text-xs px-5">Cancel</Button>
              <Button onClick={handleImportCSV} className="bg-black text-white hover:bg-gray-800 text-xs px-5">Import Products</Button>
            </div>
          </div>
        </div>
      )}

      {/* 4. PREVIEW MODAL */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-6 sm:p-8 space-y-6 relative my-8">
            <button onClick={() => setShowPreview(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black">
              <X className="h-6 w-6" />
            </button>
            
            <div className="border-b pb-3 mb-4">
              <span className="text-[10px] bg-yellow-100 text-yellow-800 font-bold px-2 py-0.5 rounded uppercase tracking-wider">Storefront Live Preview Mock</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Gallery mock */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border flex items-center justify-center relative">
                  {productImages[0]?.image_url ? (
                    <img src={productImages[0].image_url} alt="" className="object-cover w-full h-full" />
                  ) : (
                    <ImageIcon className="h-16 w-16 text-gray-300" />
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {productImages.slice(1, 5).map((img, idx) => (
                    <div key={idx} className="aspect-square bg-gray-50 rounded-lg overflow-hidden border">
                      <img src={img.image_url} alt="" className="object-cover w-full h-full" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Info Mock */}
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">TOKIYO PREMIUM MENSWEAR</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-gray-900 tracking-tight mt-1">{title || "Product Title"}</h2>
                  <p className="text-xs text-gray-500 font-medium mt-1 italic">{titleSo}</p>
                </div>

                <div className="flex items-baseline space-x-3 border-y py-3">
                  <span className="text-2xl font-bold text-gray-900">${parseFloat(price || "0").toFixed(2)}</span>
                  {compareAtPrice && (
                    <span className="text-sm text-gray-500 line-through">${parseFloat(compareAtPrice).toFixed(2)}</span>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Available Sizes</h4>
                  <div className="flex gap-2">
                    {variants.map((v, i) => (
                      <span key={i} className="px-3 py-1.5 border border-gray-200 rounded text-xs font-semibold text-gray-800 bg-gray-50">
                        {v.size} ({v.color})
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Description / Faahfaahin</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{description || "No description provided."}</p>
                  <p className="text-gray-500 text-xs mt-3 leading-relaxed border-l-2 pl-3 italic">{descriptionSo}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
