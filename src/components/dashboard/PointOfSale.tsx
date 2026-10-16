import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Product, CartItem, Sale } from '../../types.ts';
import { calculateCartTotals, calculateChangeDue } from '../../utils/businessLogic.ts';
import { 
  Barcode, 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  PauseCircle, 
  PlayCircle, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Printer, 
  X, 
  CheckCircle2, 
  Tag, 
  UserPlus, 
  Percent, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';

export const PointOfSale: React.FC = () => {
  const {
    products,
    categories,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    globalDiscountPercent,
    setGlobalDiscountPercent,
    selectedCustomer,
    setSelectedCustomer,
    customers,
    heldCarts,
    holdCurrentCart,
    restoreHeldCart,
    deleteHeldCart,
    completeCheckout,
    currentUser,
    currentBranch,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [barcodeInput, setBarcodeInput] = useState('');
  
  // Modals & Panels
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'digital_wallet'>('cash');
  const [amountTendered, setAmountTendered] = useState<string>('');
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [heldCartsModalOpen, setHeldCartsModalOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [discountInput, setDiscountInput] = useState<string>('0');

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Cart totals calculation
  const cartCalculationItems = cart.map((c) => ({
    price: c.product.sellingPrice,
    quantity: c.quantity,
    discountPercent: c.discountPercent,
  }));
  const totals = calculateCartTotals(cartCalculationItems, globalDiscountPercent, 0.08875);
  const changeDue = calculateChangeDue(Number(amountTendered) || 0, totals.grandTotal);

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesQuery =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);
    return matchesCat && matchesQuery && p.status === 'active';
  });

  // Handle barcode scanner input
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    const found = products.find((p) => p.barcode === barcodeInput.trim() || p.sku.toLowerCase() === barcodeInput.trim().toLowerCase());
    if (found) {
      if (found.stock <= 0) {
        showToast(`Warning: "${found.name}" is out of stock!`);
      }
      addToCart(found);
      setBarcodeInput('');
    } else {
      showToast(`No product matched barcode "${barcodeInput}"`);
    }
  };

  const simulateQuickBarcode = (barcode: string) => {
    const prod = products.find((p) => p.barcode === barcode);
    if (prod) {
      addToCart(prod);
      showToast(`Scanned: ${prod.name}`);
    }
  };

  const handleOpenCheckout = () => {
    if (cart.length === 0) {
      showToast('Cart is empty.');
      return;
    }
    setAmountTendered(totals.grandTotal.toFixed(2));
    setCheckoutModalOpen(true);
  };

  const handleFinalizePayment = () => {
    const tendered = Number(amountTendered) || totals.grandTotal;
    if (paymentMethod === 'cash' && tendered < totals.grandTotal) {
      showToast('Amount tendered is less than order grand total.');
      return;
    }

    const sale = completeCheckout({
      method: paymentMethod,
      amountTendered: tendered,
      reference: paymentMethod === 'card' ? `AUTH_${Math.floor(100000 + Math.random() * 900000)}` : undefined,
    });

    setCompletedSale(sale);
    setCheckoutModalOpen(false);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4">
      
      {/* Left 65%: Product Catalog & Scanner */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        
        {/* Top Search & Barcode Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
          
          {/* Barcode scanner input */}
          <form onSubmit={handleBarcodeSubmit} className="w-full sm:w-72 flex items-center gap-1.5 relative">
            <div className="relative flex-1">
              <Barcode className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={barcodeInputRef}
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Scan or enter barcode..."
                className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Scan
            </button>
          </form>

          {/* Product search input */}
          <div className="w-full sm:flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items by name or SKU..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Quick barcode test shortcuts */}
          <div className="hidden xl:flex items-center gap-1 text-[11px] text-slate-400">
            <span>Fast test:</span>
            <button 
              type="button" 
              onClick={() => simulateQuickBarcode('890123456701')} 
              className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-mono text-[10px]"
            >
              #Audio
            </button>
            <button 
              type="button" 
              onClick={() => simulateQuickBarcode('890123456704')} 
              className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-mono text-[10px]"
            >
              #Coffee
            </button>
          </div>

        </div>

        {/* Category Pills Filter */}
        <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All Items ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
              <Search className="w-8 h-8 mb-2 opacity-50" />
              <p>No products matched your search or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((p) => {
                const isOutOfStock = p.stock <= 0;
                const isLowStock = p.stock <= p.minStockAlert;
                return (
                  <div
                    key={p.id}
                    onClick={() => !isOutOfStock && addToCart(p)}
                    className={`p-3 rounded-xl border transition-all flex flex-col justify-between select-none ${
                      isOutOfStock
                        ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                        : 'bg-white dark:bg-slate-800/70 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 cursor-pointer shadow-sm hover:scale-[1.01]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-mono">{p.sku}</span>
                        <span className={`font-bold px-1.5 py-0.2 rounded ${
                          isOutOfStock
                            ? 'bg-rose-100 text-rose-700'
                            : isLowStock
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {p.stock} in stock
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                        {p.name}
                      </h4>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                        ${p.sellingPrice.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        disabled={isOutOfStock}
                        className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Right 35%: Shopping Cart & Checkout Drawer */}
      <div className="w-full lg:w-96 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        
        {/* Cart Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Active Register Cart</h3>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {heldCarts.length > 0 && (
              <button
                type="button"
                onClick={() => setHeldCartsModalOpen(true)}
                className="px-2 py-1 rounded-lg bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1"
                title="View Held Carts"
              >
                <PlayCircle className="w-3 h-3" />
                <span>{heldCarts.length} Held</span>
              </button>
            )}

            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                title="Clear Cart"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Customer Badge Selector */}
        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs bg-slate-50/30 dark:bg-slate-900">
          {selectedCustomer ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedCustomer.name}</span>
                <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-bold">
                  {selectedCustomer.loyaltyTier} ({selectedCustomer.loyaltyPoints} pts)
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedCustomer(null)}
                className="text-[10px] text-rose-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setCustomerModalOpen(true)}
              className="text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 text-xs font-medium py-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Attach Customer (Loyalty & VIP)</span>
            </button>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2.5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-6">
              <ShoppingCart className="w-12 h-12 mb-3 opacity-30 text-indigo-400" />
              <p className="font-semibold text-slate-600 dark:text-slate-300">Cart is empty</p>
              <p className="mt-1 text-[11px]">Scan an item barcode or click any product card on the left to start checkout.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    {item.product.name}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    ${item.product.sellingPrice.toFixed(2)} each
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    className="p-1 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-bold w-5 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    className="p-1 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Item Total */}
                <div className="text-right min-w-[55px]">
                  <div className="font-extrabold text-slate-900 dark:text-white">
                    ${(item.product.sellingPrice * item.quantity).toFixed(2)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cart Totals & Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 space-y-3">
          
          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Subtotal ({totals.itemCount} items)</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setDiscountModalOpen(true)}
                className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Percent className="w-3 h-3" />
                <span>Discount {globalDiscountPercent > 0 ? `(${globalDiscountPercent}%)` : ''}</span>
              </button>
              <span className={totals.discountTotal > 0 ? 'text-emerald-600 font-bold' : ''}>
                -${totals.discountTotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Sales Tax (NYC 8.875%)</span>
              <span>${totals.taxTotal.toFixed(2)}</span>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Total Due</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                ${totals.grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons: Hold & Checkout */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={() => holdCurrentCart()}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <PauseCircle className="w-4 h-4 text-amber-500" />
              <span>Park Cart</span>
            </button>

            <button
              type="button"
              disabled={cart.length === 0}
              onClick={handleOpenCheckout}
              className="flex-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Charge ${totals.grandTotal.toFixed(2)}</span>
            </button>
          </div>

        </div>

      </div>

      {/* CHECKOUT MODAL */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Finalize Transaction</h3>
                <p className="text-xs text-slate-500">Terminal Register 02 • {currentBranch.name}</p>
              </div>
              <button type="button" onClick={() => setCheckoutModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 text-center">
                <div className="text-xs text-slate-500">Total Payable Amount</div>
                <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                  ${totals.grandTotal.toFixed(2)}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1 text-xs font-semibold transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  <span>Cash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1 text-xs font-semibold transition-all ${
                    paymentMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('digital_wallet')}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1 text-xs font-semibold transition-all ${
                    paymentMethod === 'digital_wallet'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span>Digital / Apple</span>
                </button>
              </div>

              {/* Cash tendered inputs */}
              {paymentMethod === 'cash' && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Cash Tendered
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={amountTendered}
                        onChange={(e) => setAmountTendered(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-base font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Quick bill buttons */}
                  <div className="flex gap-2">
                    {[20, 50, 100].map((bill) => (
                      <button
                        key={bill}
                        type="button"
                        onClick={() => setAmountTendered(bill.toString())}
                        className="flex-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        ${bill}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setAmountTendered(totals.grandTotal.toFixed(2))}
                      className="flex-1 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold"
                    >
                      Exact
                    </button>
                  </div>

                  {/* Change due pill */}
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600 dark:text-slate-400">Change Due to Customer:</span>
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                      ${changeDue.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center text-xs text-slate-500 space-y-2">
                  <CreditCard className="w-8 h-8 mx-auto text-indigo-500" />
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Terminal Ready</p>
                  <p>Customer taps or inserts EMV chip card into connected reader.</p>
                </div>
              )}

              {/* Complete button */}
              <button
                type="button"
                onClick={handleFinalizePayment}
                className="mt-6 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Sale & Issue Receipt</span>
              </button>

            </div>
          </div>
        </div>
      )}

      {/* COMPLETED THERMAL RECEIPT MODAL */}
      {completedSale && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-xs text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Transaction Successful
              </span>
              <button type="button" onClick={() => setCompletedSale(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Thermal Receipt Box */}
            <div id="printable-receipt" className="mt-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 font-mono text-[11px] text-slate-800 dark:text-slate-200 space-y-2">
              <div className="text-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="font-bold text-sm">APEX RETAIL ENTERPRISES</div>
                <div className="text-[10px] text-slate-500">{currentBranch.name}</div>
                <div className="text-[10px] text-slate-500">{currentBranch.address}</div>
                <div className="text-[10px] text-slate-500">{currentBranch.phone}</div>
              </div>

              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Receipt: {completedSale.receiptNumber}</span>
                <span>{completedSale.timestamp.slice(11, 16)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Cashier: {completedSale.cashierName}</span>
                <span>Date: {completedSale.timestamp.slice(0, 10)}</span>
              </div>

              {/* Items */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                {completedSale.items.map((it) => (
                  <div key={it.productId} className="flex justify-between">
                    <span className="truncate max-w-[170px]">{it.quantity}x {it.productName}</span>
                    <span>${it.totalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1 text-right">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${completedSale.subtotal.toFixed(2)}</span>
                </div>
                {completedSale.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span>-${completedSale.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${completedSale.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xs pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span>TOTAL:</span>
                  <span>${completedSale.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500">
                <div className="flex justify-between">
                  <span>Payment: {completedSale.payment.method.toUpperCase()}</span>
                  <span>Tendered: ${completedSale.payment.amountTendered.toFixed(2)}</span>
                </div>
                {completedSale.payment.changeDue > 0 && (
                  <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                    <span>Change:</span>
                    <span>${completedSale.payment.changeDue.toFixed(2)}</span>
                  </div>
                )}
                {completedSale.payment.referenceNumber && (
                  <div>Ref: {completedSale.payment.referenceNumber}</div>
                )}
              </div>

              <div className="text-center pt-3 text-[10px] text-slate-400">
                <p>Thank you for shopping with us!</p>
                <p className="mt-1 font-mono tracking-widest">||||| | |||| ||| ||||||</p>
              </div>
            </div>

            {/* Receipt Modal Actions */}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => setCompletedSale(null)}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
              >
                New Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HELD CARTS MODAL */}
      {heldCartsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Suspended / Held Carts</h3>
              <button type="button" onClick={() => setHeldCartsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5 max-h-80 overflow-y-auto">
              {heldCarts.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No held carts.</p>
              ) : (
                heldCarts.map((h) => (
                  <div key={h.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{h.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {h.items.length} items • Held at {h.timestamp}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          restoreHeldCart(h.id);
                          setHeldCartsModalOpen(false);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white text-[11px] font-semibold"
                      >
                        Resume
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteHeldCart(h.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* CUSTOMER SELECTOR MODAL */}
      {customerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Attach Customer Account</h3>
              <button type="button" onClick={() => setCustomerModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {customers.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCustomer(c);
                    setCustomerModalOpen(false);
                    showToast(`Attached customer: ${c.name}`);
                  }}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 cursor-pointer flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                    <div className="text-[10px] text-slate-400">{c.email} • {c.phone}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                    {c.loyaltyTier}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ORDER DISCOUNT MODAL */}
      {discountModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xs w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scale-in">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Apply Order Discount</h3>
            <p className="text-xs text-slate-400 mt-1">Discounts &gt; 25% trigger AI fraud review.</p>

            <div className="mt-4">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(e.target.value)}
                  className="w-full px-3 py-2 text-base font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center"
                />
                <span className="font-bold">%</span>
              </div>

              {Number(discountInput) >= 50 && (
                <div className="mt-2 text-[10px] text-rose-600 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Extreme discount! Will trigger critical fraud alert.</span>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setDiscountModalOpen(false)}
                  className="flex-1 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const pct = Math.min(100, Math.max(0, Number(discountInput) || 0));
                    setGlobalDiscountPercent(pct);
                    setDiscountModalOpen(false);
                    showToast(`Discount of ${pct}% applied.`);
                  }}
                  className="flex-1 py-2 rounded-xl text-xs bg-indigo-600 text-white font-semibold"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
