import React, { useState, useEffect } from 'react';
import { getMenu, saveTransaction, getTransactions, resetMenu, getBusinessInfo } from '../../services/mockDatabase';
import { generateReceiptPDF } from '../../services/receiptServices';
import { useNavigate } from 'react-router-dom';

const POS = () => {
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState('All');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentInput, setPaymentInput] = useState('');
  const [orderType, setOrderType] = useState('Dine In');
  const [discountType, setDiscountType] = useState('None'); // 'None', 'PWD', or 'Senior'
  const navigate = useNavigate();

  useEffect(() => {
    // Reset menu to ensure latest prices are loaded
    resetMenu().then(() => getMenu()).then(setMenu);
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItem.id === item.id);
      if (existing) {
        return prev.map(i => i.menuItem.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId, delta) => {
    setCart(prev => {
      return prev.map(i => {
        if (i.menuItem.id === itemId) {
          const newQ = i.quantity + delta;
          return newQ > 0 ? { ...i, quantity: newQ } : i;
        }
        return i;
      });
    });
  };

  const filteredMenu = menu.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) && 
    (category === 'All' || item.category === category)
  );

  // Calculate totals based on totalPrice (VAT-inclusive price shown to customers)
  const baseAmount = cart.reduce((sum, item) => sum + (item.menuItem.totalPrice * item.quantity), 0);
  
  // Calculate discount on the total (which already includes VAT)
  const hasDiscount = discountType !== 'None';
  const discountAmount = hasDiscount ? baseAmount * 0.2 : 0; // 20% discount
  const discountedAmount = baseAmount - discountAmount;
  
  // If customer has discount (PWD/Senior), they are exempted from VAT
  // So we subtract the VAT portion from the discounted amount
  const vatPortion = hasDiscount ? cart.reduce((sum, item) => sum + (item.menuItem.VAT_fee * item.quantity), 0) : cart.reduce((sum, item) => sum + (item.menuItem.VAT_fee * item.quantity), 0);
  // Note: For regular customers, VAT is inside the total, so we display it but don't deduct it from the total payable.
  // The logic in provided code: `amountAfterDiscount = hasDiscount ? (discountedAmount - vatPortion) : discountedAmount;` implies VAT exemption logic.
  const amountAfterDiscount = hasDiscount ? (discountedAmount - vatPortion) : discountedAmount;
  
  // Service fee is fixed: 25 for Dine In, 50 for Takeout (only if cart has items)
  const serviceFee = cart.length > 0 ? (orderType === 'Dine In' ? 25 : 50) : 0;
  const totalAmount = amountAfterDiscount + serviceFee;
  
  const change = paymentInput ? parseFloat(paymentInput) - totalAmount : 0;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    
    try {
        const transactions = await getTransactions();
        const nextOrderNum = transactions.length + 1;
        const timeNow = new Date().toLocaleTimeString();

        // 1. Construct Transaction Object
        const newTransaction = {
            id: crypto.randomUUID(),
            orderNumber: nextOrderNum,
            items: cart,
            baseAmount: baseAmount,
            discountType: discountType,
            discountAmount: discountAmount,
            vatPortion: vatPortion, // This is the VAT amount component
            serviceFee: serviceFee,
            totalAmount: totalAmount,
            cashProvided: parseFloat(paymentInput),
            change: change,
            type: orderType,
            timeOrdered: timeNow,
            status: 'No'
        };

        // 2. Save Transaction
        await saveTransaction(newTransaction);

        // 3. Generate PDF Receipt
        let pdfError = false;
        try {
            const businessInfo = await getBusinessInfo();
            generateReceiptPDF(newTransaction, businessInfo);
        } catch (error) {
            console.error("Error generating receipt PDF:", error);
            pdfError = true;
        }

        // 4. Reset UI
        setCart([]);
        setShowCheckoutModal(false);
        setPaymentInput('');
        setDiscountType('None');
        
        // setTimeout to ensure the alert doesn't block the download initiation immediately
        setTimeout(() => {
            if (pdfError) {
                alert('Order Placed Successfully!\n\nNote: Receipt PDF generation failed. Please check console for details.');
            } else {
                alert('Order Placed Successfully! Receipt downloading...');
            }
        }, 500);

    } catch (error) {
        console.error("Error placing order", error);
        alert("Failed to place order");
    }
  };

  return (
    <div className="flex h-screen pb-20 bg-white">
        {/* Left Side: Checkout */}
        <div className="w-1/3 border-r-2 border-gray-300 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-red-600 cursor-pointer" onClick={() => navigate('/')}>Log Out</h2>
                <input 
                    type="text" 
                    placeholder="Search.." 
                    className="border-2 border-gray-400 rounded-full px-3 py-1 w-48"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
                {['Beverages', 'Main Dishes', 'Side Dish', 'Desserts'].map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-1 border-2 border-black rounded-lg text-sm font-bold ${category === cat ? 'bg-yellow-200' : 'bg-white'}`}
                    >
                        {cat}
                    </button>
                ))}
                <button 
                    onClick={() => setCategory('All')}
                    className={`px-3 py-1 border-2 border-black rounded-lg text-sm font-bold ${category === 'All' ? 'bg-yellow-200' : 'bg-white'}`}
                >
                    All
                </button>
            </div>

            {/* Order Details List */}
            <div className="flex-1 border-2 border-gray-800 p-2 overflow-y-auto mb-4 rounded-lg">
                <h3 className="text-center font-bold text-lg mb-2">Order Details</h3>
                {cart.map(item => (
                    <div key={item.menuItem.id} className="flex justify-between items-center border border-gray-400 p-2 mb-2 rounded">
                        <div className="flex flex-col">
                            <span className="font-bold">{item.menuItem.name}</span>
                            <span className="text-sm">P. {item.menuItem.totalPrice}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold">x{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.menuItem.id, 1)} className="px-2 bg-green-200 rounded">+</button>
                            <button onClick={() => updateQuantity(item.menuItem.id, -1)} className="px-2 bg-yellow-200 rounded">-</button>
                            <button onClick={() => removeFromCart(item.menuItem.id)} className="px-2 bg-red-200 rounded font-bold">X</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t-2 border-black pt-4">
                <div className="flex justify-between text-xl font-bold mb-4">
                    <span>Total:</span>
                    <span>P. {totalAmount.toFixed(2)}</span>
                </div>
                <button 
                    onClick={() => setShowCheckoutModal(true)}
                    disabled={cart.length === 0}
                    className="w-full py-3 bg-white border-2 border-black rounded-lg font-bold hover:bg-gray-100 disabled:opacity-50"
                >
                    PLACE ORDER
                </button>
            </div>
        </div>

        {/* Right Side: Menu Grid */}
        <div className="w-2/3 p-4 bg-gray-50">
            <div className="grid grid-cols-4 gap-4 overflow-y-auto h-full pb-20">
                {filteredMenu.length > 0 ? filteredMenu.map(item => (
                    <div 
                        key={item.id} 
                        onClick={() => addToCart(item)}
                        className="bg-white border-2 border-gray-400 h-32 flex flex-col items-center justify-center p-2 cursor-pointer hover:bg-green-50 transition shadow-sm rounded-lg"
                    >
                        <span className="font-bold text-center">{item.name}</span>
                        <span className="text-sm text-gray-600">P. {item.totalPrice}</span>
                    </div>
                )) : (
                    <div className="col-span-4 text-center py-10 text-gray-500">there is nothing in the list here</div>
                )}
            </div>
        </div>

        {/* Checkout Modal */}
        {showCheckoutModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] backdrop-blur-sm">
                <div className="bg-gray-200 p-8 rounded-xl w-96 border-2 border-gray-500 shadow-2xl max-h-[90vh] overflow-y-auto">
                    <div className="mb-4">
                        <div className="border-b pb-3 mb-3">
                            <div className="flex justify-between text-sm mb-1">
                                <span>Subtotal (VAT-Inclusive):</span>
                                <span className="font-bold">P. {baseAmount.toFixed(2)}</span>
                            </div>
                            
                            {/* Discount Section */}
                            <div className="mt-3 pt-3 border-t">
                                <p className="text-sm font-bold mb-2">Discount:</p>
                                <div className="flex gap-2 mb-2">
                                    <button 
                                        onClick={() => setDiscountType('None')}
                                        className={`flex-1 py-1 text-xs rounded border border-black font-semibold ${discountType === 'None' ? 'bg-white' : 'bg-gray-300'}`}
                                    >
                                        NONE
                                    </button>
                                    <button 
                                        onClick={() => setDiscountType('PWD')}
                                        className={`flex-1 py-1 text-xs rounded border border-black font-semibold ${discountType === 'PWD' ? 'bg-white' : 'bg-gray-300'}`}
                                    >
                                        PWD (20%)
                                    </button>
                                    <button 
                                        onClick={() => setDiscountType('Senior')}
                                        className={`flex-1 py-1 text-xs rounded border border-black font-semibold ${discountType === 'Senior' ? 'bg-white' : 'bg-gray-300'}`}
                                    >
                                        SENIOR (20%)
                                    </button>
                                </div>
                                {hasDiscount && (
                                    <div className="flex justify-between text-sm text-green-700 font-bold">
                                        <span>Discount ({discountType}):</span>
                                        <span>-P. {discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                {hasDiscount && (
                                    <div className="flex justify-between text-sm text-green-700 font-bold mt-1">
                                        <span>VAT Exemption:</span>
                                        <span>-P. {vatPortion.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Amount after discount and VAT exemption */}
                        <div className="flex justify-between text-sm font-bold mb-2 pb-2 border-b">
                            <span>Amount:</span>
                            <span>P. {amountAfterDiscount.toFixed(2)}</span>
                        </div>

                        {/* Service Fee */}
                        <div className="flex justify-between text-sm mb-3">
                            <span>Service Fee ({orderType === 'Dine In' ? 'Dine In: P. 25' : 'Takeout: P. 50'}):</span>
                            <span className="font-bold">P. {serviceFee.toFixed(2)}</span>
                        </div>

                        {/* Total Price */}
                        <div className="flex justify-between text-lg font-bold mb-2 bg-yellow-100 p-2 rounded">
                            <span>Total Price:</span>
                            <span>P. {totalAmount.toFixed(2)}</span>
                        </div>

                        {/* Payment Input */}
                        <input 
                            type="number"
                            placeholder="Input Amount"
                            className="w-full p-2 border border-gray-400 rounded mb-2"
                            value={paymentInput}
                            onChange={e => setPaymentInput(e.target.value)}
                        />

                        {/* Change */}
                        <div className="flex justify-between text-lg font-bold mb-4 bg-blue-100 p-2 rounded">
                            <span>Change:</span>
                            <span>P. {change >= 0 ? change.toFixed(2) : '---'}</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-2 mb-6">
                        <button 
                            onClick={() => setOrderType('Dine In')}
                            className={`flex-1 py-2 rounded-lg border border-black font-bold ${orderType === 'Dine In' ? 'bg-white' : 'bg-gray-300'}`}
                        >
                            DINE IN
                        </button>
                        <button 
                            onClick={() => setOrderType('Takeout')}
                            className={`flex-1 py-2 rounded-lg border border-black font-bold ${orderType === 'Takeout' ? 'bg-white' : 'bg-gray-300'}`}
                        >
                            TAKEOUT
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button 
                            onClick={handlePlaceOrder}
                            disabled={change < 0 || !paymentInput}
                            className="w-full py-2 bg-white border border-black rounded-lg font-bold hover:bg-green-100 disabled:opacity-50"
                        >
                            CONFIRM
                        </button>
                        <button 
                            onClick={() => setShowCheckoutModal(false)}
                            className="w-full py-1 text-sm underline text-red-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default POS;