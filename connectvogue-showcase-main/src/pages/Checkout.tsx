"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { ArrowRight, Truck, Package, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { safeFetch } from "../../src/api/fetchClient";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getCartTotal } = useCart();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = getCartTotal();
  const shipping = deliveryOption === "express" ? 299 : subtotal > 2999 ? 0 : 199;
  const total = subtotal + shipping;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);

  const getImageUrl = (image?: string) =>
    !image ? "/placeholder.png" : image.startsWith("http") ? image : `http://localhost:5000${image}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Invalid phone number";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Invalid pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all fields correctly");
      return;
    }

    try {
      const data = await safeFetch<{ success?: boolean; orderId?: string; msg?: string }>("/api/orders", {
        method: "POST",
        body: {
          customer: formData,
          items: items.map((i) => ({
            productId: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            image: i.product.image,
          })),
          subtotal,
          shipping,
          total,
        },
      });

      if (data.success && data.orderId) {
        navigate(`/payment?orderId=${data.orderId}`);
      } else {
        toast.error(data.msg || "Order failed");
      }
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Order failed. Check console.");
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
            <h1 className="font-display text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">Add some products to proceed to checkout.</p>
            <Link to="/">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Checkout</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Shipping Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["firstName", "lastName", "email", "phone", "address", "city", "state", "pincode"].map((field) => (
                <div key={field} className={field === "address" || field === "pincode" ? "md:col-span-2" : ""}>
                  <Label htmlFor={field}>{field.replace(/^\w/, (c) => c.toUpperCase())} *</Label>
                  <Input
                    id={field}
                    name={field}
                    type={field === "email" ? "email" : "text"}
                    value={formData[field as keyof typeof formData]}
                    onChange={handleChange}
                    maxLength={field === "phone" ? 10 : field === "pincode" ? 6 : undefined}
                    className={errors[field] ? "border-destructive" : ""}
                  />
                  {errors[field] && <p className="text-xs text-destructive mt-1">{errors[field]}</p>}
                </div>
              ))}
            </div>

            {/* Delivery Options */}
            <div className="space-y-3">
              {[
                { value: "standard", label: "Standard Delivery", icon: Truck, desc: "5-7 business days", price: subtotal > 2999 ? "Free" : formatPrice(199) },
                { value: "express", label: "Express Delivery", icon: Package, desc: "2-3 business days", price: formatPrice(299) },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                    deliveryOption === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  )}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={opt.value}
                    checked={deliveryOption === opt.value}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                    className="sr-only"
                  />
                  <opt.icon className="w-6 h-6 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{opt.label}</p>
                    <p className="text-sm text-muted-foreground">{opt.desc}</p>
                  </div>
                  <span className="font-medium">{opt.price}</span>
                </label>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-card rounded-lg p-6 shadow-soft space-y-4">
              <h2 className="font-display text-xl font-semibold mb-4">Order Summary</h2>
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <img src={getImageUrl(item.product.image)} alt={item.product.name} className="w-16 h-20 object-cover rounded" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium mt-1">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-sm"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
                <div className="flex justify-between font-semibold pt-2 border-t border-border"><span>Total</span><span>{formatPrice(total)}</span></div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 flex justify-center items-center">
              Proceed to Payment
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
