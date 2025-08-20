/**
 * Success stories page showcasing real ClinicalRxQ member transformations
 */
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Star, 
  Quote, 
  TrendingUp, 
  Award, 
  Users, 
  CheckCircle,
  ArrowRight,
  Target,
  Heart,
  Zap
} from 'lucide-react';
import { Link } from 'react-router';
import SafeText from '../components/common/SafeText';

export default function SuccessStories() {
  const stories = [
    {
      name: "Dr. Sarah Johnson, PharmD",
      role: "Owner, Community Care Pharmacy",
      location: "Phoenix, AZ",
      program: "MTM The Future Today",
      image: "https://pub-cdn.sider.ai/u/U03VH4NVNOE/web-coder/687655a5b1dac45b18db4f5c/resource/f889d24a-3566-420b-a530-6f81e3357a8f.jpg",
      story: "ClinicalRxQ transformed our practice. We've dramatically improved patient outcomes and clinical services. The team-based approach is genius - my technicians are now clinical partners, not just dispensing assistants.",
      achievements: [
        "40% improvement in clinical outcomes",
        "Reduced medication errors by 65%",
        "Improved patient satisfaction scores to 98%",
        "Implemented full MTM program with technician support"
      ],
      rating: 5,
      metrics: {
        services: "450",
        patients: "450",
        satisfaction: "98%"
      }
    },
    {
      name: "Dr. Michael Chen, PharmD",
      role: "Clinical Pharmacist, Metro Health Pharmacy",
      location: "Seattle, WA",
      program: "TimeMyMeds + Test & Treat",
      image: "https://pub-cdn.sider.ai/u/U03VH4NVNOE/web-coder/687655a5b1dac45b18db4f5c/resource/94a313a2-aa13-4f4d-9bd8-b906b902ee63.jpg",
      story: "The operational flywheel concept changed everything. TimeMyMeds created predictable appointments, and we layered Test & Treat services during those visits. It's not just about adding services - it's about transforming workflow.",
      achievements: [
        "300+ patients enrolled in TimeMyMeds",
        "Launched point-of-care testing program",
        "Delivered 500+ clinical services",
        "Improved medication adherence to 85%"
      ],
      rating: 5,
      metrics: {
        services: "500",
        patients: "300",
        satisfaction: "96%"
      }
    },
    {
      name: "Dr. Emily Rodriguez, PharmD",
      role: "Pharmacy Manager, Wellness Rx",
      location: "Nashville, TN",
      program: "Complete ClinicalRxQ Ecosystem",
      image: "https://pub-cdn.sider.ai/u/U03VH4NVNOE/web-coder/687655a5b1dac45b18db4f5c/resource/675e5529-8a9c-4a21-ac37-565986a39c03.jpg",
      story: "Finally, a program that teaches implementation, not just theory. The comprehensive protocols make real-world application seamless. We now offer MTM, HbA1c testing, and contraceptive consultations - all high-quality services.",
      achievements: [
        "Implemented 4 clinical service lines",
        "Served 1,200+ patients through programs",
        "Trained 3 technicians in clinical support",
        "Achieved 95% member satisfaction rating"
      ],
      rating: 5,
      metrics: {
        services: "1200",
        patients: "600",
        satisfaction: "95%"
      }
    },
    {
      name: "Dr. James Wilson, PharmD",
      role: "Independent Pharmacy Owner",
      location: "Atlanta, GA",
      program: "Medical Billing & Reimbursement",
      image: "https://pub-cdn.sider.ai/u/U03VH4NVNOE/web-coder/687655a5b1dac45b18db4f5c/resource/e2057701-f4cd-4540-a4eb-956436587d4f.jpg",
      story: "The documentation training was a game-changer. We went from struggling with clinical workflows to confidently managing comprehensive services. Our clinical service delivery has tripled since implementing their protocols.",
      achievements: [
        "Tripled clinical service delivery",
        "Implemented systematic documentation process",
        "Improved service quality by 90%",
        "Expanded to 2 additional locations"
      ],
      rating: 5,
      metrics: {
        services: "2100",
        patients: "750",
        satisfaction: "97%"
      }
    },
    {
      name: "Dr. Lisa Thompson, PharmD",
      role: "Community Pharmacy Manager",
      location: "Denver, CO",
      program: "HbA1c Testing + MTM",
      image: "https://pub-cdn.sider.ai/u/U03VH4NVNOE/web-coder/687655a5b1dac45b18db4f5c/resource/9b0d65d7-d4fc-48cb-84c4-8dafc61e8998.jpg",
      story: "The HbA1c testing program integrated perfectly with our MTM services. We're now a key partner in diabetes care for our community. The value-based care alignment has opened doors with local health systems.",
      achievements: [
        "Launched diabetes care program",
        "Partnered with 2 local health systems",
        "Conducted 500+ HbA1c tests",
        "Improved patient A1c levels by average 1.2%"
      ],
      rating: 5,
      metrics: {
        services: "500",
        patients: "400",
        satisfaction: "99%"
      }
    },
    {
      name: "Dr. Robert Martinez, PharmD",
      role: "Regional Pharmacy Director",
      location: "Houston, TX",
      program: "Pharmacist-Initiated Oral Contraceptives",
      image: "https://pub-cdn.sider.ai/u/U03VH4NVNOE/web-coder/687655a5b1dac45b18db4f5c/resource/b354cd73-e113-4476-89b6-2f8615be4d20.jpg",
      story: "Being at the forefront of pharmacy practice evolution has set us apart. The contraceptive consultation program attracts new patients and positions us as progressive healthcare providers. It's been transformational.",
      achievements: [
        "Launched contraceptive consultation services",
        "Attracted 200+ new patients",
        "Conducted 300+ consultations",
        "Established reproductive health partnerships"
      ],
      rating: 5,
      metrics: {
        services: "300",
        patients: "200",
        satisfaction: "94%"
      }
    }
  ];

  const statistics = [
    { 
      icon: TrendingUp,
      value: "40%", 
      label: "Improved Patient Outcomes",
      description: "Members report significant clinical improvements"
    },
    { 
      icon: Users,
      value: "85%", 
      label: "Improved Patient Outcomes",
      description: "Better adherence and health metrics"
    },
    { 
      icon: Award,
      value: "98%", 
      label: "Would Recommend",
      description: "Member satisfaction with programs"
    },
    { 
      icon: Heart,
      value: "96%", 
      label: "Patient Satisfaction",
      description: "Improved patient care experience"
    }
  ];

  const impactMetrics = [
    { label: "Clinical Services Delivered", value: "2.5M+", icon: Zap },
    { label: "Active Members Nationwide", value: "10,000+", icon: Users },
    { label: "Patients Served Through Programs", value: "100,000+", icon: Heart },
    { label: "Training Hours Completed", value: "25,000+", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-600 to-cyan-500"></div>
        <div className="absolute inset-0 bg-[url('https://pub-cdn.sider.ai/u/U03VH4NVNOE/web-coder/687655a5b1dac45b18db4f5c/resource/cd53336d-d6e2-4c6b-bf62-bba9d1f359ba.png')] bg-center bg-cover opacity-20"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="mb-6">
            <Badge className="bg-white/20 text-white border-white/30">
              Real Transformations, Real Results
            </Badge>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            Success Stories
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            See how ClinicalRxQ members have transformed their practices from dispensing-focused 
            to patient-centered care with measurable results and sustainable revenue growth.
          </p>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Collective{' '}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Impact
              </span>
            </h2>
            <p className="text-gray-600">Results from our member community nationwide</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactMetrics.map((metric, index) => (
              <Card key={index} className="text-center bg-white shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl mx-auto mb-4">
                    <metric.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                    <SafeText value={metric.value} />
                  </div>
                  <div className="text-sm text-gray-600">
                    <SafeText value={metric.label} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Statistics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Member Success{' '}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Metrics
              </span>
            </h2>
            <p className="text-gray-600">Key performance indicators from our 2024 member survey</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg mx-auto mb-4">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    <SafeText value={stat.value} />
                  </div>
                  <div className="text-sm font-semibold text-gray-800 mb-1">
                    <SafeText value={stat.label} />
                  </div>
                  <div className="text-xs text-gray-600">
                    <SafeText value={stat.description} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Member Success Stories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              From Our{' '}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Members
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real pharmacists sharing their transformation stories and measurable outcomes
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {stories.map((story, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    {/* Profile */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                        <img 
                          src={story.image} 
                          alt={story.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          <SafeText value={story.name} />
                        </h3>
                        <div className="flex">
                          {[...Array(story.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-1">
                        <SafeText value={story.role} />
                      </p>
                      <p className="text-gray-500 text-xs mb-2">
                        <SafeText value={story.location} />
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        <SafeText value={story.program} />
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Story */}
                  <div className="relative mb-6">
                    <Quote className="absolute -top-2 -left-2 h-6 w-6 text-purple-200" />
                    <blockquote className="text-gray-700 italic pl-6 leading-relaxed">
                      &quot;<SafeText value={story.story} />&quot;
                    </blockquote>
                  </div>
                  
                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        <SafeText value={story.metrics.services} />
                      </div>
                      <div className="text-xs text-gray-600">Services Delivered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        <SafeText value={story.metrics.patients} />
                      </div>
                      <div className="text-xs text-gray-600">Patients Served</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        <SafeText value={story.metrics.satisfaction} />
                      </div>
                      <div className="text-xs text-gray-600">Satisfaction</div>
                    </div>
                  </div>
                  
                  {/* Achievements */}
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-900">Key Achievements:</h4>
                    <ul className="space-y-2">
                      {story.achievements.map((achievement, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">
                            <SafeText value={achievement} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of pharmacy professionals who have transformed their practices 
            with ClinicalRxQ's proven methodology and comprehensive support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/enroll">
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg"
              >
                <Target className="mr-2 h-5 w-5" />
                Start Your Transformation
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white hover:text-purple-600"
              >
                Schedule Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
