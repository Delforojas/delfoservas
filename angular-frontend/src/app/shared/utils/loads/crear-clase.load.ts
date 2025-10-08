import { handleHttpError } from '@shared/utils/http-error';
import { CrearClaseContext } from '@shared/utils/context-types';

import { showToast } from '../test-messages';

export function loadClases(ctx: CrearClaseContext): void {
  ctx.claseService.getClases().subscribe({
    next: d => (ctx.state.clases = d ?? []),
    error: e => handleHttpError(e, ctx.toast, undefined, 'clasesError'),
  });
}
export function loadClasesVista(ctx: any): void {
    ctx.claseService.getClasesVista().subscribe({
        next: (rows: any[]) => (ctx.clasesVista = rows ?? []),
        error: (e: any) => handleHttpError(e, ctx.toast, undefined, 'vistaClasesError'),
    });
}

export function loadProfesores(ctx: CrearClaseContext): void {
  ctx.usersService.getProfesores().subscribe({
    next: d => (ctx.state.profesores = d ?? []),
    error: e => handleHttpError(e, ctx.toast, undefined, 'profesoresError'),
  });
}


export function loadTiposClase(ctx: CrearClaseContext): void {
  ctx.tipoClaseService.getTipos().subscribe({
    next: d => (ctx.state.tiposClase = d ?? []),
    error: e => handleHttpError(e, ctx.toast, undefined, 'tiposClaseError'),
  });
}

export function loadRooms(ctx: CrearClaseContext): void {
  ctx.roomService.getRooms().subscribe({
    next: d => (ctx.state.rooms = d ?? []),
    error: e => handleHttpError(e, ctx.toast, undefined, 'roomsError'),
  });
}
export function crearClase(ctx: CrearClaseContext): void {
  const c = ctx.state.nuevaClase;

  const payload = {
    ...c,
    tipoclase: Number(c.tipoclase),
    teacher: Number(c.teacher),
    aforo_clase: Number(c.aforo_clase),
    room: Number(c.room),
    nombre: (c.nombre ?? '').trim(),
    fecha: (c.fecha ?? '').trim(),
    hora: (c.hora ?? '').trim(),
  };

  const missing: string[] = [];
  if (!payload.nombre) missing.push('nombre');
  if (!payload.fecha) missing.push('fecha');
  if (!payload.hora) missing.push('hora');
  if (!Number.isFinite(payload.tipoclase) || payload.tipoclase <= 0) missing.push('tipoclase');
  if (!Number.isFinite(payload.teacher) || payload.teacher <= 0) missing.push('teacher');
  if (!Number.isFinite(payload.aforo_clase) || payload.aforo_clase <= 0) missing.push('aforo_clase');
  if (!Number.isFinite(payload.room) || payload.room <= 0) missing.push('room');

  if (missing.length) {
    handleHttpError({ status: 400 } as any, ctx.toast, undefined, 'crearClaseFormInvalid');
    return;
  }

  ctx.claseService.crearClase(payload).subscribe({
    next: () => {
      showToast(ctx.toast, 'classSuccess'); 
      ctx.state.nuevaClase = {
        nombre: '',
        tipoclase: 0,
        teacher: 0,
        fecha: '',
        hora: '',
        aforo_clase: 0,
        room: 0,
      };
      loadClases(ctx);
      loadClasesVista(ctx);
    },
    error: (e) => handleHttpError(e, ctx.toast, undefined, 'crearClaseError'),
  });
}