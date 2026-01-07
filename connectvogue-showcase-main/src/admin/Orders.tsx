import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { safeFetch } from "../../src/api/fetchClient"; // ✅ added

interface Order {
  _id: string;
  customer: {
    firstName: string;
    lastName: string;
  };
  total: number;
  status: string;
  createdAt: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    safeFetch<{ orders: Order[] }>("/api/orders")
      .then(data => setOrders(data.orders))
      .catch(err => console.error(err));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await safeFetch(`/api/orders/${id}/status`, {
      method: "PUT",
      body: { status },
    });

    setOrders(prev =>
      prev.map(o => (o._id === id ? { ...o, status } : o))
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="overflow-x-auto bg-card rounded-lg shadow">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="border-b">
                <td className="p-3">{order._id.slice(-6)}</td>
                <td className="p-3">
                  {order.customer.firstName} {order.customer.lastName}
                </td>
                <td className="p-3">₹{order.total}</td>
                <td className="p-3">
                  <Badge>{order.status}</Badge>
                </td>
                <td className="p-3 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => updateStatus(order._id, "processing")}
                  >
                    Process
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(order._id, "delivered")}
                  >
                    Delivered
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
