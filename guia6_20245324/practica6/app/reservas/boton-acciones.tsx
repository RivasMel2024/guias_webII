"use client";

import { cancelarReserva, confirmarReserva } from "@/app/actions/reservas";
import { useState } from "react";
import { botonPeligro } from "@/app/lib/estilos";

export function BotonAccionesReserva({
  id,
  estado,
}: {
  id: number;
  estado: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function manejarConfirmar() {
    setLoading(true);
    const resultado = await confirmarReserva(id);
    setLoading(false);
    if (!resultado.exito) {
      setError(resultado.mensaje ?? "Error desconocido.");
    }
  }

  async function manejarCancelar() {
    setLoading(true);
    const resultado = await cancelarReserva(id);
    setLoading(false);
    if (!resultado.exito) {
      setError(resultado.mensaje ?? "Error desconocido.");
    }
  }

  return (
    <div className="text-right shrink-0 ml-4 space-y-2">
      {estado === "pendiente" && (
        <div className="flex gap-2 justify-end">
          <button
            onClick={manejarConfirmar}
            disabled={loading}
            className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Confirmar"}
          </button>
          <button
            onClick={manejarCancelar}
            disabled={loading}
            className={botonPeligro}
          >
            {loading ? "..." : "Cancelar"}
          </button>
        </div>
      )}
      {estado === "confirmada" && (
        <button
          onClick={manejarCancelar}
          disabled={loading}
          className={botonPeligro}
        >
          {loading ? "..." : "Cancelar"}
        </button>
      )}
      {error && <p className="text-xs text-red-600 mt-2 font-medium">{error}</p>}
    </div>
  );
}
