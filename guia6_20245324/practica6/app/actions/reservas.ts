"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const EsquemaReserva = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  correo: z.string().email("El correo no es válido."),
  fecha: z.string().min(1, "La fecha es obligatoria."),
  servicioId: z.coerce.number({ message: "Debe seleccionar un servicio." }),
});

async function validarDisponibilidad(servicioId: number, fechaReserva: Date): Promise<{ disponible: boolean; mensaje?: string }> {

  const servicio = await prisma.servicio.findUnique({ where: { id: servicioId } });
  if (!servicio) {
    return { disponible: false, mensaje: "El servicio no existe." };
  }

  const horaFin = new Date(fechaReserva.getTime() + servicio.duracion * 60000);

  const reservasConflictivas = await prisma.reserva.findMany({
    where: {
      servicioId,
      estado: { in: ["pendiente", "confirmada"] },
      fecha: {
        lt: horaFin,
      },
    },
    select: { fecha: true, servicio: true },
  });

  for (const reserva of reservasConflictivas) {
    const horaFinReservaExistente = new Date(reserva.fecha.getTime() + (reserva.servicio?.duracion || 0) * 60000);
    
    if (horaFinReservaExistente > fechaReserva) {
      return {
        disponible: false,
        mensaje: `No hay disponibilidad en ese horario. Conflicto con otra reserva.`,
      };
    }
  }

  return { disponible: true };
}

export async function crearReserva(_estadoPrevio: any, formData: FormData) {
  const campos = EsquemaReserva.safeParse({
    nombre: formData.get("nombre"),
    correo: formData.get("correo"),
    fecha: formData.get("fecha"),
    servicioId: formData.get("servicioId"),
  });

  if (!campos.success) {
    return {
      errores: campos.error.flatten().fieldErrors,
      mensaje: "Error de validación.",
    };
  }

  const fechaReserva = new Date(campos.data.fecha);

  // Validar disponibilidad
  const validacion = await validarDisponibilidad(campos.data.servicioId, fechaReserva);
  if (!validacion.disponible) {
    return {
      errores: {},
      mensaje: validacion.mensaje || "No se puede crear la reserva.",
    };
  }

  await prisma.reserva.create({
    data: {
      nombre: campos.data.nombre,
      correo: campos.data.correo,
      fecha: fechaReserva,
      servicioId: campos.data.servicioId,
      estado: "pendiente",
    },
  });

  revalidatePath("/reservas");
  redirect("/reservas");
}

export async function cancelarReserva(id: number) {
  try {
    await prisma.reserva.update({
      where: { id },
      data: { estado: "cancelada" },
    });
    revalidatePath("/reservas");
    return { exito: true };
  } catch {
    return { exito: false, mensaje: "No se pudo cancelar la reserva." };
  }
}

export async function confirmarReserva(id: number) {
  try {
    await prisma.reserva.update({
      where: { id },
      data: { estado: "confirmada" },
    });
    revalidatePath("/reservas");
    return { exito: true };
  } catch {
    return { exito: false, mensaje: "No se pudo confirmar la reserva." };
  }
}

export async function eliminarReserva(id: number) {
  return cancelarReserva(id);
}