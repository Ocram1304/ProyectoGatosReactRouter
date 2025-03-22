import type { Route } from "./+types"
import { DowloadSpents, DeleSpent } from "~/firebase/fbActions"
import { Form } from "react-router";
import { useState } from "react";
import type { loadSpent,} from "~/firebase/fbActions";



export async function loader({ params }: Route.LoaderArgs) {
  const cate = params.category;
  const Spents = await DowloadSpents(cate);
  if (!Spents) {
      throw new Response("Not Found", { status: 404 });
  }
  return Spents;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const idSpent = formData.get("SpentID") as string;
  await DeleSpent(idSpent);
  return null; // Retornar algo para evitar errores
}

export default function Category({ loaderData }: Route.ComponentProps) {
  // Estado de la ventana modal
  const [enableModal, setEnableModal] = useState(false);

  // Función para habilitar/deshabilitar la modal
  const toggleModal = () => {
      setEnableModal((prev) => !prev);
  };

  // Datos obtenidos del loader, con valor por defecto si es undefined
  const Spents = loaderData || [];

  return (
      <div className="Spents-Container">
          {/* Condición para mostrar un mensaje si no hay datos */}
          {Spents.length === 0 ? (
              <div className="no-spents-data">
                <p>No hay gastos para mostrar.</p>
              </div>
              
          ) : (
              // Mapeo de los gastos y paso de props al componente
              Spents.map((spentData: loadSpent) => (
                  <SpentItem
                      key={spentData.SpentID}
                      dataSpent={spentData}
                      modal={enableModal}
                      toggleModal={toggleModal}
                  />
              ))
          )}
      </div>
  );
}

function SpentItem({
  dataSpent,
  modal,
  toggleModal,
}: {
  dataSpent: loadSpent;
  modal: boolean;
  toggleModal: () => void;
}) {


  return (
      <>
          <div className="container-fluid category-container ">
            <div className="row">
            <div className="col-6 col-sm-2">
                  <p><span>{dataSpent.SpentCategory &&(<CategoryIcon
                   category={dataSpent.SpentCategory}/>)}</span></p>
                </div>
                <div className="col-6 col-sm-2">
                  <p><span>Categoría:</span> {dataSpent.SpentCategory}</p>
                </div>
                <div className="col-6 col-sm-2">
                  <p><span>Fecha:</span> {dataSpent.SpentDate}</p>
                </div>
                <div className="col-6 col-sm-2">
                  <p><span>Gasto:</span> {dataSpent.SpentName}</p>
                </div>
                <div className="col-6 col-sm-2">
                  <p><span>Cantidad:</span> ${dataSpent.SpentQuantity}</p>
                </div>
                <div className="col-6 col-sm-2">
                  <button type="button" className="btn btn-danger" onClick={toggleModal}>
                      Borrar
                  </button>
                </div>
            </div>
              

              {/* Mostrar la modal si está habilitada */}
              {modal && (
                  <Modalwindow
                      name={dataSpent.SpentName}
                      id={dataSpent.SpentID}
                      toggleModal={toggleModal}
                  />
              )}
          </div>
      </>
  );
}

function Modalwindow({
  name,
  id,
  toggleModal,
}: {
  name: string;
  id?: string;
  toggleModal: () => void;
}) {
  return (
      <div className="modal" tabIndex={-1}>
          <div className="modal-dialog">
              <div className="modal-content">
                  <div className="modal-header">
                      <h5 className="modal-title">Eliminar gasto</h5>
                      <button
                          type="button"
                          className="btn-close"
                          onClick={toggleModal} // Cerrar la modal al hacer clic
                          aria-label="Close"
                      ></button>
                  </div>
                  <div className="modal-body">
                      <p>{`¿Estás seguro de eliminar ${name}?`}</p>
                  </div>
                  {/* Si se envía el formulario, se borra el gasto; caso contrario, se cierra la modal */}
                  <Form method="post" className="modal-footer">
                      <input type="hidden" name="SpentID" value={id} />
                      <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={toggleModal} // Cerrar la modal al hacer clic
                      >
                          Cancelar
                      </button>
                      <button type="submit" className="btn btn-primary">
                          Borrar
                      </button>
                  </Form>
              </div>
          </div>
      </div>
  );
}

function CategoryIcon({category}:{category:string}){
  const CATEGORYICON = {
    Ropa: <i className="bi bi-bag-dash-fill"></i>,
    Transporte: <i className="bi bi-bus-front-fill"></i>,
    Servicios: <i className="bi bi-receipt"></i>,
    Recreación: <i className="bi bi-controller"></i>,
    All: <i className="bi bi-globe"></i>
  }
  const renderizeCategory  = CATEGORYICON[category as keyof typeof CATEGORYICON] || <p>No Icon</p>;
  return(
    renderizeCategory
  )
}