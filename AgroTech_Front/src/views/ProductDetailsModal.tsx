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
    id_productos: number,
    name: string,
    price: string | number,
    image: string,
    quantity?: number
  ) => void;
};

// Misma URL del Marketplace
const apiUrl = import.meta.env.VITE_API;

// Misma función que ya funciona en Marketplace
const getImageUrl = (img: string) => {
  if (!img) {
    return "https://via.placeholder.com/250?text=Sin+Imagen";
  }

  // Si ya es una URL completa
  if (img.startsWith("http")) {
    return img;
  }

  // Convierte:
  // http://127.0.0.1:8000/api/  -> http://127.0.0.1:8000/
  // y agrega products/archivo.jpg
  return apiUrl.replace("api/", "") + `products/${img}`;
};

const ProductDetailsModal: React.FC<Props> = ({
  product,
  onClose,
  addToCart,
}) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <>
      {/* Fondo oscuro */}
      <div className="details-overlay" onClick={onClose}></div>

      {/* Modal */}
      <div className="premium-modal">
        {/* Botón cerrar */}
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="premium-content">
          {/* Imagen del producto */}
          <div className="image-section">
            <img
              className="main-image"
              src={getImageUrl(product.imagen)}
              alt={product.nombre}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://via.placeholder.com/250?text=Sin+Imagen";
              }}
            />
          </div>

          {/* Información */}
          <div className="info-section">
            <h1>{product.nombre}</h1>

            {/* Marca */}
            <div className="field">
              <span className="label">Marca</span>
              <p className="value">AgroTech</p>
            </div>

            {/* Precio */}
            <div className="field">
              <span className="label">Precio</span>
              <p className="price">
                ${Number(product.precio).toFixed(2)}{" "}
                {product.moneda || "MXN"}
              </p>
            </div>

            {/* Descripción */}
            <div className="field">
              <span className="label">Descripción</span>
              <p className="value">
                {product.descripcion || "Sin descripción disponible."}
              </p>
            </div>

            {/* Stock */}
            <div className="field">
              <span className="label">Stock disponible</span>
              <p className="value">{product.stock}</p>
            </div>

            {/* Fecha */}
            <div className="field">
              <span className="label">Fecha de publicación</span>
              <p className="value">{product.fecha_publicacion}</p>
            </div>

            {/* Estado */}
            <div className="field">
              <span className="label">Estado</span>
              <p className="value">{product.estado}</p>
            </div>

            {/* Cantidad */}
            <div className="field">
              <span className="label">Cantidad</span>

              <div className="quantity-selector">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((prev) => Math.max(prev - 1, 1))
                  }
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((prev) => prev + 1)
                  }
                >
                  +
                </button>
              </div>
            </div>

            {/* Botón agregar al carrito */}
            <button
              className="add-cart-btn"
              onClick={() => {
                addToCart(
                  product.id_productos,
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