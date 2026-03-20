"use client";

import { useState, useEffect, useCallback } from "react";

interface MenuItem {
  name: string;
  description: string;
  price: number;
  tags: string[];
}

interface MenuCategory {
  name: string;
  items: MenuItem[];
}

interface Menu {
  id: string;
  restaurantName: string;
  description: string;
  theme: "elegant" | "casual" | "modern";
  currency: string;
  categories: MenuCategory[];
}

const DIETARY_TAGS = ["vegetarian", "vegan", "gluten-free", "spicy"] as const;

function TagBadge({ tag }: { tag: string }) {
  const config: Record<string, { label: string; icon: string; color: string }> = {
    vegetarian: { label: "Vegetarian", icon: "\u{1F331}", color: "bg-green-800 text-green-200" },
    vegan: { label: "Vegan", icon: "\u{1F33F}", color: "bg-emerald-800 text-emerald-200" },
    "gluten-free": { label: "GF", icon: "\u{1F33E}", color: "bg-amber-800 text-amber-200" },
    spicy: { label: "Spicy", icon: "\u{1F336}\u{FE0F}", color: "bg-red-800 text-red-200" },
  };
  const c = config[tag];
  if (!c) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${c.color}`}>
      <span>{c.icon}</span>
      {c.label}
    </span>
  );
}

function formatPrice(price: number, currency: string): string {
  const symbols: Record<string, string> = { USD: "$", EUR: "\u20AC", GBP: "\u00A3" };
  const sym = symbols[currency] || "$";
  return `${sym}${price.toFixed(2)}`;
}

function MenuPreview({ menu }: { menu: Menu }) {
  const themeStyles: Record<string, { heading: string; body: string; accent: string; divider: string }> = {
    elegant: {
      heading: "font-serif text-emerald-300 italic",
      body: "font-serif text-gray-300",
      accent: "border-emerald-700",
      divider: "border-emerald-900",
    },
    casual: {
      heading: "font-sans font-bold text-emerald-400",
      body: "font-sans text-gray-300",
      accent: "border-emerald-600",
      divider: "border-gray-700",
    },
    modern: {
      heading: "font-mono uppercase tracking-widest text-emerald-400",
      body: "font-sans text-gray-300",
      accent: "border-emerald-500",
      divider: "border-gray-800",
    },
  };
  const style = themeStyles[menu.theme] || themeStyles.modern;

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 max-h-[80vh] overflow-y-auto" id="menu-preview">
      <div className="text-center mb-6">
        <h2 className={`text-2xl mb-1 ${style.heading}`}>{menu.restaurantName || "Your Restaurant"}</h2>
        <p className="text-gray-500 text-sm">{menu.description}</p>
      </div>
      {menu.categories.map((cat, ci) => (
        <div key={ci} className={`mb-6 pb-4 border-b ${style.divider} last:border-0`}>
          <h3 className={`text-lg mb-3 ${style.heading} border-b ${style.accent} pb-1`}>{cat.name}</h3>
          <div className="space-y-3">
            {cat.items.map((item, ii) => (
              <div key={ii} className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-medium ${style.body}`}>{item.name}</span>
                    {item.tags.map((t) => (
                      <TagBadge key={t} tag={t} />
                    ))}
                  </div>
                  {item.description && <p className="text-gray-500 text-sm mt-0.5">{item.description}</p>}
                </div>
                <span className="text-emerald-400 font-semibold whitespace-nowrap">
                  {formatPrice(item.price, menu.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
      {menu.categories.length === 0 && (
        <p className="text-gray-600 text-center py-8">Add categories and items to see your menu preview</p>
      )}
    </div>
  );
}

export default function Home() {
  const [menu, setMenu] = useState<Menu>({
    id: "",
    restaurantName: "",
    description: "",
    theme: "modern",
    currency: "USD",
    categories: [],
  });
  const [savedMenus, setSavedMenus] = useState<Menu[]>([]);
  const [qrSvg, setQrSvg] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const loadMenus = useCallback(async () => {
    try {
      const res = await fetch("/api/menus");
      const data = await res.json();
      setSavedMenus(data);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  const saveMenu = async () => {
    setSaving(true);
    try {
      const method = menu.id ? "PUT" : "POST";
      const url = menu.id ? `/api/menus/${menu.id}` : "/api/menus";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menu),
      });
      const saved = await res.json();
      setMenu(saved);
      loadMenus();
    } catch {
      /* ignore */
    }
    setSaving(false);
  };

  const loadQR = async (id: string) => {
    try {
      const res = await fetch(`/api/menus/${id}/qr`);
      const svg = await res.text();
      setQrSvg(svg);
    } catch {
      /* ignore */
    }
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    setMenu((m) => ({
      ...m,
      categories: [...m.categories, { name: newCategoryName.trim(), items: [] }],
    }));
    setNewCategoryName("");
  };

  const removeCategory = (index: number) => {
    setMenu((m) => ({
      ...m,
      categories: m.categories.filter((_, i) => i !== index),
    }));
  };

  const addItem = (catIndex: number) => {
    setMenu((m) => {
      const cats = [...m.categories];
      cats[catIndex] = {
        ...cats[catIndex],
        items: [...cats[catIndex].items, { name: "New Item", description: "", price: 0, tags: [] }],
      };
      return { ...m, categories: cats };
    });
  };

  const updateItem = (catIndex: number, itemIndex: number, updates: Partial<MenuItem>) => {
    setMenu((m) => {
      const cats = [...m.categories];
      const items = [...cats[catIndex].items];
      items[itemIndex] = { ...items[itemIndex], ...updates };
      cats[catIndex] = { ...cats[catIndex], items };
      return { ...m, categories: cats };
    });
  };

  const removeItem = (catIndex: number, itemIndex: number) => {
    setMenu((m) => {
      const cats = [...m.categories];
      cats[catIndex] = {
        ...cats[catIndex],
        items: cats[catIndex].items.filter((_, i) => i !== itemIndex),
      };
      return { ...m, categories: cats };
    });
  };

  const toggleTag = (catIndex: number, itemIndex: number, tag: string) => {
    const item = menu.categories[catIndex].items[itemIndex];
    const tags = item.tags.includes(tag) ? item.tags.filter((t) => t !== tag) : [...item.tags, tag];
    updateItem(catIndex, itemIndex, { tags });
  };

  const handlePrint = () => {
    const el = document.getElementById("menu-preview");
    if (!el) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html><head><title>${menu.restaurantName || "Menu"}</title>
      <style>body{font-family:Georgia,serif;max-width:700px;margin:0 auto;padding:40px;color:#1a1a1a}
      h2{text-align:center;margin-bottom:4px}h3{border-bottom:1px solid #ccc;padding-bottom:4px}
      .item{display:flex;justify-content:space-between;margin:8px 0}.desc{color:#666;font-size:0.9em}
      .tag{font-size:0.75em;padding:2px 6px;border-radius:9999px;background:#e5e7eb;margin-left:4px}
      .price{font-weight:bold;white-space:nowrap}</style></head><body>
      <h2>${menu.restaurantName || "Menu"}</h2>
      <p style="text-align:center;color:#666">${menu.description}</p>
      ${menu.categories
        .map(
          (cat) => `
        <h3>${cat.name}</h3>
        ${cat.items
          .map(
            (item) => `
          <div class="item">
            <div><strong>${item.name}</strong>${item.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
            ${item.description ? `<div class="desc">${item.description}</div>` : ""}</div>
            <div class="price">${formatPrice(item.price, menu.currency)}</div>
          </div>`
          )
          .join("")}`
        )
        .join("")}
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  const loadMenu = (m: Menu) => {
    setMenu(m);
    if (m.id) loadQR(m.id);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-emerald-500 mb-2">MenuMaker</h1>
        <p className="text-gray-400">Create beautiful digital menus with QR codes for your restaurant</p>
      </header>

      {/* Saved menus bar */}
      {savedMenus.length > 0 && (
        <div className="mb-6 flex gap-2 flex-wrap items-center">
          <span className="text-gray-500 text-sm">Saved menus:</span>
          {savedMenus.map((m) => (
            <button
              key={m.id}
              onClick={() => loadMenu(m)}
              className={`px-3 py-1 rounded-lg text-sm transition ${
                menu.id === m.id
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {m.restaurantName || "Untitled"}
            </button>
          ))}
          <button
            onClick={() =>
              setMenu({ id: "", restaurantName: "", description: "", theme: "modern", currency: "USD", categories: [] })
            }
            className="px-3 py-1 rounded-lg text-sm bg-gray-800 text-emerald-400 hover:bg-gray-700"
          >
            + New Menu
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Builder */}
        <div className="space-y-6">
          {/* Restaurant Info */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <h2 className="text-lg font-semibold text-emerald-400 mb-4">Restaurant Details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Restaurant Name</label>
                <input
                  type="text"
                  value={menu.restaurantName}
                  onChange={(e) => setMenu((m) => ({ ...m, restaurantName: e.target.value }))}
                  placeholder="e.g. Trattoria Bella"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <input
                  type="text"
                  value={menu.description}
                  onChange={(e) => setMenu((m) => ({ ...m, description: e.target.value }))}
                  placeholder="A short tagline for your restaurant"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Theme</label>
                  <select
                    value={menu.theme}
                    onChange={(e) => setMenu((m) => ({ ...m, theme: e.target.value as Menu["theme"] }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="elegant">Elegant</option>
                    <option value="casual">Casual</option>
                    <option value="modern">Modern</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Currency</label>
                  <select
                    value={menu.currency}
                    onChange={(e) => setMenu((m) => ({ ...m, currency: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (&euro;)</option>
                    <option value="GBP">GBP (&pound;)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <h2 className="text-lg font-semibold text-emerald-400 mb-4">Menu Categories</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCategory()}
                placeholder="Category name (e.g. Appetizers)"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:border-emerald-500 focus:outline-none"
              />
              <button
                onClick={addCategory}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
              >
                Add
              </button>
            </div>

            <div className="space-y-4">
              {menu.categories.map((cat, ci) => (
                <div key={ci} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-emerald-300">{cat.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addItem(ci)}
                        className="text-xs px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded transition"
                      >
                        + Item
                      </button>
                      <button
                        onClick={() => removeCategory(ci)}
                        className="text-xs px-2 py-1 bg-red-900 hover:bg-red-800 text-red-200 rounded transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {cat.items.map((item, ii) => (
                      <div key={ii} className="bg-gray-800 rounded-lg p-3 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(ci, ii, { name: e.target.value })}
                            placeholder="Item name"
                            className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-gray-100 focus:border-emerald-500 focus:outline-none"
                          />
                          <input
                            type="number"
                            value={item.price || ""}
                            onChange={(e) => updateItem(ci, ii, { price: parseFloat(e.target.value) || 0 })}
                            placeholder="Price"
                            step="0.01"
                            min="0"
                            className="w-24 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-gray-100 focus:border-emerald-500 focus:outline-none"
                          />
                          <button
                            onClick={() => removeItem(ci, ii)}
                            className="text-red-400 hover:text-red-300 text-sm px-1"
                          >
                            &times;
                          </button>
                        </div>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(ci, ii, { description: e.target.value })}
                          placeholder="Description (optional)"
                          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-gray-100 focus:border-emerald-500 focus:outline-none"
                        />
                        <div className="flex gap-3 flex-wrap">
                          {DIETARY_TAGS.map((tag) => (
                            <label key={tag} className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.tags.includes(tag)}
                                onChange={() => toggleTag(ci, ii, tag)}
                                className="accent-emerald-500"
                              />
                              {tag}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    {cat.items.length === 0 && (
                      <p className="text-gray-600 text-sm text-center py-2">No items yet. Click &quot;+ Item&quot; to add.</p>
                    )}
                  </div>
                </div>
              ))}
              {menu.categories.length === 0 && (
                <p className="text-gray-600 text-center py-4">No categories yet. Add one above to get started.</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={saveMenu}
              disabled={saving}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-900 text-white rounded-lg font-semibold transition"
            >
              {saving ? "Saving..." : menu.id ? "Update Menu" : "Save Menu"}
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-semibold transition"
            >
              Print Menu
            </button>
            {menu.id && (
              <button
                onClick={() => loadQR(menu.id)}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-semibold transition"
              >
                Generate QR Code
              </button>
            )}
          </div>

          {/* QR Code Display */}
          {qrSvg && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 text-center">
              <h2 className="text-lg font-semibold text-emerald-400 mb-3">QR Code for Table Display</h2>
              <div
                className="inline-block bg-white p-4 rounded-lg"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
              <p className="text-gray-500 text-sm mt-2">Scan to view the digital menu</p>
            </div>
          )}
        </div>

        {/* Right: Preview */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <h2 className="text-lg font-semibold text-emerald-400 mb-3">Live Preview</h2>
          <MenuPreview menu={menu} />
        </div>
      </div>
    </div>
  );
}
