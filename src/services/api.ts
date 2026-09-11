import {
  Profile,
  FreelanceProject,
  Application,
  ProjectSubmission,
  Review,
  Notification,
  MatchResult
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  private currentUserId: string = 'student-1';

  public setCurrentUserId(id: string) {
    this.currentUserId = id;
    localStorage.setItem('skillmatch_active_user_id', id);
  }

  public getCurrentUserId(): string {
    const saved = localStorage.getItem('skillmatch_active_user_id');
    if (saved) {
      this.currentUserId = saved;
    }
    return this.currentUserId;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}/api${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-user-id': this.getCurrentUserId(),
      ...(options.headers as Record<string, string> || {})
    };

    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err: any) {
      console.error(`[API Error] ${endpoint}:`, err);
      throw err;
    }
  }

  // Auth & Session
  async getMe(): Promise<{ user: Profile }> {
    return this.request<{ user: Profile }>('/auth/me');
  }

  async switchPersona(userId: string): Promise<{ user: Profile }> {
    this.setCurrentUserId(userId);
    return this.request<{ user: Profile }>('/auth/switch-demo', {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
  }

  async signup(data: any): Promise<{ user: Profile }> {
    const res = await this.request<{ user: Profile }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (res.user) {
      this.setCurrentUserId(res.user.id);
    }
    return res;
  }

  async login(email: string, role: 'student' | 'client'): Promise<{ user: Profile }> {
    const res = await this.request<{ user: Profile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, role })
    });
    if (res.user) {
      this.setCurrentUserId(res.user.id);
    }
    return res;
  }

  async resetDemo(): Promise<void> {
    await this.request('/auth/reset-demo', { method: 'POST' });
  }

  // Projects
  async getProjects(params?: { category?: string; difficulty?: string; status?: string; search?: string }): Promise<{ projects: FreelanceProject[] }> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.difficulty) query.set('difficulty', params.difficulty);
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    query.set('studentId', this.getCurrentUserId());

    return this.request<{ projects: FreelanceProject[] }>(`/projects?${query.toString()}`);
  }

  async getProject(id: string): Promise<{ project: FreelanceProject; match: MatchResult | null }> {
    return this.request<{ project: FreelanceProject; match: MatchResult | null }>(`/projects/${id}?studentId=${this.getCurrentUserId()}`);
  }

  async createProject(data: any): Promise<{ project: FreelanceProject }> {
    return this.request<{ project: FreelanceProject }>('/projects', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getProjectApplicants(projectId: string): Promise<{ applicants: Application[]; project: FreelanceProject }> {
    return this.request<{ applicants: Application[]; project: FreelanceProject }>(`/projects/${projectId}/applicants`);
  }

  async applyToProject(projectId: string, data: { proposal: string; proposed_price: number; estimated_days: number }): Promise<{ application: Application }> {
    return this.request<{ application: Application }>(`/projects/${projectId}/apply`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async hireStudent(projectId: string, studentId: string, applicationId?: string): Promise<{ project: FreelanceProject; message: string }> {
    return this.request<{ project: FreelanceProject; message: string }>(`/projects/${projectId}/hire`, {
      method: 'POST',
      body: JSON.stringify({ studentId, applicationId })
    });
  }

  // Applications
  async getApplications(): Promise<{ applications: Application[] }> {
    return this.request<{ applications: Application[] }>(`/applications?student_id=${this.getCurrentUserId()}`);
  }

  // Workspace
  async getWorkspace(projectId: string): Promise<{ project: FreelanceProject; hiredStudent?: Profile; submissions: ProjectSubmission[]; reviews: Review[] }> {
    return this.request(`/workspace/${projectId}`);
  }

  async submitDeliverable(projectId: string, data: { message: string; submission_url: string; github_url?: string }): Promise<{ submission: ProjectSubmission }> {
    return this.request<{ submission: ProjectSubmission }>(`/workspace/${projectId}/submit`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async approveDeliverable(projectId: string): Promise<{ project: FreelanceProject; message: string }> {
    return this.request<{ project: FreelanceProject; message: string }>(`/workspace/${projectId}/approve`, {
      method: 'POST'
    });
  }

  async requestChanges(projectId: string, feedback: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/workspace/${projectId}/request-changes`, {
      method: 'POST',
      body: JSON.stringify({ feedback })
    });
  }

  // Reviews
  async createReview(data: {
    project_id: string;
    student_id: string;
    quality_rating: number;
    communication_rating: number;
    deadline_rating: number;
    professionalism_rating: number;
    comment: string;
  }): Promise<{ review: Review; updatedStudent: Profile }> {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Students & Skills
  async getStudents(search?: string): Promise<{ students: any[] }> {
    const q = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request<{ students: any[] }>(`/students${q}`);
  }

  async getStudent(id: string): Promise<any> {
    return this.request(`/students/${id}`);
  }

  async getStudentMatches(id: string): Promise<{ matches: FreelanceProject[] }> {
    return this.request<{ matches: FreelanceProject[] }>(`/students/${id}/matches`);
  }

  async addSkill(studentId: string, skill: { skill_name: string; proficiency: number; years_experience: number }): Promise<any> {
    return this.request(`/students/${studentId}/skills`, {
      method: 'POST',
      body: JSON.stringify(skill)
    });
  }

  async addPortfolio(studentId: string, portfolio: any): Promise<any> {
    return this.request(`/students/${studentId}/portfolio`, {
      method: 'POST',
      body: JSON.stringify(portfolio)
    });
  }

  // Notifications
  async getNotifications(): Promise<{ notifications: Notification[]; unreadCount: number }> {
    return this.request<{ notifications: Notification[]; unreadCount: number }>('/notifications');
  }

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/notifications/${id}/read`, { method: 'PATCH' });
  }

  async markAllNotificationsRead(): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/notifications/read-all', { method: 'POST' });
  }

  // AI Requirement Extractor
  async analyzeProjectAI(description: string): Promise<any> {
    return this.request('/ai/analyze-project', {
      method: 'POST',
      body: JSON.stringify({ description })
    });
  }
}

export const api = new ApiClient();
