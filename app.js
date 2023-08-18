 const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, pausa, leerInput, listadoTareasBorrar, confirmar, mostrarListadoCheckList } = require('./helpers/inquirer');
const Tarea = require('./models/tarea');
const Tareas = require('./models/tareas');

require('colors');

console.clear();

const main = async ()=>{

let opt = '';
const tareas = new Tareas();
const tareasdDB = leerDB();
if (tareasdDB) {
    // cargar las tareas
    tareas.cargarTareasFromArray(tareasdDB);
}
// await pausa();

do {
    // imprimir opciones del menú
    opt = await inquirerMenu();
    
    switch (opt) {
        case '1':
            
            const desc = await leerInput('Descripción: ');
            tareas.crearTarea(desc);
            break;
    
        case '2':
            tareas.listadoCompleto();
            break;

        case '3': // listar completadas
            tareas.listarPendientesCompletadas(true);
            break;
        
        case '4': // listar incompletas
            tareas.listarPendientesCompletadas(false);
            break;

        case '5': //completar tareas
           const ids = await mostrarListadoCheckList(tareas.listadoArr);
           tareas.toggleCompletadas(ids);
            break;
        
        case '6': // borrar
           const id = await listadoTareasBorrar(tareas.listadoArr);
           if (id !== '0') {
            const ok = await confirmar('¿Está seguro?');
            if (ok) {
             tareas.borrarTarea(id);
             console.log('Tarea borrada');
            }
           }
           
            break;
        
        }

       
    
    guardarDB(tareas.listadoArr);
    await pausa();

} while (opt !== '0');


};

main();