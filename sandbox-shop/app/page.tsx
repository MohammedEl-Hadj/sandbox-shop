// app/page.tsx
"use client";

import React, { useMemo, useState } from "react";

type Category =
| "All"
| "Electronics"
| "Home"
| "Fitness"
| "Accessories"
| "Audio";

type SortOption =
| "featured"
| "price-asc"
| "price-desc"
| "rating-desc"
| "newest";

type CheckoutStep = "delivery" | "payment" | "review" | "complete";

type Product = {
id: string;
name: string;
category: Category;
brand: string;
price: number;
compareAtPrice?: number;
rating: number;
reviews: number;
inStock: boolean;
badge?: string;
image: string;
description: string;
colors: string[];
sizes?: string[];
isNew?: boolean;
featured?: boolean;
};

type CartItem = {
productId: string;
quantity: number;
};

const categories: Category[] = [
"All",
"Electronics",
"Home",
"Fitness",
"Accessories",
"Audio",
];

const products: Product[] = [
{
id: "p1",
name: "Nova X Wireless Headphones",
category: "Audio",
brand: "Nova",
price: 129.99,
compareAtPrice: 169.99,
rating: 4.6,
reviews: 284,
inStock: true,
badge: "Best Seller",
image:
"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
description:
"Premium wireless headphones with active noise cancellation and 30-hour battery life.",
colors: ["Black", "Silver", "Midnight Blue"],
featured: true,
},
{
id: "p2",
name: "Aero Smart Watch",
category: "Electronics",
brand: "Aero",
price: 219.99,
compareAtPrice: 249.99,
rating: 4.4,
reviews: 193,
inStock: true,
badge: "Limited Deal",
image:
"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
description:
"Track workouts, sleep, notifications, and heart rate with a sleek all-day wearable.",
colors: ["Graphite", "Rose Gold"],
featured: true,
},
{
id: "p3",
name: "Luma Desk Lamp",
category: "Home",
brand: "Luma",
price: 64.99,
rating: 4.7,
reviews: 88,
inStock: true,
badge: "New",
image:
"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
description:
"Minimal LED desk lamp with adjustable temperature and dimming presets.",
colors: ["White", "Matte Black"],
isNew: true,
},
{
id: "p4",
name: "Core Adjustable Dumbbells",
category: "Fitness",
brand: "Core",
price: 299.99,
compareAtPrice: 349.99,
rating: 4.8,
reviews: 141,
inStock: false,
badge: "Back Soon",
image:
"https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
description:
"Compact adjustable dumbbells designed for home gyms and progressive training.",
colors: ["Black"],
featured: true,
},
{
id: "p5",
name: "Orbit Laptop Sleeve",
category: "Accessories",
brand: "Orbit",
price: 34.99,
rating: 4.3,
reviews: 59,
inStock: true,
image:
"https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80",
description:
"Water-resistant padded laptop sleeve with premium zip and inner pocket.",
colors: ["Sand", "Charcoal", "Olive"],
},
{
id: "p6",
name: "Pulse Portable Speaker",
category: "Audio",
brand: "Pulse",
price: 89.99,
compareAtPrice: 109.99,
rating: 4.5,
reviews: 176,
inStock: true,
badge: "Top Rated",
image:
"https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=1200&q=80",
description:
"Compact Bluetooth speaker with deep bass, IPX7 water resistance, and 18-hour playtime.",
colors: ["Black", "Orange"],
},
{
id: "p7",
name: "Aria Ceramic Mug Set",
category: "Home",
brand: "Aria",
price: 27.99,
rating: 4.2,
reviews: 43,
inStock: true,
image:
"https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=1200&q=80",
description:
"Set of 4 stoneware mugs with matte glaze finish for everyday coffee rituals.",
colors: ["Ivory", "Slate"],
},
{
id: "p8",
name: "Vector Charging Stand",
category: "Electronics",
brand: "Vector",
price: 49.99,
rating: 4.1,
reviews: 72,
inStock: true,
badge: "Bundle Eligible",
image:
"https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80",
description:
"Fast wireless charging stand with vertical and horizontal device support.",
colors: ["Black", "White"],
},
];

function formatCurrency(value: number): string {
return new Intl.NumberFormat("en-GB", {
style: "currency",
currency: "GBP",
}).format(value);
}

export default function Page(): React.JSX.Element {
const [isSideMenuCollapsed, setIsSideMenuCollapsed] = useState(false);
const [selectedCategory, setSelectedCategory] = useState<Category>("All");
const [searchQuery, setSearchQuery] = useState("");
const [sortOption, setSortOption] = useState<SortOption>("featured");
const [showInStockOnly, setShowInStockOnly] = useState(false);
const [maxPrice, setMaxPrice] = useState(350);
const [cart, setCart] = useState<CartItem[]>([]);
const [wishlist, setWishlist] = useState<string[]>([]);
const [compare, setCompare] = useState<string[]>([]);
const [viewedProductId, setViewedProductId] = useState<string | null>(null);
const [activeProductId, setActiveProductId] = useState<string | null>(null);
const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("delivery");
const [couponCode, setCouponCode] = useState("");
const [appliedCoupon, setAppliedCoupon] = useState("");
const [shippingMethod, setShippingMethod] = useState("standard");
const [paymentMethod, setPaymentMethod] = useState("card");
const [newsletterEmail, setNewsletterEmail] = useState("");
const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
const [topBannerDismissed, setTopBannerDismissed] = useState(false);
const [deliveryInfo, setDeliveryInfo] = useState({
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  address: "",
});
const [paymentInfo, setPaymentInfo] = useState({
  cardholderName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
});
const [orderNumber, setOrderNumber] = useState("");
const [subscriptionMessage, setSubscriptionMessage] = useState("");

const filteredProducts = useMemo(() => {
const normalizedQuery = searchQuery.trim().toLowerCase();

const result = products
.filter((product) => {
const matchesCategory =
selectedCategory === "All" || product.category === selectedCategory;
const matchesSearch =
normalizedQuery.length === 0 ||
product.name.toLowerCase().includes(normalizedQuery) ||
product.brand.toLowerCase().includes(normalizedQuery) ||
product.description.toLowerCase().includes(normalizedQuery);
const matchesStock = !showInStockOnly || product.inStock;
const matchesPrice = product.price <= maxPrice;

return (
matchesCategory && matchesSearch && matchesStock && matchesPrice
);
})
.sort((a, b) => {
switch (sortOption) {
case "price-asc":
return a.price - b.price;
case "price-desc":
return b.price - a.price;
case "rating-desc":
return b.rating - a.rating;
case "newest":
return Number(Boolean(b.isNew)) - Number(Boolean(a.isNew));
case "featured":
default:
return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
}
});

return result;
}, [maxPrice, searchQuery, selectedCategory, showInStockOnly, sortOption]);

const activeProduct = useMemo(
() => products.find((product) => product.id === activeProductId) ?? null,
[activeProductId]
);

const recentlyViewedProducts = useMemo(() => {
if (!viewedProductId) return [];
return products.filter((product) => product.id === viewedProductId);
}, [viewedProductId]);

const cartItemsDetailed = useMemo(() => {
return cart
.map((item) => {
const product = products.find((product) => product.id === item.productId);
if (!product) return null;
return { ...item, product };
})
.filter(Boolean) as Array<CartItem & { product: Product }>;
}, [cart]);

const cartSubtotal = useMemo(() => {
return cartItemsDetailed.reduce((total, item) => {
return total + item.product.price * item.quantity;
}, 0);
}, [cartItemsDetailed]);

const discountAmount = useMemo(() => {
if (appliedCoupon.toLowerCase() === "save10") return cartSubtotal * 0.1;
if (appliedCoupon.toLowerCase() === "welcome15") return cartSubtotal * 0.15;
return 0;
}, [appliedCoupon, cartSubtotal]);

const shippingCost = useMemo(() => {
if (cartItemsDetailed.length === 0) return 0;
if (shippingMethod === "express") return 9.99;
if (shippingMethod === "next-day") return 14.99;
return cartSubtotal >= 100 ? 0 : 4.99;
}, [cartItemsDetailed.length, cartSubtotal, shippingMethod]);

const orderTotal = useMemo(() => {
return Math.max(cartSubtotal - discountAmount + shippingCost, 0);
}, [cartSubtotal, discountAmount, shippingCost]);

function addToCart(productId: string): void {
setViewedProductId(productId);

setCart((current) => {
const existing = current.find((item) => item.productId === productId);
if (existing) {
return current.map((item) =>
item.productId === productId
? { ...item, quantity: item.quantity + 1 }
: item
);
}
return [...current, { productId, quantity: 1 }];
});
}

function updateCartQuantity(productId: string, delta: number): void {
setCart((current) =>
current
.map((item) =>
item.productId === productId
? { ...item, quantity: Math.max(item.quantity + delta, 0) }
: item
)
.filter((item) => item.quantity > 0)
);
}

function removeFromCart(productId: string): void {
setCart((current) => current.filter((item) => item.productId !== productId));
}

function toggleWishlist(productId: string): void {
setViewedProductId(productId);
setWishlist((current) =>
current.includes(productId)
? current.filter((id) => id !== productId)
: [...current, productId]
);
}

function toggleCompare(productId: string): void {
setViewedProductId(productId);
setCompare((current) => {
if (current.includes(productId)) {
return current.filter((id) => id !== productId);
}
if (current.length >= 3) {
return [...current.slice(1), productId];
}
return [...current, productId];
});
}

function viewDetails(productId: string): void {
setViewedProductId(productId);
setActiveProductId(productId);
}

function applyCoupon(): void {
const code = couponCode.trim().toLowerCase();
if (code === "save10" || code === "welcome15") {
setAppliedCoupon(code);
} else {
setAppliedCoupon("");
}
}

function beginCheckout(): void {
if (cartItemsDetailed.length === 0) return;
setCheckoutStep("delivery");
}

function placeOrder(): void {
if (cartItemsDetailed.length === 0) return;
const newOrderNumber = `ORD-${Date.now().toString().slice(-8)}`;
setOrderNumber(newOrderNumber);
setCheckoutStep("complete");
setCart([]);
setAppliedCoupon("");
setCouponCode("");
setDeliveryInfo({ email: "", phone: "", firstName: "", lastName: "", address: "" });
setPaymentInfo({ cardholderName: "", cardNumber: "", expiry: "", cvv: "" });
}

function resetFilters(): void {
setSelectedCategory("All");
setSearchQuery("");
setSortOption("featured");
setShowInStockOnly(false);
setMaxPrice(350);
}

return (
<main className="min-h-screen bg-slate-50 text-slate-900">
{!topBannerDismissed && (
<section
className="border-b border-slate-200 bg-slate-900 px-4 py-3 text-white"
data-section="top-promo-banner"
>
<div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
<div className="flex flex-wrap items-center gap-3 text-sm">
<span className="rounded-full bg-white/10 px-3 py-1 font-semibold">
Spring Campaign
</span>
<span>Free delivery over £100</span>
<button
className="rounded-md border border-white/20 px-3 py-1 hover:bg-white/10"
onClick={() => setSortOption("price-desc")}
data-cta="top-banner-shop-sale"
>
Shop Sale
</button>
<button
className="rounded-md border border-white/20 px-3 py-1 hover:bg-white/10"
onClick={() => {
setCouponCode("SAVE10");
alert("Code SAVE10 copied! Add it to your cart.");
}}
data-cta="top-banner-copy-code"
>
Copy Code: SAVE10
</button>
</div>
<button
className="rounded-md border border-white/20 px-3 py-1 hover:bg-white/10"
onClick={() => setTopBannerDismissed(true)}
data-action="dismiss-top-banner"
>
Dismiss
</button>
</div>
</section>
)}

<header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
<div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-4">
<button
className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
onClick={() => {
resetFilters();
setCart([]);
setActiveProductId(null);
}}
data-nav="logo-home"
>
PracticeShop
</button>

<button
className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-100"
onClick={() => setIsSideMenuCollapsed((current) => !current)}
data-nav="toggle-side-menu"
>
{isSideMenuCollapsed ? "Open Menu" : "Collapse Menu"}
</button>

<div className="min-w-[240px] flex-1">
<input
value={searchQuery}
onChange={(event) => setSearchQuery(event.target.value)}
placeholder="Search products, brands, features..."
className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 outline-none ring-0 transition focus:border-slate-500"
data-nav="search-input"
/>
</div>

<div className="flex flex-wrap gap-2">
<button
className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-100"
onClick={() => alert("Account Dashboard\n\n👤 Profile Info\n📍 Saved Addresses\n💳 Payment Methods\n⚙️ Email Preferences\n🔒 Password & Security\n\nClick here to manage your account")}
data-nav="account"
>
Account
</button>
<button
className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-100"
onClick={() => alert(orderNumber ? `Order History\n\n📦 Recent Order\nOrder #: ${orderNumber}\nStatus: Preparing for Dispatch\nEstimated Delivery: 4-6 days\n\nView tracking details in your account` : `Order History\n\n📦 No orders yet\n\nAdd products and checkout to place an order\n\nYour orders will appear here`)}
data-nav="orders"
>
Orders
</button>
<button
className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-100"
onClick={() => alert("You have " + wishlist.length + " items in your wishlist")}
data-nav="wishlist"
>
Wishlist ({wishlist.length})
</button>
<button
className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-100"
onClick={() => alert("You are comparing " + compare.length + " items")}
data-nav="compare"
>
Compare ({compare.length})
</button>
<button
className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-100"
onClick={() => alert("Help & FAQs:\n\n• How to use filters\n• Add items to cart\n• Checkout process\n• Track orders\n• Return items\n• Contact support")}
data-nav="help"
>
Help
</button>
<button
className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
onClick={() => {
  const cartSection = document.querySelector('[data-cart-action="clear-cart"]')?.closest('section');
  cartSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}}
data-nav="cart"
>
Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
</button>
</div>
</div>

<div className="border-t border-slate-200 bg-slate-50">
<div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3">
<button
className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
onClick={() => setSortOption("newest")}
data-topnav="campaign-new-arrivals"
>
New Arrivals
</button>
<button
className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-white"
onClick={() => setSortOption("featured")}
data-topnav="campaign-best-sellers"
>
Best Sellers
</button>
<button
className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-white"
onClick={() => {
setSelectedCategory("Electronics");
setSortOption("featured");
}}
data-topnav="campaign-limited-deals"
>
Limited Deals
</button>
<button
className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-white"
onClick={() => alert("Bundle offers are available in select categories!")}
data-topnav="campaign-bundles"
>
Bundle & Save
</button>
<button
className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-white"
onClick={() => alert("Find stores near you at practicestore.com")}
data-topnav="store-locator"
>
Store Locator
</button>
<button
className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-white"
onClick={() => alert("Visit our gift cards page!")}
data-topnav="gift-cards"
>
Gift Cards
</button>
</div>
</div>
</header>

<div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[280px_minmax(0,1fr)]">
<aside
className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${
isSideMenuCollapsed ? "hidden lg:hidden" : "block"
}`}
data-section="left-side-menu"
>
<div className="mb-6 flex items-center justify-between">
<h2 className="text-lg font-semibold">Browse & Filters</h2>
<button
className="rounded-md border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
onClick={resetFilters}
data-side="reset-filters"
>
Reset
</button>
</div>

<div className="mb-6">
<h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
Categories
</h3>
<div className="flex flex-col gap-2">
{categories.map((category) => (
<button
key={category}
onClick={() => setSelectedCategory(category)}
className={`rounded-lg px-3 py-2 text-left text-sm transition ${
selectedCategory === category
? "bg-slate-900 text-white"
: "border border-slate-200 hover:bg-slate-100"
}`}
data-side-category={category}
>
{category}
</button>
))}
</div>
</div>

<div className="mb-6">
<h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
Availability
</h3>
<label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2">
<input
type="checkbox"
checked={showInStockOnly}
onChange={(event) => setShowInStockOnly(event.target.checked)}
data-side="filter-in-stock"
/>
<span className="text-sm">Show in-stock only</span>
</label>
</div>

<div className="mb-6">
<h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
Max Price
</h3>
<input
type="range"
min={25}
max={350}
step={5}
value={maxPrice}
onChange={(event) => setMaxPrice(Number(event.target.value))}
className="w-full"
data-side="filter-max-price"
/>
<div className="mt-2 text-sm text-slate-600">
Up to {formatCurrency(maxPrice)}
</div>
</div>

<div className="mb-6">
<h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
Sort
</h3>
<select
value={sortOption}
onChange={(event) => setSortOption(event.target.value as SortOption)}
className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
data-side="sort-products"
>
<option value="featured">Featured</option>
<option value="price-asc">Price: Low to High</option>
<option value="price-desc">Price: High to Low</option>
<option value="rating-desc">Rating</option>
<option value="newest">Newest</option>
</select>
</div>

<div className="mb-6">
<h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
Support Links
</h3>
<div className="flex flex-col gap-2 text-sm">
<button className="rounded-lg border border-slate-200 px-3 py-2 text-left hover:bg-slate-100" onClick={() => alert("Shipping Policy\n\n• Free shipping on orders over £100\n• Standard (3-5 days)\n• Express (1-2 days)\n• Next Day Delivery\n• We ship worldwide")} data-side-link="shipping-policy">
Shipping Policy
</button>
<button className="rounded-lg border border-slate-200 px-3 py-2 text-left hover:bg-slate-100" onClick={() => alert("Returns & Refunds\n\n• 30-day returns\n• Free returns\n• Full refund or exchange\n• Easy return process\n• Contact support for help")} data-side-link="returns-refunds">
Returns & Refunds
</button>
<button className="rounded-lg border border-slate-200 px-3 py-2 text-left hover:bg-slate-100" onClick={() => alert("Size Guide\n\nPlease measure:\n• Length\n• Width\n• Height/Depth\n\nCompare with product specs\nChat with support if unsure")} data-side-link="size-guide">
Size Guide
</button>
<button className="rounded-lg border border-slate-200 px-3 py-2 text-left hover:bg-slate-100" onClick={() => alert(orderNumber ? `Track Order\n\nOrder Number: ${orderNumber}\nStatus: Processing\n\nYour order will be dispatched soon\nYou'll receive tracking details via email` : "Track Order\n\nNo active orders to track\nPlace an order first")} data-side-link="track-order">
Track Order
</button>
<button className="rounded-lg border border-slate-200 px-3 py-2 text-left hover:bg-slate-100" onClick={() => alert("Contact Support\n\n📧 Email: support@practiceshop.com\n📞 Phone: +44 (0) 123 456 7890\n💬 Chat: Available 9-5 (Mon-Fri)\n🕐 Response time: < 2 hours")} data-side-link="contact-support">
Contact Support
</button>
</div>
</div>

<div className="rounded-xl bg-slate-100 p-4" data-section="side-promo-card">
<p className="text-sm font-semibold">Members save more</p>
<p className="mt-1 text-sm text-slate-600">
Sign in to unlock early access and loyalty-only discounts.
</p>
<button
className="mt-3 w-full rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
onClick={() => alert("Join Membership\n\n✓ 10% off all orders\n✓ Free expedited shipping\n✓ Early access to sales\n✓ Birthday discount\n✓ Exclusive member events\n\nSign up today!")}  
data-side-cta="join-membership"
>
Join Membership
</button>
</div>
</aside>

<section className="space-y-6">
<section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 text-white shadow-sm">
<div className="grid gap-6 p-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
<div>
<span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">
Seasonal Launch
</span>
<h1 className="mt-4 text-3xl font-bold md:text-5xl">
Modern practice store for realistic analytics journeys
</h1>
<p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200 md:text-base">
Browse products, filter categories, add items to cart, apply
coupons, compare products, and progress through a simple checkout.
Designed to make GTM and GA4 tagging deliberate and clean.
</p>
<div className="mt-6 flex flex-wrap gap-3">
<button
className="rounded-lg bg-white px-5 py-3 font-semibold text-slate-900 hover:bg-slate-100"
onClick={() => setSortOption("featured")}
data-hero-cta="shop-featured"
>
Shop Featured
</button>
<button
className="rounded-lg border border-white/20 px-5 py-3 font-semibold hover:bg-white/10"
onClick={() => setSortOption("price-asc")}
data-hero-cta="view-deals"
>
View Deals
</button>
<button
className="rounded-lg border border-white/20 px-5 py-3 font-semibold hover:bg-white/10"
onClick={() => setIsSideMenuCollapsed(false)}
data-hero-cta="explore-categories"
>
Explore Categories
</button>
</div>
</div>

<div className="grid gap-3 rounded-2xl bg-white/5 p-4">
<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
<p className="text-sm text-slate-200">Active filters</p>
<p className="mt-1 text-lg font-semibold">
{selectedCategory} · {showInStockOnly ? "In Stock" : "All Stock"} · Up to{" "}
{formatCurrency(maxPrice)}
</p>
</div>
<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
<p className="text-sm text-slate-200">Current cart value</p>
<p className="mt-1 text-lg font-semibold">
{formatCurrency(orderTotal)}
</p>
</div>
<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
<p className="text-sm text-slate-200">Tracking-friendly zones</p>
<p className="mt-1 text-sm">
Top nav = global actions, left rail = browse/filter, cards = commerce interactions.
</p>
</div>
</div>
</div>
</section>

<section className="grid gap-4 md:grid-cols-3">
<button
className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:bg-slate-50"
onClick={() => setMaxPrice(350)}
data-banner="free-shipping"
>
<p className="text-sm text-slate-500">Shipping</p>
<p className="mt-1 text-lg font-semibold">Free over £100</p>
<p className="mt-2 text-sm text-slate-600">
Great for testing threshold-based promo exposure.
</p>
</button>
<button
className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:bg-slate-50"
onClick={() => setSelectedCategory("Accessories")}
data-banner="bundle-offer"
>
<p className="text-sm text-slate-500">Bundles</p>
<p className="mt-1 text-lg font-semibold">Save on accessories</p>
<p className="mt-2 text-sm text-slate-600">
Useful for internal promotion click tracking.
</p>
</button>
<button
className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:bg-slate-50"
onClick={() => setCouponCode("WELCOME15")}
data-banner="new-customer-offer"
>
<p className="text-sm text-slate-500">Offer</p>
<p className="mt-1 text-lg font-semibold">WELCOME15 available</p>
<p className="mt-2 text-sm text-slate-600">
Perfect for coupon, checkout, and conversion journeys.
</p>
</button>
</section>

<section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
<div>
<h2 className="text-xl font-semibold">Products</h2>
<p className="text-sm text-slate-600">
{filteredProducts.length} results for your current browse state
</p>
</div>
<div className="flex flex-wrap gap-2">
<button
className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
data-product-toolbar="view-all"
onClick={() => setSelectedCategory("All")}
>
View All
</button>
<button
className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
data-product-toolbar="featured-only"
onClick={() => setSortOption("featured")}
>
Featured
</button>
<button
className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
data-product-toolbar="highest-rated"
onClick={() => setSortOption("rating-desc")}
>
Highest Rated
</button>
</div>
</div>

<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
{filteredProducts.map((product) => {
const inWishlist = wishlist.includes(product.id);
const inCompare = compare.includes(product.id);

return (
<article
key={product.id}
className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
data-product-id={product.id}
data-product-name={product.name}
>
<div className="relative">
<img
src={product.image}
alt={product.name}
className="h-56 w-full object-cover"
/>
{product.badge && (
<span className="absolute left-3 top-3 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
{product.badge}
</span>
)}
{!product.inStock && (
<span className="absolute right-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
Out of Stock
</span>
)}
</div>

<div className="p-4">
<div className="mb-2 flex items-start justify-between gap-3">
<div>
<p className="text-sm text-slate-500">{product.brand}</p>
<h3 className="text-lg font-semibold">{product.name}</h3>
</div>
<button
className={`rounded-lg border px-3 py-2 text-sm ${
inWishlist
? "border-rose-300 bg-rose-50 text-rose-700"
: "border-slate-300 hover:bg-slate-100"
}`}
onClick={() => toggleWishlist(product.id)}
data-product-action="wishlist-toggle"
>
{inWishlist ? "Wishlisted" : "Wishlist"}
</button>
</div>

<p className="mb-3 text-sm text-slate-600">
{product.description}
</p>

<div className="mb-3 flex items-center gap-2 text-sm text-slate-600">
<span>⭐ {product.rating}</span>
<span>·</span>
<span>{product.reviews} reviews</span>
</div>

<div className="mb-3 flex flex-wrap gap-2">
{product.colors.map((color) => (
<span
key={color}
className="rounded-full border border-slate-200 px-2 py-1 text-xs text-slate-600"
>
{color}
</span>
))}
</div>

<div className="mb-4 flex items-center gap-3">
<span className="text-xl font-bold">
{formatCurrency(product.price)}
</span>
{product.compareAtPrice && (
<span className="text-sm text-slate-400 line-through">
{formatCurrency(product.compareAtPrice)}
</span>
)}
</div>

<div className="grid gap-2">
<div className="grid grid-cols-2 gap-2">
<button
className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
onClick={() => viewDetails(product.id)}
data-product-action="view-details"
>
View Details
</button>
<button
className={`rounded-lg border px-4 py-2 text-sm ${
inCompare
? "border-indigo-300 bg-indigo-50 text-indigo-700"
: "border-slate-300 hover:bg-slate-100"
}`}
onClick={() => toggleCompare(product.id)}
data-product-action="compare-toggle"
>
{inCompare ? "Comparing" : "Compare"}
</button>
</div>

<div className="grid grid-cols-2 gap-2">
<button
className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
onClick={() => {
setViewedProductId(product.id);
setActiveProductId(product.id);
}}
data-product-action="quick-view"
>
Quick View
</button>
<button
className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
product.inStock
? "bg-emerald-600 hover:bg-emerald-700"
: "cursor-not-allowed bg-slate-400"
}`}
disabled={!product.inStock}
onClick={() => addToCart(product.id)}
data-product-action="add-to-cart"
>
{product.inStock ? "Add to Cart" : "Notify Me"}
</button>
</div>
</div>
</div>
</article>
);
})}
</div>
</section>

{activeProduct && (
<section
className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
data-section="product-detail-panel"
>
<div className="mb-4 flex items-center justify-between gap-3">
<div>
<p className="text-sm text-slate-500">{activeProduct.brand}</p>
<h2 className="text-2xl font-semibold">{activeProduct.name}</h2>
</div>
<button
className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-100"
onClick={() => setActiveProductId(null)}
data-detail-action="close-panel"
>
Close
</button>
</div>

<div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
<img
src={activeProduct.image}
alt={activeProduct.name}
className="h-80 w-full rounded-2xl object-cover"
/>

<div>
<p className="text-sm leading-6 text-slate-600">
{activeProduct.description}
</p>

<div className="mt-4 flex items-center gap-3">
<span className="text-2xl font-bold">
{formatCurrency(activeProduct.price)}
</span>
{activeProduct.compareAtPrice && (
<span className="text-sm text-slate-400 line-through">
{formatCurrency(activeProduct.compareAtPrice)}
</span>
)}
</div>

<div className="mt-4 grid gap-2 sm:grid-cols-2">
<button
className="rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700"
onClick={() => addToCart(activeProduct.id)}
data-detail-action="add-to-cart"
>
Add to Cart
</button>
<button
className="rounded-lg border border-slate-300 px-4 py-3 hover:bg-slate-100"
onClick={() => toggleWishlist(activeProduct.id)}
data-detail-action="add-to-wishlist"
>
Save to Wishlist
</button>
<button
className="rounded-lg border border-slate-300 px-4 py-3 hover:bg-slate-100"
onClick={() => toggleCompare(activeProduct.id)}
data-detail-action="add-to-compare"
>
Add to Compare
</button>
<button
className="rounded-lg border border-slate-300 px-4 py-3 hover:bg-slate-100"
onClick={() => alert("Share product: " + activeProduct.name)}
data-detail-action="share-product"
>
Share Product
</button>
</div>

<div className="mt-6 rounded-2xl bg-slate-100 p-4">
<h3 className="font-semibold">Ideal events to track here</h3>
<p className="mt-2 text-sm text-slate-600">
Item detail view, add_to_cart, add_to_wishlist, compare click,
share click, panel close, promo exposure.
</p>
</div>
</div>
</div>
</section>
)}

<section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
<div className="space-y-6">
<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
<div className="mb-4 flex items-center justify-between">
<h2 className="text-xl font-semibold">Compare Tray</h2>
<button
className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
onClick={() => setCompare([])}
data-compare-action="clear-all"
>
Clear All
</button>
</div>

{compare.length === 0 ? (
<p className="text-sm text-slate-600">
Add up to 3 items to compare specs and drive comparison-based interaction tracking.
</p>
) : (
<div className="grid gap-4 md:grid-cols-3">
{compare.map((id) => {
const product = products.find((item) => item.id === id);
if (!product) return null;

return (
<div
key={id}
className="rounded-2xl border border-slate-200 p-4"
data-compare-product={product.id}
>
<p className="font-semibold">{product.name}</p>
<p className="mt-2 text-sm text-slate-600">
Category: {product.category}
</p>
<p className="text-sm text-slate-600">
Rating: {product.rating}
</p>
<p className="text-sm text-slate-600">
Price: {formatCurrency(product.price)}
</p>
<button
className="mt-3 rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
onClick={() => toggleCompare(product.id)}
data-compare-action="remove-item"
>
Remove
</button>
</div>
);
})}
</div>
)}
</section>

<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
<h2 className="text-xl font-semibold">Recently Viewed</h2>
{recentlyViewedProducts.length === 0 ? (
<p className="mt-2 text-sm text-slate-600">
Interact with any product to populate this area.
</p>
) : (
<div className="mt-4 grid gap-4 md:grid-cols-2">
{recentlyViewedProducts.map((product) => (
<div
key={product.id}
className="flex gap-4 rounded-2xl border border-slate-200 p-4"
data-recently-viewed={product.id}
>
<img
src={product.image}
alt={product.name}
className="h-24 w-24 rounded-xl object-cover"
/>
<div className="min-w-0">
<p className="font-semibold">{product.name}</p>
<p className="text-sm text-slate-600">
{formatCurrency(product.price)}
</p>
<div className="mt-3 flex gap-2">
<button
className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
onClick={() => viewDetails(product.id)}
data-recent-action="open-detail"
>
Open
</button>
<button
className="rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700"
onClick={() => addToCart(product.id)}
data-recent-action="add-to-cart"
>
Add
</button>
</div>
</div>
</div>
))}
</div>
)}
</section>

<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
<h2 className="text-xl font-semibold">Checkout Journey</h2>
<div className="mt-4 flex flex-wrap gap-2">
{(["delivery", "payment", "review", "complete"] as CheckoutStep[]).map(
(step) => (
<button
key={step}
onClick={() => setCheckoutStep(step)}
className={`rounded-full px-4 py-2 text-sm ${
checkoutStep === step
? "bg-slate-900 text-white"
: "border border-slate-300 hover:bg-slate-100"
}`}
data-checkout-step={step}
>
{step[0].toUpperCase() + step.slice(1)}
</button>
)
)}
</div>

<div className="mt-6 rounded-2xl bg-slate-100 p-4">
{checkoutStep === "delivery" && (
<div className="space-y-3">
<h3 className="font-semibold">Delivery Information</h3>
<div className="grid gap-3 md:grid-cols-2">
<input
className="rounded-lg border border-slate-300 px-4 py-2"
placeholder="Email address"
value={deliveryInfo.email}
onChange={(event) => setDeliveryInfo({ ...deliveryInfo, email: event.target.value })}
data-checkout-field="email"
/>
<input
className="rounded-lg border border-slate-300 px-4 py-2"
placeholder="Phone number"
value={deliveryInfo.phone}
onChange={(event) => setDeliveryInfo({ ...deliveryInfo, phone: event.target.value })}
data-checkout-field="phone"
/>
<input
className="rounded-lg border border-slate-300 px-4 py-2"
placeholder="First name"
value={deliveryInfo.firstName}
onChange={(event) => setDeliveryInfo({ ...deliveryInfo, firstName: event.target.value })}
data-checkout-field="first-name"
/>
<input
className="rounded-lg border border-slate-300 px-4 py-2"
placeholder="Last name"
value={deliveryInfo.lastName}
onChange={(event) => setDeliveryInfo({ ...deliveryInfo, lastName: event.target.value })}
data-checkout-field="last-name"
/>
<input
className="rounded-lg border border-slate-300 px-4 py-2 md:col-span-2"
placeholder="Address"
value={deliveryInfo.address}
onChange={(event) => setDeliveryInfo({ ...deliveryInfo, address: event.target.value })}
data-checkout-field="address"
/>
</div>
<button
className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
onClick={() => setCheckoutStep("payment")}
data-checkout-action="continue-to-payment"
>
Continue to Payment
</button>
</div>
)}

{checkoutStep === "payment" && (
<div className="space-y-3">
<h3 className="font-semibold">Payment</h3>
<div className="flex flex-wrap gap-2">
<button
className={`rounded-full px-4 py-2 text-sm ${
paymentMethod === "card"
? "bg-slate-900 text-white"
: "border border-slate-300 hover:bg-white"
}`}
onClick={() => setPaymentMethod("card")}
data-payment-method="card"
>
Credit / Debit Card
</button>
<button
className={`rounded-full px-4 py-2 text-sm ${
paymentMethod === "paypal"
? "bg-slate-900 text-white"
: "border border-slate-300 hover:bg-white"
}`}
onClick={() => setPaymentMethod("paypal")}
data-payment-method="paypal"
>
PayPal
</button>
<button
className={`rounded-full px-4 py-2 text-sm ${
paymentMethod === "klarna"
? "bg-slate-900 text-white"
: "border border-slate-300 hover:bg-white"
}`}
onClick={() => setPaymentMethod("klarna")}
data-payment-method="klarna"
>
Buy Now Pay Later
</button>
</div>
<div className="grid gap-3 md:grid-cols-2">
<input
className="rounded-lg border border-slate-300 px-4 py-2"
placeholder="Cardholder name"
value={paymentInfo.cardholderName}
onChange={(event) => setPaymentInfo({ ...paymentInfo, cardholderName: event.target.value })}
data-payment-field="cardholder-name"
/>
<input
className="rounded-lg border border-slate-300 px-4 py-2"
placeholder="Card number"
value={paymentInfo.cardNumber}
onChange={(event) => setPaymentInfo({ ...paymentInfo, cardNumber: event.target.value })}
data-payment-field="card-number"
/>
<input
className="rounded-lg border border-slate-300 px-4 py-2"
placeholder="Expiry date"
value={paymentInfo.expiry}
onChange={(event) => setPaymentInfo({ ...paymentInfo, expiry: event.target.value })}
data-payment-field="expiry"
/>
<input
className="rounded-lg border border-slate-300 px-4 py-2"
placeholder="CVV"
value={paymentInfo.cvv}
onChange={(event) => setPaymentInfo({ ...paymentInfo, cvv: event.target.value })}
data-payment-field="cvv"
/>
</div>
<button
className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
onClick={() => setCheckoutStep("review")}
data-checkout-action="continue-to-review"
>
Review Order
</button>
</div>
)}

{checkoutStep === "review" && (
<div className="space-y-3">
<h3 className="font-semibold">Review & Place Order</h3>
<p className="text-sm text-slate-600">
Confirm delivery method, payment method, coupon, and basket contents.
</p>
<div className="grid gap-3 md:grid-cols-2">
<div className="rounded-xl border border-slate-200 bg-white p-4">
<p className="font-medium">Delivery To</p>
<p className="mt-1 text-sm text-slate-600">
{deliveryInfo.firstName || "First Name"} {deliveryInfo.lastName || "Last Name"}
</p>
<p className="text-sm text-slate-600">{deliveryInfo.address || "Address not provided"}</p>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-4">
<p className="font-medium">Contact</p>
<p className="mt-1 text-sm text-slate-600">{deliveryInfo.email || "Email not provided"}</p>
<p className="text-sm text-slate-600">{deliveryInfo.phone || "Phone not provided"}</p>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-4">
<p className="font-medium">Shipping</p>
<p className="mt-1 text-sm text-slate-600">{shippingMethod}</p>
</div>
<div className="rounded-xl border border-slate-200 bg-white p-4">
<p className="font-medium">Payment</p>
<p className="mt-1 text-sm text-slate-600">{paymentMethod}</p>
</div>
</div>
<button
className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
onClick={placeOrder}
data-checkout-action="place-order"
>
Place Order
</button>
</div>
)}

{checkoutStep === "complete" && (
<div className="space-y-4 rounded-xl bg-emerald-50 p-6">
<div className="flex items-center justify-center">
<span className="text-4xl">✓</span>
</div>
<h3 className="text-center font-semibold text-emerald-900">Order Confirmed!</h3>
<p className="text-center text-sm text-emerald-800">
Thank you for your order. This state is useful for purchase and post-purchase testing.
</p>
<div className="rounded-lg bg-white p-4">
<p className="text-sm text-slate-600">Order Number</p>
<p className="text-lg font-semibold text-slate-900">{orderNumber}</p>
</div>
<div className="grid gap-2 text-sm text-slate-600">
<p>✓ Order confirmed</p>
<p>✓ Confirmation email sent</p>
<p>✓ Tracking available after dispatch</p>
</div>
<button
className="w-full rounded-lg border border-slate-300 px-4 py-2 hover:bg-white"
onClick={() => {
setCheckoutStep("delivery");
setOrderNumber("");
}}
data-checkout-action="start-new-order"
>
Start New Order
</button>
</div>
)}
</div>
</section>
</div>

<aside className="space-y-6">
<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
<div className="mb-4 flex items-center justify-between">
<h2 className="text-xl font-semibold">Cart Summary</h2>
<button
className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
onClick={() => setCart([])}
data-cart-action="clear-cart"
>
Clear
</button>
</div>

{cartItemsDetailed.length === 0 ? (
<p className="text-sm text-slate-600">
Your cart is empty. Add products to test cart and checkout interactions.
</p>
) : (
<div className="space-y-4">
{cartItemsDetailed.map((item) => (
<div
key={item.productId}
className="rounded-2xl border border-slate-200 p-4"
data-cart-item={item.productId}
>
<div className="flex items-start justify-between gap-3">
<div>
<p className="font-semibold">{item.product.name}</p>
<p className="text-sm text-slate-600">
{formatCurrency(item.product.price)}
</p>
</div>
<button
className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
onClick={() => removeFromCart(item.productId)}
data-cart-action="remove-item"
>
Remove
</button>
</div>

<div className="mt-3 flex items-center gap-2">
<button
className="rounded-lg border border-slate-300 px-3 py-2 hover:bg-slate-100"
onClick={() => updateCartQuantity(item.productId, -1)}
data-cart-action="decrease-qty"
>
-
</button>
<span className="min-w-[40px] text-center text-sm font-semibold">
{item.quantity}
</span>
<button
className="rounded-lg border border-slate-300 px-3 py-2 hover:bg-slate-100"
onClick={() => updateCartQuantity(item.productId, 1)}
data-cart-action="increase-qty"
>
+
</button>
</div>
</div>
))}

<div className="rounded-2xl bg-slate-100 p-4">
<h3 className="font-semibold">Promo Code</h3>
<div className="mt-3 flex gap-2">
<input
value={couponCode}
onChange={(event) => setCouponCode(event.target.value)}
placeholder="SAVE10 or WELCOME15"
className="flex-1 rounded-lg border border-slate-300 px-4 py-2"
data-cart-field="coupon-code"
/>
<button
className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
onClick={applyCoupon}
data-cart-action="apply-coupon"
>
Apply
</button>
</div>
<p className="mt-2 text-sm text-slate-600">
Applied: {appliedCoupon || "None"}
</p>
</div>

<div className="rounded-2xl bg-slate-100 p-4">
<h3 className="font-semibold">Shipping Method</h3>
<div className="mt-3 grid gap-2">
{[
{ id: "standard", label: "Standard (3-5 days)" },
{ id: "express", label: "Express (1-2 days)" },
{ id: "next-day", label: "Next Day" },
].map((option) => (
<label
key={option.id}
className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2"
>
<input
type="radio"
name="shippingMethod"
checked={shippingMethod === option.id}
onChange={() => setShippingMethod(option.id)}
data-shipping-method={option.id}
/>
<span className="text-sm">{option.label}</span>
</label>
))}
</div>
</div>

<div className="rounded-2xl border border-slate-200 p-4">
<div className="flex items-center justify-between text-sm">
<span>Subtotal</span>
<span>{formatCurrency(cartSubtotal)}</span>
</div>
<div className="mt-2 flex items-center justify-between text-sm">
<span>Discount</span>
<span>-{formatCurrency(discountAmount)}</span>
</div>
<div className="mt-2 flex items-center justify-between text-sm">
<span>Shipping</span>
<span>{formatCurrency(shippingCost)}</span>
</div>
<div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-base font-semibold">
<span>Total</span>
<span>{formatCurrency(orderTotal)}</span>
</div>
</div>

<button
className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700"
onClick={beginCheckout}
data-cart-action="begin-checkout"
>
Begin Checkout
</button>
<button
className="w-full rounded-lg border border-slate-300 px-4 py-3 hover:bg-slate-100"
onClick={() => setActiveProductId(null)}
data-cart-action="continue-shopping"
>
Continue Shopping
</button>
</div>
)}
</section>

<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
<h2 className="text-xl font-semibold">Newsletter</h2>
<p className="mt-2 text-sm text-slate-600">
Great for lead generation and form interaction tracking.
</p>
<div className="mt-4 space-y-3">
<input
type="email"
value={newsletterEmail}
onChange={(event) => setNewsletterEmail(event.target.value)}
placeholder="Enter your email"
className="w-full rounded-lg border border-slate-300 px-4 py-2"
data-newsletter-field="email"
/>
<button
className="w-full rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
onClick={() => {
if (newsletterEmail.trim()) {
setSubscriptionMessage("✓ Successfully subscribed! Check your email for a special offer.");
setNewsletterSubscribed(true);
setNewsletterEmail("");
setTimeout(() => setSubscriptionMessage(""), 5000);
} else {
setSubscriptionMessage("Please enter a valid email address");
setTimeout(() => setSubscriptionMessage(""), 3000);
}
}}
data-newsletter-action="subscribe"
>
Subscribe
</button>
{subscriptionMessage && (
<p className={`text-sm mt-2 ${subscriptionMessage.startsWith("✓") ? "text-emerald-700" : "text-amber-700"}`}>
{subscriptionMessage}
</p>
)}
</div>
</section>

<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
<h2 className="text-xl font-semibold">Support & Trust</h2>
<div className="mt-4 grid gap-2">
<button
className="rounded-lg border border-slate-300 px-4 py-3 text-left hover:bg-slate-100"
onClick={() => alert("Live Chat\n\n💬 Connect with an agent\n\nAgents available:\nMon-Fri: 9am-9pm\nSat: 10am-6pm\nSun: 12pm-5pm\n\nAverage response: < 2 min")}
data-support-action="live-chat"
>
Live Chat
</button>
<button
className="rounded-lg border border-slate-300 px-4 py-3 text-left hover:bg-slate-100"
onClick={() => alert("Book Product Demo\n\n📅 Schedule a demo with our team\n\n• 15-minute walkthrough\n• Product Q&A\n• Expert tips\n• Special promo included\n\nBook at: demo@practiceshop.com")}
data-support-action="book-demo"
>
Book Product Demo
</button>
<button
className="rounded-lg border border-slate-300 px-4 py-3 text-left hover:bg-slate-100"
onClick={() => alert("Frequently Asked Questions\n\n• How do I reset my password?\n• Can I change my order?\n• What's your return policy?\n• Do you offer gift wrapping?\n• How long is shipping?\n• Do you have a physical store?")}
data-support-action="faq"
>
FAQs
</button>
<button
className="rounded-lg border border-slate-300 px-4 py-3 text-left hover:bg-slate-100"
onClick={() => alert("Returns Help\n\n🔄 How to return items:\n\n1. Log into your account\n2. Find your order\n3. Click 'Return Item'\n4. Select reason\n5. Get return label\n6. Ship it back\n7. Get refund\n\nQuestions? Chat with us")}
data-support-action="returns-help"
>
Returns Help
</button>
</div>
</section>
</aside>
</section>
</section>
</div>
</main>
);
}
