/**
 * Type definitions for ClinicalRxQ application
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'member' | 'admin';
  subscription?: Subscription;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  planName: string;
  status: 'active' | 'inactive' | 'cancelled';
  startDate: Date;
  endDate: Date;
  programs: string[];
}

export interface Program {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  modules: Module[];
  resources: Resource[];
  thumbnail: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  content: string;
  duration: string;
  order: number;
  completed?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'document' | 'link';
  url: string;
  description: string;
  category: string;
}

export interface SuccessStory {
  id: string;
  name: string;
  title: string;
  content: string;
  image: string;
  program: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  linkedin?: string;
}
