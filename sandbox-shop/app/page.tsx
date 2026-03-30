"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ShoppingCart,
  Search,
  User,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  BadgePercent,
  Truck,
  CreditCard,
  Receipt,
  Bug,
  Heart,
  HeartOff,
} from "lucide-react";

/**
 * GA4/GTM Ecommerce Sandbox Shop (Clean UI)
 * - Removed on-screen dataLayer viewer & GTM guides
 * - Added dynamic journeys: Profile (addresses), Wishlist, Orders
 * - Keeps dataLayer pushes so you can practice in GTM/GA4
 */

// ---------- Utilities: lightweight hash router (SSR-safe) ----------
function useHashRoute() {
  // Safe default on server
  const [hash, setHash] = useState<string>("/");

  useEffect(() => {
    const getHash = () =>
      (typeof window !== "undefined" ? window.location.hash.replace(/^#/, "") || "/" : "/");

    // Sync after mount
    setHash(getHash());

    function onChange() {
      setHash(getHash());
    }

    if (typeof window !== "undefined") {
      window.addEventListener("hashchange", onChange);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("hashchange", onChange);
      }
    };
  }, []);

  const navigate = (path: string) => {
    if (typeof window !== "undefined") {
      window.location.hash = path;
    }
  };

  return { path: hash, navigate };
}

function moneyGBP(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
}
function uid(prefix = "T") {
  return `${prefix}${Math.random().toString(16).slice(2, 10)}${Date.now().toString(16).slice(-6)}`.toUpperCase();
}

// ---------- Demo catalog ----------
const CATALOG = [
  {
    item_id: "SKU-TSHIRT-001",
    item_name: "Everyday Tee",
    item_brand: "NorthMill",
    item_category: "Apparel",
    item_category2: "Tops",
    item_variant: "Black",
    price: 19.99,
    image: "tshirt",
    description: "A soft, breathable tee for daily wear.",
  },
  {
    item_id: "SKU-HOODIE-002",
    item_name: "Cloud Hoodie",
    item_brand: "NorthMill",
    item_category: "Apparel",
    item_category2: "Hoodies",
    item_variant: "Heather Grey",
    price: 49.0,
    image: "hoodie",
    description: "Warm fleece hoodie with a relaxed fit.",
  },
  {
    item_id: "SKU-MUG-003",
    item_name: "Studio Mug",
    item_brand: "Mori",
    item_category: "Home",
    item_category2: "Kitchen",
    item_variant: "White",
    price: 12.5,
    image: "mug",
    description: "Ceramic mug designed for long work sessions.",
  },
  {
    item_id: "SKU-BAG-004",
    item_name: "Weekend Tote",
    item_brand: "Mori",
    item_category: "Accessories",
    item_category2: "Bags",
    item_variant: "Sand",
    price: 34.99,
    image: "tote",
    description: "Durable canvas tote with internal pocket.",
  },
  {
    item_id: "SKU-BOTTLE-005",
    item_name: "Insulated Bottle",
    item_brand: "Astra",
    item_category: "Home",
    item_category2: "On-the-go",
    item_variant: "Navy",
    price: 24.0,
    image: "bottle",
    description: "Keeps drinks cold for 24h / hot for 12h.",
  },
  {
    item_id: "SKU-NOTE-006",
    item_name: "Minimal Notebook",
    item_brand: "Astra",
    item_category: "Stationery",
    item_category2: "Notebooks",
    item_variant: "Dot Grid",
    price: 9.95,
    image: "notebook",
    description: "120 pages, lay-flat binding, dot grid paper.",
  },
];

const PROMOTION = {
  promotion_id: "PROMO-SPRING-10",
  promotion_name: "Spring Sale 10%",
  creative_name: "Hero Banner",
  creative_slot: "home_hero",
};

// ---------- dataLayer helper ----------
function ensureDataLayer() {
  // @ts-ignore
  window.dataLayer = window.dataLayer || [];
  // @ts-ignore
  return window.dataLayer as any[];
}
function dlPush(obj: any) {
  const dl = ensureDataLayer();
  dl.push(obj);
}
function clearEcommerce() {
  dlPush({ ecommerce: null });
}
function toGA4Item(
  p: any,
  quantity = 1,
  index: number | undefined = undefined,
  item_list_id?: string,
  item_list_name?: string,
) {
  const item: any = {
    item_id: p.item_id,
    item_name: p.item_name,
    item_brand: p.item_brand,
    item_category: p.item_category,
    item_category2: p.item_category2,
    item_variant: p.item_variant,
    price: p.price,
    quantity,
  };
  if (typeof index === "number") item.index = index;
  if (item_list_id) item.item_list_id = item_list_id;
  if (item_list_name) item.item_list_name = item_list_name;
  return item;
}

// ---------- SVG placeholders ----------
function ProductArt({ type }: { type: string }) {
  const common = "w-full h-40 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 border";
  return (
    <div className={common}>
      <svg viewBox="0 0 400 200" className="w-full h-full">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="400" height="200" rx="24" fill="url(#g)" />
        <g fill="#0f172a" opacity="0.9">
          {type === "tshirt" && <path d="M130 60l40-20h60l40 20-25 30v60H155V90l-25-30z" fill="#111827" opacity="0.15" />}
          {type === "hoodie" && <path d="M140 60c10-20 30-30 60-30s50 10 60 30l20 30-20 10v70H140V100l-20-10 20-30z" fill="#111827" opacity="0.15" />}
          {type === "mug" && <path d="M150 70h90v90h-90z" fill="#111827" opacity="0.15" />}
          {type === "tote" && <path d="M140 70h120l-10 100H150L140 70z" fill="#111827" opacity="0.15" />}
          {type === "bottle" && <path d="M185 40h30v20h-30zM175 60h50v120h-50z" fill="#111827" opacity="0.15" />}
          {type === "notebook" && <path d="M150 50h100v120H150z" fill="#111827" opacity="0.15" />}
        </g>
        <text x="24" y="176" fontSize="14" fill="#334155">{type.toUpperCase()}</text>
      </svg>
    </div>
  );
}

// ---------- Types for new journeys ----------
type Address = {
  id: string;
  label: string;
  name: string;
  line1: string;
  city: string;
  postcode: string;
  country: string;
  isDefault?: boolean;
};
type SavedOrder = {
  id: string;
  value: number;
  tax: number;
  shipping: number;
  coupon?: string | null;
  items: { item_id: string; qty: number; price: number; name: string }[];
  ts: number;
};

// ---------- Main App ----------
export default function EcommerceSandboxApp() {
  const { path, navigate } = useHashRoute();

  // Settings
  const [analyticsOn, setAnalyticsOn] = useState(true);
  const [debugOn, setDebugOn] = useState(true);
  const [consentAnalytics, setConsentAnalytics] = useState(true);

  // User
  const [user, setUser] = useState<{ email: string; user_id: string } | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [emailDraft, setEmailDraft] = useState("mohammed@example.com");

  // Profile details (simple)
  const [profileFirst, setProfileFirst] = useState("");
  const [profileLast, setProfileLast] = useState("");
  const [profilePhone, setProfilePhone] = useState("");

  // Addresses, Wishlist, Orders
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<SavedOrder[]>([]);

  // Cart
  const [cart, setCart] = useState<{ item_id: string; qty: number }[]>([]);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Checkout
  const [shippingTier, setShippingTier] = useState("Standard");
  const [paymentType, setPaymentType] = useState("Card");
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);

  // --- Persistence (localStorage) ---
  useEffect(() => {
    try {
      const u = localStorage.getItem("sandbox_user");
      if (u) setUser(JSON.parse(u));
      const a = localStorage.getItem("sandbox_addresses");
      if (a) setAddresses(JSON.parse(a));
      const w = localStorage.getItem("sandbox_wishlist");
      if (w) setWishlist(JSON.parse(w));
      const o = localStorage.getItem("sandbox_orders");
      if (o) setOrders(JSON.parse(o));
      const c = localStorage.getItem("sandbox_cart");
      if (c) setCart(JSON.parse(c));
      const pf = localStorage.getItem("sandbox_profile_first");
      const pl = localStorage.getItem("sandbox_profile_last");
      const pp = localStorage.getItem("sandbox_profile_phone");
      if (pf) setProfileFirst(pf);
      if (pl) setProfileLast(pl);
      if (pp) setProfilePhone(pp);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("sandbox_user", JSON.stringify(user));
      localStorage.setItem("sandbox_addresses", JSON.stringify(addresses));
      localStorage.setItem("sandbox_wishlist", JSON.stringify(wishlist));
      localStorage.setItem("sandbox_orders", JSON.stringify(orders));
      localStorage.setItem("sandbox_cart", JSON.stringify(cart));
      localStorage.setItem("sandbox_profile_first", profileFirst);
      localStorage.setItem("sandbox_profile_last", profileLast);
      localStorage.setItem("sandbox_profile_phone", profilePhone);
    } catch {}
  }, [user, addresses, wishlist, orders, cart, profileFirst, profileLast, profilePhone]);

  // Mappings & totals
  const productsById = useMemo(() => {
    const m = new Map<string, any>();
    CATALOG.forEach((p) => m.set(p.item_id, p));
    return m;
  }, []);

  const cartLines = useMemo(() => {
    return cart
      .map((c) => {
        const p = productsById.get(c.item_id);
        return { ...c, p, lineTotal: (p?.price || 0) * c.qty };
      })
      .filter((x) => x.p);
  }, [cart, productsById]);
  const subtotal = useMemo(() => cartLines.reduce((s, l) => s + l.lineTotal, 0), [cartLines]);
  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon === "SPRING10") return Math.round(subtotal * 0.1 * 100) / 100;
    if (appliedCoupon === "FREESHIP") return 0;
    return 0;
  }, [appliedCoupon, subtotal]);
  const shippingCost = useMemo(() => {
    if (appliedCoupon === "FREESHIP") return 0;
    return shippingTier === "Express" ? 6.99 : 3.49;
  }, [shippingTier, appliedCoupon]);
  const tax = useMemo(() => Math.round((subtotal - discount) * 0.2 * 100) / 100, [subtotal, discount]);
  const total = useMemo(
    () => Math.max(0, Math.round((subtotal - discount + shippingCost + tax) * 100) / 100),
    [subtotal, discount, shippingCost, tax],
  );

  const isCheckout = path.startsWith("/checkout");
  const cartCount = useMemo(() => cart.reduce((s, c) => s + c.qty, 0), [cart]);
  const categories = useMemo(() => Array.from(new Set(CATALOG.map((p) => p.item_category))), []);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return CATALOG.filter((p) => {
      const catOk = activeCategory === "All" || p.item_category === activeCategory;
      const termOk =
        !term ||
        `${p.item_name} ${p.item_brand} ${p.item_category} ${p.item_category2}`.toLowerCase().includes(term);
      return catOk && termOk;
    });
  }, [searchTerm, activeCategory]);

  // ---------- Tracking gate & helpers ----------
  const canTrack = analyticsOn && consentAnalytics;
  function pushEcomEvent(eventName: string, ecommerceObj: any, extra: Record<string, any> = {}) {
    if (!canTrack) return;
    clearEcommerce();
    dlPush({
      event: eventName,
      ...extra,
      ecommerce: {
        currency: "GBP",
        ...ecommerceObj,
      },
      ...(debugOn ? { debug_mode: true } : {}),
    });
  }
  function pushNonEcomEvent(eventName: string, params: Record<string, any> = {}) {
    if (!canTrack) return;
    dlPush({
      event: eventName,
      ...params,
      ...(debugOn ? { debug_mode: true } : {}),
    });
  }

  // ---------- Route-level tracking ----------
  useEffect(() => {
    // page_view
    pushNonEcomEvent("page_view", {
      page_location: typeof window !== "undefined" ? window.location.href : "",
      page_path: path,
      page_title: typeof document !== "undefined" ? document.title || "GA4 Sandbox Shop" : "GA4 Sandbox Shop",
    });

    if (path === "/") {
      // Promotion impression
      pushEcomEvent("view_promotion", {
        items: [],
        promotion_id: PROMOTION.promotion_id,
        promotion_name: PROMOTION.promotion_name,
        creative_name: PROMOTION.creative_name,
        creative_slot: PROMOTION.creative_slot,
      });
      // Featured list impression
      const item_list_id = "home_featured";
      const item_list_name = "Featured";
      pushEcomEvent("view_item_list", {
        item_list_id,
        item_list_name,
        items: CATALOG.slice(0, 4).map((p, idx) => toGA4Item(p, 1, idx + 1, item_list_id, item_list_name)),
      });
    }
    if (path.startsWith("/category/")) {
      const cat = decodeURIComponent(path.split("/category/")[1] || "");
      const item_list_id = `cat_${cat.toLowerCase()}`;
      const item_list_name = cat;
      const items = CATALOG.filter((p) => p.item_category === cat).map((p, idx) =>
        toGA4Item(p, 1, idx + 1, item_list_id, item_list_name),
      );
      pushEcomEvent("view_item_list", { item_list_id, item_list_name, items });
    }
    if (path.startsWith("/product/")) {
      const id = decodeURIComponent(path.split("/product/")[1] || "");
      const p = productsById.get(id);
      if (p) {
        pushEcomEvent("view_item", {
          value: p.price,
          items: [toGA4Item(p, 1)],
        });
      }
    }
    if (path === "/cart") {
      pushEcomEvent("view_cart", {
        value: subtotal,
        items: cartLines.map((l) => toGA4Item(l.p, l.qty)),
      });
    }
    if (path === "/checkout") {
      pushEcomEvent("begin_checkout", {
        value: subtotal,
        coupon: appliedCoupon || undefined,
        items: cartLines.map((l) => toGA4Item(l.p, l.qty)),
      });
    }
    if (path === "/wishlist") {
      pushNonEcomEvent("view_wishlist", { items: wishlist });
    }
    if (path === "/account") {
      pushNonEcomEvent("view_profile", { user_id: user?.user_id });
    }
    if (path === "/orders") {
      pushNonEcomEvent("view_orders", { count: orders.length });
    }
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- Actions that also track ----------
  function selectItemFromList(p: any, listId?: string, listName?: string, index?: number) {
    pushEcomEvent("select_item", {
      item_list_id: listId,
      item_list_name: listName,
      items: [toGA4Item(p, 1, index, listId, listName)],
    });
    navigate(`/product/${encodeURIComponent(p.item_id)}`);
  }
  function addToCart(p: any, qty = 1) {
    setCart((prev) => {
      const existing = prev.find((x) => x.item_id === p.item_id);
      if (existing) return prev.map((x) => (x.item_id === p.item_id ? { ...x, qty: x.qty + qty } : x));
      return [...prev, { item_id: p.item_id, qty }];
    });
    pushEcomEvent("add_to_cart", {
      value: Math.round(p.price * qty * 100) / 100,
      items: [toGA4Item(p, qty)],
    });
  }
  function removeFromCart(p: any, qty = 1) {
    setCart((prev) => {
      const existing = prev.find((x) => x.item_id === p.item_id);
      if (!existing) return prev;
      if (existing.qty <= qty) return prev.filter((x) => x.item_id !== p.item_id);
      return prev.map((x) => (x.item_id === p.item_id ? { ...x, qty: x.qty - qty } : x));
    });
    pushEcomEvent("remove_from_cart", {
      value: Math.round(p.price * qty * 100) / 100,
      items: [toGA4Item(p, qty)],
    });
  }
  function applyCoupon(code: string) {
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;
    const allowed = ["SPRING10", "FREESHIP"];
    if (!allowed.includes(normalized)) {
      pushNonEcomEvent("coupon_invalid", { coupon: normalized });
      return;
    }
    setAppliedCoupon(normalized);
    pushNonEcomEvent("coupon_applied", { coupon: normalized });
  }
  function trackSearch(term: string) {
    const t = term.trim();
    if (!t) return;
    pushNonEcomEvent("search", { search_term: t });
  }
  function trackLogin(email: string) {
    const user_id = uid("U");
    setUser({ email, user_id });
    pushNonEcomEvent("login", { method: "email", user_id });
  }
  function trackSignup(email: string) {
    const user_id = uid("U");
    setUser({ email, user_id });
    pushNonEcomEvent("sign_up", { method: "email", user_id });
  }

  function proceedShipping() {
    pushEcomEvent("add_shipping_info", {
      value: subtotal,
      coupon: appliedCoupon || undefined,
      shipping_tier: shippingTier,
      items: cartLines.map((l) => toGA4Item(l.p, l.qty)),
    });
    navigate("/checkout/payment");
  }
  function proceedPayment() {
    pushEcomEvent("add_payment_info", {
      value: subtotal,
      coupon: appliedCoupon || undefined,
      payment_type: paymentType,
      items: cartLines.map((l) => toGA4Item(l.p, l.qty)),
    });
    navigate("/checkout/review");
  }
  function placeOrder() {
    const transaction_id = uid("T");
    pushEcomEvent("purchase", {
      transaction_id,
      affiliation: "GA4 Sandbox Store",
      value: total,
      tax,
      shipping: shippingCost,
      coupon: appliedCoupon || undefined,
      items: cartLines.map((l) => toGA4Item(l.p, l.qty)),
    });

    // Persist order to "orders"
    const newOrder: SavedOrder = {
      id: transaction_id,
      value: total,
      tax,
      shipping: shippingCost,
      coupon: appliedCoupon,
      items: cartLines.map((l) => ({
        item_id: l.p.item_id,
        qty: l.qty,
        price: l.p.price,
        name: l.p.item_name,
      })),
      ts: Date.now(),
    };
    setOrders((prev) => [newOrder, ...prev]);

    // Clear cart after purchase
    setCart([]);
    setAppliedCoupon(null);
    setCoupon("");
    setNewsletterOptIn(false);
    setTosAccepted(false);
    navigate(`/thank-you/${transaction_id}`);
  }
  function clickPromotion() {
    pushEcomEvent("select_promotion", {
      items: [],
      promotion_id: PROMOTION.promotion_id,
      promotion_name: PROMOTION.promotion_name,
      creative_name: PROMOTION.creative_name,
      creative_slot: PROMOTION.creative_slot,
    });
    navigate("/category/Apparel");
  }

  // Wishlist
  function toggleWishlist(id: string) {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [id, ...prev];
      const p = productsById.get(id);
      if (p) {
        if (exists) pushNonEcomEvent("remove_from_wishlist", { item_id: id });
        else pushNonEcomEvent("add_to_wishlist", { item_id: id, item_name: p.item_name });
      }
      return next;
    });
  }

  // Addresses
  function addOrUpdateAddress(a: Address) {
    setAddresses((prev) => {
      const exists = prev.find((x) => x.id === a.id);
      let next: Address[];
      if (exists) {
        next = prev.map((x) => (x.id === a.id ? { ...x, ...a } : x));
        pushNonEcomEvent("update_address", { address_id: a.id, label: a.label });
      } else {
        next = [{ ...a }, ...prev];
        pushNonEcomEvent("add_address", { address_id: a.id, label: a.label });
      }
      if (a.isDefault) {
        next = next.map((x) => ({ ...x, isDefault: x.id === a.id }));
        pushNonEcomEvent("set_default_address", { address_id: a.id });
      }
      return next;
    });
  }
  function deleteAddress(id: string) {
    setAddresses((prev) => prev.filter((x) => x.id !== id));
    pushNonEcomEvent("remove_address", { address_id: id });
  }

  // ---------- Render helpers ----------
  const Header = (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="font-semibold tracking-tight text-slate-900">
          <span className="inline-flex items-center gap-2">
            <span className="w-8 h-8 rounded-2xl bg-slate-900 text-white grid place-items-center text-sm">S</span>
            Sandbox Shop
          </span>
        </button>

        <div className="hidden md:flex items-center gap-2 ml-6">
          <Badge variant="secondary" className="rounded-2xl">GA4 / GTM Practice</Badge>
          <Badge variant="outline" className="rounded-2xl">No real payments</Badge>
        </div>

        <div className="flex-1" />

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 w-[380px]">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") trackSearch(searchTerm);
              }}
              placeholder="Search products…"
              className="pl-9 rounded-2xl"
            />
          </div>
          <Button variant="secondary" className="rounded-2xl" onClick={() => trackSearch(searchTerm)}>
            Search
          </Button>
        </div>

        {/* Account + Wishlist + Cart */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="rounded-2xl"
            onClick={() => {
              if (user) navigate("/account");
              else setLoginOpen(true);
            }}
          >
            <User className="w-4 h-4 mr-2" />
            {user ? "Account" : "Sign in"}
          </Button>

          <Button variant="ghost" className="rounded-2xl" onClick={() => navigate("/wishlist")}>
            <Heart className="w-4 h-4 mr-2" />
            Wishlist
            {wishlist.length > 0 && (
              <Badge className="ml-2 rounded-2xl" variant="secondary">{wishlist.length}</Badge>
            )}
          </Button>

          <Button variant="secondary" className="rounded-2xl" onClick={() => navigate("/cart")} aria-label="Cart">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart
            <Badge className="ml-2 rounded-2xl" variant="secondary">{cartCount}</Badge>
          </Button>
        </div>
      </div>

      {/* Category tabs + toggles */}
      <div className="max-w-6xl mx-auto px-4 pb-3 flex items-center gap-2">
        <Tabs
          value={activeCategory}
          onValueChange={(v) => {
            setActiveCategory(v);
            if (v !== "All") navigate(`/category/${encodeURIComponent(v)}`);
            else navigate("/");
          }}
        >
          <TabsList className="rounded-2xl">
            <TabsTrigger value="All" className="rounded-2xl">All</TabsTrigger>
            {categories.map((c) => (
              <TabsTrigger key={c} value={c} className="rounded-2xl">{c}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex-1" />

        <div className="flex items-center gap-4 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4" />
            <Label className="text-xs">Debug</Label>
            <Switch checked={debugOn} onCheckedChange={setDebugOn} />
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <Label className="text-xs">Consent</Label>
            <Switch checked={consentAnalytics} onCheckedChange={setConsentAnalytics} />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs">Analytics</Label>
            <Switch checked={analyticsOn} onCheckedChange={setAnalyticsOn} />
          </div>
        </div>
      </div>
    </div>
  );

  function PageShell({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen bg-slate-50">
        {Header}
        {/* Single column layout (Right rail removed) */}
        <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
        <Footer />
        <LoginDialog
          open={loginOpen}
          onOpenChange={setLoginOpen}
          emailDraft={emailDraft}
          setEmailDraft={setEmailDraft}
          user={user}
          onLogin={() => {
            trackLogin(emailDraft);
            setLoginOpen(false);
            navigate("/account");
          }}
          onSignup={() => {
            trackSignup(emailDraft);
            setLoginOpen(false);
            navigate("/account");
          }}
          onLogout={() => {
            setUser(null);
            pushNonEcomEvent("logout", {});
            setLoginOpen(false);
          }}
        />
      </div>
    );
  }

  // ---------- Pages ----------
  function Home() {
    const featured = CATALOG.slice(0, 4);
    const listId = "home_featured";
    const listName = "Featured";
    return (
      <div className="space-y-6">
        <Card className="rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-700 text-white relative">
            <div className="absolute right-6 top-6 hidden md:flex items-center gap-2">
              <Badge className="rounded-2xl bg-white/10 border-white/20" variant="outline">
                <BadgePercent className="w-4 h-4 mr-1" /> {PROMOTION.promotion_name}
              </Badge>
            </div>
            <div className="max-w-xl">
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Build realistic ecommerce journeys—without real payments.
              </h1>
              <p className="mt-3 text-white/80">
                Browse products, add to cart, apply coupons, complete checkout, and trigger GA4-style ecommerce events
                via <span className="font-mono">dataLayer</span>.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button className="rounded-2xl" onClick={clickPromotion}>Shop Spring Sale</Button>
                <Button className="rounded-2xl" variant="secondary" onClick={() => navigate("/category/Home")}>
                  Explore Home
                </Button>
              </div>
              <div className="mt-4 text-xs text-white/70 flex items-center gap-2">
                <Truck className="w-4 h-4" /> Try coupon{" "}
                <span className="font-mono bg-white/10 px-2 py-1 rounded-xl">SPRING10</span> or{" "}
                <span className="font-mono bg-white/10 px-2 py-1 rounded-xl">FREESHIP</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Featured</h2>
          <Button variant="ghost" className="rounded-2xl" onClick={() => navigate("/category/Apparel")}>
            View Apparel <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {featured.map((p, idx) => (
            <ProductCard
              key={p.item_id}
              p={p}
              inWishlist={wishlist.includes(p.item_id)}
              onWishlist={() => toggleWishlist(p.item_id)}
              onOpen={() => selectItemFromList(p, listId, listName, idx + 1)}
              onAdd={() => addToCart(p, 1)}
            />
          ))}
        </div>
      </div>
    );
  }

  function CategoryPage({ category }: { category: string }) {
    const listId = `cat_${category.toLowerCase()}`;
    const listName = category;
    const items = CATALOG.filter((p) => p.item_category === category);
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <button className="hover:underline" onClick={() => navigate("/")}>Home</button>
          <span>/</span>
          <span className="text-slate-900 font-medium">{category}</span>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{category}</h2>
          <Badge variant="secondary" className="rounded-2xl">{items.length} items</Badge>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((p, idx) => (
            <ProductCard
              key={p.item_id}
              p={p}
              inWishlist={wishlist.includes(p.item_id)}
              onWishlist={() => toggleWishlist(p.item_id)}
              onOpen={() => selectItemFromList(p, listId, listName, idx + 1)}
              onAdd={() => addToCart(p, 1)}
            />
          ))}
        </div>
      </div>
    );
  }

  function ProductPage({ id }: { id: string }) {
    const p = productsById.get(id);
    const [qty, setQty] = useState(1);
    if (!p) return <Card className="rounded-2xl"><CardContent className="p-6">Product not found.</CardContent></Card>;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <button className="hover:underline" onClick={() => navigate("/")}>Home</button>
          <span>/</span>
          <button className="hover:underline" onClick={() => navigate(`/category/${encodeURIComponent(p.item_category)}`)}>
            {p.item_category}
          </button>
        </div>
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 grid md:grid-cols-2 gap-6">
            <ProductArt type={p.image} />
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">{p.item_name}</h1>
                  <p className="text-sm text-slate-600 mt-1">{p.item_brand} • {p.item_variant}</p>
                </div>
                <Badge className="rounded-2xl" variant="secondary">{p.item_category2}</Badge>
              </div>
              <p className="mt-4 text-slate-700">{p.description}</p>
              <div className="mt-5 flex items-center justify-between">
                <div className="text-2xl font-semibold">{moneyGBP(p.price)}</div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" className="rounded-2xl" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="min-w-10 text-center font-mono">{qty}</div>
                  <Button variant="ghost" className="rounded-2xl" onClick={() => setQty((q) => Math.min(9, q + 1))}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button className="rounded-2xl" onClick={() => addToCart(p, qty)}>
                  <ShoppingCart className="w-4 h-4 mr-2" /> Add to cart
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-2xl"
                  onClick={() => {
                    addToCart(p, qty);
                    navigate("/cart");
                  }}
                >
                  Go to cart
                </Button>
                <Button
                  variant={wishlist.includes(p.item_id) ? "secondary" : "ghost"}
                  className="rounded-2xl"
                  onClick={() => toggleWishlist(p.item_id)}
                >
                  {wishlist.includes(p.item_id) ? <HeartOff className="w-4 h-4 mr-2" /> : <Heart className="w-4 h-4 mr-2" />}
                  {wishlist.includes(p.item_id) ? "Remove from wishlist" : "Add to wishlist"}
                </Button>
              </div>

              <Separator className="my-6" />
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-700">
                <InfoPill title="Returns" value="30 days" />
                <InfoPill title="Delivery" value="Standard / Express" />
                <InfoPill title="SKU" value={p.item_id} mono />
                <InfoPill title="Category" value={`${p.item_category} › ${p.item_category2}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function CartPage() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Your cart</h2>
          <Button variant="ghost" className="rounded-2xl" onClick={() => navigate("/")}>Continue shopping</Button>
        </div>
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            {cartLines.length === 0 ? (
              <div className="text-slate-700">Your cart is empty. Add something to get started.</div>
            ) : (
              <div className="space-y-4">
                {cartLines.map((l) => (
                  <div key={l.item_id} className="flex items-center gap-4">
                    <div className="w-20"><ProductArt type={l.p.image} /></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <button className="font-medium hover:underline" onClick={() => navigate(`/product/${encodeURIComponent(l.item_id)}`)}>
                          {l.p.item_name}
                        </button>
                        <div className="font-semibold">{moneyGBP(l.lineTotal)}</div>
                      </div>
                      <div className="text-sm text-slate-600">{l.p.item_brand} • {l.p.item_variant}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <Button variant="secondary" className="rounded-2xl" onClick={() => removeFromCart(l.p, 1)}>-</Button>
                        <div className="min-w-10 text-center font-mono">{l.qty}</div>
                        <Button variant="secondary" className="rounded-2xl" onClick={() => addToCart(l.p, 1)}>+</Button>
                        <Button variant="ghost" className="rounded-2xl ml-2" onClick={() => removeFromCart(l.p, l.qty)}>Remove</Button>
                      </div>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Coupon</Label>
                    <div className="mt-2 flex gap-2">
                      <Input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="SPRING10 or FREESHIP" className="rounded-2xl" />
                      <Button className="rounded-2xl" onClick={() => applyCoupon(coupon)}>Apply</Button>
                    </div>
                    {appliedCoupon && (
                      <div className="mt-2 text-sm text-slate-700">Applied: <span className="font-mono">{appliedCoupon}</span></div>
                    )}
                  </div>
                  <div className="md:text-right">
                    <div className="text-sm text-slate-600">Subtotal</div>
                    <div className="text-xl font-semibold">{moneyGBP(subtotal)}</div>
                    <Button className="rounded-2xl mt-3" onClick={() => navigate("/checkout")}>Begin checkout</Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  function CheckoutShell({ step, children }: { step: "shipping" | "payment" | "review"; children: React.ReactNode }) {
    const steps = [
      { key: "cart", label: "Cart", path: "/cart", icon: ShoppingCart },
      { key: "shipping", label: "Shipping", path: "/checkout", icon: Truck },
      { key: "payment", label: "Payment", path: "/checkout/payment", icon: CreditCard },
      { key: "review", label: "Review", path: "/checkout/review", icon: Receipt },
    ] as const;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Checkout</h2>
          <div className="flex gap-2">
            <Button variant="ghost" className="rounded-2xl" onClick={() => navigate("/orders")}>Orders</Button>
            <Button variant="ghost" className="rounded-2xl" onClick={() => navigate("/cart")}>Back to cart</Button>
          </div>
        </div>
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-4 gap-2">
              {steps.map((s) => {
                const Icon = s.icon;
                const active = s.key === step;
                return (
                  <button
                    key={s.key}
                    onClick={() => navigate(s.path)}
                    className={`rounded-2xl px-3 py-2 text-left border ${
                      active ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <div className="text-sm font-medium">{s.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            {cartLines.length === 0 ? (
              <div className="text-slate-700">Your cart is empty. <button className="underline" onClick={() => navigate("/")}>Shop now</button>.</div>
            ) : (
              children
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  function CheckoutShipping() {
    const defaultAddress = addresses.find((a) => a.isDefault);
    return (
      <CheckoutShell step="shipping">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Shipping details</h3>

            {/* Saved addresses (optional) */}
            {addresses.length > 0 && (
              <div className="rounded-2xl border bg-white p-3">
                <div className="text-sm font-medium text-slate-700 mb-2">Saved addresses</div>
                <div className="space-y-2">
                  {addresses.map((a) => (
                    <div key={a.id} className="flex items-center justify-between gap-3 text-sm">
                      <div className="text-slate-700">
                        <span className="font-medium">{a.label}</span>{" "}
                        {a.isDefault && <Badge variant="secondary" className="rounded-2xl ml-1">Default</Badge>}
                        <div className="text-slate-600">{a.name}, {a.line1}, {a.city}, {a.postcode}, {a.country}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          className="rounded-2xl"
                          onClick={() => {
                            pushNonEcomEvent("select_shipping_address", { address_id: a.id, default: !!a.isDefault });
                          }}
                        >
                          Use this
                        </Button>
                        <Button variant="ghost" className="rounded-2xl" onClick={() => navigate("/account")}>Manage</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-3">
              <Input className="rounded-2xl" placeholder="First name" defaultValue={profileFirst} />
              <Input className="rounded-2xl" placeholder="Last name" defaultValue={profileLast} />
              <Input className="rounded-2xl sm:col-span-2" placeholder="Address" defaultValue={defaultAddress?.line1 || ""} />
              <Input className="rounded-2xl" placeholder="City" defaultValue={defaultAddress?.city || ""} />
              <Input className="rounded-2xl" placeholder="Postcode" defaultValue={defaultAddress?.postcode || ""} />
            </div>

            <div>
              <Label className="text-sm">Delivery option</Label>
              <div className="mt-2">
                <Select value={shippingTier} onValueChange={setShippingTier}>
                  <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard (2–4 days)</SelectItem>
                    <SelectItem value="Express">Express (1–2 days)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={newsletterOptIn}
                onCheckedChange={(v) => {
                  setNewsletterOptIn(!!v);
                  pushNonEcomEvent("newsletter_opt_in", { opt_in: !!v });
                }}
              />
              <span className="text-sm text-slate-700">Email me product updates</span>
            </div>

            <div className="flex gap-2">
              <Button className="rounded-2xl" onClick={proceedShipping}>Continue to payment</Button>
              <Button variant="secondary" className="rounded-2xl" onClick={() => navigate("/cart")}>Back</Button>
            </div>
          </div>

          <OrderSummary
            subtotal={subtotal}
            discount={discount}
            tax={tax}
            shippingCost={shippingCost}
            total={total}
            appliedCoupon={appliedCoupon}
            cartLines={cartLines}
          />
        </div>
      </CheckoutShell>
    );
  }

  function CheckoutPayment() {
    return (
      <CheckoutShell step="payment">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Payment</h3>
            <div>
              <Label className="text-sm">Payment type</Label>
              <div className="mt-2">
                <Select value={paymentType} onValueChange={setPaymentType}>
                  <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                    <SelectItem value="Klarna">Klarna</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input className="rounded-2xl" placeholder="Card number (fake)" />
              <Input className="rounded-2xl" placeholder="Expiry" />
              <Input className="rounded-2xl" placeholder="CVC" />
              <Input className="rounded-2xl" placeholder="Name on card" />
            </div>
            <div className="flex gap-2">
              <Button className="rounded-2xl" onClick={proceedPayment}>Review order</Button>
              <Button variant="secondary" className="rounded-2xl" onClick={() => navigate("/checkout")}>Back</Button>
            </div>
          </div>

          <OrderSummary
            subtotal={subtotal}
            discount={discount}
            tax={tax}
            shippingCost={shippingCost}
            total={total}
            appliedCoupon={appliedCoupon}
            cartLines={cartLines}
          />
        </div>
      </CheckoutShell>
    );
  }

  function CheckoutReview() {
    return (
      <CheckoutShell step="review">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Review & place order</h3>
            <div className="text-sm text-slate-700 space-y-1">
              <div><span className="text-slate-500">Shipping:</span> {shippingTier}</div>
              <div><span className="text-slate-500">Payment:</span> {paymentType}</div>
              <div><span className="text-slate-500">Coupon:</span> {appliedCoupon ? appliedCoupon : "None"}</div>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox checked={tosAccepted} onCheckedChange={(v) => setTosAccepted(!!v)} />
              <div className="text-sm text-slate-700">
                I accept the terms (fake) and understand this is a sandbox.
              </div>
            </div>
            <Button className="rounded-2xl" disabled={!tosAccepted} onClick={placeOrder}>
              Place order (fake)
            </Button>
          </div>

          <OrderSummary
            subtotal={subtotal}
            discount={discount}
            tax={tax}
            shippingCost={shippingCost}
            total={total}
            appliedCoupon={appliedCoupon}
            cartLines={cartLines}
          />
        </div>
      </CheckoutShell>
    );
  }

  function ThankYou({ tid }: { tid: string }) {
    return (
      <div className="space-y-4">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Order confirmed</h2>
                <p className="text-slate-700 mt-1">
                  Transaction ID: <span className="font-mono">{tid}</span>
                </p>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <Button className="rounded-2xl" onClick={() => navigate("/")}>Back to shop</Button>
              <Button variant="secondary" className="rounded-2xl" onClick={() => navigate("/orders")}>View orders</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- New: Account (Profile + Addresses + Preferences) ---
  function AccountPage() {
    const [tab, setTab] = useState<"profile" | "addresses" | "preferences">("profile");

    const [editing, setEditing] = useState<Address | null>(null);
    const [draft, setDraft] = useState<Address>({
      id: "",
      label: "",
      name: "",
      line1: "",
      city: "",
      postcode: "",
      country: "United Kingdom",
      isDefault: false,
    });

    function startCreate() {
      const id = uid("A");
      setEditing({ ...draft, id });
      setDraft({
        id,
        label: "Home",
        name: `${profileFirst || "John"} ${profileLast || "Doe"}`,
        line1: "",
        city: "",
        postcode: "",
        country: "United Kingdom",
        isDefault: addresses.length === 0,
      });
    }
    function startEdit(a: Address) {
      setEditing(a);
      setDraft(a);
    }
    function cancelEdit() {
      setEditing(null);
      setDraft({
        id: "",
        label: "",
        name: "",
        line1: "",
        city: "",
        postcode: "",
        country: "United Kingdom",
        isDefault: false,
      });
    }
    function saveDraft() {
      addOrUpdateAddress(draft);
      setEditing(null);
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">My Account</h2>
          <div className="text-sm text-slate-600">{user ? user.email : "Not signed in"}</div>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="rounded-2xl">
            <TabsTrigger value="profile" className="rounded-2xl">Profile</TabsTrigger>
            <TabsTrigger value="addresses" className="rounded-2xl">Addresses</TabsTrigger>
            <TabsTrigger value="preferences" className="rounded-2xl">Preferences</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            {/* Profile */}
            <TabsContent value="profile" className="space-y-4">
              <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">First name</Label>
                      <Input className="rounded-2xl mt-1" value={profileFirst} onChange={(e) => setProfileFirst(e.target.value)} />
                    </div>
                    <div>
                      <Label className="text-sm">Last name</Label>
                      <Input className="rounded-2xl mt-1" value={profileLast} onChange={(e) => setProfileLast(e.target.value)} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-sm">Phone</Label>
                      <Input className="rounded-2xl mt-1" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="rounded-2xl"
                      onClick={() =>
                        pushNonEcomEvent("update_profile", {
                          first_name: profileFirst || undefined,
                          last_name: profileLast || undefined,
                          phone: profilePhone || undefined,
                          user_id: user?.user_id,
                        })
                      }
                    >
                      Save profile
                    </Button>
                    <Button variant="secondary" className="rounded-2xl" onClick={() => navigate("/orders")}>View orders</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Addresses */}
            <TabsContent value="addresses" className="space-y-4">
              <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">Saved addresses</div>
                    <Button className="rounded-2xl" onClick={startCreate}>Add address</Button>
                  </div>
                  {addresses.length === 0 ? (
                    <div className="text-sm text-slate-600">No addresses yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map((a) => (
                        <div key={a.id} className="rounded-2xl border bg-white p-4">
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <div className="font-medium">
                                {a.label} {a.isDefault && <Badge className="rounded-2xl ml-1" variant="secondary">Default</Badge>}
                              </div>
                              <div className="text-slate-600">{a.name}</div>
                              <div className="text-slate-600">{a.line1}, {a.city}, {a.postcode}, {a.country}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              {!a.isDefault && (
                                <Button
                                  variant="secondary"
                                  className="rounded-2xl"
                                  onClick={() => addOrUpdateAddress({ ...a, isDefault: true })}
                                >
                                  Set default
                                </Button>
                              )}
                              <Button variant="ghost" className="rounded-2xl" onClick={() => startEdit(a)}>Edit</Button>
                              <Button variant="ghost" className="rounded-2xl" onClick={() => deleteAddress(a.id)}>Delete</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Address editor dialog */}
              <Dialog open={!!editing} onOpenChange={(o) => (o ? null : cancelEdit())}>
                <DialogContent className="rounded-2xl">
                  <DialogHeader>
                    <DialogTitle>{addresses.some((x) => x.id === draft.id) ? "Edit address" : "Add address"}</DialogTitle>
                    <DialogDescription>Manage your shipping addresses for a quicker checkout.</DialogDescription>
                  </DialogHeader>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <Label className="text-sm">Label</Label>
                      <Input className="rounded-2xl mt-1" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-sm">Full name</Label>
                      <Input className="rounded-2xl mt-1" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-sm">Address line</Label>
                      <Input className="rounded-2xl mt-1" value={draft.line1} onChange={(e) => setDraft({ ...draft, line1: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-sm">City</Label>
                      <Input className="rounded-2xl mt-1" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} />
                    </div>
                    <div>
                      <Label className="text-sm">Postcode</Label>
                      <Input className="rounded-2xl mt-1" value={draft.postcode} onChange={(e) => setDraft({ ...draft, postcode: e.target.value })} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-sm">Country</Label>
                      <Input className="rounded-2xl mt-1" value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Checkbox checked={!!draft.isDefault} onCheckedChange={(v) => setDraft({ ...draft, isDefault: !!v })} />
                    <span className="text-sm text-slate-700">Set as default</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button className="rounded-2xl" onClick={saveDraft}>Save</Button>
                    <Button variant="secondary" className="rounded-2xl" onClick={cancelEdit}>Cancel</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences" className="space-y-4">
              <Card className="rounded-2xl shadow-sm">
                <CardContent className="p-6 space-y-3">
                  <div className="text-sm text-slate-700">
                    Control analytics toggles from the header. These gate dataLayer pushes to help simulate consent.
                  </div>
                  <div className="text-sm text-slate-700">
                    Newsletter opt-in can also be toggled during checkout.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );
  }

  function WishlistPage() {
    const items = wishlist
      .map((id) => productsById.get(id))
      .filter(Boolean) as any[];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Wishlist</h2>
          <Button variant="ghost" className="rounded-2xl" onClick={() => navigate("/")}>Continue shopping</Button>
        </div>
        {items.length === 0 ? (
          <Card className="rounded-2xl"><CardContent className="p-6">Your wishlist is empty.</CardContent></Card>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {items.map((p) => (
              <ProductCard
                key={p.item_id}
                p={p}
                inWishlist={true}
                onWishlist={() => toggleWishlist(p.item_id)}
                onOpen={() => navigate(`/product/${encodeURIComponent(p.item_id)}`)}
                onAdd={() => addToCart(p, 1)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  function OrdersPage() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Orders</h2>
          <Button variant="ghost" className="rounded-2xl" onClick={() => navigate("/")}>Back to shop</Button>
        </div>
        {orders.length === 0 ? (
          <Card className="rounded-2xl"><CardContent className="p-6">No orders yet.</CardContent></Card>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <Card key={o.id} className="rounded-2xl shadow-sm">
                <CardContent className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Order <span className="font-mono">{o.id}</span></div>
                    <div className="text-sm text-slate-600">{new Date(o.ts).toLocaleString()}</div>
                  </div>
                  <div className="text-sm text-slate-700">
                    <span className="mr-4">Total: <span className="font-medium">{moneyGBP(o.value)}</span></span>
                    {o.coupon ? <span>Coupon: <span className="font-mono">{o.coupon}</span></span> : null}
                  </div>
                  <Separator />
                  <div className="space-y-1 text-sm">
                    {o.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="text-slate-700 truncate">{it.name} <span className="text-slate-400">×</span> <span className="font-mono">{it.qty}</span></div>
                        <div className="text-slate-900">{moneyGBP(it.price * it.qty)}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ---------- Route switch ----------
  let page: React.ReactNode = null;
  if (path === "/") page = <Home />;
  else if (path.startsWith("/category/")) {
    const category = decodeURIComponent(path.split("/category/")[1] || "");
    page = <CategoryPage category={category} />;
  } else if (path.startsWith("/product/")) {
    const id = decodeURIComponent(path.split("/product/")[1] || "");
    page = <ProductPage id={id} />;
  } else if (path === "/cart") page = <CartPage />;
  else if (path === "/checkout") page = <CheckoutShipping />;
  else if (path === "/checkout/payment") page = <CheckoutPayment />;
  else if (path === "/checkout/review") page = <CheckoutReview />;
  else if (path.startsWith("/thank-you/")) {
    const tid = decodeURIComponent(path.split("/thank-you/")[1] || "");
    page = <ThankYou tid={tid} />;
  } else if (path === "/account") page = <AccountPage />;
  else if (path === "/wishlist") page = <WishlistPage />;
  else if (path === "/orders") page = <OrdersPage />;
  else {
    page = (
      <Card className="rounded-2xl">
        <CardContent className="p-6">
          Not found. <button className="underline" onClick={() => navigate("/")}>Go home</button>.
        </CardContent>
      </Card>
    );
  }

  // ---------- SPA search list on home/all ----------
  const showSearchResults = !isCheckout && path === "/" && (searchTerm.trim() || activeCategory !== "All");
  return <PageShell>{showSearchResults ? <SearchResults /> : page}</PageShell>;

  function SearchResults() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Browse</h2>
          <div className="text-sm text-slate-600">Showing {filteredProducts.length} results</div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {filteredProducts.map((p, idx) => (
            <ProductCard
              key={p.item_id}
              p={p}
              inWishlist={wishlist.includes(p.item_id)}
              onWishlist={() => toggleWishlist(p.item_id)}
              onOpen={() => {
                const listId = activeCategory === "All" ? "search_all" : `cat_${activeCategory.toLowerCase()}`;
                const listName = activeCategory === "All" ? "All products" : activeCategory;
                selectItemFromList(p, listId, listName, idx + 1);
              }}
              onAdd={() => addToCart(p, 1)}
            />
          ))}
        </div>
      </div>
    );
  }
}

// ---------- Components ----------
function ProductCard({
  p,
  onOpen,
  onAdd,
  inWishlist,
  onWishlist,
}: {
  p: any;
  onOpen: () => void;
  onAdd: () => void;
  inWishlist?: boolean;
  onWishlist?: () => void;
}) {
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <ProductArt type={p.image} />
        <div className="flex items-start justify-between gap-3">
          <div>
            <button className="font-semibold hover:underline text-left" onClick={onOpen}>{p.item_name}</button>
            <div className="text-sm text-slate-600">{p.item_brand} • {p.item_variant}</div>
          </div>
          <div className="text-right">
            <div className="font-semibold">{new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(p.price)}</div>
            <Badge className="rounded-2xl mt-1" variant="secondary">{p.item_category}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="rounded-2xl" onClick={onAdd}>Add</Button>
          <Button variant="secondary" className="rounded-2xl" onClick={onOpen}>View</Button>
          {onWishlist && (
            <Button variant={inWishlist ? "secondary" : "ghost"} className="rounded-2xl" onClick={onWishlist} aria-label="Wishlist">
              {inWishlist ? <HeartOff className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function InfoPill({ title, value, mono }: { title: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-2xl border bg-white p-3">
      <div className="text-xs text-slate-500">{title}</div>
      <div className={`text-sm text-slate-900 mt-1 ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

function OrderSummary({
  subtotal,
  discount,
  tax,
  shippingCost,
  total,
  appliedCoupon,
  cartLines,
}: {
  subtotal: number;
  discount: number;
  tax: number;
  shippingCost: number;
  total: number;
  appliedCoupon: string | null;
  cartLines: any[];
}) {
  const money = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
  return (
    <div className="rounded-2xl border bg-white p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Order summary</div>
        {appliedCoupon ? <Badge className="rounded-2xl" variant="secondary">{appliedCoupon}</Badge> : null}
      </div>
      <div className="text-sm text-slate-700 space-y-2">
        <Row label="Subtotal" value={money(subtotal)} />
        <Row label="Discount" value={discount ? `- ${money(discount)}` : money(0)} />
        <Row label="Shipping" value={money(shippingCost)} />
        <Row label="Tax (est.)" value={money(tax)} />
        <Separator />
        <Row label={<span className="font-semibold">Total</span>} value={<span className="font-semibold">{money(total)}</span>} />
      </div>
      <Separator />
      <div className="space-y-2">
        <div className="text-xs font-medium text-slate-500">Items</div>
        <div className="space-y-1">
          {cartLines.map((l: any) => (
            <div key={l.item_id} className="flex items-center justify-between text-sm">
              <div className="text-slate-700 truncate">{l.p.item_name} <span className="text-slate-400">×</span> <span className="font-mono">{l.qty}</span></div>
              <div className="text-slate-900">{money(l.lineTotal)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-slate-600">{label}</div>
      <div className="text-slate-900">{value}</div>
    </div>
  );
}

function Footer() {
  return (
    <div className="border-t bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-slate-600 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="font-medium text-slate-900">Sandbox Shop</div>
          <div className="text-xs mt-1">Built for GA4/GTM ecommerce tagging practice. No real transactions.</div>
        </div>
        <div className="text-xs text-slate-500">
          This is a demo app. All interactions are simulated.
        </div>
      </div>
    </div>
  );
}

function LoginDialog({
  open,
  onOpenChange,
  emailDraft,
  setEmailDraft,
  user,
  onLogin,
  onSignup,
  onLogout,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  emailDraft: string;
  setEmailDraft: (s: string) => void;
  user: { email: string; user_id: string } | null;
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>{user ? "Account" : "Sign in"}</DialogTitle>
          <DialogDescription>
            This is a sandbox identity used for tagging practice (login/sign_up events).
          </DialogDescription>
        </DialogHeader>
        {user ? (
          <div className="space-y-4">
            <div className="rounded-2xl border bg-slate-50 p-4">
              <div className="text-sm text-slate-600">Signed in as</div>
              <div className="font-medium">{user.email}</div>
              <div className="text-xs text-slate-500 mt-1">user_id: <span className="font-mono">{user.user_id}</span></div>
            </div>
            <div className="flex gap-2">
              <Button className="rounded-2xl" onClick={() => onOpenChange(false)}>Close</Button>
              <Button variant="secondary" className="rounded-2xl" onClick={onLogout}>Sign out</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Email</Label>
              <Input className="rounded-2xl mt-2" value={emailDraft} onChange={(e) => setEmailDraft(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button className="rounded-2xl" onClick={onLogin}>Sign in</Button>
              <Button variant="secondary" className="rounded-2xl" onClick={onSignup}>Create account</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}