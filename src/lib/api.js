export async function fetchProductos() {
  const resp = await fetch("http://localhost/php-react/php-validar/productos.php");
  const data = await resp.json();

  if (!data.ok) {
    throw new Error(data.mensaje || "Error al cargar productos");
  }

  return data.productos;
}

export async function fetchUsuarios() {
  const resp = await fetch("http://localhost/php-react/php-validar/usuarios_get.php")
  const data = await resp.json()

  if (!data.ok) {
    throw new Error(data.mensaje || "Error al cargar usuarios")
  }

  return data.usuarios
}

export async function createUsuario(usuario) {
  const resp = await fetch("http://localhost/php-react/php-validar/usuarios_create.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  })
  const data = await resp.json()
  if (!data.ok) {
    throw new Error(data.mensaje || "Error al crear usuario")
  }
  return data.usuario
}

export async function updateUsuario(usuario) {
  const resp = await fetch("http://localhost/php-react/php-validar/usuarios_update.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  })
  const data = await resp.json()
  if (!data.ok) {
    throw new Error(data.mensaje || "Error al actualizar usuario")
  }
  return true
}

export async function deleteUsuario(id) {
  const resp = await fetch("http://localhost/php-react/php-validar/usuarios_delete.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  })
  const data = await resp.json()
  if (!data.ok) {
    throw new Error(data.mensaje || "Error al desactivar usuario")
  }
  return true
}
export async function actualizarStock(items) {
  const resp = await fetch(
    "http://localhost/php-react/php-validar/actualizar_stock.php",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    }
  )

  const data = await resp.json()

  if (!data.ok) {
    throw new Error(data.mensaje || "Error al actualizar stock")
  }

  return true
}
export async function registrarVenta(venta) {
  const resp = await fetch(
    "http://localhost/php-react/php-validar/registrar_venta.php",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(venta),
    }
  )

  const data = await resp.json()
  if (!data.ok) {
    throw new Error(data.mensaje || "Error al registrar venta")
  }

  return data.venta_id
}

export async function fetchVentasHoy() {
  const resp = await fetch(
    "http://localhost/php-react/php-validar/ventas_hoy.php"
  )
  const data = await resp.json()

  if (!data.ok) {
    throw new Error(data.mensaje || "Error al cargar ventas")
  }

  return data.ventas
}

export async function ajustarStockAdmin(id, cantidad) {
  const resp = await fetch(
    "http://localhost/php-react/php-validar/ajustar_stock_admin.php",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, cantidad }),
    }
  )

  const data = await resp.json()

  if (!data.ok) {
    throw new Error(data.mensaje || "Error al ajustar stock")
  }

  return true
}

export async function createProducto(producto) {
  const resp = await fetch("http://localhost/php-react/php-validar/productos_create.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  })

  const data = await resp.json()
  if (!data.ok) throw new Error(data.mensaje)
  return data.producto
}

export async function updateProducto(producto) {
  const resp = await fetch("http://localhost/php-react/php-validar/productos_update.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  })

  const data = await resp.json()
  if (!data.ok) throw new Error(data.mensaje || "Error al actualizar producto")
  return true
}

export async function deleteProducto(id) {
  const resp = await fetch("http://localhost/php-react/php-validar/productos_delete.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  })

  const data = await resp.json()
  if (!data.ok) throw new Error(data.mensaje)
  return true
}
