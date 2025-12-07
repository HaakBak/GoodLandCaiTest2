import React, { useEffect, useState } from 'react';
import { getTransactions, getNotifications } from '../../services/mockDatabase';
import { calculateCategoryRanking, calculateESA } from '../../utils/mlEngine';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend 
} from 'recharts';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  
  // Metrics
  const [todaysOrders, setTodaysOrders] = useState(0);
  
  // Ranking Chart State
  const [rankingData, setRankingData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Beverages');

  // Forecasting Chart State
  const [forecastData, setForecastData] = useState([]);
//Notifications
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadData = async () => {
        const data = await getTransactions();
        setTransactions(data);

        // Calculate "Today's Orders" - Counting "Yes" status as completed for demo
        const completedCount = data.filter(t => t.status === 'Yes').length;
        setTodaysOrders(completedCount);

        // Load Notifications
        const notifs = await getNotifications();
        setNotifications(notifs.slice(0, 5)); // Show top 5 recent
    };
    loadData();

    // Listen for new toasts to update list immediately
    const handleUpdate = () => {
        getNotifications().then(n => setNotifications(n.slice(0, 5)));
    };
    window.addEventListener('SHOW_TOAST', handleUpdate);
    return () => window.removeEventListener('SHOW_TOAST', handleUpdate);

  }, []);

  

  // Update Ranking Chart when category or transactions change
  useEffect(() => {
    if (transactions.length > 0) {
        const ranked = calculateCategoryRanking(transactions, selectedCategory);
        // Take top 5 for better visualization
        setRankingData(ranked.slice(0, 5));
    }
  }, [transactions, selectedCategory]);

  // Update Forecast Chart when transactions change
  useEffect(() => {
    if (transactions.length > 0) {
        // Use ESA algorithm
        const esaData = calculateESA(transactions, 0.5); 
        setForecastData(esaData);
    }
  }, [transactions]);

  const categories = ['Beverages', 'Main Dish', 'Side Dish', 'Desserts'];

  return (
    <div className="p-8 bg-white min-h-screen">
        <h1 className="text-4xl font-bold mb-8">Welcome Back</h1>

        <div className="flex gap-8">
            {/* Left Column: Charts */}
            <div className="flex-1 flex flex-col gap-8">
                
                {/* Chart 1: Top Menu Dish (Ranking) */}
                <div className="border-2 border-gray-400 p-6 rounded-xl shadow-sm bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Top Menu Dish</h3>
                        <select 
                            className="border-2 border-gray-300 rounded-lg p-1 text-sm font-bold"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={rankingData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 12}} />
                                <Tooltip cursor={{fill: 'transparent'}} />
                                <Bar dataKey="count" fill="#4ade80" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: Sales Forecasting (ESA) */}
                <div className="border-2 border-gray-400 p-6 rounded-xl shadow-sm bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Sales Forecasting</h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Exponential Smoothing</span>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={forecastData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual Sales" strokeWidth={2} dot={{r:4}} />
                                <Line type="monotone" dataKey="forecast" stroke="#82ca9d" name="Forecast (ESA)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Right Column: Metrics & Notifications */}
            <div className="w-80 flex flex-col gap-6">
                
                {/* Metric 1 */}
                <div className="border-2 border-black rounded-3xl p-6 flex flex-col items-center justify-center bg-white shadow-md h-40">
                    <span className="text-center font-bold text-gray-700">Orders Completed Today</span>
                    <span className="text-5xl font-bold mt-2">{todaysOrders}</span>
                </div>

                {/* Metric 2 */}
                <div className="border-2 border-black rounded-3xl p-6 flex flex-col items-center justify-center bg-white shadow-md h-40">
                    <span className="text-center font-bold text-gray-700">Employees On-Site</span>
                    <span className="text-5xl font-bold mt-2">3</span> 
                </div>

                 {/* Notifications / Recent Activity */}
                 <div className="border-2 border-black rounded-3xl p-6 flex-1 bg-white shadow-md min-h-[300px] relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 w-8 h-full bg-gray-100 rounded-l-3xl"></div>
                    
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <h3 className="font-bold text-xl">Recent Activity</h3>
                    </div>

                    <div className="space-y-4 relative z-10 flex-1 overflow-y-auto pr-2">
                        {notifications.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 italic">
                                <span>There's nothing here...</span>
                            </div>
                        ) : (
                            notifications.map(note => (
                                <div key={note.id} className={`text-sm p-3 rounded border ${
                                    note.type === 'warning' 
                                        ? 'bg-yellow-50 border-yellow-200 text-yellow-800' 
                                        : 'bg-blue-50 border-blue-200 text-blue-800'
                                }`}>
                                    <div className="font-bold mb-1">{note.type === 'warning' ? 'Warning' : 'Info'}</div>
                                    <div>{note.message}</div>
                                    <div className="text-xs text-right mt-2 opacity-60">{new Date(note.timestamp).toLocaleTimeString()}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};

export default Dashboard;