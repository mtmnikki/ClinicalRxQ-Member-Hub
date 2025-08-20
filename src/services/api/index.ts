/**
 * Api mock service
 * - Purpose: Provide Dashboard with realistic demo data without external dependencies.
 * - Replace these methods with real integrations when ready.
 */

import { Announcement, ClinicalProgram, QuickAccessItem, RecentActivity, ResourceItem } from './types';
import { buildPublicUrl } from '../supabaseStorage';

/**
 * Simulate async latency
 */
function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 * Api methods
 */
export const Api = {
  /** Get Clinical Programs
   * Normalized to canonical ProgramSlugs used by routes and storage:
   * - mtmthefuturetoday
   * - timemymeds
   * - testandtreat
   * - hba1c
   * - oralcontraceptives
   */
  async getPrograms(): Promise<ClinicalProgram[]> {
    await wait(200);
    return [
      {
        slug: 'mtmthefuturetoday',
        name: 'MTM The Future Today',
        description:
          'Team-based Medication Therapy Management with proven protocols and technician workflows.',
        icon: 'ClipboardCheck',
        resourceCount: 18,
        lastUpdatedISO: new Date(Date.now() - 86400 * 1000 * 3).toISOString(),
      },
      {
        slug: 'timemymeds',
        name: 'TimeMyMeds',
        description:
          'Appointment-based care via synchronization workflows that unlock clinical service delivery.',
        icon: 'CalendarCheck',
        resourceCount: 12,
        lastUpdatedISO: new Date(Date.now() - 86400 * 1000 * 10).toISOString(),
      },
      {
        slug: 'testandtreat',
        name: 'Test & Treat Services',
        description:
          'CLIA-waived testing and treatment plans for Flu, Strep, and COVID-19.',
        icon: 'Stethoscope',
        resourceCount: 15,
        lastUpdatedISO: new Date(Date.now() - 86400 * 1000 * 6).toISOString(),
      },
      {
        slug: 'hba1c',
        name: 'HbA1c Testing',
        description:
          'POC A1c testing integrated with diabetes care and MTM workflows.',
        icon: 'Activity',
        resourceCount: 9,
        lastUpdatedISO: new Date(Date.now() - 86400 * 1000 * 18).toISOString(),
      },
      {
        slug: 'oralcontraceptives',
        name: 'Oral Contraceptives',
        description:
          'From patient intake to billing—simplified, step-by-step service workflows.',
        icon: 'TestTubes',
        resourceCount: 11,
        lastUpdatedISO: new Date(Date.now() - 86400 * 1000 * 12).toISOString(),
      },
    ];
  },

  /** Get Quick Access tiles */
  async getQuickAccess(): Promise<QuickAccessItem[]> {
    await wait(150);
    return [
      {
        id: 'qa-1',
        title: 'CMR Pharmacist Protocol',
        subtitle: 'MTM Protocols',
        cta: 'Download',
        icon: 'FileText',
        url: buildPublicUrl('mtmthefuturetoday/protocols/MTMTFT%20Pharmacist%20Protocol.pdf'),
        external: true,
      },
      {
        id: 'qa-2',
        title: 'Technician Training Module 1',
        subtitle: 'Onboarding',
        cta: 'Watch',
        icon: 'PlayCircle',
        url: buildPublicUrl('mtmthefuturetoday/training/1%20Introduction%20to%20MTM.mp4'),
        external: true,
      },
      {
        id: 'qa-3',
        title: 'A1c Patient Handout',
        subtitle: 'Diabetes Care',
        cta: 'Download',
        icon: 'FileText',
        url: buildPublicUrl('patienthandouts/Diabetes/Checking%20your%20Blood%20Sugar.pdf'),
        external: true,
      },
      {
        id: 'qa-4',
        title: 'Flu Test Workflow',
        subtitle: 'Test & Treat',
        cta: 'Download',
        icon: 'TestTubes',
        url: buildPublicUrl('testandtreat/protocols/Test%20and%20Treat%20Protocol%20Manual.pdf'),
        external: true,
      },
    ];
  },

  /** Get Bookmarked resources for current user */
  async getBookmarkedResources(): Promise<ResourceItem[]> {
    await wait(120);
    return [
      {
        id: 'bm-1',
        name: 'Pharmacist CMR Worksheet',
        program: 'MTM',
        url: buildPublicUrl('mtmthefuturetoday/Forms/utilityforms/Pharmacist%20CMR%20Worksheet.pdf'),
      },
      {
        id: 'bm-2',
        name: 'TimeMyMeds Protocol',
        program: 'TMM',
        url: buildPublicUrl('timemymeds/protocols/TimeMyMeds%20Protocol.pdf'),
      },
      {
        id: 'bm-3',
        name: 'A1c Result CPT Code Billing',
        program: 'A1C',
        url: buildPublicUrl('hba1c/resources/A1c%20Result%20CPT%20Code%20Billing.pdf'),
      },
      {
        id: 'bm-4',
        name: 'Strep Treatment – Peds',
        program: 'TNT',
        url: buildPublicUrl('testandtreat/forms/Flu/Flu%20Treatment-Peds.pdf'),
      },
    ];
  },

  /** Get recent activity list */
  async getRecentActivity(): Promise<RecentActivity[]> {
    await wait(160);
    const now = Date.now();
    return [
      {
        id: 'ra-1',
        name: 'CMR Interview Guide',
        program: 'MTM',
        accessedAtISO: new Date(now - 1000 * 60 * 60).toISOString(),
        url: buildPublicUrl('mtmthefuturetoday/resources/MTMTFT%20Pharmacist%20Form%20Explanations.pdf'),
      },
      {
        id: 'ra-2',
        name: 'Sync Schedule Template',
        program: 'TMM',
        accessedAtISO: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
        url: buildPublicUrl('timemymeds/forms/Enrollment%20Form.pdf'),
      },
      {
        id: 'ra-3',
        name: 'A1c Tech Checklist',
        program: 'A1C',
        accessedAtISO: new Date(now - 1000 * 60 * 60 * 22).toISOString(),
        url: buildPublicUrl('hba1c/protocols/Hemoglobin%20A1c%20Testing%20Protocol.pdf'),
      },
    ];
  },

  /** Get announcements */
  async getAnnouncements(): Promise<Announcement[]> {
    await wait(100);
    return [
      { id: 'an-1', title: 'New: Prescriber Communication Forms', body: 'Standardized outreach templates now available in all MTM programs.', dateISO: new Date().toISOString() },
      { id: 'an-2', title: 'Sync Workflow Update', body: 'Checklist updated for latest payer guidance. Please review by month end.', dateISO: new Date(Date.now() - 86400 * 1000 * 4).toISOString() },
    ];
  },
};
