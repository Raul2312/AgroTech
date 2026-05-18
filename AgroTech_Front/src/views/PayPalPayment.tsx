import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';

const PayPalPayment: React.FC = () => {
  // Obtenemos el monto desde la ruta /checkout/:amount
  const { amount } = useParams<{ amount: string }>();
  const navigate = useNavigate();

  // NUEVO: Estado para alternar entre botones de PayPal y pantalla de éxito
  const [isSuccess, setIsSuccess] = useState(false);

  // Obtenemos las configuraciones necesarias
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const apiURl = import.meta.env.VITE_API;

  const sessionStr = localStorage.getItem("agroSession") || sessionStorage.getItem("agroSession");
  const sessionData = sessionStr ? JSON.parse(sessionStr) : null;
  const userData = sessionData?.user || sessionData?.usuario;

  // FUNCIÓN PARA REGISTRAR EN TU BASE DE DATOS
  const registrarCompraEnBD = async (orderID: string) => {
    try {
      const cart = JSON.parse(localStorage.getItem("agroCart") || "[]");
      if (cart.length === 0) return;

      const item = cart[0]; 

      const payload = {
        id_transaccion: orderID,
        id_producto: item.id, 
        id_vendedor: item.id_usuario || item.id_vendedor,
        id_comprador: 10, // Tu ID de usuario
        total: amount,
        iva: 0
      };

      await axios.post(`${apiURl}compras`, payload, {
        headers: { 
          'Authorization': `Bearer ${sessionData.token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log("Registro guardado en Laravel");
    } catch (error: any) {
      console.error("Error al registrar en BD:", error.response?.data || error.message);
    }
  };

  const containerStyle: React.CSSProperties = {
    margin: 0,
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    boxSizing: 'border-box',
  };

  const buttonWrapperStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '400px',
    background: 'white',
    padding: '30px',
    borderRadius: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    textAlign: 'center'
  };

  useEffect(() => {
    console.log(sessionData?.token);
  }, []);

  // LÓGICA DE RENDERIZADO CONDICIONAL
  return (
    <div style={containerStyle}>
      <div style={buttonWrapperStyle}>
        {isSuccess ? (
          /* VISTA DE PAGO EXITOSO */
          <>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
            <h2 style={{ color: '#059669', marginBottom: '10px' }}>¡Pago Exitoso!</h2>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>
              Tu transacción de <strong>${amount} MXN</strong> se completó correctamente.
            </p>
            <button 
              onClick={() => navigate('/mis-pedidos')}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Ver mis pedidos
            </button>
          </>
        ) : (
          /* VISTA ORIGINAL DE PAGO */
          <>
            <h2 style={{ color: '#0f172a', marginBottom: '10px' }}>Finalizar Compra</h2>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>Total a pagar: <strong>${amount} MXN</strong></p>

            <PayPalScriptProvider options={{ 
              clientId: clientId, 
              currency: "MXN",
              components: "buttons"
            }}>
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={async () => {
                  try {
                    const resRanchos = await axios.post(apiURl + "paypal/create-order", { amount: amount },
                      {
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionData.token}` }
                      }
                    );
                    const orderData = resRanchos.data;

                    if (orderData.id) {
                      return orderData.id;
                    } else {
                      throw new Error("Error al crear orden");
                    }
                  } catch (error: any) {
                    console.error(error);
                    alert(`Error al crear la orden: ${error.message}`);
                    throw error;
                  }
                }}
                onApprove={async (data, actions) => {
                  try {
                    const response = await fetch(apiURl + "paypal/capture-order", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${sessionData.token}`,
                      },
                      body: JSON.stringify({ orderID: data.orderID })
                    });

                    const orderData = await response.json();

                    if (orderData.status === 'COMPLETED') {
                      
                      // 1. Guardamos en la base de datos ANTES de borrar el carrito
                      await registrarCompraEnBD(data.orderID); 
                      
                      // Resguardar datos del carrito en localStorage para visualización inmediata en MisPedidos
                      const cart = JSON.parse(localStorage.getItem("agroCart") || "[]");
                      const productName = cart.length > 0 ? cart[0].name : "Producto Marketplace";
                      
                      const nuevoPedidoLocal = {
                        id_pedido: data.orderID, // Guardamos el hash/string devuelto por PayPal
                        producto_nombre: productName,
                        estado: "Completado", // MODIFICADO: De "Procesando" a "Completado"
                        fecha: new Date().toLocaleDateString('es-MX'),
                        monto: amount // NUEVO: Añadimos el monto dinámico de la compra
                      };
                      
                      const localesExistentes = JSON.parse(localStorage.getItem("agroPedidosRecientes") || "[]");
                      localStorage.setItem("agroPedidosRecientes", JSON.stringify([nuevoPedidoLocal, ...localesExistentes]));

                      // 2. Borramos el carrito del LocalStorage
                      localStorage.removeItem("agroCart");
                      
                      // 3. Cambiamos el estado para mostrar la pantalla de éxito
                      setIsSuccess(true);
                      
                    } else {
                      throw new Error('El pago no pudo ser completado');
                    }
                  } catch (error: any) {
                    console.error(error);
                    alert(`Error al capturar el pago: ${error.message}`);
                  }
                }}
                onError={(err) => {
                  console.error('PayPal Error:', err);
                  alert('Error al procesar el pago con PayPal');
                }}
                onCancel={(data) => {
                  alert('Pago cancelado por el usuario');
                }}
              />
            </PayPalScriptProvider>
          </>
        )}
      </div>
    </div>
  );
};

export default PayPalPayment;