import React from 'react'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const App = () => {
  const tareasInitialState = JSON.parse(localStorage.getItem('tareas')) || []
  // Si JSON.parse(localStorage.getItem('tareas')) no devuelve nada se asigna []
  const tareaInitialState = {
    nombre: '',
    descripcion: '',
    estado: false,
    prioridad: false,
  }
  const [tareas, setTareas] = useState(tareasInitialState)
  // Hook que crea la propiedad tareas en state:
  // this.state = {
  //    tareas : tareasInitialState
  // }
  // setTareas actualiza la propiedad tareas:
  // setTareas(valor_nuevo)
  const [tarea, setTarea] = useState(tareaInitialState)
  // Hook que crea la propiedad tarea en state:
  // this.state = {
  //    tareas : tareasInitialState,
  //    tarea : tareaInitialState
  // }
  // setTarea actualiza la propiedad tareas:
  // setTarea(valor_nuevo)

  // Funciones
  const agregarTarea = e => {
    e.preventDefault()
    if (!tarea.nombre.trim()) {
      // Si la tarea no tiene nombre
      e.target[0].focus()
      // Se señala el input del nombre
      Swal.fire({
        // Método de la librería sweetalert2
        // Muestra la siguiente alerta:
        title: 'Error',
        text: 'El campo nombre es obligatorio',
        icon: 'error',
      })
      return
    }
    if (!tarea.descripcion.trim()) {
      e.target[1].focus()
      Swal.fire({
        title: 'Error',
        text: 'El campo descripción es obligatorio',
        icon: 'error',
      })
      return
    }
    // Si no falta ninguno de los campos ->
    Swal.fire({
      title: 'Éxito',
      text: 'Tarea agregada con éxito',
      icon: 'success',
    })
    setTareas([...tareas, tarea])
    // Actualiza tareas añadiendole a la lista de tareas la tarea que se quiere agregar
    setTarea(tareaInitialState)
    // Actualiza tarea devolviendole su valor predeterminado, vacío
  }

  const eliminarTarea = id => {
    setTareas(tareas.filter(item => item.id !== id))
  }
  // Elimina la tarea por su id

  const finalizarTarea = id => {
    setTareas(
      tareas.map(item =>
        item.id === id ? { ...item, estado: !item.estado } : item
      )
    )
  }

  const handleChange = e => {
    setTarea({
      ...tarea,
      [e.target.name]:
        e.target.type === 'checkbox' ? e.target.checked : e.target.value,
      id: Date.now(),
    })
  }

  useEffect(() => {
    localStorage.setItem('tareas', JSON.stringify(tareas))
  }, [tareas])

  const handleonDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;
    const startIndex = source.index;
    const endIndex = destination.index;

    reorder(startIndex, endIndex);
  };

  const reorder = (startIndex, endIndex) => {
    const result = [...tareas];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setTareas(result);
  };

  return (
    <div className='container mt-4'>
      <h1 className='text-center'>Tareas App</h1>
      <hr />
      <div className='row mt-2'>
        <div className='col-8'>
          {/* 
          <h4 className='text-center'>Lista tareas</h4>
          <ul className='class="list-group'>
            {tareas.map((item, index) => (
              <li
                key={index}
                className='list-group-item d-flex justify-content-between'
              >
                <div
                  className={item.estado ? 'text-decoration-line-through' : ''}
                >
                  <div
                    className={
                      item.prioridad
                        ? 'fw-bold  d-flex align-items-start text-danger'
                        : 'fw-bold  d-flex align-items-start'
                    }
                  >
                    {item.nombre}
                  </div>
                  <p>{item.descripcion}</p>
                </div>

                <div className='d-flex justify-content-end align-items-center'>
                  <button
                    type='button'
                    className='btn btn-secondary me-2 btn-sm float-end'
                    onClick={() => finalizarTarea(item.id)}
                  >
                    {item.estado ? 'Activar' : 'Finalizar'}
                  </button>
                  <button className='btn btn-warning me-2 btn-sm float-end'>
                    Editar
                  </button>
                  <button
                    className='btn btn-danger me-2 btn-sm float-end'
                    onClick={e => eliminarTarea(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
          */}
          <DragDropContext onDragEnd={handleonDragEnd}>
            <h4 className='text-center'>Lista tareas</h4>
            <Droppable droppableId="droppable-1">
              {(droppableProvided) => (
                <ul
                  className='class="list-group'
                  ref={droppableProvided.innerRef}
                  {...droppableProvided.droppableProps}
                >
                  {tareas.map((item, index) => (
                    <Draggable key={index} draggableId={`${index}`} index={index}>
                      {(dragableProvided) => (
                        <li
                          className='list-group-item d-flex justify-content-between'
                          ref={dragableProvided.innerRef}
                          {...dragableProvided.draggableProps}
                          {...dragableProvided.dragHandleProps}
                        >
                          <div
                            className={item.estado ? 'text-decoration-line-through' : ''}
                          >
                            <div
                              className={
                                item.prioridad
                                  ? 'fw-bold  d-flex align-items-start text-danger'
                                  : 'fw-bold  d-flex align-items-start'
                              }
                            >
                              {item.nombre}
                            </div>
                            <p>{item.descripcion}</p>
                          </div>

                          <div className='d-flex justify-content-end align-items-center'>
                            <button
                              type='button'
                              className='btn btn-secondary me-2 btn-sm float-end'
                              onClick={() => finalizarTarea(item.id)}
                            >
                              {item.estado ? 'Activar' : 'Finalizar'}
                            </button>
                            <button className='btn btn-warning me-2 btn-sm float-end'>
                              Editar
                            </button>
                            <button
                              className='btn btn-danger me-2 btn-sm float-end'
                              onClick={e => eliminarTarea(item.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {droppableProvided.placeholder}
                </ul>
              )}
            </Droppable>
      </DragDropContext>
        </div>
        <div className='col-4'>
          <h4 className='text-center'>Agregar tareas</h4>
          <form onSubmit={agregarTarea}>
            <input
              name='nombre'
              type='text'
              className='form-control mb-2'
              placeholder='Introduce el nombre de la tarea'
              onChange={e => handleChange(e)}
              value={tarea.nombre}
            />
            <textarea
              name='descripcion'
              type='text'
              className='form-control mb-2'
              placeholder='Introduce la descripción de la tarea'
              onChange={e => handleChange(e)}
              value={tarea.descripcion}
            />
            {/* <select
              name='estado'
              className='form-control mb-2'
              onChange={e => handleChange(e)}
              value={tarea.estado}
            >
              <option value='pendiente'>Pendiente</option>
              <option value='completada'>Completada</option>
            </select> */}

            <div className='form-check mb-2'>
              <input
                className='form-check-input'
                type='checkbox'
                name='prioridad'
                checked={tarea.prioridad}
                onChange={e => handleChange(e)}
              />
              <label className='form-check-label' htmlFor='flexCheckDefault'>
                Prioridad
              </label>
            </div>
            <button className='btn btn-dark w-100 mt-2'>Agregar</button>
          </form>
        </div>
      </div>
    </div>
  )
}


export default App
