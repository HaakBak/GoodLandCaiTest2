import logo from '/src/assets/logo.png';

const INITIAL_MENU = [
  { id: '1', name: 'Espresso', basePrice: 85, VAT_fee: 10.2, totalPrice: 95.2, category: 'Beverages' },
  { id: '2', name: 'Double Espresso', basePrice: 105, VAT_fee: 12.6, totalPrice: 117.6, category: 'Beverages' },
  { id: '3', name: 'Cappuccino', basePrice: 125, VAT_fee: 15, totalPrice: 140, category: 'Beverages' },
  { id: '4', name: 'Mocha', basePrice: 135, VAT_fee: 16.2, totalPrice: 151.2, category: 'Beverages' },
  { id: '5', name: 'Iced Coffee', basePrice: 115, VAT_fee: 13.8, totalPrice: 128.8, category: 'Beverages' },
  { id: '9', name: 'Grilled Chicken Breast', basePrice: 295, VAT_fee: 35.4, totalPrice: 330.4, category: 'Main Dishes' },
  { id: '10', name: 'Beef Burger', basePrice: 245, VAT_fee: 29.4, totalPrice: 274.4, category: 'Main Dishes' },
  { id: '13', name: 'Pasta Alfredo', basePrice: 265, VAT_fee: 31.8, totalPrice: 296.8, category: 'Main Dishes' },
  { id: '14', name: 'Fish & Chips', basePrice: 285, VAT_fee: 34.2, totalPrice: 319.2, category: 'Main Dishes' },
  { id: '15', name: 'Veggie Wrap', basePrice: 155, VAT_fee: 18.6, totalPrice: 173.6, category: 'Main Dishes' },
  { id: '16', name: 'Coleslaw', basePrice: 45, VAT_fee: 5.4, totalPrice: 50.4, category: 'Side Dish' },
  { id: '17', name: 'Onion Rings', basePrice: 65, VAT_fee: 7.8, totalPrice: 72.8, category: 'Side Dish' },
  { id: '18', name: 'Brownie', basePrice: 95, VAT_fee: 11.4, totalPrice: 106.4, category: 'Desserts' },
  { id: '19', name: 'Fruit Tart', basePrice: 125, VAT_fee: 15.0, totalPrice: 140.0, category: 'Desserts' },
];

// Enhanced Inventory with Measurement Logic
const INITIAL_INVENTORY = [
  { 
    id: '1', 
    name: 'Coffee Beans - Arabica', 
    inStock: 10, // 10 Bags
    cost: 365, 
    type: 'Perishable',
    measurementUnit: 'g',
    measurementQty: 1000, // 1 Bag = 1000g
    openStock: 500 // 500g currently in the grinder
  },
  { 
    id: '2', 
    name: 'Milk - Fresh', 
    inStock: 20, 
    cost: 166, 
    type: 'Perishable',
    measurementUnit: 'ml',
    measurementQty: 1000, // 1 Carton = 1000ml (1 Liter)
    openStock: 200 // 200ml left in open carton
  },
  { 
    id: '3', 
    name: 'Sugar - Brown', 
    inStock: 15, 
    cost: 178, 
    type: 'Perishable',
    measurementUnit: 'g',
    measurementQty: 500, // 1 Pack = 500g
    openStock: 450 
  },
  { 
    id: '4', 
    name: 'Chicken Breast', 
    inStock: 50, 
    cost: 216, 
    type: 'Perishable',
    measurementUnit: 'pcs',
    measurementQty: 1, // 1 Pack = 1 pc (Simple count)
    openStock: 0 
  },
  { 
    id: '5', 
    name: 'Brown Paper Cups', 
    inStock: 5, 
    cost: 39, 
    type: 'Supplies',
    measurementUnit: 'pcs',
    measurementQty: 50, // 1 Sleeve = 50 cups
    openStock: 25 
  }
  ,
  { id: '6', name: 'Flour - All Purpose', inStock: 20, cost: 120, type: 'Perishable', measurementUnit: 'g', measurementQty: 1000, openStock: 0 },
  { id: '8', name: 'Eggs', inStock: 30, cost: 8, type: 'Perishable', measurementUnit: 'pcs', measurementQty: 12, openStock: 6 },
  { id: '11', name: 'Potatoes', inStock: 40, cost: 30, type: 'Perishable', measurementUnit: 'g', measurementQty: 1000, openStock: 500 }
  ,
  { id: '20', name: 'Pasta (Semolina)', inStock: 15, cost: 120, type: 'Perishable', measurementUnit: 'g', measurementQty: 1000, openStock: 0 },
  { id: '21', name: 'Alfredo Sauce', inStock: 10, cost: 220, type: 'Perishable', measurementUnit: 'g', measurementQty: 1000, openStock: 0 },
  { id: '22', name: 'Fish Fillet', inStock: 30, cost: 150, type: 'Perishable', measurementUnit: 'pcs', measurementQty: 1, openStock: 10 },
  { id: '23', name: 'Breadcrumbs', inStock: 20, cost: 80, type: 'Perishable', measurementUnit: 'g', measurementQty: 500, openStock: 200 },
  { id: '24', name: 'Lettuce', inStock: 25, cost: 25, type: 'Perishable', measurementUnit: 'pcs', measurementQty: 1, openStock: 10 },
  { id: '25', name: 'Onions', inStock: 40, cost: 18, type: 'Perishable', measurementUnit: 'pcs', measurementQty: 1, openStock: 20 },
  { id: '26', name: 'Brownie Mix / Chocolate', inStock: 12, cost: 200, type: 'Perishable', measurementUnit: 'g', measurementQty: 500, openStock: 0 },
  { id: '27', name: 'Assorted Fruits', inStock: 10, cost: 180, type: 'Perishable', measurementUnit: 'g', measurementQty: 1000, openStock: 200 }
];

const INITIAL_BUSINESS_INFO = {
  tin: "908-767-876-000",
  name: "GoodLand Cafe",
  status: "VAT_Reg",
  address: "Cariño Street, Baguio City",
  phone: "(239) 555-0298",
  // Using a placeholder avatar generator that serves an image (PNG/JPG compatible)
  logoUrl: logo,
};

const KEYS = {
  MENU: 'pos_menu',
  INVENTORY: 'pos_inventory',
  INVENTORY_AUTO: 'pos_inventory_recipes',
  SUPPLIERS: 'pos_suppliers',
  TRANSACTIONS: 'pos_transactions',
  USAGE_LOGS: 'pos_inventory_usage_logs',
  BUSINESS_INFO: 'pos_business_info',
  NOTIFICATIONS: 'pos_notifications',
};

// --- Helpers ---
const getLocalStorage = (key, initial) => {
  // Always prefer existing localStorage value. If none exists, return the
  // provided initial value as a fallback but do NOT write it back into
  // localStorage automatically. This prevents unintentionally overwriting
  // user data and ensures the app reads live local data when present.
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      // If stored data is corrupted, fall back to initial without overwriting.
      console.warn(`Failed to parse localStorage for ${key}:`, e);
      return initial;
    }
  }
  return initial;
};

// Merge initial seed data into existing localStorage without removing user data.
const mergeInitialData = (key, initial) => {
  const storedRaw = localStorage.getItem(key);

  // If nothing stored yet, write the initial seed and return it
  if (!storedRaw) {
    setLocalStorage(key, initial);
    return initial;
  }

  try {
    const stored = JSON.parse(storedRaw);

    // If both stored and initial are arrays -> merge by `id`
    if (Array.isArray(initial) && Array.isArray(stored)) {
      const map = new Map();
      stored.forEach(item => map.set(item.id, item));

      // detect duplicates (ids present in both initial and stored)
      const storedIds = new Set(stored.map(i => i.id));
      const initialIds = new Set(initial.map(i => i.id));
      const duplicates = Array.from(initialIds).filter(id => storedIds.has(id));

      // If merging menu or inventory, warn when duplicates exist and ensure
      // local storage entries take precedence (they are already placed first).
      if (duplicates.length > 0 && (key === KEYS.MENU || key === KEYS.INVENTORY)) {
        console.warn(`mergeInitialData: Found duplicate ids for ${key}. Local storage entries will overwrite initial seeds for ids:`, duplicates);
      }

      let added = false;
      initial.forEach(item => {
        if (!map.has(item.id)) {
          map.set(item.id, item);
          added = true;
        }
      });
      const merged = Array.from(map.values());
      if (added) setLocalStorage(key, merged);
      return merged;
    }

    // If both are objects -> shallow merge keys
    if (initial && typeof initial === 'object' && !Array.isArray(initial) && stored && typeof stored === 'object' && !Array.isArray(stored)) {
      const merged = { ...initial, ...stored };
      // We want stored to take precedence, so saved object should match stored but include missing initial keys
      let added = false;
      Object.keys(initial).forEach(k => {
        if (!(k in stored)) added = true;
      });
      if (added) setLocalStorage(key, merged);
      return merged;
    }

    // Fallback: return stored as-is
    return stored;
  } catch (e) {
    console.warn(`Failed merging initial data for ${key}:`, e);
    // If parsing fails, replace with initial to recover
    setLocalStorage(key, initial);
    return initial;
  }
};

const setLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- API Methods ---

export const getMenu = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mergeInitialData(KEYS.MENU, INITIAL_MENU)), 300);
  });
};

export const saveMenu = (menu) => {
  return new Promise((resolve) => {
    setLocalStorage(KEYS.MENU, menu);
    resolve();
  });
};

export const resetMenu = () => {
  return new Promise((resolve) => {
    // Merge initial menu into localStorage without overwriting existing local entries.
    const merged = mergeInitialData(KEYS.MENU, INITIAL_MENU);
    resolve(merged);
  });
};

export const getInventory = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mergeInitialData(KEYS.INVENTORY, INITIAL_INVENTORY)), 100);
  });
};

export const addInventoryItem = async (item) => {
  return new Promise((resolve) => {
      const inventory = getLocalStorage(KEYS.INVENTORY, INITIAL_INVENTORY);
      const newItem = { ...item, id: crypto.randomUUID() };
      inventory.push(newItem);
      setLocalStorage(KEYS.INVENTORY, inventory);
      resolve(newItem);
  });
};

export const updateInventoryItem = async (id, updates) => {
  return new Promise((resolve) => {
      let inventory = getLocalStorage(KEYS.INVENTORY, INITIAL_INVENTORY);
      inventory = inventory.map(item => {
          if (item.id === id) {
              return { ...item, ...updates };
          }
          return item;
      });
      setLocalStorage(KEYS.INVENTORY, inventory);
      resolve();
  });
};

export const getSuppliers = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getLocalStorage(KEYS.SUPPLIERS, [])), 100);
  });
};

export const saveSuppliers = async (suppliers) => {
  return new Promise((resolve) => {
    setLocalStorage(KEYS.SUPPLIERS, suppliers);
    resolve();
  });
};

export const getTransactions = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getLocalStorage(KEYS.TRANSACTIONS, [])), 300);
  });
};

export const saveTransaction = (transaction) => {
  return new Promise((resolve) => {
    const current = getLocalStorage(KEYS.TRANSACTIONS, []);
    current.push(transaction);
    setLocalStorage(KEYS.TRANSACTIONS, current);
    resolve();
  });
};

export const getRecipes = async () => {
  const INITIAL_RECIPES = {
    '13': [ // Pasta Alfredo
      { inventoryId: '20', name: 'Pasta (Semolina)', quantity: 120 },
      { inventoryId: '21', name: 'Alfredo Sauce', quantity: 80 }
    ],
    '14': [ // Fish & Chips
      { inventoryId: '22', name: 'Fish Fillet', quantity: 1 },
      { inventoryId: '23', name: 'Breadcrumbs', quantity: 50 },
      { inventoryId: '11', name: 'Potatoes', quantity: 200 }
    ],
    '15': [ // Veggie Wrap
      { inventoryId: '24', name: 'Lettuce', quantity: 1 },
      { inventoryId: '9', name: 'Tomatoes', quantity: 1 },
      { inventoryId: '25', name: 'Onions', quantity: 1 }
    ],
    '16': [ // Coleslaw (simple seed)
      { inventoryId: '24', name: 'Lettuce', quantity: 1 },
      { inventoryId: '25', name: 'Onions', quantity: 0.5 }
    ],
    '17': [ // Onion Rings
      { inventoryId: '25', name: 'Onions', quantity: 2 },
      { inventoryId: '6', name: 'Flour - All Purpose', quantity: 50 }
    ],
    '18': [ // Brownie
      { inventoryId: '26', name: 'Brownie Mix / Chocolate', quantity: 80 },
      { inventoryId: '8', name: 'Eggs', quantity: 2 }
    ],
    '19': [ // Fruit Tart
      { inventoryId: '27', name: 'Assorted Fruits', quantity: 120 },
      { inventoryId: '6', name: 'Flour - All Purpose', quantity: 80 }
    ]
  };

  return new Promise((resolve) => {
      setTimeout(() => resolve(mergeInitialData(KEYS.INVENTORY_AUTO, INITIAL_RECIPES)), 100);
  });
};

export const saveRecipe = async (dishId, ingredients) => {
  return new Promise((resolve) => {
      const recipes = getLocalStorage(KEYS.INVENTORY_AUTO, {});
      recipes[dishId] = ingredients;
      setLocalStorage(KEYS.INVENTORY_AUTO, recipes);
      resolve();
  });
};

// --- BUSINESS INFO METHODS ---
export const getBusinessInfo = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getLocalStorage(KEYS.BUSINESS_INFO, INITIAL_BUSINESS_INFO)), 100);
  });
};

export const saveBusinessInfo = async (info) => {
  return new Promise((resolve) => {
    setLocalStorage(KEYS.BUSINESS_INFO, info);
    resolve();
  });
};

export const getUsageLogs = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(getLocalStorage(KEYS.USAGE_LOGS, [])), 100);
    });
};
// --- Notifications System ---

export const getNotifications = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(getLocalStorage(KEYS.NOTIFICATIONS, [])), 100);
    });
};

export const addNotification = (notification) => {
    const notifications = getLocalStorage(KEYS.NOTIFICATIONS, []);
    const newNote = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        read: false,
        ...notification
    };
    // Add to top of list
    notifications.unshift(newNote);
    setLocalStorage(KEYS.NOTIFICATIONS, notifications);
    
    // Dispatch custom event for UI Toast
    window.dispatchEvent(new CustomEvent('SHOW_TOAST', { detail: newNote }));
};

// --- CORE LOGIC: Transaction Processing with Unit Conversion ---

export const updateTransactionStatus = async (transactionId) => {
  return new Promise((resolve) => {
    const transactions = getLocalStorage(KEYS.TRANSACTIONS, []);
    const transaction = transactions.find(t => t.id === transactionId);

    if (transaction && transaction.status === 'No') {
      const recipes = getLocalStorage(KEYS.INVENTORY_AUTO, {});
      const inventory = getLocalStorage(KEYS.INVENTORY, INITIAL_INVENTORY);
      const usageLogs = getLocalStorage(KEYS.USAGE_LOGS, []);
      
      const usageTracker = new Map();

      // Iterate through ordered items
      transaction.items.forEach(orderItem => {
        const dishId = orderItem.menuItem.id;
        
        // Only process if dish has a recipe
        if (recipes[dishId]) {
          const ingredients = recipes[dishId];
          
          ingredients.forEach(ing => {
            const invIndex = inventory.findIndex(inv => inv.id === ing.inventoryId);
            
            if (invIndex !== -1) {
              const item = inventory[invIndex];
              const amountNeededTotal = ing.quantity * orderItem.quantity;
              
              // Track usage for logging
              if (usageTracker.has(item.id)) {
                  const current = usageTracker.get(item.id);
                  current.qty += amountNeededTotal;
              } else {
                  usageTracker.set(item.id, { name: item.name, unit: item.measurementUnit, qty: amountNeededTotal });
              }

              // 1. DEDUCT FROM OPEN STOCK FIRST
              let remainingNeeded = amountNeededTotal;
              
              if (item.openStock >= remainingNeeded) {
                // Scenario A: Open stock has enough
                item.openStock -= remainingNeeded;
                remainingNeeded = 0;
              } else {
                // Scenario B: Open stock runs out
                remainingNeeded -= item.openStock;
                item.openStock = 0;
                
                // 2. OPEN NEW PACKS FROM WAREHOUSE (inStock)
                // Determine how many packs needed to cover the remainder
                // Avoid division by zero
                const packSize = item.measurementQty > 0 ? item.measurementQty : 1; 
                
                while (remainingNeeded > 0 && item.inStock > 0) {
                  item.inStock -= 1; // Open a pack
                  item.openStock += packSize; // Add content to open stock
                  
                  if (item.openStock >= remainingNeeded) {
                    item.openStock -= remainingNeeded;
                    remainingNeeded = 0;
                  } else {
                    remainingNeeded -= item.openStock;
                    item.openStock = 0;
                  }
                }
                
                // If we ran out of packs and still need more, Open Stock goes negative to indicate deficit
                if (remainingNeeded > 0) {
                  item.openStock -= remainingNeeded;
                }
              }

              // --- LOW STOCK ALERT CHECK ---
              // Default threshold is 5 if not set
              const threshold = item.lowStockThreshold !== undefined ? item.lowStockThreshold : 5;
              if (item.inStock <= threshold) {
                   // Check if a warning for this item was recently added to avoid spamming?
                   // For now, we just add the alert.
                   addNotification({
                       message: `Low Stock Alert: ${item.name} is down to ${item.inStock} packs.`,
                       type: 'warning'
                   });
              }
              
              // Update the item in the array
              inventory[invIndex] = item;
            }
          });
        }
      });

      // Save updated inventory
      setLocalStorage(KEYS.INVENTORY, inventory);

      // Create and Save Logs
      usageTracker.forEach((val, key) => {
          usageLogs.push({
              id: crypto.randomUUID(),
              itemName: val.name,
              quantityUsed: val.qty,
              unit: val.unit,
              timestamp: new Date().toISOString(),
              transactionId: transactionId
          });
      });
      setLocalStorage(KEYS.USAGE_LOGS, usageLogs);

      // Update Transaction Status
      const updatedTransactions = transactions.map(t => t.id === transactionId ? { ...t, status: 'Yes' } : t);
      setLocalStorage(KEYS.TRANSACTIONS, updatedTransactions);
    }
    
    resolve();
  });
};
