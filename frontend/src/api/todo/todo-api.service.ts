import { apiRoutes } from "../routes";
import { useFetch } from "../utils/react-query.service";

export const useGetAllTodos = () => useFetch<any>(apiRoutes.getAllTodos);
