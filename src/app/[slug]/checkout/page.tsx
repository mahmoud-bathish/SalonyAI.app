"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";

const TENANT_IDENTIFIER = "3fa85f64-5717-4562-b3fc-2c963f66afa6";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useParams();
  const { cartItems, subtotal, shippingCost, total, clearCart } = useCart();

  const [customer, setCustomer] = useState({ name: "", phoneNumber: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");

  async function handleOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOrderError("");
    setOrderSuccess("");

    try {
      const orderPayload = {
        tenantIdentifier: TENANT_IDENTIFIER,
        customer,
        totalAmount: total,
        source: 1, // Website
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
      };

      const response = await fetch("https://api.salonyai.com/api/Order", {
        method: "POST",
        headers: {
          accept: "text/plain",
          "content-type": "application/json",
          "x-tenant-identifier": TENANT_IDENTIFIER,
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok || !data.isSuccessful) {
        throw new Error(data?.message || "Order failed");
      }

      setOrderSuccess("Order placed successfully!");
      clearCart();
      setTimeout(() => {
        router.push(`/${params.slug}`);
      }, 2000);
    } catch (err: any) {
      setOrderError(err.message || "Order failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleOrder} className="space-y-6 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            required
            className="w-full border rounded px-3 py-2"
            value={customer.name}
            onChange={e => setCustomer({ ...customer, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            required
            className="w-full border rounded px-3 py-2"
            value={customer.phoneNumber}
            onChange={e => setCustomer({ ...customer, phoneNumber: e.target.value })}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Address</label>
          <input
            type="text"
            required
            className="w-full border rounded px-3 py-2"
            value={customer.address}
            onChange={e => setCustomer({ ...customer, address: e.target.value })}
          />
        </div>
        <div>
          <h2 className="font-semibold mb-2">Order Summary</h2>
          <ul className="divide-y">
            {cartItems.map(item => (
              <li key={item.productId} className="flex items-center py-2">
                <div className="w-12 h-12 relative mr-3">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">x{item.quantity}</div>
                </div>
                <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${(subtotal ?? 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{(shippingCost ?? 0) === 0 ? 'Free' : `$${(shippingCost ?? 0).toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${(total ?? 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
        {orderError && <div className="text-red-500">{orderError}</div>}
        {orderSuccess && <div className="text-green-600">{orderSuccess}</div>}
        <button
          type="submit"
          className="w-full py-3 rounded bg-primary text-white font-semibold"
          disabled={loading}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}