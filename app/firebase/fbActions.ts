import {db} from "./firebase";
import {  addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";

 export type loadSpent =  {
    SpentID?: string;
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