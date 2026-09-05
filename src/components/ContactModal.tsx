'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Send, X, AlertCircle, Loader2 } from 'lucide-react';

export function openContactModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-contact-modal'));
  }
}

export function ContactButton({
  className = 'btn-creator-contact',
  children,
  style,
  title = 'Enviar un mensaje o propuesta a Pablosky92',
}: {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  title?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      style={style}
      title={title}
      onClick={openContactModal}
    >
      {children || (
        <>
          <Mail size={16} />
          <span>Contactar</span>
        </>
      )}
    </button>
  );
}

export function ContactLink({
  className = 'creator-contact-link',
  children,
  style,
  title = 'Abrir formulario de contacto',
}: {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  title?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      style={style}
      title={title}
      onClick={openContactModal}
    >
      {children || 'Enviar mensaje ✉️'}
    </button>
  );
}

export function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Solo charlar o saludar',
    message: '',
  });

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
    };

    window.addEventListener('open-contact-modal', handleOpen);
    return () => {
      window.removeEventListener('open-contact-modal', handleOpen);
    };
  }, []);

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: 'c669c668-da2d-4b10-8298-094ee145a7d6',
          subject: `Nuevo mensaje desde Tus Desvaríos (${formData.category})`,
          from_name: 'Tus Desvaríos Web',
          ...formData,
        }),
      });

      const result = await response.json();

      if (response.status === 200 && result.success) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          category: 'Solo charlar o saludar',
          message: '',
        });
      } else {
        setStatus('error');
        setErrorMessage(
          result.message || '⚠️ Error al enviar el mensaje. Por favor, inténtalo de nuevo.'
        );
      }
    } catch {
      setStatus('error');
      setErrorMessage(
        '⚠️ Error de conexión. Comprueba tu conexión a internet e inténtalo de nuevo.'
      );
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setErrorMessage('');
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div
      id="contact-modal"
      className="contact-modal-overlay active"
      onClick={(e) => {
        if ((e.target as HTMLElement).id === 'contact-modal') {
          closeModal();
        }
      }}
      aria-hidden={!isOpen}
    >
      <div
        className="contact-modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        <button
          type="button"
          className="contact-modal-close"
          onClick={closeModal}
          aria-label="Cerrar ventana emergente"
        >
          <X size={18} />
        </button>

        <div className="contact-modal-header">
          <div className="contact-modal-badge">
            <span>📻</span>
            <span>Línea Directa con el Taller</span>
          </div>
          <h2 id="contact-modal-title" className="contact-modal-title">
            Contactar con Pablosky92
          </h2>
          <p className="contact-modal-desc">
            ¿Tienes una idea, sugerencia, has detectado un cable suelto en la web o simplemente
            quieres saludar? Rellena el formulario y el mensaje viajará directo a mi estación de
            trabajo.
          </p>
        </div>

        {status === 'success' ? (
          <div className="contact-success-view" style={{ display: 'flex' }}>
            <div className="contact-success-icon">🎉</div>
            <h3 className="contact-success-title">¡Mensaje Transmitido con Éxito!</h3>
            <p className="contact-success-desc">
              Tus datos han viajado a través de los cables de cobre y han aterrizado en la bandeja del
              creador. Te responderé en cuanto mis circuitos se enfríen.
            </p>
            <button
              type="button"
              className="btn-contact-submit"
              style={{ width: 'auto', marginTop: '1.25rem' }}
              onClick={handleReset}
            >
              <span>Cerrar o Enviar otro mensaje</span>
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            {/* Honeypot antispam */}
            <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

            <div className="contact-form-grid">
              <div className="contact-form-group">
                <label htmlFor="modal-contact-name" className="contact-form-label">
                  <span>👤 Tu Nombre o Alias</span>
                </label>
                <input
                  type="text"
                  id="modal-contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="contact-form-input"
                  placeholder="Ej. Viajero del Módem"
                  required
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="modal-contact-email" className="contact-form-label">
                  <span>📧 Correo Electrónico</span>
                </label>
                <input
                  type="email"
                  id="modal-contact-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="contact-form-input"
                  placeholder="tu-correo@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div className="contact-form-group">
              <label htmlFor="modal-contact-category" className="contact-form-label">
                <span>🏷️ Motivo del Contacto</span>
              </label>
              <select
                id="modal-contact-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="contact-form-select"
              >
                <option value="Sugerencia o Idea">💡 Sugerencia o nueva idea para la web</option>
                <option value="Reporte de Error o Bug">⚙️ Reporte de fallo o cable suelto</option>
                <option value="Propuesta de Colaboración">🤝 Propuesta de colaboración o proyecto</option>
                <option value="Solo charlar o saludar">☕ Solo charlar o saludar</option>
              </select>
            </div>

            <div className="contact-form-group">
              <label htmlFor="modal-contact-message" className="contact-form-label">
                <span>💬 Tu Mensaje</span>
              </label>
              <textarea
                id="modal-contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="contact-form-textarea"
                rows={4}
                placeholder="Escribe aquí lo que quieras contarle a Pablosky92..."
                required
              />
            </div>

            {status === 'error' && (
              <div className="contact-form-status error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="contact-form-actions">
              <button
                type="button"
                className="btn-contact-cancel"
                onClick={closeModal}
                disabled={status === 'loading'}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-contact-submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Transmitiendo...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Enviar Mensaje</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
