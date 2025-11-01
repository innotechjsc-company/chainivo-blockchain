import { ApiService, API_ENDPOINTS } from '../api';
import type { ApiResponse } from '../api';
import type { Leader } from '@/types/about';

export class AboutService {
  static async getLeaders(): Promise<ApiResponse<Leader[]>> {
    return ApiService.get<Leader[]>(API_ENDPOINTS.ABOUT.LEADERS);
  }
}

export default AboutService;