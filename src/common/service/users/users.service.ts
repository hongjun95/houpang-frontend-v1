import axios from 'axios';

class UserService {
  constructor(private readonly url: string, private readonly version: string) {}

  private readonly headerConfig = {
    baseURL: this.url,
    headers: {
      'Content-Type': 'application/json',
      'Accept-Version': `v${this.version}`,
    },
  };

  private readonly api = axios.create(this.headerConfig);

  async signup(data) {
    const response = await this.api.post('/signup', {
      params: {
        chart: 'mostPopular',
        maxResults: 25,
      },
      data,
    });

    const result = response.data;
    return result.items;
  }

  async login(data) {
    const response = await this.api.post('/login', {
      params: {
        chart: 'mostPopular',
        maxResults: 25,
      },
      data,
    });

    const result = response.data;
    return result.items;
  }
}

export default UserService;
