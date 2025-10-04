// loaders.ts
import { handleHttpError } from '../utils/http-error';
import { finalize } from 'rxjs';
import { showToast } from '../utils/test-messages';
import { ReservarClaseContext } from './interfaces';
import { UsuarioBonosContext } from './interfaces';
import { UsuarioReservasContext } from './interfaces';
import { UsuarioPagosContext } from './interfaces';
import { CrearClaseContext } from './interfaces';
import { ClasesProfesorContext } from '../utils/interfaces';





// --- BONOS ---
export function loadBonosPorUsuario(ctx: UsuarioBonosContext): void {
  const id = ctx.state.usuarioId;
  if (!id || id <= 0) {
    handleHttpError({ status: 400 } as any, ctx.toast, undefined, 'bonosError');
    return;
  }

  ctx.state.cargando = true;
  ctx.state.error = null;

  ctx.vistas.getBonosPorUsuario(id).subscribe({
    next: (rows: any[]) => {
      ctx.state.bonosDeUsuario = rows ?? [];
      ctx.state.mostrarTablaBonosUsuario = true;
      ctx.state.cargando = false;
    },
    error: (e: any) => {
      handleHttpError(e, ctx.toast, undefined, 'bonosError');
      ctx.state.cargando = false;
    },
  });
}

// --- CLASES ---
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


// --- PROFESOR: sus clases ---
export function loadClasesProfesores(ctx: ClasesProfesorContext): void {
  ctx.state.cargando = true;

  ctx.claseService.getMisClases()
    .pipe(finalize(() => (ctx.state.cargando = false)))
    .subscribe({
      next: (rows: any[]) => (ctx.state.clasesProfe = rows ?? []),
      error: (e: any) => handleHttpError(e, ctx.toast, undefined, 'misClasesError'),
    });
}

// --- Alumnos de una clase ---
export function loadAlumnos(ctx: ClasesProfesorContext, id: number): void {
  ctx.state.cargandoAlumnos = true;
  ctx.state.errorAlumnos = null;
  ctx.state.alumnos = [];
  ctx.state.claseSeleccionadaId = id;

  ctx.claseService.getAlumnosDeClase(id)
    .pipe(finalize(() => (ctx.state.cargandoAlumnos = false)))
    .subscribe({
      next: (rows: any[]) => {
        ctx.state.alumnos = rows ?? [];
        ctx.state.mostrarTablaAlumnos = true;
      },
      error: (e: any) => handleHttpError(e, ctx.toast, undefined, 'alumnosError'),
    });
}
export function loadProfesores(ctx: CrearClaseContext): void {
  ctx.usersService.getProfesores().subscribe({
    next: d => (ctx.state.profesores = d ?? []),
    error: e => handleHttpError(e, ctx.toast, undefined, 'profesoresError'),
  });
}

// --- ACCIONES ---
export function deleteClase(ctx: any, id: number): void {
    if (!confirm('¿Eliminar esta clase?')) return;
    ctx.claseService.eliminarClase(id).subscribe({
        next: () => loadClases(ctx),
        error: (e: any) => handleHttpError(e, ctx.toast, undefined, 'eliminarClaseError'),
    });
}

export function deleteAlumnoDeClase(ctx: any, a: any): void {
    if (!a?.alumno_reservation_id) {
        handleHttpError({ status: 400 } as any, ctx.toast, undefined, 'eliminarReservaError');
        return;
    }
    if (!confirm(`¿Eliminar la reserva de ${a.alumno_nombre}?`)) return;

    ctx.eliminandoId = a.alumno_reservation_id;

    ctx.reservationService.eliminarReservation(a.alumno_reservation_id)
        .pipe(finalize(() => (ctx.eliminandoId = null)))
        .subscribe({
            next: () => {
                ctx.alumnos = (ctx.alumnos ?? []).filter(
                    (x: any) => x.alumno_reservation_id !== a.alumno_reservation_id
                );
                if (ctx.claseSeleccionadaId != null) loadAlumnos(ctx, ctx.claseSeleccionadaId);
                loadClasesProfesores(ctx);
            },
            error: (e: any) => handleHttpError(e, ctx.toast, undefined, 'eliminarReservaError'),
        });
}
// --- catálogos ---

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
// 1) Usuarios (lista y binding del buscador)
export function loadUsuariosPagos(ctx: any): void {
    ctx.vistas.getUsuarios().subscribe({
        next: (u: any[]) => {
            ctx.usuarios = u ?? [];
            // si ya hay valueChanges enganchado, no hacemos nada más
        },
        error: (e: any) => console.error('Error cargando usuarios', e),
    });
}

// Engancha el valueChanges del input para resolver usuario_id
export function bindNombreUsuarioToId(ctx: any): void {
    ctx.nombreUsuario?.valueChanges?.subscribe((nombre: string) => {
        const usuario = (ctx.usuarios ?? []).find((u: any) => u.nombre === nombre);
        ctx.usuario_id = usuario ? usuario.id : null;
    });
}

// 2) Tipos de clase

// 3) Meses disponibles (autoselecciona mes actual y carga wallets del mes)
export function loadMesesWallet(ctx: any): void {
    ctx.vistas.getMesesWallet().subscribe({
        next: (m: string[]) => {
            ctx.meses = m ?? [];

            const mesesEs = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
                'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            const mesActual = mesesEs[new Date().getMonth()];
            ctx.mesSeleccionado = (ctx.meses ?? []).find(
                (x: string) => x?.toLowerCase?.() === mesActual.toLowerCase()
            ) ?? null;

            if (ctx.mesSeleccionado) {
                loadWalletMes(ctx, ctx.mesSeleccionado);
            }
        },
        error: (e: any) => console.error('Error cargando meses', e),
    });
}

// 4) Wallets base
export function loadWallets(ctx: any): void {
    ctx.cargando = true;
    ctx.walletService.getWallets().subscribe({
        next: (data: any[]) => {
            ctx.wallets = data ?? [];
            ctx.cargando = false;
        },
        error: (err: any) => {
            console.error(err);
            ctx.error = 'Error al cargar las wallets';
            ctx.cargando = false;
        },
    });
}

export function createWallet(ctx: any): void {
    const w = ctx.nuevaWallet ?? {};
    if (!w.fecha || !w.usuario_id || !w.tipoclase_id) {
        alert('Completa todos los campos');
        return;
    }
    ctx.walletService.crearWallet(w as any).subscribe({
        next: () => {
            ctx.nuevaWallet = { fecha: '', usuario_id: 0, tipoclase_id: 0 };
            loadWallets(ctx);
        },
        error: (err: any) => {
            console.error(err);
            ctx.error = 'Error al crear la wallet';
        },
    });
}

export function deleteWallet(ctx: any, id: number): void {
    if (!confirm('¿Seguro que quieres eliminar esta wallet?')) return;
    ctx.walletService.eliminarWallet(id).subscribe({
        next: () => loadWalletAll(ctx),
        error: (err: any) => {
            console.error(err);
            ctx.error = 'Error al eliminar wallet';
        },
    });
}

// 5) Vistas agregadas
export function loadWalletAll(ctx: any): void {
    ctx.vistas.getVistaUsuarioWalletAll().subscribe({
        next: (d: any[]) => (ctx.walletAll = d ?? []),
        error: (e: any) => console.error(e),
    });
}

export function loadWalletUsuario(ctx: UsuarioPagosContext): void {
  const id = Number(ctx.state.usuarioId);

  if (!id || id <= 0) {
    handleHttpError({ status: 400 } as any, ctx.toast, undefined, 'walletError');
    return;
  }

  ctx.state.cargando = true;
  ctx.state.error = null;

  ctx.vistas.getVistaUsuarioWalletByUser(id).subscribe({
    next: (rows: any[]) => {
      ctx.state.walletUsuario = rows ?? [];
      ctx.state.mostrarTablaWalletUsuario = true;
      ctx.state.cargando = false;
    },
    error: (e: any) => {
      ctx.state.mostrarTablaWalletUsuario = false;
      ctx.state.walletUsuario = [];
      ctx.state.cargando = false;
      handleHttpError(e, ctx.toast, undefined, 'walletError');
    },
  });
}

export function loadWalletMes(ctx: any, mes: string | null): void {
    if (!mes) { ctx.walletMes = []; return; }
    ctx.vistas.getWalletMes(mes).subscribe({
        next: (d: any[]) => (ctx.walletMes = d ?? []),
        error: (e: any) => console.error('Error al cargar wallets por mes', e),
    });
}

export function loadWalletTipo(ctx: any, tipoId: number): void {
    ctx.vistas.getWalletPorTipoClase(tipoId).subscribe({
        next: (d: any[]) => {
            ctx.tiposClaseFiltrados = d ?? [];
            console.log('Pagos filtrados desde backend:', ctx.tiposClaseFiltrados);
        },
        error: (e: any) => console.error('Error al cargar wallets por tipo de clase', e),
    });
}

export function loadWalletPorMesYTipo(ctx: any): void {
    if (!ctx.mesSeleccionado || !ctx.tipoSeleccionadoId) {
        ctx.walletMesTipo = [];
        return;
    }
    ctx.vistas.getWalletPorMesYTipo(ctx.mesSeleccionado, ctx.tipoSeleccionadoId).subscribe({
        next: (d: any[]) => {
            ctx.walletMesTipo = d ?? [];
            console.log('Resultados mes + tipo:', ctx.walletMesTipo);
        },
        error: (e: any) => console.error('Error al cargar wallets por mes y tipo', e),
    });
}


export function onUsuarioSeleccionado(ctx: UsuarioPagosContext): void {
  if (ctx.usuarioSeleccionadoId) {
    ctx.usuarioSeleccionado =
      (ctx.usuarios ?? []).find((u: any) => u.id === ctx.usuarioSeleccionadoId) ?? null;
    loadWalletUsuario(ctx);
  } else {
    ctx.walletUser = [];
    ctx.usuarioSeleccionado = null;
  }
}

export function onMesSeleccionado(ctx: any): void {
    if (ctx.mesSeleccionado) {
        ctx.walletMes = (ctx.walletAll ?? []).filter((wm: any) => wm.mes === ctx.mesSeleccionado);
    } else {
        ctx.walletMes = [];
    }
}

export function onTipoClaseSeleccionado(ctx: any): void {
    if (ctx.tipoSeleccionadoId) {
        loadWalletTipo(ctx, ctx.tipoSeleccionadoId);
    } else {
        ctx.tiposClaseFiltrados = [];
    }
}

export function onFiltrarMesYTipo(ctx: any): void {
    if (ctx.mesSeleccionado && ctx.tipoSeleccionadoId) {
        ctx.vistas.getWalletPorMesYTipo(ctx.mesSeleccionado, ctx.tipoSeleccionadoId).subscribe({
            next: (data: any[]) => {
                ctx.walletMesTipo = data ?? [];
                ctx.mostrarMesTipo = true;
                console.log('Resultados mes + tipo:', ctx.walletMesTipo);
            },
            error: (err: any) => console.error('Error al filtrar por mes y tipo', err),
        });
    }
}


// ----------- LUNES -----------
export function loadClassMonday(ctx: any): void {
  ctx.reservasService.getClassMonday().subscribe({
    next: (data: any[]) => {
      console.log('📅 Clases Lunes recibidas:', data);
      ctx.state.clasesPorDia.L = [...(data ?? [])];
    },
    error: (e: any) => handleHttpError(e, ctx.toast, undefined, 'clasesError'),
  });
}

// ----------- MARTES -----------
export function loadClassTuesday(ctx: any): void {
  ctx.reservasService.getClassTuesday().subscribe({
    next: (data: any[]) => {
      console.log('📅 Clases Martes recibidas:', data);
      ctx.state.clasesPorDia.M = [...(data ?? [])];
    },
    error: (e: any) => handleHttpError(e, ctx.toast, undefined, 'clasesError'),
  });
}

// ----------- MIÉRCOLES -----------
export function loadClassWednesday(ctx: any): void {
  ctx.reservasService.getClassWednesday().subscribe({
    next: (data: any[]) => {
      console.log('📅 Clases Miércoles recibidas:', data);
      ctx.state.clasesPorDia.X = [...(data ?? [])];
    },
    error: (e: any) => handleHttpError(e, ctx.toast, undefined, 'clasesError'),
  });
}

// ----------- JUEVES -----------
export function loadClassThursday(ctx: any): void {
  ctx.reservasService.getClassThursday().subscribe({
    next: (data: any[]) => {
      console.log('📅 Clases Jueves recibidas:', data);
      ctx.state.clasesPorDia.J = [...(data ?? [])];
    },
    error: (e: any) => handleHttpError(e, ctx.toast, undefined, 'clasesError'),
  });
}

// ----------- VIERNES -----------
export function loadClassFriday(ctx: any): void {
  ctx.reservasService.getClassFriday().subscribe({
    next: (data: any[]) => {
      console.log('📅 Clases Viernes recibidas:', data);
      ctx.state.clasesPorDia.V = [...(data ?? [])];
    },
    error: (e: any) => handleHttpError(e, ctx.toast, undefined, 'clasesError'),
  });
}

// -------- ALUMNOS DE CLASE --------
export function loadAlumnosDeClase(ctx: ReservarClaseContext, id: number): void {
  ctx.state.cargandoAlumnos = true;
  ctx.state.errorAlumnos = null;
  ctx.state.alumnos = [];
  ctx.state.claseSeleccionadaId = id;

  ctx.claseService.getAlumnosDeClase(id).subscribe({
    next: (rows: any[]) => {
      ctx.state.alumnos = rows ?? [];
      ctx.state.mostrarTablaAlumnos = true;
      ctx.state.cargandoAlumnos = false;
    },
    error: (e: any) =>
      handleHttpError(e, ctx.toast, undefined, 'alumnosError'),
  });
}
// -------- RESERVAR --------
export function reservarClase(ctx: ReservarClaseContext , id: number): void {
    const claseId = Number(id);
    if (!Number.isFinite(claseId) || claseId <= 0) {
        handleHttpError({ status: 400 } as any , ctx.toast, undefined, 'reservarError');
        return;
    }

    ctx.reservandoId = claseId;

    ctx.reservasService.reservarClase(claseId).subscribe({
        next: () => {
            handleHttpError({ status: 200 } as any , ctx.toast, undefined, 'reservarSuccess');

            if (ctx.mostrarTablaL) loadClassMonday(ctx);
            if (ctx.mostrarTablaM) loadClassTuesday(ctx);
            if (ctx.mostrarTablaX) loadClassWednesday(ctx);
            if (ctx.mostrarTablaJ) loadClassThursday(ctx);
            if (ctx.mostrarTablaV) loadClassFriday(ctx);

            if (ctx.mostrarTablaAlumnos && ctx.claseSeleccionadaId === claseId) {
                loadAlumnosDeClase(ctx, claseId);
            }
        },
        error: (e: any ) => handleHttpError(e, ctx.toast, undefined, 'reservarError'),
    });
}


// --- RESERVAS USUARIO ---
export function loadReservasUsuario(ctx: UsuarioReservasContext): void {
  const uid = ctx.state.usuarioId;
  if (!uid || uid <= 0) {
    handleHttpError({ status: 400 } as any, ctx.toast, undefined, 'cargarUsuarioError');
    return;
  }

  ctx.state.cargando = true;
  ctx.state.error = null;

  ctx.vistas.getReservasPorUsuario(uid).subscribe({
    next: (rows: any[]) => {
      ctx.state.reservasUsuario = rows ?? [];
      ctx.state.mostrarTablaReservasUsuario = true;
      ctx.state.cargando = false;
    },
    error: (e: any) => {
      ctx.state.cargando = false;
      handleHttpError(e, ctx.toast, undefined, 'reservasUsuarioError');
    },
  });
}

export function deleteReservaUsuario(ctx: UsuarioReservasContext, reservaId: number): void {
  if (!Number.isFinite(reservaId) || reservaId <= 0) {
    handleHttpError({ status: 400 } as any, ctx.toast, undefined, 'eliminarReservaSuccess');
    return;
  }

  ctx.state.eliminandoId = reservaId;

  ctx.reservationService.eliminarReservation(reservaId).subscribe({
    next: () => {
      // quita del listado en memoria
      ctx.state.reservasUsuario = (ctx.state.reservasUsuario ?? []).filter(r => r.reserva_id !== reservaId);
      ctx.state.eliminandoId = null;
    },
    error: (e: any) => {
      ctx.state.eliminandoId = null;
      handleHttpError(e, ctx.toast, undefined, 'eliminarReservaError');
    },
  });
}