import React, { useState, useEffect } from 'react';
import { 
  getInventory, 
  getSuppliers, 
  saveSuppliers, 
  getMenu, 
  getRecipes, 
  saveRecipe, 
  addInventoryItem, 
  updateInventoryItem,
  getUsageLogs
} from '../../services/mockDatabase';

const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState('Inventory');
  const [inventorySubTab, setInventorySubTab] = useState('General');
  
  const [inventory, setInventory] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [menu, setMenu] = useState([]);
  const [recipes, setRecipes] = useState({});
  const [usageLogs, setUsageLogs] = useState([]);
  const [search, setSearch] = useState('');
  
  const [sortOrder, setSortOrder] = useState(null);

  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [supplierName, setSupplierName] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');

  // 1. Add Inventory State
  const [addItemData, setAddItemData] = useState({
    name: '',
    stock: '', 
    cost: '',
    type: 'Perishable',
    measurementUnit: 'g',
    measurementQty: '1000',
    lowStockThreshold: '5' // Default alert threshold
  });

  // 2. Edit Inventory State
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    stock: '', 
    cost: '',
    type: '',
    measurementUnit: '',
    measurementQty: '',
    openStock: '',
    lowStockThreshold: '' // Added for edit
  });

  const [selectedCategory, setSelectedCategory] = useState('Beverages');
  const [showAutoModal, setShowAutoModal] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [currentRecipe, setCurrentRecipe] = useState([]); 
  const [recipeSearch, setRecipeSearch] = useState(''); 

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    const [invData, supData, menuData, recipeData, logData] = await Promise.all([
        getInventory(),
        getSuppliers(),
        getMenu(),
        getRecipes(),
        getUsageLogs()
    ]);
    setInventory(invData);
    setSuppliers(supData);
    setMenu(menuData);
    setRecipes(recipeData);
    setUsageLogs(logData);
  };

  const handleAddSupplier = async () => {
    if (!supplierEmail.includes('@') || !supplierEmail.endsWith('.com')) {
        alert('Needs to be a valid email');
        setSupplierEmail('');
        return;
    }
    const newSupplier = { id: crypto.randomUUID(), name: supplierName, email: supplierEmail };
    const updated = [...suppliers, newSupplier];
    await saveSuppliers(updated);
    setSuppliers(updated);
    setShowSupplierModal(false);
    setSupplierName('');
    setSupplierEmail('');
  };

  const handleAddItemChange = (e) => {
    const { name, value } = e.target;
    setAddItemData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveNewItem = async () => {
    if (!addItemData.name || !addItemData.stock || !addItemData.cost) {
        alert("Please fill in all fields.");
        return;
    }
    
    const newItem = {
        name: addItemData.name,
        inStock: parseInt(addItemData.stock, 10),
        cost: parseFloat(addItemData.cost),
        type: addItemData.type,
        measurementUnit: addItemData.measurementUnit,
        measurementQty: parseInt(addItemData.measurementQty, 10) || 1,
        openStock: 0,
        lowStockThreshold: parseInt(addItemData.lowStockThreshold, 10) || 5
    };

    await addInventoryItem(newItem);
    await refreshData();
    handleClearNewItem(); 
  };

  const handleClearNewItem = () => {
    setAddItemData({
        name: '',
        stock: '',
        cost: '',
        type: 'Perishable',
        measurementUnit: 'g',
        measurementQty: '1000',
        lowStockThreshold: '5'
    });
  };

  const handleSelectForEdit = (item) => {
    setEditingItem(item);
    setEditFormData({
        name: item.name || '',
        stock: (item.inStock ?? '').toString(),
        cost: (item.cost ?? '').toString(),
        type: item.type || 'Perishable',
        measurementUnit: item.measurementUnit || 'g',
        measurementQty: (item.measurementQty ?? '').toString(),
        openStock: (item.openStock ?? '').toString(),
        lowStockThreshold: (item.lowStockThreshold ?? 5).toString()
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEditItem = async () => {
    if (!editingItem) return;

    await updateInventoryItem(editingItem.id, {
        name: editFormData.name,
        inStock: parseInt(editFormData.stock, 10) || 0,
        cost: parseFloat(editFormData.cost) || 0,
        type: editFormData.type,
        measurementUnit: editFormData.measurementUnit,
        measurementQty: parseInt(editFormData.measurementQty, 10) || 1,
        openStock: parseInt(editFormData.openStock, 10) || 0,
        lowStockThreshold: parseInt(editFormData.lowStockThreshold, 10) || 5
    });

    await refreshData();
    setEditingItem(null);
    setEditFormData({ name: '', stock: '', cost: '', type: '', measurementUnit: '', measurementQty: '', openStock: '', lowStockThreshold: '' });
  };

  // Automation Logic 
  const handleOpenAutoModal = (dish) => {
    setSelectedDish(dish);
    setCurrentRecipe(recipes[dish.id] ? [...recipes[dish.id]] : []);
    setShowAutoModal(true);
    setRecipeSearch('');
  };

  const handleAddToRecipe = (inventoryItem) => {
    if (currentRecipe.find(r => r.inventoryId === inventoryItem.id)) {
        return; 
    }
    const defaultQty = inventoryItem.measurementUnit === 'pcs' ? 1 : 10;
    
    const newItem = {
        inventoryId: inventoryItem.id,
        name: inventoryItem.name,
        quantity: defaultQty
    };
    setCurrentRecipe([...currentRecipe, newItem]);
  };

  const handleSetRecipeQuantity = (inventoryId, value) => {
    const newQty = parseFloat(value);
    if (isNaN(newQty)) return;

    setCurrentRecipe(prev => prev.map(item => {
        if (item.inventoryId === inventoryId) {
            return { ...item, quantity: newQty };
        }
        return item;
    }));
  };
  
  const handleRemoveFromRecipe = (inventoryId) => {
    setCurrentRecipe(prev => prev.filter(item => item.inventoryId !== inventoryId));
  };

  const handleSaveRecipe = async () => {
    if (selectedDish) {
        await saveRecipe(selectedDish.id, currentRecipe);
        await refreshData(); 
        setShowAutoModal(false);
        setSelectedDish(null);
        setCurrentRecipe([]);
    }
  };

  const filteredInventory = inventory
    .filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
        if (sortOrder === 'most') return b.inStock - a.inStock;
        if (sortOrder === 'least') return a.inStock - b.inStock;
        return 0;
    });

  const filteredKitchenInventory = inventory
    .filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
        if (sortOrder === 'most') return b.openStock - a.openStock;
        if (sortOrder === 'least') return a.openStock - b.openStock;
        return 0;
    });

  const filteredUsageLogs = usageLogs
    .filter(l => l.itemName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
        if (sortOrder === 'most') return b.quantityUsed - a.quantityUsed;
        if (sortOrder === 'least') return a.quantityUsed - b.quantityUsed;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const categories = ['Beverages', 'Main Dishes', 'Side Dish', 'Desserts'];
  const filteredMenuByCat = menu.filter(m => m.category === selectedCategory || (m.category === 'Main Dishes' && selectedCategory === 'Main Dish'));

  const modalInventoryList = inventory.filter(i => 
    i.name.toLowerCase().includes(recipeSearch.toLowerCase()) && 
        i.type !== 'Not Food'
  );

  const editInventoryList = inventory.filter(i => i.name.toLowerCase().includes(recipeSearch.toLowerCase()));

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Inventory</h1>

      {/* Main Tabs */}
      <div className="flex justify-center mb-6">
        <div className="bg-[#fef9c3] border-2 border-black rounded-full overflow-hidden flex">
            {['Inventory', 'Suppliers', 'Management'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setSortOrder(null); setSearch(''); }}
                    className={`px-6 py-2 border-r border-black last:border-r-0 font-medium ${activeTab === tab ? 'bg-yellow-300' : ''}`}
                >
                    {tab}
                </button>
            ))}
        </div>
      </div>

      {activeTab === 'Inventory' && (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => { setInventorySubTab('General'); setSortOrder(null); setSearch(''); }}
                  className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${inventorySubTab === 'General' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                >
                  General
                </button>
                <button
                  onClick={() => { setInventorySubTab('Used'); setSortOrder(null); setSearch(''); }}
                  className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${inventorySubTab === 'Used' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                >
                  Used
                </button>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                  <input 
                      type="text" 
                      placeholder={inventorySubTab === 'General' ? "Search packs..." : "Search kitchen..."} 
                      className="border-2 border-gray-400 rounded-lg px-4 py-2 w-full md:w-64"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                  />
                  <select
                    className="border-2 border-gray-400 rounded-lg px-4 py-2 bg-white font-medium cursor-pointer hover:bg-gray-50"
                    value={sortOrder || ''}
                    onChange={(e) => setSortOrder(e.target.value || null)}
                  >
                    <option value="">Sort By...</option>
                    <option value="most">Most {inventorySubTab === 'General' ? 'Stock' : 'Quantity'}</option>
                    <option value="least">Least {inventorySubTab === 'General' ? 'Stock' : 'Quantity'}</option>
                  </select>
              </div>
            </div>

            {inventorySubTab === 'General' && (
              <div className="border-2 border-gray-400 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                      <thead className="bg-gray-200 border-b-2 border-gray-400">
                          <tr>
                              <th className="p-3">Item Name</th>
                              <th className="p-3 text-center">Packs</th>
                              <th className="p-3 text-center">Alert At</th>
                              <th className="p-3 text-center">Amount per Pack</th>
                              <th className="p-3 text-center">Unit Cost</th>
                              <th className="p-3">Type</th>
                          </tr>
                      </thead>
                      <tbody>
                          {filteredInventory.map(item => (
                              <tr key={item.id} className="border-b border-gray-200">
                                  <td className="p-3 font-medium">{item.name}</td>
                                  <td className={`p-3 font-bold text-center ${item.inStock <= item.lowStockThreshold ? 'text-red-600' : ''}`}>
                                      {item.inStock}
                                  </td>
                                  <td className="p-3 text-center text-gray-500 text-sm">{item.lowStockThreshold}</td>
                                  <td className="p-3 text-gray-600 text-center">
                                    {item.measurementQty} {item.measurementUnit}
                                  </td>
                                  <td className="p-3 text-center">{item.cost}</td>
                                  <td className="p-3">{item.type}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
            )}

            {inventorySubTab === 'Used' && (
              <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2 ml-1 flex items-center gap-2">
                        <span className="w-3 h-8 bg-blue-600 rounded-full inline-block"></span>
                        Kitchen Stock (Open)
                    </h3>
                    <div className="border-2 border-blue-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-left">
                          <thead className="bg-blue-50 border-b border-blue-200 text-blue-900">
                              <tr>
                                  <th className="p-3">Item Name</th>
                                  <th className="p-3 text-center">Open Amount</th>
                                  <th className="p-3 text-center">Status</th>
                              </tr>
                          </thead>
                          <tbody>
                              {filteredKitchenInventory.map(item => (
                                  <tr key={item.id} className="border-b border-gray-100 bg-white">
                                      <td className="p-3 font-medium">{item.name}</td>
                                      <td className="p-3 font-bold text-blue-700 text-center">
                                        {item.openStock} {item.measurementUnit}
                                      </td>
                                      <td className="p-3 text-center">
                                          {item.openStock <= 0 ? (
                                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold">Empty</span>
                                          ) : (
                                              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-bold">In Use</span>
                                          )}
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2 ml-1 flex items-center gap-2">
                        <span className="w-3 h-8 bg-gray-400 rounded-full inline-block"></span>
                        Recent Usage History
                    </h3>
                    <div className="border-2 border-gray-400 rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-200 border-b-2 border-gray-400">
                                <tr>
                                    <th className="p-3">Item Name</th>
                                    <th className="p-3 text-center">Quantity Deducted</th>
                                    <th className="p-3">Unit</th>
                                    <th className="p-3">Date/Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsageLogs.length === 0 ? (
                                  <tr><td colSpan={4} className="p-4 text-center text-gray-500">No usage logs found.</td></tr>
                                ) : (
                                  filteredUsageLogs.map(log => (
                                      <tr key={log.id} className="border-b border-gray-200">
                                          <td className="p-3 font-medium">{log.itemName}</td>
                                          <td className="p-3 font-bold text-red-600 text-center">-{log.quantityUsed}</td>
                                          <td className="p-3">{log.unit}</td>
                                          <td className="p-3 text-sm text-gray-600">{new Date(log.timestamp).toLocaleString()}</td>
                                      </tr>
                                  ))
                                )}
                            </tbody>
                        </table>
                    </div>
                  </div>
              </div>
            )}
        </div>
      )}

      {activeTab === 'Suppliers' && (
        <div className="relative">
            <div className="flex flex-wrap gap-4">
                {suppliers.map(sup => (
                    <div key={sup.id} className="w-64 h-48 border-2 border-gray-400 rounded-2xl p-4 flex flex-col justify-between">
                        <div className="text-center font-bold">{sup.name}</div>
                        <div className="text-sm">Email: {sup.email}</div>
                    </div>
                ))}
                
                <button 
                    onClick={() => setShowSupplierModal(true)}
                    className="w-16 h-16 rounded-full bg-black text-white text-3xl flex items-center justify-center self-center"
                >
                    +
                </button>
            </div>
        </div>
      )}

      {activeTab === 'Management' && (
        <div className="flex flex-col w-full pb-10">

            <div className="w-full max-w-4xl mx-auto mb-10">
                <h2 className="text-2xl font-bold mb-4 text-center">Add Inventory Item</h2>
                <div className='border-2 border-black rounded-xl p-6 bg-white'> 
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold mb-1">Item Name</label>
                            <input 
                                name="name"
                                value={addItemData.name}
                                onChange={handleAddItemChange} 
                                className="w-full border-2 border-gray-400 rounded p-2"
                                placeholder="e.g. Sugar, Flour, Milk"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Cost (Per Pack)</label>
                            <input 
                                name="cost"
                                type="number"
                                value={addItemData.cost}
                                onChange={handleAddItemChange} 
                                className="w-full border-2 border-gray-400 rounded p-2"
                                placeholder="e.g. 500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">Stock (Packs)</label>
                            <input 
                                name="stock"
                                type="number"
                                value={addItemData.stock}
                                onChange={handleAddItemChange}
                                className="w-full border-2 border-gray-400 rounded p-2"
                                placeholder="e.g. 10"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold mb-1">Unit Type</label>
                            <select 
                                name="measurementUnit"
                                value={addItemData.measurementUnit}
                                onChange={handleAddItemChange}
                                className="w-full border-2 border-gray-400 rounded p-2 bg-white"
                            >
                                <option value="g">Grams (g)</option>
                                <option value="ml">Milliliters (ml)</option>
                                <option value="pcs">Pieces (pcs)</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-bold mb-1">Amount per Pack</label>
                            <input 
                                name="measurementQty"
                                type="number"
                                value={addItemData.measurementQty}
                                onChange={handleAddItemChange}
                                className="w-full border-2 border-gray-400 rounded p-2"
                                placeholder="e.g. 1000"
                            />
                        </div>

                        {/* New Alert Threshold Field */}
                        <div>
                             <label className="block text-sm font-bold mb-1 text-red-600">Alert Threshold (Packs)</label>
                             <input 
                                 name="lowStockThreshold"
                                 type="number"
                                 value={addItemData.lowStockThreshold}
                                 onChange={handleAddItemChange}
                                 className="w-full border-2 border-red-200 rounded p-2"
                                 placeholder="e.g. 5"
                             />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-1">Category Type</label>
                            <select 
                                name="type"
                                value={addItemData.type}
                                onChange={handleAddItemChange}
                                className="w-full border-2 border-gray-400 rounded p-2 bg-white"
                            >
                                <option value="Perishable">Perishables</option>
                                <option value="Non-Perishable">Non-Perishables</option>
                                <option value="Supplies">Supplies</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-4 justify-center mt-6">
                        <button onClick={handleSaveNewItem} className="bg-green-800 text-white px-8 py-2 rounded font-bold hover:bg-green-900 uppercase">Save</button>
                        <button onClick={handleClearNewItem} className="bg-red-700 text-white px-8 py-2 rounded font-bold hover:bg-red-800 uppercase">Clear</button>
                    </div>
                 </div>   
            </div>

            <div className="w-full max-w-4xl mx-auto border-t-2 border-gray-300 my-8"></div>

            <div className="w-full max-w-4xl mx-auto mb-10">
                 <h2 className="text-2xl font-bold mb-4 text-center">Edit Inventory Item</h2>
                 <div className="border-2 border-black rounded-xl p-6 bg-white shadow-sm flex flex-col md:flex-row gap-6 h-[450px]">
                    <div className="w-full md:w-1/2 flex flex-col justify-center border-r border-gray-300 pr-4">
                        {editingItem ? (
                            <div className="flex flex-col h-full overflow-y-auto px-1">
                                            <div className="mb-2">
                                                <label className="block text-sm font-bold text-gray-500">Item Name</label>
                                                <div className="text-xl font-bold">{editingItem.name}</div>
                                            </div>

                                 <div className="mb-2 grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Warehouse Stock (Packs)</label>
                                        <input 
                                            name="stock"
                                            type="number"
                                            value={editFormData.stock}
                                            onChange={handleEditFormChange}
                                            className="w-full border-2 border-gray-200 rounded p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Cost</label>
                                        <input 
                                            name="cost"
                                            type="number"
                                            value={editFormData.cost}
                                            onChange={handleEditFormChange}
                                            className="w-full border-2 border-gray-200 rounded p-2"
                                        />
                                    </div>
                                 </div>

                                 <div className="mb-4">
                                    <label className="block text-sm font-bold mb-1 text-blue-700">Used Amount ({editFormData.measurementUnit})</label>
                                    <div className="flex gap-2 items-center">
                                      <input 
                                          name="openStock"
                                          type="number"
                                          value={editFormData.openStock}
                                          onChange={handleEditFormChange}
                                          className="w-full border-2 border-blue-200 rounded p-2 bg-blue-50"
                                      />
                                      <span className="text-gray-500 font-bold">{editFormData.measurementUnit}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Adjust if spilled/wasted. 1 Pack = {editFormData.measurementQty}{editFormData.measurementUnit}</p>
                                 </div>
                                 
                                 {/* Edit Alert Threshold */}
                                 <div className="mb-4">
                                     <label className="block text-sm font-bold mb-1 text-red-600">Alert Threshold (Packs)</label>
                                     <input 
                                         name="lowStockThreshold"
                                         type="number"
                                         value={editFormData.lowStockThreshold}
                                         onChange={handleEditFormChange}
                                         className="w-full border-2 border-red-200 rounded p-2"
                                     />
                                 </div>

                                 <div className="mb-2">
                                     <label className="block text-sm font-bold mb-1">Pack Size ({editFormData.measurementUnit})</label>
                                     <div className="grid grid-cols-2 gap-2">
                                       <input 
                                           name="measurementQty"
                                           type="number"
                                           value={editFormData.measurementQty}
                                           onChange={handleEditFormChange}
                                           className="w-full border-2 border-gray-200 rounded p-2"
                                       />
                                       <select
                                           name="measurementUnit"
                                           value={editFormData.measurementUnit}
                                           onChange={handleEditFormChange}
                                           className="w-full border-2 border-gray-200 rounded p-2 bg-white"
                                       >
                                           <option value="g">g</option>
                                           <option value="ml">ml</option>
                                           <option value="pcs">pcs</option>
                                       </select>
                                     </div>
                                 </div>

                                 <div className="flex justify-center mt-2">
                                    <button onClick={handleSaveEditItem} className="bg-green-800 text-white py-2 px-12 rounded font-bold hover:bg-green-900 uppercase">Save</button>
                                 </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-center">
                                Select an item from the list to edit its details and stock levels.
                            </div>
                        )}
                    </div>

                    <div className="w-full md:w-1/2 pl-2 flex flex-col">
                        <div className="mb-2">
                            <input
                             type="text"
                                placeholder="Search inventory..."
                                className="w-full border-2 border-gray-400 rounded-full px-4 py-2"
                                value={recipeSearch}
                                onChange={e => setRecipeSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto border-2 border-gray-400 rounded-xl relative">
                            {editInventoryList.length === 0 ? (
                              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                No items found
                              </div>
                            ) : (
                              <table className="w-full text-left">
                                <thead className="bg-gray-200 sticky top-0">
                                    <tr>
                                        <th className="p-2 text-sm border-b border-gray-400">Item Name</th>
                                        <th className="p-2 text-sm text-center border-b border-gray-400">Warehouse</th>
                                        <th className="p-2 text-sm text-center border-b border-gray-400">Kitchen</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {editInventoryList.map(item => (
                                        <tr 
                                            key={item.id} 
                                            onClick={() => handleSelectForEdit(item)}
                                            className={`cursor-pointer hover:bg-yellow-50 border-b border-gray-300 ${editingItem?.id === item.id ? 'bg-yellow-100' : ''}`}
                                        >
                                            <td className="p-2 font-medium text-sm">{item.name}</td>
                                            <td className={`p-2 text-center text-sm ${item.inStock <= item.lowStockThreshold ? 'text-red-600 font-bold' : ''}`}>{item.inStock}</td>
                                            <td className="p-2 text-center text-sm text-blue-600">{item.openStock} {item.measurementUnit}</td>
                                        </tr>
                                    ))}
                                </tbody>
                              </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-4xl mx-auto border-t-2 border-gray-300 my-8"></div>
            
            <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Automate Inventory</h2>
            
            <div className="w-full max-w-4xl flex justify-end mb-4">
                 <select 
                    className="border-2 border-black rounded-full px-4 py-1 bg-white"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                 >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
            </div>

            <div className="w-full max-w-4xl border-2 border-black rounded-xl overflow-hidden">
                 {filteredMenuByCat.length > 0 ? filteredMenuByCat.map(dish => {
                    const hasRecipe = recipes[dish.id] && recipes[dish.id].length > 0;
                    const ingredientCount = hasRecipe ? recipes[dish.id].length : 0;
                    return (
                        <div key={dish.id} className="flex justify-between items-center p-4 border-b border-gray-300 last:border-b-0 bg-white">
                            <span className="font-bold text-lg w-1/3">{dish.name}</span>
                            <span className="text-gray-500 w-1/3 text-center">
                                {hasRecipe ? `${ingredientCount} Ingredients` : 'No Ingredients'}
                            </span>
                            <div className="w-1/3 flex justify-end">
                                <button 
                                    onClick={() => handleOpenAutoModal(dish)}
                                    className="border-2 border-black p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    );
                 }) : (
                     <div className="p-8 text-center text-gray-500">No dishes found in this category.</div>
                 )}
            </div>
        </div>
    </div>
      )}

      {showSupplierModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-200 p-8 rounded-2xl w-96 border border-gray-400 shadow-xl relative">
                <h3 className="text-lg mb-2">Name of Company</h3>
                <input 
                    className="w-full p-2 mb-4 border border-gray-400 rounded" 
                    value={supplierName}
                    onChange={e => setSupplierName(e.target.value)}
                    placeholder="Santos Co."
                />
                <h3 className="text-lg mb-2">Email Info:</h3>
                <input 
                    className="w-full p-2 mb-8 border border-gray-400 rounded"
                    value={supplierEmail}
                    onChange={e => setSupplierEmail(e.target.value)}
                    placeholder="santos@gmail.com"
                />
                <div className="flex justify-center">
                    <button 
                        onClick={handleAddSupplier}
                        className="px-8 py-2 bg-white border border-black rounded uppercase font-bold"
                    >
                        Confirm
                    </button>
                </div>
                <button onClick={() => setShowSupplierModal(false)} className="absolute top-2 right-4 text-xl font-bold">x</button>
            </div>
        </div>
      )}

      {showAutoModal && selectedDish && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl border-2 border-gray-500 w-[900px] h-[600px] flex flex-col overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-300 bg-gray-50">
                    <h3 className="text-xl font-bold">Edit Recipe: {selectedDish.name}</h3>
                    <button onClick={() => setShowAutoModal(false)} className="text-xl font-bold text-gray-600 hover:text-red-500">X</button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    <div className="w-1/2 p-6 border-r border-gray-300 flex flex-col bg-white">
                        <div className="flex-1 overflow-y-auto space-y-2">
                            {currentRecipe.length === 0 ? (
                                <div className="text-center text-gray-400 mt-10">No ingredients added yet.</div>
                            ) : (
                                currentRecipe.map(ing => {
                                  const originalItem = inventory.find(i => i.id === ing.inventoryId);
                                  const unit = originalItem ? originalItem.measurementUnit : '';

                                  return (
                                    <div key={ing.inventoryId} className="flex justify-between items-center border border-gray-300 p-2 rounded shadow-sm">
                                        <div className="flex flex-col">
                                          <span className="font-medium">{ing.name}</span>
                                          <span className="text-xs text-gray-500">Unit: {unit}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="number"
                                                min="0"
                                                className="w-20 border border-gray-300 rounded p-1 text-right"
                                                value={ing.quantity}
                                                onChange={(e) => handleSetRecipeQuantity(ing.inventoryId, e.target.value)}
                                            />
                                            <span className="font-bold text-sm min-w-[1.5rem]">{unit}</span>
                                            
                                            <button onClick={() => handleRemoveFromRecipe(ing.inventoryId)} className="w-8 h-8 ml-2 bg-red-100 text-red-600 rounded hover:bg-red-200 font-bold text-sm flex items-center justify-center border border-red-300">x</button>
                                        </div>
                                    </div>
                                  );
                                })
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-center gap-4">
                            <button 
                                onClick={handleSaveRecipe}
                                className="bg-green-700 text-white px-8 py-2 rounded-lg font-bold hover:bg-green-800 transition"
                            >
                                SAVE
                            </button>
                            <button 
                                onClick={() => setShowAutoModal(false)}
                                className="text-red-600 font-bold hover:underline py-2"
                            >
                                Back
                            </button>
                        </div>
                    </div>

                    <div className="w-1/2 p-6 bg-gray-50 flex flex-col">
                        <div className="mb-4">
                            <h4 className="font-bold mb-2">Choose Inventory Item</h4>
                            <input 
                                type="text"
                                placeholder="Search inventory..."
                                className="w-full border-2 border-gray-400 rounded-full px-4 py-2"
                                value={recipeSearch}
                                onChange={e => setRecipeSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto border border-gray-300 rounded-lg bg-white relative">
                            {modalInventoryList.length === 0 ? (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                    No suitable food items found
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-200 sticky top-0">
                                        <tr>
                                            <th className="p-2 text-sm">Item Name</th>
                                            <th className="p-2 text-sm text-center">Kitchen</th>
                                            <th className="p-2 text-sm"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modalInventoryList.map(item => (
                                            <tr key={item.id} className="border-b border-gray-100 hover:bg-yellow-50">
                                                <td className="p-2 text-sm">{item.name}</td>
                                                <td className="p-2 text-center text-sm">{item.openStock} {item.measurementUnit}</td>
                                                <td className="p-2 text-center">
                                                    <button 
                                                        onClick={() => handleAddToRecipe(item)}
                                                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                                    >
                                                        Add
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default InventoryPage;