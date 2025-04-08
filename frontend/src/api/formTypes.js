import apiClient from "@/lib/axios";

export const formTypeApi = {
    getAll: async ()=>{
        const { data } = await apiClient.get("/api/v1/form-type/get");
        return data.data
    }
}