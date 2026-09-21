'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IProduct } from '@/modules/products';
import { ICartItem } from '../interfaces/IPurchasing';
export type { ICartItem };

interface ICartContext {
  cartItems: ICartItem[];
  addToCart: (objProduct: IProduct, nQuantity: number) => void;
  updateCartQty: (nProductId: number, nQuantity: number) => void;
  removeFromCart: (nProductId: number) => void;
  clearCart: () => void;
  nTotalItems: number;
}

const CartContext = createContext<ICartContext>({
  cartItems: [],
  addToCart: () => {},
  updateCartQty: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  nTotalItems: 0,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);

  // โหลดข้อมูลตะกร้าจาก localStorage ตอนเริ่มต้น
  useEffect(() => {
    try {
      const sSaved = localStorage.getItem('pr_cart');
      if (sSaved) {
        setCartItems(JSON.parse(sSaved));
      }
    } catch {
      // ignore
    }
  }, []);

  // บันทึกลง localStorage เมื่อตะกร้าเปลี่ยน
  const saveCart = (items: ICartItem[]) => {
    setCartItems(items);
    try {
      localStorage.setItem('pr_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  };

  const addToCart = (objProduct: IProduct, nQuantity: number) => {
    setCartItems((prev) => {
      const nIndex = prev.findIndex((item) => item.objProduct.nProductId === objProduct.nProductId);
      let updated: ICartItem[];
      if (nIndex > -1) {
        updated = [...prev];
        updated[nIndex] = {
          ...updated[nIndex],
          nQuantity: updated[nIndex].nQuantity + nQuantity,
        };
      } else {
        updated = [...prev, { objProduct, nQuantity }];
      }
      try {
        localStorage.setItem('pr_cart', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const updateCartQty = (nProductId: number, nQuantity: number) => {
    if (nQuantity <= 0) {
      removeFromCart(nProductId);
      return;
    }
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.objProduct.nProductId === nProductId ? { ...item, nQuantity } : item
      );
      try {
        localStorage.setItem('pr_cart', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const removeFromCart = (nProductId: number) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.objProduct.nProductId !== nProductId);
      try {
        localStorage.setItem('pr_cart', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const clearCart = () => {
    saveCart([]);
  };

  const nTotalItems = cartItems.reduce((acc, curr) => acc + curr.nQuantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        nTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
