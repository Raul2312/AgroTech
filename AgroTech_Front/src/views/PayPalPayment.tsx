import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom'; // 🔥 Necesario para leer el monto de la URL
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Link, useNavigate } from "react-router-dom"; 
import axios from 'axios';
const PayPalPayment: React.FC = () => {
  // Obtenemos el monto desde la ruta /checkout/:amount
  const { amount } = useParams<{ amount: string }>();
    const navigate = useNavigate();
  // Obtenemos las configuraciones necesarias
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  const apiURl= import.meta.env.VITE_API

 const sessionStr = localStorage.getItem("agroSession") || sessionStorage.getItem("agroSession");
  const sessionData = sessionStr ? JSON.parse(sessionStr) : null;
  const userData = sessionData?.user || sessionData?.usuario;


  const containerStyle: React.CSSProperties = {
    margin: 0,
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafc', // Un fondo ligero para que luzca como pantalla
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
       console.log( sessionData.token)

   
    }, []);
  

  return (
    <div style={containerStyle}>
      <div style={buttonWrapperStyle}>
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
                /*const response = await fetch(apiURl+"paypal/create-order", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                   'Authorization': `Bearer ${sessionData.token}`,
                  },
                  body: JSON.stringify({ amount: amount })
                });*/
                const resRanchos = await axios.post(apiURl+"paypal/create-order",{ amount: amount },
                     {
                    headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${sessionData.token}`, }
                    }
                );
                console.log(resRanchos)
                const orderData =resRanchos.data

                if (orderData.id) {
                  return orderData.id;
                } else {
                  const errorDetail = orderData?.details?.[0];
                  const errorMessage = errorDetail ?
                    `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})` :
                    JSON.stringify(orderData);

                  throw new Error(errorMessage);
                }
              } catch (error: any) {
                console.error(error);
           
                alert(`Error al crear la orden: ${error.message}`);
                throw error;
              }
            }}
            onApprove={async (data, actions) => {
              try {
                const response = await fetch(apiURl+"paypal/capture-order", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${sessionData.token}`,
                  },
                  body: JSON.stringify({ orderID: data.orderID })
                });

                const orderData = await response.json();
                const errorDetail = orderData?.details?.[0];

                if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                  return actions.restart();
                } else if (errorDetail) {
                  throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
                } else if (orderData.status === 'COMPLETED') {
                  alert('¡Pago completado con éxito!');
             
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
      </div>
    </div>
  );
};

export default PayPalPayment;