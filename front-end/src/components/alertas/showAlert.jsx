import Swal from 'sweetalert2';

const showAlert = async ({ type, message, title, confirmAction }) => {
    if (type === 'confirmation') {
        // No pasamos "confirmation" como tipo de icono
        const result = await Swal.fire({
            title: title || '¿Estás seguro?',
            text: message || "Confirma que la información sea correcta.",
            icon: 'warning',  // Usa "warning" como el icono para confirmaciones
            iconColor: '#007BFF',
            showCancelButton: true,
            confirmButtonColor: '#007BFF',
            cancelButtonColor: '#81d4fa',
            confirmButtonText: 'Sí, estoy seguro!',
            cancelButtonText: 'Cancelar',
            customClass: {
                container: 'swal2-container',
                popup: 'swal2-popup'
            }
        });

        // Maneja la acción si el usuario confirma
        if (result.isConfirmed && typeof confirmAction === 'function') {
            confirmAction();  // Ejecuta la acción de confirmación
        }

        return result;
    }

    // Para cualquier otro tipo de alerta (success, error, etc.)
    return await Swal.fire({
        icon: type, // 'success', 'error', 'warning', 'info', 'question'
        title: title || (type === 'success' ? 'Operación exitosa' : 'Oops...'),
        text: message, // Muestra el mensaje personalizado
        confirmButtonColor: "#6fc390",
        customClass: {
            container: 'swal2-container',
            popup: 'swal2-popup'
        }
    });
};

export default showAlert;
