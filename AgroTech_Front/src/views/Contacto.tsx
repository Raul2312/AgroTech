import { useState } from "react";
import Header from "../Layouts/Header";
import "../css/Contacto.css";

const Contacto = () => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  const handleChange = (
    evento: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [evento.target.name]: evento.target.value,
    });
  };

  const handleSubmit = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    setMensajeEnviado(true);

    setForm({
      nombre: "",
      email: "",
      mensaje: "",
    });

    setTimeout(() => {
      setMensajeEnviado(false);
    }, 4000);
  };

  return (
    <>
      <Header />

      <section className="contact-page">
        <div className="contact-container">

          {/* INFORMACIÓN */}
          <div className="contact-info">
            <h2>Información de contacto</h2>

            <div className="info-item">
              <div className="icon-box">📍</div>
              <div>
                <h4>Dirección</h4>
                <p>Nuevo Casas Grandes, Chihuahua, México</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box">📞</div>
              <div>
                <h4>Teléfono</h4>
                <p>+52 636 100 20 30</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box">✉️</div>
              <div>
                <h4>Email</h4>
                <p>Soporte@agrotech.com</p>
              </div>
            </div>

            <div className="info-item">
              <div className="icon-box">🕒</div>
              <div>
                <h4>Horario</h4>
                <p>Lunes a Viernes 8:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="socials">
              <a href="#">📸</a>
              <a href="#">💼</a>
              <a href="#">🐦</a>
            </div>
          </div>

          {/* FORMULARIO */}
          <div className="contact-form-box">
            <h2>Envíanos un mensaje</h2>
            <p>Nos encantará ayudarte.</p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="nombre"
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Tu correo"
                value={form.email}
                onChange={handleChange}
                required
              />

              <textarea
                name="mensaje"
                placeholder="Escribe tu mensaje..."
                rows={5}
                value={form.mensaje}
                onChange={handleChange}
                required
              />

              <button type="submit">Enviar mensaje</button>
            </form>

            {mensajeEnviado && (
              <div className="toast">
                ¡Mensaje enviado correctamente!
              </div>
            )}
          </div>

        </div>
      </section>
    </>
  );
};

export default Contacto;