
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Briefcase,
  Loader2
} from 'lucide-react';
import { summarizeResume, ResumeSummarizerOutput } from '@/ai/flows/ai-resume-summarizer';
import { aiJobDescriptionGenerator } from '@/ai/flows/ai-job-description-generator';
import { useToast } from '@/hooks/use-toast';

export default function RecruitmentPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('summary');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryResult, setSummaryResult] = useState<ResumeSummarizerOutput | null>(null);
  const [resumeText, setResumeText] = useState('');

  const [jdLoading, setJdLoading] = useState(false);
  const [jdResult, setJdResult] = useState<string | null>(null);
  const [jdInput, setJdInput] = useState({ title: '', dept: '', responsibilities: '' });

  const handleSummarize = async () => {
    if (!resumeText) return;
    setLoadingSummary(true);
    try {
      // Mock data URI as the tool expects one
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Recruitment Management</h1>
          <p className="text-muted-foreground">Manage job postings and screen candidates with AI assistance.</p>
        </div>
        <Button className="gap-2">
          <Briefcase className="w-4 h-4" /> New Job Posting
        </Button>
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
                  className="w-full p-3 border rounded-md min-h-[100px]"
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
                    <Button variant="outline" size="sm" onClick={() => {
                      navigator.clipboard.writeText(jdResult);
                      toast({ title: "Copied to clipboard" });
                    }}>Copy Text</Button>
                  </div>
                  {jdResult}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Active Job Openings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Senior Product Designer", dept: "Design", applicants: 45, status: "Active", date: "2 days ago" },
                  { title: "Frontend Developer (React)", dept: "Engineering", applicants: 120, status: "Urgent", date: "5 days ago" },
                  { title: "HR Generalist", dept: "HR", applicants: 12, status: "Active", date: "1 week ago" },
                ].map((job, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/20 transition-colors">
                    <div className="flex gap-4 items-center">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Briefcase className="w-5 h-5 text-primary" />
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
                      <Button variant="ghost" size="icon">
                        <Clock className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
