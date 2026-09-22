'use client';

import React, { useEffect, useState } from 'react';
import { ProductSearchContainer, useCart } from '@/modules/purchasing';
import { IProduct, productService } from '@/modules/products';
import { Box, CircularProgress, Alert, Snackbar } from '@mui/material';

export const ProcurementContainer: React.FC = () => {
  const [lstProducts, setLstProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sNotification, setSNotification] = useState<string>('');

  const { cartItems, addToCart, updateCartQty, removeFromCart } = useCart();

  useEffect(() => {
    productService.getProducts().then((data) => {
      setLstProducts(data);
      setIsLoading(false);
    });
  }, []);

  // เพิ่มสินค้าเข้าตะกร้า
  const handleAddToCart = (objProduct: IProduct, nQuantity: number) => {
    addToCart(objProduct, nQuantity);
    setSNotification(`เพิ่ม ${objProduct.sProductName} (${nQuantity} ${objProduct.sUnit}) เข้าตะกร้าแล้ว`);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <ProductSearchContainer
        lstProducts={lstProducts}
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onUpdateCartQty={updateCartQty}
        onRemoveFromCart={removeFromCart}
      />

      {/* แจ้งเตือนเมื่อเพิ่มสินค้าลงตะกร้า */}
      <Snackbar
        open={!!sNotification}
        autoHideDuration={2500}
        onClose={() => setSNotification('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSNotification('')} severity="success" sx={{ width: '100%', borderRadius: 2 }}>
          {sNotification}
        </Alert>
      </Snackbar>
    </Box>
  );
};
