import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';

const OPENINGS = [
  {
    title: 'Senior Full Stack Engineer',
    department: 'Engineering',
    location: 'Remote (India)',
    type: 'Full-time',
  },
  {
    title: 'Product Designer (UI/UX)',
    department: 'Design',
    location: 'New Delhi / Remote',
    type: 'Full-time',
  },
  {
    title: 'Community Manager',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Trust & Safety Specialist',
    department: 'Operations',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Campus Ambassador Intern',
    department: 'Marketing',
    location: 'Multiple Universities',
    type: 'Internship',
  },
];

const Careers = () => {
  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-bg-primary to-accent/10"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary leading-tight mb-6">
            Build the Future of <span className="gradient-text">Student Work</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
            Join our mission to empower the next generation of talent. We're a fast-growing team looking for passionate builders.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Open Positions</h2>
            <p className="text-text-secondary">Don't see a perfect fit? Email us at careers@unilance.in with your resume.</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {OPENINGS.map((job, i) => (
              <div key={i} className="bg-bg-secondary rounded-xl border border-border p-6 hover:border-primary/50 transition-colors group cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors mb-2">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
                    <span className="flex items-center gap-1"><Briefcase size={14} /> {job.department}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {job.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:underline">
                  Apply Now <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
