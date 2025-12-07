import React, { useEffect, useState } from 'react';
import { getTransactions, updateTransactionStatus } from '../../services/mockDatabase';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const allTransactions = await getTransactions();
    setOrders(allTransactions.filter(t => t.status === 'No'));
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = async (id) => {
    try {
      await updateTransactionStatus(id);
      await fetchOrders();
    } catch (error) {
      console.error('Error completing order:', error);
      alert('Error completing order. Please try again.');
    }
  };

  return (
    <div className="h-screen bg-gray-50 p-8 pb-24 overflow-x-auto">
      <h1 className="text-3xl font-bold mb-6">Active Orders</h1>
      
      {orders.length === 0 ? (
        <div className="flex justify-center items-center h-64">
            <h2 className="text-2xl text-gray-400 font-bold">No orders here</h2>
        </div>
      ) : (
        <div className="flex gap-4 min-w-max">
            {orders.map(order => (
                <div key={order.id} className="w-64 bg-white border-2 border-gray-400 rounded-lg p-4 shadow-md shrink-0 relative flex flex-col">
                    <div className="border-b-2 border-gray-200 pb-2 mb-2 text-center">
                        <span className="font-bold text-xl">#{String(order.orderNumber).padStart(2, '0')}</span>
                    </div>
                    
                    <div className="mb-4 text-sm grow">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between mb-1">
                                <span>{item.menuItem.name}</span>
                                <span className="font-bold">x{item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-300 my-2 pt-2 text-xs mb-2">
                        <div className="flex justify-between mb-1">
                            <span>Subtotal (VAT-Inclusive):</span>
                            <span className="font-bold">P. {order.baseAmount?.toFixed(2) || order.totalAmount.toFixed(2)}</span>
                        </div>
                        
                        {order.discountAmount > 0 && (
                            <div className="flex justify-between mb-1 text-green-700 font-semibold">
                                <span>{order.discountType} Discount:</span>
                                <span>-P. {order.discountAmount?.toFixed(2)}</span>
                            </div>
                        )}
                        
                        {order.discountAmount > 0 && order.vatPortion !== undefined && (
                            <div className="flex justify-between mb-1 text-green-700 font-semibold">
                                <span>VAT Exemption:</span>
                                <span>-P. {order.vatPortion.toFixed(2)}</span>
                            </div>
                        )}
                        
                        {order.serviceFee !== undefined && (
                            <div className="flex justify-between mb-1">
                                <span>Service Fee ({order.type === 'Dine In' ? 'Dine In: P. 25' : 'Takeout: P. 50'}):</span>
                                <span className="font-bold">P. {order.serviceFee.toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-dashed border-gray-300 my-2 pt-2 flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>P. {typeof order.totalAmount === 'object' ? order.baseAmount.toFixed(2) : order.totalAmount.toFixed(2)}</span>
                    </div>

                    <div className="border-t border-gray-300 my-2 pt-2 text-xs">
                        {order.cashProvided !== undefined && (
                            <div className="flex justify-between mb-1">
                                <span>Cash Received:</span>
                                <span className="font-bold">P. {order.cashProvided.toFixed(2)}</span>
                            </div>
                        )}
                        {order.change !== undefined && (
                            <div className="flex justify-between text-green-700 font-semibold">
                                <span>Change:</span>
                                <span>P. {order.change.toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    <div className="text-sm font-bold mb-1">
                        Status: <span className="font-normal">{order.type}</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-4">
                        Time: {order.timeOrdered}
                    </div>
                    
                    <button 
                        onClick={() => handleComplete(order.id)}
                        className="w-full py-2 text-white rounded font-bold transition bg-green-500 hover:bg-green-600"
                    >
                        Complete
                    </button>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Orders;