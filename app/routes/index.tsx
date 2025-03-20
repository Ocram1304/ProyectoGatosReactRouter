import { useFetcher } from "react-router";
import { SPENTCATEGORIES } from "~/data/data";
import type { Route } from "./+types";
import type { loadSpent } from "~/firebase/fbActions";
import { LoadSpent } from "~/firebase/fbActions";
import { useState, useEffect } from "react"; // Importar useEffect

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();

    // Crear un objeto con los datos del formulario
    const newSpent: loadSpent = {
        SpentCategory: formData.get("SpentCategory") as string,
        SpentDate: formData.get("SpentDate") as string,
        SpentQuantity: Number(formData.get("SpentQuantity")),
        SpentName: formData.get("SpentName") as string,
    };

    console.log("Cargando datos...");
    try {
        await LoadSpent(newSpent);
        return { success: true };
    } catch (error) {
        console.error("Error al guardar el gasto:", error);
        return { success: false, error: "Error al guardar el gasto" };
    }
}

export default function Index() {
    const fetcher = useFetcher();
    const [formData, setFormData] = useState({
        SpentCategory: "",
        SpentDate: "",
        SpentQuantity: "",
        SpentName: "",
    });

    // Manejar cambios en los campos del formulario
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Limpiar los campos después de un envío exitoso
    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data?.success) {
            setFormData({
                SpentCategory: "",
                SpentDate: "",
                SpentQuantity: "",
                SpentName: "",
            });
        }
    }, [fetcher.state, fetcher.data]); 

    // Manejar el envío del formulario
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        fetcher.submit(formData, { method: "post" });
    };

    return (
        <>
            <div className="container spent-container">
                <fetcher.Form method="post" className="add-spent-form" onSubmit={handleSubmit}>
                    {/* Campo de categoría con datalist */}
                    <div>
                        <label htmlFor="spent-category">Categoría</label>
                        <input
                            list="#spent-category"
                            name="SpentCategory"
                            id="spent-category"
                            value={formData.SpentCategory}
                            onChange={handleChange}
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
                            value={formData.SpentDate}
                            onChange={handleChange}
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
                            value={formData.SpentQuantity}
                            onChange={handleChange}
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
                            value={formData.SpentName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Botón de envío */}
                    <div>
                        <button type="submit" className="btn btn-primary">
                            Agregar
                        </button>
                    </div>
                </fetcher.Form>
            </div>
        </>
    );
}