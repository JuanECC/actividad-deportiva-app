// Mapeo de músculos de Wger usando AMBOS nombres (científico y común)
export const gruposMusculares = {
  pecho: {
    label: 'Pecho',
    icono: '💪',
    musculos: ['Pectoralis major', 'Chest', 'Pecho']
  },
  espalda: {
    label: 'Espalda',
    icono: '🔙',
    musculos: ['Latissimus dorsi', 'Lats', 'Trapezius', 'Serratus anterior', 'Espalda']
  },
  hombros: {
    label: 'Hombros',
    icono: '🎯',
    musculos: ['Anterior deltoid', 'Shoulders', 'Deltoid', 'Hombros']
  },
  biceps: {
    label: 'Bíceps',
    icono: '💪',
    musculos: ['Biceps brachii', 'Biceps', 'Brachialis', 'Bíceps']
  },
  triceps: {
    label: 'Tríceps',
    icono: '🦾',
    musculos: ['Triceps brachii', 'Triceps', 'Tríceps']
  },
  core: {
    label: 'Core / Abdomen',
    icono: '🎽',
    musculos: ['Rectus abdominis', 'Abs', 'Obliquus externus abdominis', 'Core', 'Abdomen']
  },
  cuadriceps: {
    label: 'Cuádriceps',
    icono: '🦵',
    musculos: ['Quadriceps femoris', 'Quads', 'Cuádriceps']
  },
  femorales: {
    label: 'Femorales / Glúteos',
    icono: '🍑',
    musculos: ['Biceps femoris', 'Hamstrings', 'Gluteus maximus', 'Glutes', 'Femorales', 'Glúteos']
  },
  pantorrillas: {
    label: 'Pantorrillas',
    icono: '🦶',
    musculos: ['Gastrocnemius', 'Calves', 'Soleus', 'Pantorrillas']
  }
}

export function obtenerGrupoPorMusculo(nombreCientifico, nombreComun) {
  const nombres = [nombreCientifico, nombreComun].filter(Boolean).map(n => n.toLowerCase())

  for (const [key, grupo] of Object.entries(gruposMusculares)) {
    const coincide = grupo.musculos.some(m =>
      nombres.includes(m.toLowerCase())
    )
    if (coincide) return { key, ...grupo }
  }
  return null
}