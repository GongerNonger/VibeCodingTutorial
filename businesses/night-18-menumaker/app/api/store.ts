export interface MenuItem {
  name: string;
  description: string;
  price: number;
  tags: string[]; // vegetarian, vegan, gluten-free, spicy
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface Menu {
  id: string;
  restaurantName: string;
  description: string;
  theme: "elegant" | "casual" | "modern";
  currency: string;
  categories: MenuCategory[];
}

const menus: Map<string, Menu> = new Map();

// Pre-seed with sample Italian restaurant
const sampleMenu: Menu = {
  id: "sample-1",
  restaurantName: "Trattoria Bella",
  description: "Authentic Italian cuisine in the heart of the city",
  theme: "elegant",
  currency: "USD",
  categories: [
    {
      name: "Antipasti",
      items: [
        { name: "Bruschetta", description: "Toasted bread with fresh tomatoes and basil", price: 9.50, tags: ["vegetarian"] },
        { name: "Caprese Salad", description: "Fresh mozzarella, tomatoes, and basil drizzle", price: 12.00, tags: ["vegetarian", "gluten-free"] },
        { name: "Arancini", description: "Crispy fried risotto balls with marinara", price: 11.00, tags: ["vegetarian"] },
      ],
    },
    {
      name: "Pasta",
      items: [
        { name: "Spaghetti Carbonara", description: "Classic Roman pasta with egg, pecorino, and guanciale", price: 18.00, tags: [] },
        { name: "Penne Arrabbiata", description: "Spicy tomato sauce with garlic and chili flakes", price: 15.00, tags: ["vegan", "spicy"] },
        { name: "Fettuccine Alfredo", description: "Rich and creamy parmesan sauce", price: 17.00, tags: ["vegetarian"] },
      ],
    },
    {
      name: "Pizze",
      items: [
        { name: "Margherita", description: "San Marzano tomatoes, fresh mozzarella, basil", price: 14.00, tags: ["vegetarian"] },
        { name: "Diavola", description: "Spicy salami, mozzarella, chili oil", price: 16.00, tags: ["spicy"] },
        { name: "Quattro Formaggi", description: "Mozzarella, gorgonzola, fontina, parmesan", price: 17.00, tags: ["vegetarian"] },
      ],
    },
    {
      name: "Dolci",
      items: [
        { name: "Tiramisu", description: "Classic coffee-flavored Italian dessert", price: 10.00, tags: ["vegetarian"] },
        { name: "Panna Cotta", description: "Vanilla cream with berry compote", price: 9.00, tags: ["vegetarian", "gluten-free"] },
        { name: "Sorbet Trio", description: "Lemon, raspberry, and mango sorbets", price: 8.00, tags: ["vegan", "gluten-free"] },
      ],
    },
  ],
};

menus.set(sampleMenu.id, sampleMenu);

let nextId = 2;

export function getAllMenus(): Menu[] {
  return Array.from(menus.values());
}

export function getMenu(id: string): Menu | undefined {
  return menus.get(id);
}

export function createMenu(data: Omit<Menu, "id">): Menu {
  const id = `menu-${nextId++}`;
  const menu: Menu = { id, ...data };
  menus.set(id, menu);
  return menu;
}

export function updateMenu(id: string, data: Partial<Omit<Menu, "id">>): Menu | undefined {
  const existing = menus.get(id);
  if (!existing) return undefined;
  const updated: Menu = { ...existing, ...data, id };
  menus.set(id, updated);
  return updated;
}
