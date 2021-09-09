import axios, { AxiosResponse } from 'axios';
import { LoginOutput, SignUpOutput } from 'src/interfaces/user.interface';

class UserService {
  constructor() {}

  private readonly headerConfig = {
    baseURL: 'http://localhost:4000',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Version': `v1`,
      withCredentials: true,
    },
  };

  private readonly api = axios.create(this.headerConfig);

  async signup(body) {
    let response: AxiosResponse<SignUpOutput>;
    try {
      response = await this.api.post<SignUpOutput>('/signup', {
        data: body,
      });
    } catch (error) {
      console.error(error);
    }
    const result = response.data;
    return result;
  }

  async login(data) {
    let response: AxiosResponse<LoginOutput>;
    try {
      response = await this.api.post('/login', {
        data,
      });
    } catch (error) {
      console.error(error);
    }
    const result = response.data;
    return result;
  }
}

export default UserService;
