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
  addToCart: (
    name: string,
    price: string | number,
    image: string,
    quantity?: number
  ) => void;
};

const getImageUrl = (img: string) => {
  if (!img) return "https://via.placeholder.com/250?text=Sin+Imagen";
  if (img.startsWith("http")) return img;
  return `http://127.0.0.1:8000/products/${img}`;
};

const ProductDetailsModal: React.FC<Props> = ({
  product,
  onClose,
  addToCart,
}) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <>
      <div className="details-overlay" onClick={onClose}></div>

      <div className="premium-modal">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="premium-content">
          {/* IMAGEN */}
          <div className="image-section">
            <img
              className="main-image"
              src={getImageUrl(product.imagen)}
              alt={product.nombre}
            />
          </div>

          <div className="info-section">
            <h1>{product.nombre}</h1>

            {/* MARCA */}
            <div className="field">
              <span className="label">Marca</span>
              <p className="value">AgroTech</p>
            </div>

            {/* PRECIO */}
            <div className="field">
              <span className="label">Precio</span>
              <p className="price">
                ${Number(product.precio).toFixed(2)} {product.moneda}
              </p>
            </div>

            {/* DESCRIPCIÓN */}
            <div className="field">
              <span className="label">Descripción</span>
              <p className="value">{product.descripcion}</p>
            </div>

            {/* STOCK */}
            <div className="field">
              <span className="label">Stock disponible</span>
              <p className="value">{product.stock}</p>
            </div>

            {/* FECHA */}
            <div className="field">
              <span className="label">Fecha de publicación</span>
              <p className="value">{product.fecha_publicacion}</p>
            </div>

            {/* ESTADO */}
            <div className="field">
              <span className="label">Estado</span>
              <p className="value">{product.estado}</p>
            </div>

            {/* CANTIDAD */}
            <div className="field">
              <span className="label">Cantidad</span>
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(quantity - 1, 1))}>
                  −
                </button>

                <span>{quantity}</span>

                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* BOTÓN */}
            <button
              className="add-cart-btn"
              onClick={() => {
                addToCart(
                  product.nombre,
                  product.precio,
                  product.imagen,
                  quantity
                );
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