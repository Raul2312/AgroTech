import React, { useEffect, useState } from 'react';
import {
  getDailySpinStatus,
  spinDailyWheel,
} from '../services/api';
import '../css/DailySpin.css';

interface Prize {
  label: string;
  value: number;
  type: string;
}

const prizes: Prize[] = [
  { label: '10 Puntos', value: 10, type: 'points' },
  { label: '20 Puntos', value: 20, type: 'points' },
  { label: '50 Puntos', value: 50, type: 'points' },
  { label: '5% Descuento', value: 5, type: 'discount' },
  { label: '10% Descuento', value: 10, type: 'discount' },
  { label: 'Envío Gratis', value: 1, type: 'shipping' },
  { label: '100 Puntos', value: 100, type: 'points' },
  { label: 'Sigue Intentando', value: 0, type: 'none' },
];

export default function DailySpin() {
  const [loading, setLoading] = useState<boolean>(true);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [canSpin, setCanSpin] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [rotation, setRotation] = useState<number>(0);
  const [result, setResult] = useState<Prize | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false); 

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async (): Promise<void> => {
    try {
      setLoading(true);
      const data: any = await getDailySpinStatus();
      console.log('Ruleta - Datos del Backend:', data);

      // Obtener la fecha de hoy local en formato estricto YYYY-MM-DD
      const localDate = new Date();
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, '0');
      const day = String(localDate.getDate()).padStart(2, '0');
      const today = `${year}-${month}-${day}`; 

      let canSpinToday = true;

      // CONTROL DE ESCENARIO B: Validamos que data realmente tenga la propiedad, si no, asumimos que es cuenta nueva y puede girar.
      if (data && data.last_spin_date) {
        const cleanBackendDate = data.last_spin_date.substring(0, 10).replace(/\//g, '-');
        canSpinToday = cleanBackendDate !== today;
      }

      setCanSpin(canSpinToday);

      if (canSpinToday) {
        setVisible(true);
        setMessage('¡Tienes un giro disponible hoy!');
      } else {
        setVisible(false);
        setMessage('Ya utilizaste tu giro diario. Regresa mañana.');
      }
    } catch (error: any) {
      console.error('Error al obtener estado del giro:', error);
      
      // CONTROL DE ESCENARIO A: Si el error es un 401 o 403, avisa en consola que falta el Token correcto
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        console.warn("La ruleta no se muestra porque el token de la cuenta no es válido o expiró.");
      }

      setCanSpin(false);
      setVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = (): void => {
    setVisible(false);
  };

  const handleSpin = async (): Promise<void> => {
    if (!canSpin || spinning) return;

    try {
      setSpinning(true);
      const data: any = await spinDailyWheel();
      console.log('Resultado del spin:', data);

      const reward = data.reward;

      const index = prizes.findIndex(
        (p) =>
          p.label.toLowerCase() === reward.label.toLowerCase() ||
          (p.type === reward.type && p.value === reward.value)
      );

      const selectedIndex = index >= 0 ? index : 0;
      const segmentAngle = 360 / prizes.length;
      const extraTurns = 6 * 360;

      const targetAngle =
        360 - selectedIndex * segmentAngle - segmentAngle / 2;

      const finalRotation = rotation + extraTurns + targetAngle;

      setRotation(finalRotation);

      setTimeout(() => {
        setResult({
          label: reward.label,
          value: reward.value,
          type: reward.type,
        });

        setShowModal(true);
        setCanSpin(false);
        setMessage('Ya utilizaste tu giro diario. Regresa mañana.');
        setSpinning(false);
      }, 5000);

    } catch (error: any) {
      console.error('Error al girar:', error);
      const msg = error?.response?.data?.message || 'Ocurrió un error al girar la ruleta.';
      alert(msg);
      setSpinning(false);
    }
  };

  if (loading || !visible) {
    return null;
  }

  return (
    <div className="daily-spin-overlay">
      <div className="daily-spin-container">
        <button className="daily-spin-close" onClick={closePopup}>
          ✕
        </button>

        <h1>🎰 Daily Spin</h1>
        <p className="daily-spin-message">{message}</p>

        <div className="wheel-wrapper">
          <div className="pointer"></div>
          <div
            className="wheel"
            style={{
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {prizes.map((prize, index) => (
              <div key={index} className={`segment segment-${index}`}>
                <span>{prize.label}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          className="spin-button"
          onClick={handleSpin}
          disabled={!canSpin || spinning}
        >
          {spinning ? 'Girando...' : '¡Girar Ruleta!'}
        </button>

        {showModal && result && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>🎉 ¡Felicidades!</h2>
              <p>Has ganado:</p>
              <h3>{result.label}</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setVisible(false); 
                }}
              >
                Aceptar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}