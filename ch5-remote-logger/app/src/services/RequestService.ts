import Axios, { AxiosStatic } from "axios";
import { API_URL, EndpointsEnum } from "../../config";

export default class RequestService {

  private static URL: string = API_URL;
  protected http: AxiosStatic = {} as AxiosStatic;

  constructor() {
    this.http = Axios;
  }

  public async get(endpoint: EndpointsEnum) {
    try {
      const response = await this.http.get(`${RequestService.URL}${endpoint}`);
      return response;
    } catch(e) {
      return false;
    }
  }

  public async post(endpoint: EndpointsEnum, data) {
    try {
      const response = await this.http.post(
        `${RequestService.URL}${endpoint}`,
        data, 
      );

      return response;
    } catch(e) {
      console.log(e);
    }
  }

}