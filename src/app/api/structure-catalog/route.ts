import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { apolloProductsCatalog, ApolloProduct } from "@/data/apolloProducts";

const DATA_FILE = path.join(process.cwd(), "src/data/customStructureProducts.json");

function getCatalog(): ApolloProduct[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading customStructureProducts.json:", err);
  }
  // Initialize with default catalog if missing
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(apolloProductsCatalog, null, 2), "utf-8");
  } catch (err) {
    console.error("Error creating customStructureProducts.json:", err);
  }
  return apolloProductsCatalog;
}

function saveCatalog(products: ApolloProduct[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), "utf-8");
}

// GET - List all structure catalog items
export async function GET() {
  try {
    const products = getCatalog();
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Add a new product or perform bulk operations
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Reset action
    if (body.action === "reset") {
      saveCatalog(apolloProductsCatalog);
      return NextResponse.json({ success: true, message: "Reset to default catalog", data: apolloProductsCatalog });
    }

    // Add product
    const { name, sku, category, unit, gstRate, basePrice, stock, description } = body;
    if (!name || !sku) {
      return NextResponse.json({ success: false, message: "Product name and SKU are required" }, { status: 400 });
    }

    const currentCatalog = getCatalog();
    const newId = body.id || `custom-${Date.now()}`;
    const newProduct: ApolloProduct = {
      id: newId,
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      category: category || "G.I. Solar Mounting Structure",
      unit: unit || "Pcs",
      gstRate: Number(gstRate) || 18,
      basePrice: Number(basePrice) || 0,
      stock: stock || "In Stock",
      description: description || "",
    };

    const updatedCatalog = [newProduct, ...currentCatalog];
    saveCatalog(updatedCatalog);

    return NextResponse.json({ success: true, data: newProduct, message: "Product added successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Update an existing product (rate, stock, name, etc.)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const currentCatalog = getCatalog();
    const index = currentCatalog.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // Merge updates
    const updatedProduct = {
      ...currentCatalog[index],
      ...updates,
      basePrice: updates.basePrice !== undefined ? Number(updates.basePrice) : currentCatalog[index].basePrice,
      gstRate: updates.gstRate !== undefined ? Number(updates.gstRate) : currentCatalog[index].gstRate,
    };

    currentCatalog[index] = updatedProduct;
    saveCatalog(currentCatalog);

    return NextResponse.json({ success: true, data: updatedProduct, message: "Product updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Remove a product from the catalog
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const currentCatalog = getCatalog();
    const filtered = currentCatalog.filter((p) => p.id !== id);

    if (filtered.length === currentCatalog.length) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    saveCatalog(filtered);
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
