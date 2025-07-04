import React from 'react'
import './Order.css'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Order = () => {
  const [orders, setOrders] = useState([]);
  const url = "http://localhost:8282";

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error("❌ Error in fetchOrders:", error);
      toast.error("Something went wrong");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(`${url}/api/order/updateStatus/${orderId}`, {
        status: newStatus,
      });

      if (response.data.success) {
        toast.success("Order status updated");
        fetchAllOrders(); // Refresh the list
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("❌ Error updating status:", error.message);
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order-list">
      <h2>Order List</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Order Date</th>
            <th>Total Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.userId?.name || "Unknown"}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>₹{order.totalAmount}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Order;
