import React, { useState } from "react";

type Producto = {
  id_productos: number;
  nombre: string;
  descripcion: string;
  precio: string;
  moneda: string;
  stock: number;
  imagen: string;
  id_usuario: number;
  id_categoria: number;
  fecha_publicacion: string;
  estado: string;
};

type Props = {
  product: Producto;
  onClose: () => void;
  addToCart: (name: string, price: string | number, image: string, quantity?: number) => void;
};

const ProductDetailsModal: React.FC<Props> = ({ product, onClose, addToCart }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <>
      <div className="details-overlay" onClick={onClose}></div>
      <div className="premium-modal">
        <button className="close-btn" onClick={onClose}>✕</button>
        <div className="premium-content">
          <div className="image-section">
            <img
              className="main-image"
              src={
                product.imagen
                  ? `http://localhost:8000/storage/images/${product.imagen}`
                  : "https://via.placeholder.com/250?text=Sin+Imagen"
              }
              alt={product.nombre}
            />
          </div>
          <div className="info-section">
            <h1>{product.nombre}</h1>
            <p className="brand">AgroTech</p>
            <div className="price">${parseFloat(product.precio as any).toFixed(2)} MXN</div>
            <p className="description">{product.descripcion}</p>
            <div>Stock disponible: {product.stock}</div>
            <div>Fecha de llegada: {product.fecha_publicacion}</div>

            <div className="quantity-selector">
              <button onClick={() => setQuantity(Math.max(quantity - 1, 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>

            <button
              className="add-cart-btn"
              onClick={() => {
                addToCart(product.nombre, product.precio, product.imagen, quantity);
                onClose();
              }}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsModal;