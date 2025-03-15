import type { Route } from "./+types";
import {  useFetcher } from "react-router"; // Asegúrate de importar desde "react-router-dom"
import { SpentsPerMonths } from "~/firebase/fbActions";
import type { SpentMonthly } from "~/firebase/fbActions";
export async function loader({ params }: Route.LoaderArgs) {
    const Defaultdata = await SpentsPerMonths("Current");
    return Defaultdata;
}

export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const q = formData.get("monthQuery") as string;
    const queryResults = await SpentsPerMonths(q);
    return queryResults;
}

export default function Gastos({ loaderData }: Route.ComponentProps) {
    const Defaultdata = loaderData || [];
    const fetcher = useFetcher();

    // Manejar el cambio en el input
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const form = event.target.form; 
        if (form) {
            fetcher.submit(form);
        }
    };

    
    const dataToShow = fetcher.data || Defaultdata;

    return (
        <div>
            {/* Formulario para seleccionar el mes */}
            <fetcher.Form method="post">
                <input
                    list="MonthOption"
                    id="monthQuery"
                    name="monthQuery"
                    required
                    onChange={handleChange} // Manejar cambios en el input
                />
                <datalist id="MonthOption">
                    <option value="Current">Mes actual</option>
                    <option value="LastMonth">Mes anterior</option>
                    <option value="SecondToLast">Hace dos meses</option>
                    <option value="ThirdToLast">Hace tres meses</option>
                    <option value="All">Todos</option>
                </datalist>
            </fetcher.Form>

            {/* Contenedor de resultados */}
            <div className="spentBillContainer">
                {dataToShow.length === 0 ? (
                    <p>No hay registros</p>
                ) : (
                    dataToShow.map((item:SpentMonthly) => (
                        <div key={item.month}>
                            <h3>Gastos del mes</h3>
                            <p>
                                <span>Mes:</span> {item.month}, <span>Total:</span> {item.totalAmount}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}