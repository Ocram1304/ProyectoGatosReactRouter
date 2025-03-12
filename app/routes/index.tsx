import { Form } from "react-router"
import { SPENTCATEGORIES } from "~/data/data"
import type { Route } from "./+types"
import type { loadSpent } from "~/firebase/fbActions";
import { LoadSpent } from "~/firebase/fbActions";


export async function action({params, request}: Route.ActionArgs) {
    const formData = await request.formData();
    
    
    const newSpent: loadSpent = {
        SpentCategory: formData.get("SpentCategoy") as string,
        SpentDate: formData.get("SpentDate") as string,
        SpentQuantity: Number(formData.get("SpentQuantity")) ,
        SpentName: formData.get(" SpentName") as string
    }
    
    try {
        await LoadSpent(newSpent);
        console.log("Gasto añadido correctamente");
        return { success: true };
    } catch (error) {
        console.error("Error al guardar el gasto:", error);
        return { success: false, error: "Error al guardar el gasto" }; 
    } 
}

export default function Index(){
    return(
        <>
            <div className="spent-container"> 
                <Form method="post">

                    <div>
                        <label htmlFor="sepent-category">Categoría</label>
                        <input
                            list="spent-category"
                            name="SpentCategory"
                            id="spent-category"
                        />
                        <datalist  id="spent-category">
                           {
                            SPENTCATEGORIES.map((item)=>(
                                <option key={item.id} value={item.category} >{item.category}</option>
                            ))
                           } 
                        </datalist>
                    </div>
    
                    <div>
                        <label htmlFor="sepent-date">Fecha</label>
                        <input type="date" name="SpentDate" id="spent-date" />
                    </div>

                    <div>
                        <label htmlFor="sepent-quantity">Cantidad</label>
                        <input type="number" name="SpentQuantity" id="spent-quantity" />
                    </div>

                    <div>
                        <label htmlFor="sepent-name">Nombre</label>
                        <input type="datetime-local" name="SpentName" id="spent-name" />
                    </div>

                    <div>
                        <button type="submit">Agregar</button>
                    </div>
                </Form>
            </div>
        </>
    )
}