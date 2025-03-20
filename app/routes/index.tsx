import { Form, useNavigate } from "react-router"; 
import { SPENTCATEGORIES } from "~/data/data";
import type { Route } from "./+types";
import type { loadSpent } from "~/firebase/fbActions";
import { LoadSpent } from "~/firebase/fbActions";

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();

    // Crear un objeto con los datos del formulario

    const newSpent: loadSpent = {
        SpentCategory: formData.get("SpentCategory") as string,
        SpentDate: formData.get("SpentDate") as string,
        SpentQuantity: Number(formData.get("SpentQuantity")),
        SpentName: formData.get("SpentName") as string,
    };
    console.log("cargando datos");
    try {
        await LoadSpent(newSpent);
        return { success: true };
    } catch (error) {
        console.error("Error al guardar el gasto:", error);
        return { success: false, error: "Error al guardar el gasto" };
    }
}

export default function Index() {
    return (
        <>
            <div className="container spent-container">
                <Form method="post" className="add-spent-form">
                    {/* Campo de categoría con datalist */}
                    <div>
                        <label htmlFor="#spent-category">Categoría</label>
                        <input
                            list="#spent-category"
                            name="SpentCategory"
                            id="spent-category"
                            required
                        />
                        <datalist id="#spent-category">
                            {SPENTCATEGORIES.map((item) => (
                                <option key={item.id} value={item.category}>
                                    {item.category}
                                </option>
                            ))}
                        </datalist>
                    </div>

                    {/* Campo de fecha */}
                    <div>
                        <label htmlFor="spent-date">Fecha</label>
                        <input
                            type="date"
                            name="SpentDate"
                            id="spent-date"
                            required
                        />
                    </div>

                    {/* Campo de cantidad */}
                    <div>
                        <label htmlFor="spent-quantity">Cantidad</label>
                        <input
                            type="number"
                            name="SpentQuantity"
                            id="spent-quantity"
                            required
                        />
                    </div>

                    {/* Campo de nombre */}
                    <div>
                        <label htmlFor="spent-name">Nombre</label>
                        <input
                            type="text"
                            name="SpentName"
                            id="spent-name"
                            required
                        />
                    </div>

                    {/* Botón de envío */}
                    <div>
                        <button type="submit" className="btn btn-primary">Agregar</button>
                    </div>
                </Form>
            </div>
        </>
    );
}