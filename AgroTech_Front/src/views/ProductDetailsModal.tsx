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

const apiUrl = import.meta.env.VITE_API;

const getImageUrl = (img: string) => {
  if (!img) {
    return "https://via.placeholder.com/250?text=Sin+Imagen";
  }

  if (img.startsWith("http")) {
    return img;
  }

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
      <div className="details-overlay" onClick={onClose}></div>

      <div className="premium-modal">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="premium-content">
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

          <div className="info-section">
            <h1>{product.nombre}</h1>

            <div className="field">
              <span className="label">Marca</span>
              <p className="value">AgroTech</p>
            </div>

            <div className="field">
              <span className="label">Precio</span>
              <p className="price">
                ${Number(product.precio).toFixed(2)}{" "}
                {product.moneda || "MXN"}
              </p>
            </div>

            <div className="field">
              <span className="label">Descripción</span>
              <p className="value">
                {product.descripcion || "Sin descripción disponible."}
              </p>
            </div>

            <div className="field">
              <span className="label">Stock disponible</span>
              <p className="value">{product.stock}</p>
            </div>

            <div className="field">
              <span className="label">Fecha de publicación</span>
              <p className="value">{product.fecha_publicacion}</p>
            </div>

            <div className="field">
              <span className="label">Estado</span>
              <p className="value">{product.estado}</p>
            </div>

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