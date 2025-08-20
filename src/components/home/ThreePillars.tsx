/**
 * ThreePillars section
 * - Purpose: Restore the original "The Three Pillars" content block to the Home page.
 * - Visual: Gradient headline + three feature cards with lucide icons and concise bullet lists.
 */

import { Shield, Target, Users, CircleCheckBig } from 'lucide-react';
import { Card } from '../../components/ui/card';

/** Pillar item structure for rendering */
interface PillarItem {
  /** Main title for the pillar */
  title: string;
  /** Short supporting subtitle */
  subtitle: string;
  /** Icon for the card header */
  Icon: React.ComponentType<{ className?: string }>;
  /** Tailwind gradient tokens for the header avatar + subtle overlay */
  gradient: {
    /** For avatar background (e.g., from-blue-600 to-cyan-500) */
    avatar: string;
    /** For faint card overlay */
    overlay: string;
  };
  /** Bullet points */
  bullets: string[];
}

/** Render a single pillar card */
function PillarCard({ item }: { item: PillarItem }) {
  const { Icon, title, subtitle, gradient, bullets } = item;

  return (
    <div className="flex-1">
      <Card className="rounded-xl border bg-card text-card-foreground shadow relative overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Subtle gradient wash overlay */}
        <div className={`absolute inset-0 ${gradient.overlay} opacity-5`} />
        <div className="relative z-10 p-6">
          <div className={`w-16 h-16 rounded-xl ${gradient.avatar} flex items-center justify-center mb-4`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
          <div className="font-semibold tracking-tight text-2xl mb-2">{title}</div>
          <p className="text-gray-600 font-medium">{subtitle}</p>
        </div>
        <div className="relative z-10 p-6 pt-0">
          <ul className="space-y-3">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <CircleCheckBig className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}

/** The ThreePillars section component */
export default function ThreePillars() {
  const pillars: PillarItem[] = [
    {
      title: 'The Operational Flywheel',
      subtitle: 'A self-reinforcing cycle of care and revenue',
      Icon: Target,
      gradient: {
        avatar: 'bg-gradient-to-br from-blue-600 to-cyan-500',
        overlay: 'bg-gradient-to-br from-blue-600 to-cyan-500',
      },
      bullets: [
        'TimeMyMeds creates predictable monthly appointments',
        'Protected time enables billable clinical services',
        'Revenue funds program expansion',
        'More patients = more clinical opportunities',
      ],
    },
    {
      title: 'Technician as Force Multiplier',
      subtitle: 'Strategic elevation of the pharmacy technician',
      Icon: Users,
      gradient: {
        avatar: 'bg-gradient-to-br from-cyan-500 to-teal-400',
        overlay: 'bg-gradient-to-br from-cyan-500 to-teal-400',
      },
      bullets: [
        'Technicians manage MTM platforms and scheduling',
        'Handle all paperwork and documentation',
        'Process billing and claims submission',
        'Pharmacists focus exclusively on clinical care',
      ],
    },
    {
      title: 'Turnkey Clinical Infrastructure',
      subtitle: "Complete 'business-in-a-box' solution",
      Icon: Shield,
      gradient: {
        avatar: 'bg-gradient-to-br from-teal-400 to-green-400',
        overlay: 'bg-gradient-to-br from-teal-400 to-green-400',
      },
      bullets: [
        'Step-by-step Standard Operating Procedures',
        'All necessary forms and worksheets',
        'Specific CPT, HCPCS, and ICD-10 codes',
        'Software platform navigation guides',
      ],
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-300 text-white border-0 shadow mb-4">
            THE CLINICALRXQ FOUNDATION
          </div>
          <h2 className="text-4xl font-bold mb-4">
            The Three <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-300 bg-clip-text text-transparent">Pillars</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Three foundational principles that work in concert to overcome the most significant barriers to practice transformation
          </p>
        </div>

        {/* Pillars layout (staggered for rhythm on large screens) */}
        <div className="mb-12 flex flex-col lg:flex-row gap-8 items-center">
          <PillarCard item={pillars[0]} />
        </div>
        <div className="mb-12 flex flex-col lg:flex-row-reverse gap-8 items-center">
          <PillarCard item={pillars[1]} />
        </div>
        <div className="mb-12 flex flex-col lg:flex-row gap-8 items-center">
          <PillarCard item={pillars[2]} />
        </div>
      </div>
    </section>
  );
}
