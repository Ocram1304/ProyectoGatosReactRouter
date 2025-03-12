import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";


export default [
    layout("layouts/sidebar.tsx",[
        index("routes/index.tsx"),
        route("/category/:category","routes/category.tsx")
    ])    
    ] satisfies RouteConfig;
