import { Injectable } from "@nestjs/common";

import { httpAdapter } from "../interfaces/http-adapter.interfaces";
import axios, { AxiosInstance } from "axios";

@Injectable()
export class AxiosAdapter implements httpAdapter {

    private axios:AxiosInstance = axios; 

    async get<T>(url: string): Promise<T> {
       try {
        const {data} = await this.axios.get<T>(url);
        return data;
       } catch (error) {
        throw new Error("This is a error in axios adapter-- checklogs ")
       }
    }
    
}