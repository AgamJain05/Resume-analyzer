import { useState } from 'react'
import { Button } from "../components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function Home() {
  const [jobDescription, setJobDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleAnalyze = () => {
    // Here you would implement the logic to analyze the resume
    console.log('Analyzing resume...')
    console.log('Job Description:', jobDescription)
    console.log('File:', file)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Job Resume Analyzer</h1>
      
      <div className="space-y-2">
        <Label htmlFor="job-description">Job Description</Label>
        <Textarea
          id="job-description"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="min-h-[200px]"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="resume-upload">Upload Resume</Label>
        <Input
          id="resume-upload"
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
        />
      </div>
      
      <Button 
        onClick={handleAnalyze} 
        className="w-full"
        disabled={!jobDescription || !file}
      >
        Analyze
      </Button>
    </div>
  )
}