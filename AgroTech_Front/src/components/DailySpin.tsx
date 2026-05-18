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

interface DailySpinStatusResponse {
  can_spin: boolean;
  message?: string;
}

interface SpinResponse {
  reward: Prize;
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
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    loadStatus();
  }, []);

  // REEMPLAZA COMPLETAMENTE la función loadStatus() en DailySpin.tsx
// Así el frontend funcionará con tu backend actual SIN modificar Laravel.

const loadStatus = async (): Promise<void> => {
  try {
    setLoading(true);

    // Tu backend actual devuelve:
    // {
    //   id,
    //   user_id,
    //   points,
    //   last_spin_date,
    //   last_reward_type,
    //   ...
    // }
    const data: any = await getDailySpinStatus();

    console.log('Reward data:', data);

    // Fecha actual en formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    // Puede girar si no existe last_spin_date
    // o si last_spin_date es diferente al día de hoy
    const canSpinToday =
      !data.last_spin_date ||
      data.last_spin_date !== today;

    setCanSpin(canSpinToday);

    // Mostrar siempre el popup
    setVisible(true);

    if (canSpinToday) {
      setMessage('¡Tienes un giro disponible hoy!');
    } else {
      setMessage(
        'Ya utilizaste tu giro diario. Regresa mañana.'
      );
    }
  } catch (error) {
    console.error('Error al obtener estado:', error);

    // En caso de error, mostrar la ruleta para pruebas
    setCanSpin(true);
    setVisible(true);
    setMessage('¡Tienes un giro disponible hoy!');
  } finally {
    setLoading(false);
  }
};

  const closePopup = (): void => {
    setVisible(false);
  };

  // REEMPLAZA COMPLETAMENTE la función handleSpin() en DailySpin.tsx
// Esto asegura que SIEMPRE se llame al endpoint POST /rewards/spin,
// que es el que guarda last_spin_date y la recompensa en la base de datos.

const handleSpin = async (): Promise<void> => {
  if (!canSpin || spinning) return;

  try {
    setSpinning(true);

    // LLAMADA REAL AL BACKEND
    // Este endpoint guarda en la BD:
    // - last_spin_date
    // - last_reward_type
    // - last_reward_value
    // - last_reward_label
    // - points
    const data: any = await spinDailyWheel();

    console.log('Resultado del spin:', data);

    // La respuesta del backend es:
    // {
    //   points: ...,
    //   reward: {
    //     type,
    //     value,
    //     label
    //   }
    // }

    const reward = data.reward;

    // Buscar índice del premio en la ruleta
    const index = prizes.findIndex(
      (p) =>
        p.label.toLowerCase() === reward.label.toLowerCase() ||
        (p.type === reward.type &&
          p.value === reward.value)
    );

    const selectedIndex = index >= 0 ? index : 0;

    const segmentAngle = 360 / prizes.length;
    const extraTurns = 6 * 360;

    const targetAngle =
      360 -
      selectedIndex * segmentAngle -
      segmentAngle / 2;

    const finalRotation =
      rotation + extraTurns + targetAngle;

    // Animar ruleta
    setRotation(finalRotation);

    // Esperar a que termine la animación
    setTimeout(() => {
      setResult({
        label: reward.label,
        value: reward.value,
        type: reward.type,
      });

      setShowModal(true);
      setCanSpin(false);

      setMessage(
        'Ya utilizaste tu giro diario. Regresa mañana.'
      );

      setSpinning(false);
    }, 5000);
  } catch (error: any) {
    console.error('Error al girar:', error);

    const msg =
      error?.response?.data?.message ||
      'Ocurrió un error al girar la ruleta.';

    alert(msg);
    setSpinning(false);
  }
};

  // Mientras carga, no mostrar nada
  if (loading) {
    return null;
  }

  // Si no debe mostrarse, no renderizar
  if (!visible) {
    return null;
  }

  return (
    <div className="daily-spin-overlay">
      <div className="daily-spin-container">
        {/* Botón cerrar */}
        <button
          className="daily-spin-close"
          onClick={closePopup}
        >
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
              <div
                key={index}
                className={`segment segment-${index}`}
              >
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
          {spinning
            ? 'Girando...'
            : canSpin
            ? '¡Girar Ruleta!'
            : 'Sin giros disponibles'}
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