import { Outlet, Link, useNavigation } from "react-router"
import { SPENTCATEGORIES } from "~/data/data"
export default function Sidebar(){

    const navigation = useNavigation();
    return(

        <>
           

            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Inicio</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        {
                            SPENTCATEGORIES.map((item)=>(
                                <li className="nav-item">
                                    <Link className="nav-link"  key={item.id} to={`/category/${item.category}`}>{item.category}</Link>
                                </li>
                
                            ))
                        } 
                           <li className="nav-item">
                                <Link className="nav-link" to={`/spents`}>Gastos del mes</Link>
                            </li>    
                    </ul>
                </div>
                </div>
            </nav>


             <div id="content" className={navigation.state === "loading" ? "loading" : ""}>
                <Outlet/>
            </div>
        </>
       
    )
}