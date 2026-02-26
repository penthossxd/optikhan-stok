"use client";
import { useState, useEffect, useMemo } from "react";

export default function Home() {
  const [isLogged, setIsLogged] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({
    name: "",
    buyPrice: "",
    sellPrice: "",
    quantity: "",
  });
  const [saleQty, setSaleQty] = useState("");

  const APP_PASSWORD = "optik123";

  useEffect(() => {
    const savedProducts = localStorage.getItem("products");
    const savedSales = localStorage.getItem("sales");
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedSales) setSales(JSON.parse(savedSales));
  }, []);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales]);

  const handleLogin = () => {
    if (password === APP_PASSWORD) setIsLogged(true);
    else alert("Şifre yanlış");
  };

  const handleAddProduct = () => {
    if (!form.name || !form.buyPrice || !form.sellPrice || !form.quantity)
      return;

    const newProduct = {
      id: Date.now(),
      name: form.name,
      buyPrice: parseFloat(form.buyPrice),
      sellPrice: parseFloat(form.sellPrice),
      quantity: parseInt(form.quantity),
    };

    setProducts([...products, newProduct]);
    setForm({ name: "", buyPrice: "", sellPrice: "", quantity: "" });
  };

  const handleSale = (product) => {
    const qty = parseInt(saleQty);
    if (!qty || qty <= 0 || qty > product.quantity) {
      alert("Geçersiz adet");
      return;
    }

    const updatedProducts = products.map((p) =>
      p.id === product.id ? { ...p, quantity: p.quantity - qty } : p
    );

    const newSale = {
      id: Date.now(),
      profit: (product.sellPrice - product.buyPrice) * qty,
      date: new Date().toISOString(),
    };

    setProducts(updatedProducts);
    setSales([...sales, newSale]);
    setSaleQty("");
  };

  const totalStockValue = useMemo(() => {
    return products.reduce(
      (acc, p) => acc + p.buyPrice * p.quantity,
      0
    );
  }, [products]);

  const totalProfit = useMemo(() => {
    return sales.reduce((acc, s) => acc + s.profit, 0);
  }, [sales]);

  if (!isLogged)
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <h2>Optik Han Stok Giriş</h2>
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleLogin} style={styles.button}>
            Giriş Yap
          </button>
        </div>
      </div>
    );

  return (
    <div style={styles.container}>
      <h1>Optik Han Stok & Kar Takip</h1>

      <div style={styles.summary}>
        <div style={styles.box}>
          <h3>Toplam Stok Değeri</h3>
          <p>{totalStockValue.toFixed(2)} ₺</p>
        </div>
        <div style={styles.box}>
          <h3>Toplam Net Kar</h3>
          <p>{totalProfit.toFixed(2)} ₺</p>
        </div>
      </div>

      <h2>Ürün Ekle</h2>
      <div style={styles.form}>
        <input
          placeholder="Ürün"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Alış"
          value={form.buyPrice}
          onChange={(e) => setForm({ ...form, buyPrice: e.target.value })}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Satış"
          value={form.sellPrice}
          onChange={(e) => setForm({ ...form, sellPrice: e.target.value })}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Stok"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          style={styles.input}
        />
        <button onClick={handleAddProduct} style={styles.button}>
          Ekle
        </button>
      </div>

      <h2>Ürünler</h2>
      {products.map((p) => (
        <div key={p.id} style={styles.product}>
          <div>
            {p.name} | Stok: {p.quantity} | Alış: {p.buyPrice} | Satış: {p.sellPrice}
          </div>
          <div>
            <input
              type="number"
              placeholder="Adet"
              value={saleQty}
              onChange={(e) => setSaleQty(e.target.value)}
              style={{ ...styles.input, width: "80px" }}
            />
            <button onClick={() => handleSale(p)} style={styles.button}>
              Sat
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    padding: 40,
    fontFamily: "Arial",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  card: {
    padding: 30,
    border: "1px solid #ddd",
    borderRadius: 10,
  },
  input: {
    margin: 5,
    padding: 8,
  },
  button: {
    padding: 8,
    margin: 5,
    cursor: "pointer",
  },
  summary: {
    display: "flex",
    gap: 20,
    marginBottom: 20,
  },
  box: {
    border: "1px solid #ddd",
    padding: 15,
    borderRadius: 8,
  },
  form: {
    marginBottom: 30,
  },
  product: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #ddd",
    padding: 10,
  },
};
