// src/pages/ProductionAssets.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiSearch,
  FiX,
  FiChevronDown,
  FiChevronRight,
  FiExternalLink,
  FiPackage,
  FiMapPin,
  FiRefreshCw,
  FiArrowLeft,
  FiUser,
} from "react-icons/fi";
import api from "../Components/axios";
import vendorCategories from "../utils/vendorCategories.json";

const Disclaimer = () => (
  <div className="pt-8 pb-4">
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
      <p className="text-[10px] leading-relaxed text-gray-400 font-medium text-center italic">
        <span className="font-bold text-gray-500 uppercase tracking-widest not-italic mr-1">
          Disclaimer:
        </span>
        The information and data displayed on this portal are provided solely by
        the respective individuals/applicants. The Department makes no representations or
        warranties regarding the accuracy, completeness, or reliability of the
        submitted information and shall not be held responsible or liable for
        any errors, omissions, or claims arising from its use.
      </p>
    </div>
  </div>
);

const safeArray = (x) => (Array.isArray(x) ? x : []);
const norm = (s) => String(s || "").trim().toLowerCase();

const BASE_URL = "https://film.bihar.gov.in";
const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/600x400?text=No+Image";
  if (String(path).startsWith("http")) return path;
  const clean = String(path).startsWith("/") ? String(path).slice(1) : String(path);
  return `${BASE_URL}/${clean}`;
};

const money = (v) => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(String(v).replace(/[^\d.]/g, ""));
  if (!Number.isFinite(n)) return null;
  try {
    return new Intl.NumberFormat("en-IN").format(n);
  } catch {
    return String(v);
  }
};

/**
 * Product-wise registry only
 * - Left menu: Type -> Subtype
 * - Menu sources:
 *    1) JSON (all possible types/subtypes)
 *    2) API /api/products/menu (verified counts)
 * - Click Type => show ALL products in that type
 * - Click Subtype => filter within type
 * - Search:
 *    - Filters products by name/vendor/type/subtype/description/address
 *    - Also narrows visible menu (types/subtypes) based on query
 * - Type click expands reliably (no "toggle closes instantly" issue)
 * - Product card:
 *    - "Vendor details" opens a vendor view (like VendorList) + back button
 */
const ProductionAssets = ({ onClose }) => {
  // menu
  const [menuApi, setMenuApi] = useState([]); // {type,total,subTypes:[{subType,count}]}
  const [menuLoading, setMenuLoading] = useState(true);

  // selection
  const [selectedType, setSelectedType] = useState("");
  const [selectedSubType, setSelectedSubType] = useState(null); // null => "All in type"
  const [openTypes, setOpenTypes] = useState(() => new Set());

  // products
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // ui
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // vendor drilldown (within this page)
  const [view, setView] = useState("products"); // "products" | "vendor"
  const [focusedVendor, setFocusedVendor] = useState(null);
  const [vendorProducts, setVendorProducts] = useState([]);
  const [vendorLoading, setVendorLoading] = useState(false);

  const searchDebounceRef = useRef(null);
  const [searchLive, setSearchLive] = useState("");

  // -----------------------
  // JSON menu map: type -> subTypes[]
  // -----------------------
  const jsonMenu = useMemo(() => {
    const map = new Map();
    safeArray(vendorCategories).forEach((cat) => {
      const type = cat?.name?.trim();
      if (!type) return;
      const subs = safeArray(cat?.subcategories)
        .map((s) => s?.name?.trim())
        .filter(Boolean);
      map.set(type, subs);
    });
    return map;
  }, []);

  // -----------------------
  // Fetch menu from API (verified products counts)
  // -----------------------
  const fetchMenu = async () => {
    setMenuLoading(true);
    try {
      const res = await api.get("/api/products/menu?onlyVendorVerified=true", {
        validateStatus: () => true,
      });
      if (res.status >= 200 && res.status < 300) setMenuApi(safeArray(res.data?.data));
      else setMenuApi([]);
    } catch {
      setMenuApi([]);
    } finally {
      setMenuLoading(false);
    }
  };

  // -----------------------
  // Merge JSON + API into a logical menu
  // -----------------------
  const mergedMenu = useMemo(() => {
    const apiMap = new Map();
    safeArray(menuApi).forEach((row) => {
      const type = row?.type?.trim();
      if (!type) return;
      apiMap.set(type, {
        type,
        total: Number(row?.total || 0),
        subTypes: safeArray(row?.subTypes)
          .map((s) => ({
            subType: s?.subType?.trim(),
            count: Number(s?.count || 0),
          }))
          .filter((s) => s.subType),
      });
    });

    const allTypes = new Set([...Array.from(jsonMenu.keys()), ...Array.from(apiMap.keys())]);

    const out = Array.from(allTypes).map((type) => {
      const apiEntry = apiMap.get(type);
      const jsonSubs = jsonMenu.get(type) || [];
      const apiSubs = (apiEntry?.subTypes || []).map((s) => s.subType);

      const subSet = new Set([...jsonSubs, ...apiSubs].filter(Boolean));
      const subTypes = Array.from(subSet)
        .sort((a, b) => a.localeCompare(b))
        .map((subType) => ({
          subType,
          count: apiEntry?.subTypes?.find((x) => x.subType === subType)?.count || 0,
        }));

      return { type, total: apiEntry?.total ?? 0, subTypes };
    });

    out.sort((a, b) => {
      const d = (b.total || 0) - (a.total || 0);
      if (d !== 0) return d;
      return a.type.localeCompare(b.type);
    });

    return out;
  }, [menuApi, jsonMenu]);

  // -----------------------
  // Menu filtered by search (type/subtype match OR vendor/product match)
  // - keeps UX: typing narrows sidebar list too
  // -----------------------
  const menuVisible = useMemo(() => {
    const q = norm(searchLive);
    if (!q) return mergedMenu;

    // If we already have products loaded, leverage them to keep relevant types visible
    const typeHit = new Set();
    const subHit = new Map(); // type -> Set(subType)

    safeArray(products).forEach((p) => {
      const t = p?.type?.trim();
      const s = p?.subType?.trim();
      const vendorName = p?.vendor?.vendorName;
      const name = p?.name;
      const desc = p?.description;
      const addr = p?.vendor?.address;

      const hay = [
        t,
        s,
        vendorName,
        name,
        desc,
        addr,
        p?.vendor?.email,
        p?.vendor?.phoneNumber,
      ]
        .map(norm)
        .join(" | ");

      if (hay.includes(q)) {
        if (t) typeHit.add(t);
        if (t && s) {
          if (!subHit.has(t)) subHit.set(t, new Set());
          subHit.get(t).add(s);
        }
      }
    });

    return safeArray(mergedMenu)
      .map((t) => {
        const typeMatches = norm(t.type).includes(q);
        const subTypes = safeArray(t.subTypes).filter((s) => {
          const subMatches = norm(s.subType).includes(q);
          const inProductHit = subHit.get(t.type)?.has(s.subType);
          return typeMatches || subMatches || inProductHit;
        });

        const keepType =
          typeMatches ||
          subTypes.length > 0 ||
          typeHit.has(t.type);

        if (!keepType) return null;

        return {
          ...t,
          subTypes,
        };
      })
      .filter(Boolean);
  }, [mergedMenu, searchLive, products]);

  // -----------------------
  // Fetch products for selection
  // - type required
  // - subType optional
  // -----------------------
  const fetchProducts = async ({ type, subType }) => {
    if (!type) return [];
    const params = new URLSearchParams({
      type: String(type),
      onlyVendorVerified: "true",
    });
    if (subType) params.set("subType", String(subType));

    const res = await api.get(`/api/products?${params.toString()}`, {
      validateStatus: () => true,
    });

    if (res.status >= 200 && res.status < 300) return safeArray(res.data?.data);
    return [];
  };

  // -----------------------
  // Vendor drilldown: fetch vendor products (best effort)
  // - tries vendorId param; falls back to filtering current products list
  // -----------------------
  const openVendor = async (vendorObj) => {
    const v = vendorObj || null;
    if (!v) return;
    setFocusedVendor(v);
    setView("vendor");
    setVendorLoading(true);
    setVendorProducts([]);

    const vendorId = v?.id || v?.vendorId || v?._id;

    try {
      if (vendorId) {
        const params = new URLSearchParams({
          onlyVendorVerified: "true",
          vendorId: String(vendorId),
        });

        // if backend doesn't support vendorId, this will fail; fallback below
        const res = await api.get(`/api/products?${params.toString()}`, {
          validateStatus: () => true,
        });

        if (res.status >= 200 && res.status < 300) {
          setVendorProducts(safeArray(res.data?.data));
          return;
        }
      }

      // fallback: filter from currently loaded products (same type/subtype scope)
      const vp = safeArray(products).filter((p) => {
        const pv = p?.vendor;
        const idMatch =
          (vendorId && (pv?.id === vendorId || pv?.vendorId === vendorId || pv?._id === vendorId)) ||
          false;
        const nameMatch =
          pv?.vendorName && v?.vendorName && norm(pv.vendorName) === norm(v.vendorName);
        return idMatch || nameMatch;
      });

      setVendorProducts(vp);
    } catch {
      setVendorProducts([]);
    } finally {
      setVendorLoading(false);
    }
  };

  const backToProducts = () => {
    setView("products");
    setFocusedVendor(null);
    setVendorProducts([]);
    setVendorLoading(false);
  };

  // -----------------------
  // Boot
  // -----------------------
  useEffect(() => {
    fetchMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ensure default selection
  useEffect(() => {
    if (!mergedMenu.length) return;

    const exists = mergedMenu.some((m) => m.type === selectedType);
    if (exists) return;

    const pick = mergedMenu.find((m) => (m.total || 0) > 0) || mergedMenu[0];
    if (pick?.type) {
      setSelectedType(pick.type);
      setSelectedSubType(null);
      setOpenTypes(new Set([pick.type]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mergedMenu]);

  // load products when selection changes
  useEffect(() => {
    const run = async () => {
      if (!selectedType) return;
      setProductsLoading(true);
      try {
        const items = await fetchProducts({ type: selectedType, subType: selectedSubType });
        setProducts(items);
      } finally {
        setProductsLoading(false);
      }
    };

    // leaving vendor view when switching category to avoid stale vendor context
    if (view === "vendor") backToProducts();

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, selectedSubType]);

  // debounce search for smoother menu filtering
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => setSearchLive(search), 120);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [search]);

  // product search filter (includes type + subtype as required)
  const filteredProducts = useMemo(() => {
    const q = norm(searchLive);
    if (!q) return products;

    return safeArray(products).filter((p) => {
      const name = norm(p?.name);
      const type = norm(p?.type);
      const sub = norm(p?.subType);
      const vendorName = norm(p?.vendor?.vendorName);
      const desc = norm(p?.description);
      const addr = norm(p?.vendor?.address);
      const email = norm(p?.vendor?.email);
      const phone = norm(p?.vendor?.phoneNumber);
      const link = norm(p?.productLink);

      return (
        name.includes(q) ||
        type.includes(q) || // explicit requirement: filter type
        sub.includes(q) || // explicit requirement: filter subtype
        vendorName.includes(q) ||
        desc.includes(q) ||
        addr.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        link.includes(q)
      );
    });
  }, [products, searchLive]);

  // menu helpers
  const setTypeOpen = (type, open) => {
    setOpenTypes((prev) => {
      const next = new Set(prev);
      if (open) next.add(type);
      else next.delete(type);
      return next;
    });
  };

  const toggleOpen = (type) => {
    setOpenTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const chooseType = (type) => {
    setSelectedType(type);
    setSelectedSubType(null);
    setTypeOpen(type, true); // ensure open on click (fix)
    setMobileMenuOpen(false);
  };

  const chooseSubType = (type, subType) => {
    setSelectedType(type);
    setSelectedSubType(subType);
    setTypeOpen(type, true); // ensure open on click (fix)
    setMobileMenuOpen(false);
  };

  // -----------------------------------
  // UI small pieces
  // -----------------------------------
// Replace ONLY the Card component with this one.
// It shows: image, type/subtype, product name, vendor, description,
// price, address, and buttons: Vendor Details + View Link.

// 2) Modern clean card (NO heavy overlay boxes, smaller fonts, no overlap,
// supports long price like "10000-20000" without breaking UI).
// Replace your Card component with this.

// ✅ Swiggy-style inspiration card (no ADD button, no edit button)
// Layout: left details + right image (clean, modern, compact)
// Includes: type/subtype chips, product name, vendor, price (range-safe),
// address (1 line), description (2 lines), actions: Vendor Details + View Link

// Replace Card with this exact layout.
// Structure:
// 1) Top: Product Title
// 2) Price range
// 3) Light divider
// 4) Row: left details + right square image
// 5) Light divider
// 6) Bottom actions: View Link + View Vendor

const Card = ({ p }) => {
  const img =
    p?.imageUrl || p?.image || p?.vendor?.logoUrl || p?.vendor?.logo || null;

  const name = p?.name || "Unnamed Product";
  const vendorName = p?.vendor?.vendorName || "Vendor";
  const type = p?.type || "Type";
  const subType = p?.subType || null;

  const desc = p?.description || "No description provided.";
  const addr = p?.vendor?.address || "Address not provided";

  // Keep string so ranges like "10000-20000" show fully
  const priceTextRaw =
    p?.price === null || p?.price === undefined || p?.price === ""
      ? "On Request"
      : String(p.price);

  const priceText =
    priceTextRaw === "On Request"
      ? "On Request"
      : priceTextRaw.startsWith("₹")
      ? priceTextRaw
      : `₹${priceTextRaw}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#891737]/25 transition-all overflow-hidden">
      <div className="p-4">
        {/* TOP: Title */}
        <h3 className="text-[15px] sm:text-[16px] font-bold text-gray-900 leading-snug line-clamp-2">
          {name}
        </h3>

        {/* Price */}
        <p className="mt-1 text-[13px] font-semibold text-[#891737] truncate">
          {priceText}
        </p>

        {/* Divider */}
        <div className="mt-3 h-px bg-gray-100" />

        {/* Middle: details + image */}
        <div className="mt-3 flex gap-3 items-start">
          {/* LEFT details */}
          <div className="flex-1 min-w-0">
            {/* Type/Subtype */}
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-700">
                {type}
              </span>
              {subType ? (
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-700">
                  {subType}
                </span>
              ) : null}
            </div>

            {/* Vendor */}
            <p className="mt-2 text-[12px] font-semibold text-gray-700 truncate">
              {vendorName}
            </p>

            {/* Address */}
            <div className="mt-1 flex items-start gap-2 min-w-0">
              <FiMapPin className="w-4 h-4 text-gray-400 mt-[2px] shrink-0" />
              <p className="text-[12px] text-gray-600 leading-snug line-clamp-2">
                {addr}
              </p>
            </div>

            {/* Description */}
            <p className="mt-2 text-[12px] text-gray-600 leading-relaxed line-clamp-2">
              {desc}
            </p>
          </div>

          {/* RIGHT: Square image */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
            <img
              src={getImageUrl(img)}
              alt={name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="mt-4 h-px bg-gray-100" />

        {/* Bottom actions */}
        <div className="mt-3 flex items-center gap-2">
          {p?.productLink ? (
            <a
              href={p.productLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-800 transition"
            >
              View Link <FiExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gray-100 text-gray-400 text-xs font-semibold cursor-not-allowed"
            >
              View Link <FiExternalLink className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => openVendor(p?.vendor)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#891737] text-white text-xs font-semibold hover:opacity-95 transition"
          >
            <FiUser className="w-4 h-4 text-gray-500" />
            View Vendor
          </button>
        </div>
      </div>
    </div>
  );
};




  // -----------------------------------
  // Render
  // -----------------------------------
  return (
    <div className="w-full min-h-screen bg-[#FDFCFD] flex relative overflow-hidden">
      {/* backdrop */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#891737]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-[#891737]/3 rounded-full blur-[100px] pointer-events-none" />

      {/* close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[80] p-2 bg-white/90 backdrop-blur-md rounded-full text-gray-400 hover:text-[#891737] hover:bg-[#891737]/5 transition-all shadow-sm border border-gray-100/50"
        title="Close"
      >
        <FiX className="w-5 h-5" />
      </button>

      {/* MOBILE MENU DRAWER */}
      <div
        className={`fixed inset-0 z-[70] lg:hidden transition-all ${
          mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 bottom-0 w-[90%] max-w-sm bg-white shadow-2xl border-r border-gray-100 transition-transform ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-extrabold text-gray-900">Categories</p>
              <p className="text-[11px] text-gray-400">Type → Subtype</p>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-50 text-gray-500"
              title="Close menu"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search product/vendor/type/subtype..."
                className="w-full placeholder:text-gray-400 pl-9 pr-3 py-2.5 text-sm rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#891737] focus:ring-2 focus:ring-[#891737]/10 outline-none"
              />
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100vh-120px)] p-3">
            {menuLoading ? (
              <div className="px-2 py-6">
                <p className="text-xs text-gray-400">Loading menu...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {menuVisible.map((t) => {
                  const isOpen = openTypes.has(t.type);
                  const isSelected = selectedType === t.type;

                  return (
                    <div key={t.type} className="rounded-2xl border border-gray-100 overflow-hidden">
                      <div
                        className={`w-full px-3 py-3 flex items-center justify-between ${
                          isSelected ? "bg-[#891737]/10" : "bg-white"
                        }`}
                      >
                        <button
                          onClick={() => chooseType(t.type)}
                          className="min-w-0 text-left flex-1"
                          title={t.type}
                        >
                          <div
                            className={`text-sm font-bold truncate ${
                              isSelected ? "text-[#891737]" : "text-gray-800"
                            }`}
                          >
                            {t.type}
                          </div>
                        </button>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full border bg-gray-50 border-gray-100 text-gray-600">
                            {t.total || 0}
                          </span>
                          <button
                            onClick={() => toggleOpen(t.type)}
                            className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-500"
                            title={isOpen ? "Collapse" : "Expand"}
                          >
                            {isOpen ? <FiChevronDown /> : <FiChevronRight />}
                          </button>
                        </div>
                      </div>

                      {isOpen && (
                        <div className="px-3 pb-3 bg-white">
                          <div className="flex flex-wrap gap-2 pt-2">
                            <button
                              onClick={() => chooseType(t.type)}
                              className={`text-[12px] font-bold px-3 py-1.5 rounded-full border ${
                                isSelected && selectedSubType === null
                                  ? "bg-[#891737] text-white border-[#891737]"
                                  : "bg-white text-gray-700 border-gray-200"
                              }`}
                            >
                              All
                            </button>
                            {safeArray(t.subTypes).map((s) => {
                              const active = isSelected && selectedSubType === s.subType;
                              return (
                                <button
                                  key={`${t.type}-${s.subType}`}
                                  onClick={() => chooseSubType(t.type, s.subType)}
                                  className={`text-[12px] font-bold px-3 py-1.5 rounded-full border inline-flex items-center gap-2 ${
                                    active
                                      ? "bg-[#891737] text-white border-[#891737]"
                                      : "bg-white text-gray-700 border-gray-200"
                                  }`}
                                >
                                  <span className="truncate max-w-[180px]">{s.subType}</span>
                                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border bg-gray-50 border-gray-100 text-gray-600">
                                    {s.count || 0}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-80 border-r border-gray-100 bg-white/60 backdrop-blur-xl h-screen sticky top-0 flex-col z-40">
        <div className="p-4 border-b border-gray-100/60 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-extrabold text-gray-900">Product Registry</p>
              <p className="text-[11px] text-gray-400">Browse Products & Services</p>
            </div>
            <button
              onClick={fetchMenu}
              className="p-2 rounded-lg hover:bg-gray-50 text-gray-500"
              title="Refresh menu"
            >
              <FiRefreshCw className={`w-4 h-4 ${menuLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product/vendor/type/subtype..."
              className="w-full placeholder:text-gray-400 pl-9 pr-3 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-[#891737] focus:ring-2 focus:ring-[#891737]/10 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 mb-8 custom-scrollbar">
          {menuLoading ? (
            <div className="px-2 py-6">
              <p className="text-xs text-gray-400">Loading menu...</p>
            </div>
          ) : menuVisible.length === 0 ? (
            <div className="px-2 py-6">
              <p className="text-xs text-gray-400">No categories available.</p>
            </div>
          ) : (
            <div className="space-y-2 pb-6">
              {menuVisible.map((t) => {
                const isOpen = openTypes.has(t.type);
                const isSelected = selectedType === t.type;

                return (
                  <div key={t.type} className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
                    <div
                      className={`w-full px-3 py-2.5 flex items-center justify-between ${
                        isSelected ? "bg-[#891737]/10" : "hover:bg-gray-50"
                      }`}
                    >
                      <button
                        onClick={() => chooseType(t.type)}
                        className="min-w-0 text-left flex-1"
                        title={t.type}
                      >
                        <div
                          className={`text-xs font-extrabold truncate ${
                            isSelected ? "text-[#891737]" : "text-gray-800"
                          }`}
                        >
                          {t.type}
                        </div>
                      </button>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border bg-gray-50 border-gray-100 text-gray-600">
                          {t.total || 0}
                        </span>
                        <button
                          onClick={() => toggleOpen(t.type)}
                          className="p-1.5 rounded-lg hover:bg-white text-gray-500"
                          title={isOpen ? "Collapse" : "Expand"}
                        >
                          {isOpen ? (
                            <FiChevronDown className="w-4 h-4 text-gray-400" />
                          ) : (
                            <FiChevronRight className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="px-3 pb-3 bg-white">
                        <div className="flex flex-wrap gap-2 pt-2">
                          <button
                            onClick={() => chooseType(t.type)}
                            className={`text-[11px] font-bold px-2.5 py-1.5 rounded-full border ${
                              isSelected && selectedSubType === null
                                ? "bg-[#891737] text-white border-[#891737]"
                                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            All
                          </button>

                          {safeArray(t.subTypes).map((s) => {
                            const active = isSelected && selectedSubType === s.subType;
                            return (
                              <button
                                key={`${t.type}-${s.subType}`}
                                onClick={() => chooseSubType(t.type, s.subType)}
                                className={`text-[11px] font-bold px-2.5 py-1.5 rounded-full border inline-flex items-center gap-2 ${
                                  active
                                    ? "bg-[#891737] text-white border-[#891737]"
                                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                                }`}
                              >
                                <span className="truncate max-w-[140px]">{s.subType}</span>
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border bg-gray-50 border-gray-100 text-gray-600">
                                  {s.count || 0}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-gray-100/60 text-center">
          <p className="text-[10px] text-gray-400">
            {productsLoading ? "Loading..." : `${filteredProducts.length} Products`}
          </p>
        </div>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="flex-1 h-screen overflow-y-auto relative z-10 w-full">
        {/* Mobile top bar (improved) */}
        <div className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-gray-900 truncate">
                {view === "vendor" ? focusedVendor?.vendorName || "Vendor" : "Product Registry"}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {view === "vendor"
                  ? "Vendor details"
                  : `${selectedType || "Select a type"}${selectedSubType ? ` • ${selectedSubType}` : ""}`}
              </p>
            </div>

            {view === "vendor" ? (
              <button
                onClick={backToProducts}
                className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 text-xs font-extrabold text-gray-700"
              >
                Back
              </button>
            ) : (
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 text-xs font-extrabold text-gray-700"
              >
                Categories
              </button>
            )}
          </div>

          {/* Mobile search always visible */}
          <div className="mt-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search product/vendor/type/subtype..."
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-gray-50 border border-gray-100 focus:border-[#891737] focus:ring-2 focus:ring-[#891737]/10 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-full">
          {/* Desktop header */}
          <div className="hidden lg:flex items-end justify-between mb-8 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-extrabold text-gray-700 tracking-tight leading-none mb-2">
                {view === "vendor" ? "Vendor Details" : "Product Registry"}
              </h2>
              <p className="text-xs text-gray-400">
                {view === "vendor" ? (
                  <span className="font-semibold text-gray-600">
                    {focusedVendor?.vendorName || "Vendor"}
                  </span>
                ) : (
                  <>
                    Browse Products & Services{" "}
                    {selectedType ? (
                      <>
                        • <span className="font-semibold text-gray-600">{selectedType}</span>
                        {selectedSubType ? (
                          <>
                            {" "}
                            • <span className="font-semibold text-gray-600">{selectedSubType}</span>
                          </>
                        ) : null}
                      </>
                    ) : null}
                  </>
                )}
              </p>
            </div>

            <div className="text-right pr-10 md:pr-0">
              {view === "vendor" ? (
                <button
                  onClick={backToProducts}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-extrabold text-gray-800 transition"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Back to Products
                </button>
              ) : (
                <>
                  <p className="text-xs font-extrabold text-[#891737] uppercase tracking-wide">
                    {selectedSubType ? selectedSubType : selectedType || "Select a Type"}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {productsLoading ? "Loading..." : `${filteredProducts.length} Result(s)`}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* STATES / VIEWS */}
          {menuLoading || productsLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
              <div className="w-12 h-12 border-[3px] border-[#891737]/10 border-t-[#891737] rounded-full animate-spin" />
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                Loading...
              </p>
            </div>
          ) : view === "vendor" ? (
            <>
              {/* Vendor header card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 p-0.5 overflow-hidden">
                    <img
                      src={getImageUrl(
                        focusedVendor?.image ||
                          focusedVendor?.logoUrl ||
                          focusedVendor?.logo ||
                          focusedVendor?.vendorLogo
                      )}
                      alt={focusedVendor?.vendorName || "Vendor"}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl font-extrabold text-gray-900 truncate">
                      {focusedVendor?.vendorName || "Vendor"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {focusedVendor?.address || "Address not provided"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">
                      Email
                    </p>
                    <p className="text-sm font-semibold text-gray-900 break-all">
                      {focusedVendor?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">
                      Phone
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {focusedVendor?.phoneNumber || "N/A"}
                    </p>
                  </div>
                  {focusedVendor?.website ? (
                    <div>
                      <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">
                        Website
                      </p>
                      <a
                        href={focusedVendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-extrabold text-[#891737] hover:underline inline-flex items-center gap-1"
                      >
                        Visit <FiExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Vendor products */}
              <div className="mt-8">
                <div className="flex items-end justify-between mb-4">
                  <h3 className="text-lg font-extrabold text-gray-900">Products & Services</h3>
                  <p className="text-xs text-gray-400 font-semibold">
                    {vendorLoading ? "Loading..." : `${vendorProducts.length} item(s)`}
                  </p>
                </div>

                {vendorLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-white/60 rounded-3xl border border-gray-100/60">
                    <div className="w-10 h-10 border-[3px] border-[#891737]/10 border-t-[#891737] rounded-full animate-spin" />
                    <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                      Loading...
                    </p>
                  </div>
                ) : vendorProducts.length === 0 ? (
                  <div className="py-16 text-center bg-white/60 rounded-3xl border border-gray-100/60">
                    <FiPackage className="text-3xl text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-600 font-semibold text-sm">
                      No products listed for this vendor.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2  md:gap-6">
                    {vendorProducts.map((p) => (
                      <Card key={p.id || `${p?.name}-${p?.productLink || ""}`} p={p} />
                    ))}
                  </div>
                )}
              </div>

              <Disclaimer />
            </>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white/60 rounded-3xl border border-gray-100/60">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <FiPackage className="text-2xl text-gray-300" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-1">
                No products found
              </h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Try adjusting search or select a different type/subtype.
              </p>
            </div>
          ) : (
            <>
              {/* grid: improved mobile density */}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
  {filteredProducts.map((p) => (
    <Card key={p.id || `${p?.name}-${p?.productLink || ""}`} p={p} />
  ))}
</div>



              <Disclaimer />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductionAssets;
