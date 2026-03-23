import { prisma } from "@/lib/prisma";
import Link from "next/link";
// import { BotonEliminarReserva } from "./boton-eliminar";
import { BotonAccionesReserva } from "./boton-acciones";
import { tarjeta } from "@/app/lib/estilos";

const etiquetaEstado: Record<string, string> = {
  pendiente: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmada: "bg-green-50 text-green-700 border-green-200",
  cancelada: "bg-gray-100 text-gray-500 border-gray-200",
};

export default async function PaginaReservas({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const estado = params?.estado ? (params.estado as string) : undefined;

  const where = estado ? { estado } : {};

  const reservas = await prisma.reserva.findMany({
    where,
    orderBy: { fecha: "asc" },
    include: { servicio: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Reservas</h1>
        <Link
          href="/reservas/nueva"
          className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors"
        >
          Nueva reserva
        </Link>
      </div>
      
      {/* Filtros por estado */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Link
          href="/reservas"
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            !estado
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Todas
        </Link>
        <Link
          href="/reservas?estado=pendiente"
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            estado === "pendiente"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Pendientes
        </Link>
        <Link
          href="/reservas?estado=confirmada"
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            estado === "confirmada"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Confirmadas
        </Link>
        <Link
          href="/reservas?estado=cancelada"
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            estado === "cancelada"
              ? "bg-gray-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Canceladas
        </Link>
      </div>
      {reservas.length === 0 ? (
        <p className="text-sm text-gray-400">No hay reservas registradas.</p>
      ) : (
        <ul className="space-y-3">
          {reservas.map((reserva) => (
            <li
              key={reserva.id}
              className={`${tarjeta} flex items-start justify-between`}
            >
              <div>
                <p className="font-medium text-sm">{reserva.nombre}</p>
                <p className="text-xs text-gray-400 mt-0.5">{reserva.correo}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {reserva.servicio.nombre} —{" "}
                  {new Date(reserva.fecha).toLocaleString("es-SV")}
                </p>
                <span
                  className={`inline-block mt-2 text-xs px-2 py-0.5 rounded border ${
                    etiquetaEstado[reserva.estado] ?? etiquetaEstado.pendiente
                  }`}
                >
                  {reserva.estado}
                </span>
              </div>
              <BotonAccionesReserva id={reserva.id} estado={reserva.estado} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}