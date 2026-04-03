
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { 
  Search, 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Briefcase,
  Loader2,
  Plus,
  ArrowRight,
  ClipboardCheck,
  ChevronLeft,
  User,
  MoreVertical,
  Mail,
  MapPin,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { summarizeResume, ResumeSummarizerOutput } from '@/ai/flows/ai-resume-summarizer';
import { aiJobDescriptionGenerator } from '@/ai/flows/ai-job-description-generator';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface JobListing {
  id: string;
  title: string;
  dept: string;
  applicants: number;
  status: 'Active' | 'Urgent' | 'Closed';
  date: string;
  description?: string;
}

interface Applicant {
  id: string;
  name: string;
  email: string;
  status: 'Screening' | 'Interviewing' | 'Applied' | 'Rejected' | 'Hired';
  score: number;
  appliedDate: string;
}

const INITIAL_LISTINGS: JobListing[] = [
  { id: '1', title: "Senior Plant Supervisor", dept: "Operations", applicants: 45, status: "Active", date: "2 days ago" },
  { id: '2', title: "Dairy Technologist", dept: "Quality Control", applicants: 120, status: "Urgent", date: "5 days ago" },
  { id: '3', title: "HR Generalist", dept: "HR", applicants: 12, status: "Active", date: "1 week ago" },
];

const MOCK_APPLICANTS: Record<string, Applicant[]> = {
  '1': [
    { id: 'a1', name: 'Bharat Chaudhary', email: 'bharat@example.com', status: 'Interviewing', score: 92, appliedDate: '2024-03-12' },
    { id: 'a2', name: 'Rekha Chaudhary', email: 'rekha@example.com', status: 'Screening', score: 85, appliedDate: '2024-03-13' },
    { id: 'a3', name: 'Karshan Chaudhary', email: 'karshan@itshere.com', status: 'Applied', score: 78, appliedDate: '2024-03-14' },
  ],
  '2': [
    { id: 'a4', name: 'Jignesh Chaudhary', email: 'jignesh@themyscira.com', status: 'Interviewing', score: 98, appliedDate: '2024-03-10' },
    { id: 'a5', name: 'Ashok Chaudhary', email: 'ashok@fightclub.com', status: 'Rejected', score: 45, appliedDate: '2024-03-11' },
  ],
  '3': [
    { id: 'a6', name: 'Sitaben Chaudhary', email: 'sita@music.com', status: 'Screening', score: 88, appliedDate: '2024-03-08' },
  ],
};

export default function RecruitmentPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('summary');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryResult, setSummaryResult] = useState<ResumeSummarizerOutput | null>(null);
  const [resumeText, setResumeText] = useState('');

  const [jdLoading, setJdLoading] = useState(false);
  const [jdResult, setJdResult] = useState<string | null>(null);
  const [jdInput, setJdInput] = useState({ title: '', dept: '', responsibilities: '' });

  const [jobListings, setJobListings] = useState<JobListing[]>(INITIAL_LISTINGS);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', dept: '', status: 'Active' as JobListing['status'] });

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [viewingApplicant, setViewingApplicant] = useState<Applicant | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  const handleSummarize = async () => {
    if (!resumeText) return;
    setLoadingSummary(true);
    try {
      const mockDataUri = `data:text/plain;base64,${btoa(resumeText)}`;
      const result = await summarizeResume({ resumeContent: mockDataUri });
      setSummaryResult(result);
      toast({ title: "Summary Generated", description: "AI has successfully analyzed the resume." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to summarize resume." });
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleGenerateJD = async () => {
    if (!jdInput.title || !jdInput.dept) return;
    setJdLoading(true);
    try {
      const result = await aiJobDescriptionGenerator({
        jobTitle: jdInput.title,
        department: jdInput.dept,
        keyResponsibilities: jdInput.responsibilities
      });
      setJdResult(result.jobDescription);
      toast({ title: "JD Generated", description: "A comprehensive job description is ready." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to generate JD." });
    } finally {
      setJdLoading(false);
    }
  };

  const handleAddJobListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title || !newJob.dept) return;

    const listing: JobListing = {
      id: Math.random().toString(36).substr(2, 9),
      title: newJob.title,
      dept: newJob.dept,
      applicants: 0,
      status: newJob.status,
      date: "Just now"
    };

    setJobListings([listing, ...jobListings]);
    setIsAddJobOpen(false);
    setNewJob({ title: '', dept: '', status: 'Active' });
    toast({ title: "Job Posted", description: `${newJob.title} is now live.` });
  };

  const handleViewResume = (applicant: Applicant) => {
    setViewingApplicant(applicant);
    setIsResumeOpen(true);
  };

  const selectedJob = jobListings.find(j => j.id === selectedJobId);
  const applicantsForSelectedJob = selectedJobId ? (MOCK_APPLICANTS[selectedJobId] || []) : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Recruitment Management</h1>
          <p className="text-muted-foreground">Manage job postings and screen candidates for Banas Dairy.</p>
        </div>
        
        <Dialog open={isAddJobOpen} onOpenChange={setIsAddJobOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> New Job Posting
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Job Posting</DialogTitle>
              <DialogDescription>Enter the basic details for the new role.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddJobListing} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input 
                  placeholder="e.g. Senior Plant Supervisor" 
                  value={newJob.title}
                  onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input 
                  placeholder="e.g. Operations" 
                  value={newJob.dept}
                  onChange={(e) => setNewJob({...newJob, dept: e.target.value})}
                  required
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit">Post Job</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-secondary/50 p-1 rounded-lg mb-6">
          <TabsTrigger value="summary" className="gap-2">
            <Sparkles className="w-4 h-4" /> AI Resume Screen
          </TabsTrigger>
          <TabsTrigger value="jd" className="gap-2">
            <FileText className="w-4 h-4" /> JD Generator
          </TabsTrigger>
          <TabsTrigger value="listings" className="gap-2">
            <Search className="w-4 h-4" /> Active Listings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          {selectedJobId ? (
            <div className="space-y-6">
              <Button variant="ghost" className="gap-2" onClick={() => setSelectedJobId(null)}>
                <ChevronLeft className="w-4 h-4" /> Back to Listings
              </Button>
              <h2 className="text-2xl font-bold">{selectedJob?.title}</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Match Score</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applicantsForSelectedJob.map(applicant => (
                    <TableRow key={applicant.id}>
                      <TableCell>{applicant.name}</TableCell>
                      <TableCell><Badge variant="outline">{applicant.status}</Badge></TableCell>
                      <TableCell>{applicant.score}%</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => handleViewResume(applicant)}>View Resume</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Card className="dashboard-card">
              <CardContent className="space-y-4 pt-6">
                {jobListings.map(job => (
                  <div key={job.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-secondary/20 cursor-pointer" onClick={() => setSelectedJobId(job.id)}>
                    <div>
                      <p className="font-bold">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{job.dept}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge>{job.status}</Badge>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
