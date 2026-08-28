mkdir -p frontend/docs
cat > frontend/docs/ERRORES.md << 'EOF'
# ⚠️ Manejo de Errores y Validaciones

## Validaciones

- Se utiliza **Zod** para validar formularios:
  - Login
  - Registro de actividades
  - Registro de sueño

## Frontend

- Los mensajes de error de Zod se muestran en la interfaz.
- Los errores de Firebase Auth se traducen a mensajes amigables.
- El cliente HTTP captura errores de red y de respuesta.

## Backend

- Firestore Security Rules evitan accesos no autorizados.
- Firebase Auth valida credenciales y sesión.
EOF