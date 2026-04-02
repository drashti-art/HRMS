
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
  MoreVertical
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
  { id: '1', title: "Senior Product Designer", dept: "Design", applicants: 45, status: "Active", date: "2 days ago" },
  { id: '2', title: "Frontend Developer (React)", dept: "Engineering", applicants: 120, status: "Urgent", date: "5 days ago" },
  { id: '3', title: "HR Generalist", dept: "HR", applicants: 12, status: "Active", date: "1 week ago" },
];

const MOCK_APPLICANTS: Record<string, Applicant[]> = {
  '1': [
    { id: 'a1', name: 'Alice Wonder', email: 'alice@example.com', status: 'Interviewing', score: 92, appliedDate: '2024-03-12' },
    { id: 'a2', name: 'Bob Builder', email: 'bob@example.com', status: 'Screening', score: 85, appliedDate: '2024-03-13' },
    { id: 'a3', name: 'Charlie Day', email: 'charlie@itshere.com', status: 'Applied', score: 78, appliedDate: '2024-03-14' },
  ],
  '2': [
    { id: 'a4', name: 'Diana Prince', email: 'diana@themyscira.com', status: 'Interviewing', score: 98, appliedDate: '2024-03-10' },
    { id: 'a5', name: 'Edward Norton', email: 'ed@fightclub.com', status: 'Rejected', score: 45, appliedDate: '2024-03-11' },
  ],
  '3': [
    { id: 'a6', name: 'Fiona Apple', email: 'fiona@music.com', status: 'Screening', score: 88, appliedDate: '2024-03-08' },
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

  const handleSummarize = async () => {
    if (!resumeText) return;
    setLoadingSummary(true);
    try {
      const mockDataUri = `data:text/plain;base64,${btoa(resumeText)}`;
      const result = await summarizeResume({ resumeContent: mockDataUri });
      setSummaryResult(result);
      toast({ title: "Summary Generated", description: "AI has successfully analyzed the resume." });
    } catch (error) {
      console.error(error);
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

  const handleSaveJdToListing = () => {
    if (!jdResult || !jdInput.title || !jdInput.dept) return;

    const listing: JobListing = {
      id: Math.random().toString(36).substr(2, 9),
      title: jdInput.title,
      dept: jdInput.dept,
      applicants: 0,
      status: 'Active',
      date: "Just now",
      description: jdResult
    };

    setJobListings([listing, ...jobListings]);
    toast({ title: "Saved to Listings", description: "The generated JD has been added as a new job opening." });
    setActiveTab('listings');
  };

  const selectedJob = jobListings.find(j => j.id === selectedJobId);
  const applicantsForSelectedJob = selectedJobId ? (MOCK_APPLICANTS[selectedJobId] || []) : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Recruitment Management</h1>
          <p className="text-muted-foreground">Manage job postings and screen candidates with AI assistance.</p>
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
                  placeholder="e.g. Senior Software Engineer" 
                  value={newJob.title}
                  onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input 
                  placeholder="e.g. Engineering" 
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

        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Resume Content</CardTitle>
                <CardDescription>Paste the candidate's resume text below for instant AI analysis.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  className="w-full min-h-[300px] p-4 rounded-lg border bg-secondary/20 font-mono text-sm focus:outline-primary"
                  placeholder="Paste resume text here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
                <Button 
                  className="w-full gap-2 py-6" 
                  onClick={handleSummarize} 
                  disabled={loadingSummary || !resumeText}
                >
                  {loadingSummary ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  Generate AI Summary
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {summaryResult ? (
                <Card className="dashboard-card border-accent bg-accent/5">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-primary flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-accent" /> Analysis Result
                      </CardTitle>
                      <Badge variant="outline">AI Generated</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-sm uppercase text-muted-foreground mb-2">Overall Summary</h4>
                      <p className="text-sm leading-relaxed">{summaryResult.overallSummary}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm uppercase text-muted-foreground mb-2">Key Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {summaryResult.keySkills.map((skill, i) => (
                          <Badge key={i} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-sm uppercase text-muted-foreground mb-4">Work Experience</h4>
                      <div className="space-y-4">
                        {summaryResult.workExperience.map((work, i) => (
                          <div key={i} className="pl-4 border-l-2 border-accent/30 space-y-1">
                            <p className="font-bold text-sm">{work.title} @ {work.company}</p>
                            <p className="text-xs text-muted-foreground">{work.duration}</p>
                            <ul className="text-xs list-disc list-inside mt-2 space-y-1">
                              {work.responsibilities.slice(0, 2).map((resp, j) => (
                                <li key={j} className="text-muted-foreground">{resp}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 text-center bg-secondary/10">
                  <div className="bg-secondary p-4 rounded-full mb-4">
                    <Sparkles className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">Ready for Analysis</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                    Paste a resume on the left to get a structured AI summary of skills, experience, and education.
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="jd" className="space-y-6">
          <Card className="dashboard-card max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>AI Job Description Generator</CardTitle>
              <CardDescription>Enter basic details to generate a professional, standardized job description.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input 
                    placeholder="e.g. Senior Software Engineer" 
                    value={jdInput.title}
                    onChange={(e) => setJdInput({...jdInput, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input 
                    placeholder="e.g. Engineering" 
                    value={jdInput.dept}
                    onChange={(e) => setJdInput({...jdInput, dept: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Key Responsibilities (Briefly)</Label>
                <textarea 
                  className="w-full p-3 border rounded-md min-h-[100px] bg-background text-sm"
                  placeholder="Bullet points of main duties..."
                  value={jdInput.responsibilities}
                  onChange={(e) => setJdInput({...jdInput, responsibilities: e.target.value})}
                />
              </div>
              <Button onClick={handleGenerateJD} disabled={jdLoading} className="w-full gap-2">
                {jdLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Generate Description
              </Button>

              {jdResult && (
                <div className="mt-8 p-6 bg-secondary/10 rounded-xl border whitespace-pre-wrap text-sm leading-relaxed">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-primary">Generated Job Description</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        navigator.clipboard.writeText(jdResult);
                        toast({ title: "Copied to clipboard" });
                      }}>Copy Text</Button>
                      <Button variant="default" size="sm" className="gap-2" onClick={handleSaveJdToListing}>
                        <Plus className="w-3 h-3" /> Save to Listings
                      </Button>
                    </div>
                  </div>
                  {jdResult}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings">
          {selectedJobId ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <Button 
                variant="ghost" 
                className="gap-2 text-muted-foreground hover:text-primary pl-0"
                onClick={() => setSelectedJobId(null)}
              >
                <ChevronLeft className="w-4 h-4" /> Back to Listings
              </Button>
              
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-primary">{selectedJob?.title}</h2>
                  <p className="text-muted-foreground">{selectedJob?.dept} • {selectedJob?.applicants} Total Applicants</p>
                </div>
                <Badge variant={selectedJob?.status === 'Urgent' ? 'destructive' : 'default'}>
                  {selectedJob?.status}
                </Badge>
              </div>

              <Card className="dashboard-card overflow-hidden">
                <CardHeader className="bg-secondary/10 border-b">
                  <CardTitle>Applicant Listing</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-secondary/5">
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Match Score</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applicantsForSelectedJob.length > 0 ? (
                        applicantsForSelectedJob.map((applicant) => (
                          <TableRow key={applicant.id} className="hover:bg-accent/5">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                  {applicant.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-semibold">{applicant.name}</p>
                                  <p className="text-xs text-muted-foreground">{applicant.email}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline"
                                className={cn(
                                  "text-[10px]",
                                  applicant.status === 'Interviewing' && "bg-blue-50 text-blue-700 border-blue-200",
                                  applicant.status === 'Hired' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                                  applicant.status === 'Rejected' && "bg-rose-50 text-rose-700 border-rose-200",
                                  applicant.status === 'Screening' && "bg-amber-50 text-amber-700 border-amber-200"
                                )}
                              >
                                {applicant.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-secondary rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className={cn(
                                      "h-full rounded-full",
                                      applicant.score > 80 ? "bg-emerald-500" : "bg-amber-500"
                                    )} 
                                    style={{ width: `${applicant.score}%` }}
                                  />
                                </div>
                                <span className="text-xs font-bold">{applicant.score}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {applicant.appliedDate}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="text-xs h-8 text-primary">
                                View Resume
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                            No applicants found for this position.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Active Job Openings</CardTitle>
                <CardDescription>Currently advertised roles across the organization. Click a role to view applicants.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobListings.map((job) => (
                    <div 
                      key={job.id} 
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/30 transition-all cursor-pointer group"
                      onClick={() => setSelectedJobId(job.id)}
                    >
                      <div className="flex gap-4 items-center">
                        <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold">{job.title}</p>
                          <p className="text-xs text-muted-foreground">{job.dept} • Posted {job.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-semibold">{job.applicants} Applicants</p>
                          <Badge variant={job.status === "Urgent" ? "destructive" : "default"} className="text-[10px] h-4">
                            {job.status}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
