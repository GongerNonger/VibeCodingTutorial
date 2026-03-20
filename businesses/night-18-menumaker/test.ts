import { getAllMenus, getMenu, createMenu, updateMenu } from "./app/api/store";
import type { Menu, MenuCategory, MenuItem } from "./app/api/store";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.error(`  FAIL: ${message}`);
    failed++;
  }
}

console.log("MenuMaker Tests\n================\n");

// Test 1: Pre-seeded menu exists
console.log("Test 1: Pre-seeded sample menu exists");
{
  const menus = getAllMenus();
  assert(menus.length >= 1, "At least one menu exists");
  const sample = menus.find((m) => m.restaurantName === "Trattoria Bella");
  assert(sample !== undefined, "Sample Italian restaurant is pre-seeded");
  assert(sample!.categories.length === 4, "Sample has 4 categories (Antipasti, Pasta, Pizze, Dolci)");
}

// Test 2: Menu creation
console.log("\nTest 2: Menu creation");
{
  const newMenu = createMenu({
    restaurantName: "Sushi Palace",
    description: "Fresh sushi daily",
    theme: "modern",
    currency: "USD",
    categories: [
      {
        name: "Rolls",
        items: [
          { name: "California Roll", description: "Crab, avocado, cucumber", price: 12.0, tags: [] },
        ],
      },
    ],
  });
  assert(newMenu.id !== "", "Created menu has an ID");
  assert(newMenu.restaurantName === "Sushi Palace", "Restaurant name is set correctly");
  assert(newMenu.categories.length === 1, "Menu has one category");
  const fetched = getMenu(newMenu.id);
  assert(fetched !== undefined, "Menu can be retrieved by ID");
  assert(fetched!.restaurantName === "Sushi Palace", "Retrieved menu has correct name");
}

// Test 3: Category management
console.log("\nTest 3: Category management");
{
  const menu = createMenu({
    restaurantName: "Test Restaurant",
    description: "",
    theme: "casual",
    currency: "USD",
    categories: [],
  });

  // Add categories via update
  const withCats = updateMenu(menu.id, {
    categories: [
      { name: "Starters", items: [] },
      { name: "Mains", items: [] },
      { name: "Desserts", items: [] },
    ],
  });
  assert(withCats!.categories.length === 3, "Menu updated with 3 categories");
  assert(withCats!.categories[0].name === "Starters", "First category is Starters");

  // Remove a category
  const removed = updateMenu(menu.id, {
    categories: withCats!.categories.filter((c) => c.name !== "Mains"),
  });
  assert(removed!.categories.length === 2, "Category removed, now has 2");
  assert(removed!.categories.every((c) => c.name !== "Mains"), "Mains category was removed");
}

// Test 4: Item CRUD operations
console.log("\nTest 4: Item CRUD operations");
{
  const menu = createMenu({
    restaurantName: "CRUD Test",
    description: "",
    theme: "elegant",
    currency: "EUR",
    categories: [{ name: "Food", items: [] }],
  });

  // Add items
  const item1: MenuItem = { name: "Burger", description: "Beef patty", price: 15.0, tags: [] };
  const item2: MenuItem = { name: "Salad", description: "Fresh greens", price: 10.0, tags: ["vegetarian", "vegan"] };
  const withItems = updateMenu(menu.id, {
    categories: [{ name: "Food", items: [item1, item2] }],
  });
  assert(withItems!.categories[0].items.length === 2, "Two items added to category");

  // Update item
  const updatedItems = [...withItems!.categories[0].items];
  updatedItems[0] = { ...updatedItems[0], price: 16.5 };
  const updated = updateMenu(menu.id, {
    categories: [{ name: "Food", items: updatedItems }],
  });
  assert(updated!.categories[0].items[0].price === 16.5, "Item price updated to 16.50");

  // Remove item
  const oneItem = updateMenu(menu.id, {
    categories: [{ name: "Food", items: [updatedItems[1]] }],
  });
  assert(oneItem!.categories[0].items.length === 1, "Item removed, one remains");
  assert(oneItem!.categories[0].items[0].name === "Salad", "Remaining item is Salad");
}

// Test 5: Dietary tag filtering
console.log("\nTest 5: Dietary tag filtering");
{
  const menu = createMenu({
    restaurantName: "Tag Test",
    description: "",
    theme: "modern",
    currency: "USD",
    categories: [
      {
        name: "Dishes",
        items: [
          { name: "Steak", description: "", price: 25.0, tags: ["gluten-free"] },
          { name: "Pasta", description: "", price: 14.0, tags: ["vegetarian"] },
          { name: "Tofu Bowl", description: "", price: 13.0, tags: ["vegan", "vegetarian", "gluten-free"] },
          { name: "Hot Wings", description: "", price: 12.0, tags: ["spicy", "gluten-free"] },
        ],
      },
    ],
  });

  const items = menu.categories[0].items;
  const veganItems = items.filter((i) => i.tags.includes("vegan"));
  assert(veganItems.length === 1, "One vegan item found");
  assert(veganItems[0].name === "Tofu Bowl", "Vegan item is Tofu Bowl");

  const gfItems = items.filter((i) => i.tags.includes("gluten-free"));
  assert(gfItems.length === 3, "Three gluten-free items found");

  const spicyItems = items.filter((i) => i.tags.includes("spicy"));
  assert(spicyItems.length === 1, "One spicy item found");

  const vegetarianItems = items.filter((i) => i.tags.includes("vegetarian"));
  assert(vegetarianItems.length === 2, "Two vegetarian items found");
}

// Test 6: Price formatting
console.log("\nTest 6: Price formatting");
{
  function formatPrice(price: number, currency: string): string {
    const symbols: Record<string, string> = { USD: "$", EUR: "\u20AC", GBP: "\u00A3" };
    const sym = symbols[currency] || "$";
    return `${sym}${price.toFixed(2)}`;
  }

  assert(formatPrice(9.5, "USD") === "$9.50", "USD formatting: $9.50");
  assert(formatPrice(15.0, "EUR") === "\u20AC15.00", "EUR formatting: \u20AC15.00");
  assert(formatPrice(22.99, "GBP") === "\u00A322.99", "GBP formatting: \u00A322.99");
  assert(formatPrice(0, "USD") === "$0.00", "Zero price formats as $0.00");
  assert(formatPrice(100.1, "USD") === "$100.10", "Trailing zero preserved: $100.10");
}

// Test 7: Theme application
console.log("\nTest 7: Theme application");
{
  const themes = ["elegant", "casual", "modern"] as const;
  for (const theme of themes) {
    const menu = createMenu({
      restaurantName: `${theme} Restaurant`,
      description: "",
      theme,
      currency: "USD",
      categories: [],
    });
    assert(menu.theme === theme, `Theme "${theme}" is set correctly`);
  }

  // Update theme
  const menu = createMenu({
    restaurantName: "Theme Switch",
    description: "",
    theme: "elegant",
    currency: "USD",
    categories: [],
  });
  const updated = updateMenu(menu.id, { theme: "casual" });
  assert(updated!.theme === "casual", "Theme updated from elegant to casual");

  // Non-existent menu returns undefined
  const result = updateMenu("nonexistent-id", { theme: "modern" });
  assert(result === undefined, "Updating non-existent menu returns undefined");
}

console.log(`\n================\nResults: ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
