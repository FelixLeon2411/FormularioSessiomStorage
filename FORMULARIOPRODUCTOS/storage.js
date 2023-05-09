class Producto {
    constructor(id, descripcion, precio, marca, categoria) {
      this.id = id;
      this.descripcion = descripcion;
      this.precio = precio;
      this.marca = marca;
      this.categoria = categoria;
    }
  }

  let database = new dataManager('product');

  function dataManager(name) {

    let DB = (sessionStorage.getItem(name)) ? JSON.parse(sessionStorage.getItem(name)) : [];
  
    return {
      //OBTIENE TODOS LOS DATOS DE LA LISTA
      get: () => {
        return DB;
      },
      // SE INGRESAN NUEVOS DATOS
      push: (obj) => {
        DB.push(obj);
        sessionStorage.setItem(name, JSON.stringify(DB));
      },
      // ingresar una nueva colección
      set: (collection) => {
        DB = collection;
        sessionStorage.setItem(name, JSON.stringify(DB));
      },
      // eliminar todos los datos de la colección
      delete: () => {
        DB = [];
        sessionStorage.setItem(name, JSON.stringify(DB));
      }
    }
  }
  function saveData() {
    const id = parseInt(document.getElementById("id").value);
    const descripcion = document.getElementById("descripcion").value;
    const precio = parseFloat(document.getElementById("precio").value);
    const marca = document.getElementById("marca").value;
    const categoria = document.getElementById("categoria").value;
  
    //ATRAVES DE ESTA CONDICION VALIDAMOS QUE EL ID SEA DE TIPO INT/ENTERO
    if (!Number.isInteger(id)) {
      alert('El ID debe ser un número entero');
      return;
    }
  
    //validamos que el ID no se repita con otro producto
    const productos = database.get();
    const productoExistente = productos.find(producto => producto.id === id);
    if (productoExistente) {
      alert('El ID que proporciono ya existe');
      return;
    }
  
    //validamos que el precio sea un número decimal o entero
    if (isNaN(precio)) {
      alert('El precio debe ser un número');
      return;
    }
  
    const producto = new Producto(id, descripcion, precio, marca, categoria);
  
    database.push(producto);
  }
  
  
  function listData() {
    let productos = database.get();
    let table = document.getElementById("products");
    table.innerHTML = "";
    let i = 0;
    productos.forEach(producto => {
      let row = table.insertRow(i);
      let cell = row.insertCell(0);
      cell.innerHTML = producto.id;
      cell = row.insertCell(1);
      cell.innerHTML = producto.descripcion;
      cell = row.insertCell(2);
      cell.innerHTML = producto.precio;
      cell = row.insertCell(3);
      cell.innerHTML = producto.marca;
      cell = row.insertCell(4);
      cell.innerHTML = producto.categoria;
      i++;
    });
  }
  function searchData() {
    const id = parseInt(document.getElementById("search").value);
    const productos = database.get();
    const productoEncontrado = productos.find(producto => producto.id === id);
    let table = document.getElementById("product");
    if (productoEncontrado) {
      let row = table.insertRow(0);
      let cell = row.insertCell(0);
      cell.innerHTML = productoEncontrado.id;
      cell = row.insertCell(1);
      cell.innerHTML = productoEncontrado.descripcion;
      cell = row.insertCell(2);
      cell.innerHTML = productoEncontrado.precio;
      cell = row.insertCell(3);
      cell.innerHTML = productoEncontrado.marca;
      cell = row.insertCell(4);
      cell.innerHTML = productoEncontrado.categoria;
    } else {
      let row = table.insertRow(0);
      let cell = row.insertCell(0);
      cell.innerHTML = "Producto no encontrado";
    }


  }
  // BORRAMOS EL CONTENIDO DEL PRODUCTO CON EL ID PRODUCT
  function clearSearch() {
    document.getElementById("product").innerHTML = "";
  }

  //ACTUALIZAR DATOS

function updateData() {
  const id = parseInt(document.getElementById("id").value);
  const descripcion = document.getElementById("descripcion").value;
  const precio = parseFloat(document.getElementById("precio").value);
  const marca = document.getElementById("marca").value;
  const categoria = document.getElementById("categoria").value;

  //ATRAVES DE ESTA CONDICION VALIDAMOS QUE EL ID SEA DE TIPO INT/ENTERO
  if (!Number.isInteger(id)) {
    alert('El ID debe ser un número entero');
    return;
  }

  //validamos que el ID exista en la base de datos
  const productos = database.get();
  const index = productos.findIndex(producto => producto.id === id);
  if (index === -1) {
    alert('El ID que proporcionó no existe');
    return;
  }

  //validamos que el precio sea un número decimal o entero
  if (isNaN(precio)) {
    alert('El precio debe ser un número');
    return;
  }

  //ACTUALIZAMOS EL PRODUCTO
  productos[index].descripcion = descripcion;
  productos[index].precio = precio;
  productos[index].marca = marca;
  productos[index].categoria = categoria;
  database.set(productos);

  //limpiamos los campos del formulario y actualizamos la lista de productos
  document.getElementById("id").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("marca").value = "";
  document.getElementById("categoria").value = "";
  listData();
}


function editData() {
  const id = parseInt(document.getElementById("search").value);
  const productos = database.get();
  const productoEncontrado = productos.find(producto => producto.id === id);
  let table = document.getElementById("product");
  table.innerHTML = ""; 
  if (productoEncontrado) {
    let row = table.insertRow(0);
    let cell = row.insertCell(0);
    cell.innerHTML = productoEncontrado.id;
    cell = row.insertCell(1);
    cell.innerHTML = `<input type="text" value="${productoEncontrado.descripcion}" id="EditarDescripcion">`;
    cell = row.insertCell(2);
    cell.innerHTML = `<input type="text" value="${productoEncontrado.precio}" id="EditarPrecio">`;
    cell = row.insertCell(3);
    cell.innerHTML = `<input type="text" value="${productoEncontrado.marca}" id="EditarMarca">`;
    cell = row.insertCell(4);
    cell.innerHTML = productoEncontrado.categoria;
    } else {
    let row = table.insertRow(0);
    let cell = row.insertCell(0);
    cell.innerHTML = "Producto no encontrado";
  }
}
function saveEditData() {
  const id = parseInt(document.getElementById("search").value);
  const descripcion = document.getElementById("EditarDescripcion").value;
  const precio = parseFloat(document.getElementById("EditarPrecio").value);
  const marca = document.getElementById("EditarMarca").value;
  const categoria = document.getElementById("categoria").value;

  console.log(`id:${id}, descripcion: ${descripcion}`);
  
  const productos = database.get();
  const index = productos.findIndex(producto => producto.id === id);

  if (index !== -1) {
    productos[index].descripcion = descripcion;
    productos[index].precio = precio;
    productos[index].marca = marca;
    productos[index].categoria = categoria;
    database.set(productos);
    alert('Producto actualizado correctamente');
    clearSearch();
    listData();
  } else {
    alert('Producto no encontrado');
  }
}



// ELEMINAR PRODUCTO
  
  function deleteProduct() {
    const id = parseInt(document.getElementById("search").value);
    let productos = database.get();
    const index = productos.findIndex(producto => producto.id === id);
    if (index !== -1) {
      productos.splice(index, 1);
      database.set(productos);
      alert('Producto eliminado correctamente');
      clearSearch();
      listData();
    } else {
      alert('Producto no encontrado');
    }
  }
     
    function deleteData() {
    database.delete();
  }
  
