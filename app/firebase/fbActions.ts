import {db} from "./firebase";
import {  addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";

 export type loadSpent =  {
    SpentID?: string,
    SpentCategory: string,
    SpentDate: string,
    SpentQuantity: number,
    SpentName: string,
}
export const LoadSpent = async(data:loadSpent):Promise<void>=>{
  try {
        //añadir documento a la base de datos
        const loadSuccess = await addDoc(collection(db,"gastos"),data);
        if(loadSuccess){
            console.log("Gasto añadido correctamente");
        }
  } catch (error) {
    console.log("Error al intentar subir los datos");
  }
}

export const DeleSpent = async (id: string): Promise<{ ok: boolean; error?: string }> => {
    try {
        const spentRef = doc(db, "gastos", id);
        await deleteDoc(spentRef);
        console.log("Gasto eliminado correctamente");
        return { ok: true }; 
    } catch (error) {
        console.error("Error al borrar en Firestore:", error);
        return { ok: false, error: "Error al borrar en Firestore" }; // Devolver una respuesta de error
    }
};



export type bucketSpents = loadSpent[];

export const DowloadSpents = async (categotyS: string = "All"): Promise<bucketSpents> => {
    try {
        // Leer los datos de la colección "gastos"
        const querySnapShot = await getDocs(collection(db, "gastos"));

        // Mapear los datos con el ID incluido
        const spentBucket: bucketSpents = querySnapShot.docs.map((doc) => ({
            SpentID: doc.id, // Incluir el ID del documento
            SpentCategory: doc.data().SpentCategory, 
            SpentDate: doc.data().SpentDate,
            SpentQuantity: doc.data().SpentQuantity,
            SpentName: doc.data().SpentName,
        }));

        // Filtrar por categoría si no es "All"
        if (categotyS !== "All") {
            const spentBucketFiltered = spentBucket.filter((sp) => sp.SpentCategory === categotyS);
            return spentBucketFiltered;
        }

        // Retornar todos los gastos si no se especifica una categoría
        return spentBucket;
    } catch (error) {
        console.error("Error al descargar los gastos:", error);
        throw error; // Lanzar el error para manejarlo en el componente
    }
};

export type SpentMonthly = {
    month: string; 
    totalAmount: number; 
};

export type SpentsRegister = SpentMonthly[];

export const SpentsPerMonths = async (mesTarget: string = "Current"): Promise<SpentsRegister> => {
    // Obtener los datos de la BD
    const bucket = await DowloadSpents("All");

    // Mapear y formatear los datos
    const filterBucket = bucket.map((sp) => ({
        month: new Date(sp.SpentDate).toLocaleString("es-ES", { month: 'long' }), 
        quantity: sp.SpentQuantity, 
    }));

    // Agrupar los gastos por mes y sumar las cantidades
    const monthlySpents: { [key: string]: number } = {};

    filterBucket.forEach((spent) => {
        if (monthlySpents[spent.month]) {
            monthlySpents[spent.month] += spent.quantity; // Sumar al mes existente
        } else {
            monthlySpents[spent.month] = spent.quantity; // Crear nuevo mes
        }
    });

    // Convertir el objeto a un array de SpentMonthly
    const spentsRegister: SpentsRegister = Object.keys(monthlySpents).map((month) => ({
        month,
        totalAmount: monthlySpents[month],
    }));

    // Definir los meses objetivo usando un objeto
    const currentDate = new Date();
    const targetMonths = {
        Current: currentDate.toLocaleString("es-ES", { month: 'long' }), // Mes actual
        LastMonth: new Date(currentDate.setMonth(currentDate.getMonth() - 1)).toLocaleString("es-ES", { month: 'long' }), // Mes anterior
        SecondToLast: new Date(currentDate.setMonth(currentDate.getMonth() - 1)).toLocaleString("es-ES", { month: 'long' }), // Hace dos meses
        ThirdToLast: new Date(currentDate.setMonth(currentDate.getMonth() - 1)).toLocaleString("es-ES", { month: 'long' }), // Hace tres meses
    };

    // Filtrar según el mes objetivo
    const targetMonth = targetMonths[mesTarget as keyof typeof targetMonths] || null;

    if (targetMonth) {
        return spentsRegister.filter((spent) => spent.month === targetMonth);
    }

    return spentsRegister; // Devolver todos los meses si no se especifica un mes objetivo válido
};