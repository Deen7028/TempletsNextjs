'use client';

import React, { useEffect, useState } from 'react';
import { ProductSearchContainer, useCart } from '@/modules/purchasing';
import { IProduct, productService } from '@/modules/products';
import { Box, Alert, Snackbar } from '@mui/material';
import { LogoLoader } from '@/shared/components';

export const ProcurementContainer: React.FC = () => {
  const [lstProducts, setLstProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nPage, setNPage] = useState<number>(0);
  const [nRowsPerPage, setNRowsPerPage] = useState<number>(10);
  const [nTotalProducts, setNTotalProducts] = useState<number>(0);
  const [sSearch, setSSearch] = useState<string>('');
  const [sNotification, setSNotification] = useState<string>('');

  const { cartItems, addToCart, updateCartQty, removeFromCart } = useCart();

  const loadProducts = async (search: string = sSearch, page: number = nPage, pageSize: number = nRowsPerPage) => {
    setIsLoading(true);
    try {
      const res = await productService.getProducts(search, page + 1, pageSize);
      setLstProducts(res.data);
      setNTotalProducts(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(sSearch, nPage, nRowsPerPage);
  }, [sSearch, nPage, nRowsPerPage]);

  // เพิ่มสินค้าเข้าตะกร้า
  const handleAddToCart = (objProduct: IProduct, nQuantity: number) => {
    addToCart(objProduct, nQuantity);
    setSNotification(`เพิ่ม ${objProduct.sProductName} (${nQuantity} ${objProduct.sUnit}) เข้าตะกร้าแล้ว`);
  };

  if (isLoading && lstProducts.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <LogoLoader sMessage="กำลังโหลดสินค้า..." />
      </Box>
    );
  }

  return (
    <Box>
      <ProductSearchContainer
        lstProducts={lstProducts}
        cartItems={cartItems}
        nPage={nPage}
        nRowsPerPage={nRowsPerPage}
        nTotalProducts={nTotalProducts}
        sSearch={sSearch}
        onSearchChange={(val) => {
          setSSearch(val);
          setNPage(0);
        }}
        onPageChange={(newPage) => setNPage(newPage)}
        onRowsPerPageChange={(newSize) => {
          setNRowsPerPage(newSize);
          setNPage(0);
        }}
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
