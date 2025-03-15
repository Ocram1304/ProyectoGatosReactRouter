import { Outlet, Link } from "react-router"
import { SPENTCATEGORIES } from "~/data/data"
export default function Sidebar(){

    
    return(

        <>
            <nav>
                <h1><Link to={"/"}>Inicio</Link></h1>
                {
                    SPENTCATEGORIES.map((item)=>(
                        <Link key={item.id} to={`/category/${item.category}`}>{item.category}</Link>
                    ))
                }
                <Link to={"/spents"}>Gastos</Link>
            </nav>       
             <div id="content">
                <Outlet/>
            </div>
        </>
       
    )
}