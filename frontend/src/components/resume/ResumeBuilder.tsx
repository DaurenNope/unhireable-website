"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Download, Eye, FileText, Zap, AlertCircle } from "lucide-react";
import { track } from "../../lib/analytics";

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    location: string;
    graduationDate: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
}

type ResumeBuilderProps = {
  onDownload?: (payload: { data: ResumeData; download: () => void }) => void;
  onChange?: (data: ResumeData) => void;
};

export function ResumeBuilder({ onDownload, onChange }: ResumeBuilderProps) {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      summary: ""
    },
    experience: [],
    education: [],
    skills: {
      technical: [],
      soft: []
    }
  });

  const [skillInput, setSkillInput] = useState({ technical: "", soft: "" });
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills'>('personal');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailCollected, setEmailCollected] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("resume_email");
  });

  useEffect(() => {
    track({ type: "resume_builder_start" });
  }, []);

  useEffect(() => {
    onChange?.(resumeData);
  }, [resumeData, onChange]);

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: ""
      }]
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: "",
        school: "",
        location: "",
        graduationDate: ""
      }]
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addSkill = (type: 'technical' | 'soft') => {
    const value = skillInput[type].trim();
    if (value) {
      setResumeData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [type]: [...prev.skills[type], value]
        }
      }));
      setSkillInput(prev => ({ ...prev, [type]: "" }));
    }
  };

  const removeSkill = (type: 'technical' | 'soft', index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: prev.skills[type].filter((_, i) => i !== index)
      }
    }));
  };

  const printable = useMemo(() => {
    const text = `
${resumeData.personalInfo.name}
${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.location}

${resumeData.personalInfo.summary}

EXPERIENCE
${resumeData.experience.map(exp => `
${exp.title} - ${exp.company}
${exp.location} | ${exp.startDate} - ${exp.endDate}
${exp.description}`).join('\n')}

EDUCATION
${resumeData.education.map(edu => `
${edu.degree} - ${edu.school}
${edu.location} | Graduated ${edu.graduationDate}`).join('\n')}

SKILLS
Technical: ${resumeData.skills.technical.join(', ')}
Soft Skills: ${resumeData.skills.soft.join(', ')}
    `.trim();
    const html = `<!doctype html>
    <html><head><meta charSet="utf-8" />
    <title>${resumeData.personalInfo.name || "Resume"}</title>
    <style>
      body{font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.35;color:#111;}
      .wrap{max-width:800px;margin:24px auto;padding:24px;border:2px solid #000;}
      h1{margin:0 0 4px;font-size:28px}
      h2{margin:16px 0 8px;font-size:16px;border-bottom:1px solid #000;padding-bottom:4px}
      .muted{color:#444;font-size:14px}
      pre{white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
    </style></head>
    <body><div class="wrap">
      <h1>${resumeData.personalInfo.name || ""}</h1>
      <div class="muted">${[resumeData.personalInfo.email, resumeData.personalInfo.phone, resumeData.personalInfo.location].filter(Boolean).join(" • ")}</div>
      <h2>Summary</h2>
      <pre>${resumeData.personalInfo.summary || ""}</pre>
      <h2>Experience</h2>
      <pre>${resumeData.experience.map(exp => `• ${exp.title} - ${exp.company}\n${exp.location} | ${exp.startDate} - ${exp.endDate}\n${exp.description}`).join('\n\n')}</pre>
      <h2>Education</h2>
      <pre>${resumeData.education.map(edu => `• ${edu.degree} - ${edu.school}\n${edu.location} | Graduated ${edu.graduationDate}`).join('\n\n')}</pre>
      <h2>Skills</h2>
      <pre>Technical: ${resumeData.skills.technical.join(', ')}\nSoft Skills: ${resumeData.skills.soft.join(', ')}</pre>
    </div>
    <script>window.onload=()=>{window.print();setTimeout(()=>window.close(),300)}</script>
    </body></html>`;
    return { text, html };
  }, [resumeData]);

  const downloadTxt = () => {
    const blob = new Blob([printable.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData.personalInfo.name || 'resume'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printPDF = () => {
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return downloadTxt();
    w.document.open();
    w.document.write(printable.html);
    w.document.close();
  };

  const handleDownload = () => {
    if (!emailCollected) {
      setShowEmailModal(true);
      return;
    }
    printPDF();
  };

  const submitEmail = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email.");
      return;
    }
    setEmailError("");
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}
    localStorage.setItem("resume_email", email);
    setEmailCollected(true);
    setShowEmailModal(false);
    printPDF();
  };

  const BrutalistInput = ({ label, value, onChange, placeholder, type = "text" }: any) => (
    <div>
      <label className="font-mono text-sm mb-2 block text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border-2 border-black font-mono text-base focus:border-cyan-400 focus:outline-none bg-white"
      />
    </div>
  );

  const BrutalistTextarea = ({ label, value, onChange, placeholder, rows = 4 }: any) => (
    <div>
      <label className="font-mono text-sm mb-2 block text-gray-700">{label}</label>
      <textarea
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 border-2 border-black font-mono text-base focus:border-cyan-400 focus:outline-none bg-white resize-none"
      />
    </div>
  );

  const BrutalistButton = ({ onClick, children, variant = "primary", icon, id }: any) => (
    <button
      id={id}
      onClick={onClick}
      className={`px-6 py-3 font-black border-2 transition-all transform hover:scale-105 ${
        variant === "primary" 
          ? "bg-cyan-400 text-black border-black hover:bg-white" 
          : variant === "secondary"
          ? "bg-black text-cyan-400 border-cyan-400 hover:bg-cyan-400 hover:text-black"
          : "bg-purple-400 text-black border-black hover:bg-white"
      } flex items-center gap-2`}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-black text-cyan-400 p-1 border-4 border-cyan-400">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'personal', label: 'PERSONAL', icon: '👤' },
            { id: 'experience', label: 'EXPERIENCE', icon: '💼' },
            { id: 'education', label: 'EDUCATION', icon: '🎓' },
            { id: 'skills', label: 'SKILLS', icon: '⚡' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                track({ type: "resume_section_complete", section: tab.id });
              }}
              className={`px-4 py-2 font-mono text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-400 text-black'
                  : 'hover:bg-white text-cyan-400'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'personal' && (
          <motion.div
            key="personal"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-4 border-black p-6 space-y-6"
          >
            <h3 className="font-black text-2xl mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-cyan-400 text-black rounded-full flex items-center justify-center font-black text-lg">👤</span>
              PERSONAL BULLSHIT
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BrutalistInput
                label="FULL NAME"
                value={resumeData.personalInfo.name}
                onChange={(value: string) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, name: value }
                }))}
                placeholder="John Doe"
              />
              <BrutalistInput
                label="EMAIL"
                type="email"
                value={resumeData.personalInfo.email}
                onChange={(value: string) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, email: value }
                }))}
                placeholder="john@example.com"
              />
              <BrutalistInput
                label="PHONE"
                value={resumeData.personalInfo.phone}
                onChange={(value: string) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, phone: value }
                }))}
                placeholder="+1 (555) 123-4567"
              />
              <BrutalistInput
                label="LOCATION"
                value={resumeData.personalInfo.location}
                onChange={(value: string) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, location: value }
                }))}
                placeholder="San Francisco, CA"
              />
            </div>
            
            <BrutalistTextarea
              label="PROFESSIONAL SUMMARY"
              value={resumeData.personalInfo.summary}
              onChange={(value: string) => setResumeData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, summary: value }
              }))}
              placeholder="Experienced software developer with expertise in..."
              rows={4}
            />
          </motion.div>
        )}

        {activeTab === 'experience' && (
          <motion.div
            key="experience"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-4 border-black p-6 space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-2xl flex items-center gap-2">
                <span className="w-8 h-8 bg-cyan-400 text-black rounded-full flex items-center justify-center font-black text-lg">💼</span>
                JOB EXPERIENCE
              </h3>
              <BrutalistButton onClick={addExperience} variant="secondary" icon={<Plus className="w-4 h-4" />}>
                ADD EXPERIENCE
              </BrutalistButton>
            </div>

            <AnimatePresence>
              {resumeData.experience.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="border-2 border-gray-300 p-4 space-y-4 relative"
                >
                  <button
                    onClick={() => removeExperience(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <BrutalistInput
                      label="JOB TITLE"
                      value={exp.title}
                      onChange={(value: string) => updateExperience(index, 'title', value)}
                      placeholder="Software Engineer"
                    />
                    <BrutalistInput
                      label="COMPANY"
                      value={exp.company}
                      onChange={(value: string) => updateExperience(index, 'company', value)}
                      placeholder="Tech Company"
                    />
                    <BrutalistInput
                      label="LOCATION"
                      value={exp.location}
                      onChange={(value: string) => updateExperience(index, 'location', value)}
                      placeholder="San Francisco, CA"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <BrutalistInput
                        label="START DATE"
                        type="month"
                        value={exp.startDate}
                        onChange={(value: string) => updateExperience(index, 'startDate', value)}
                      />
                      <BrutalistInput
                        label="END DATE"
                        type="month"
                        value={exp.endDate}
                        onChange={(value: string) => updateExperience(index, 'endDate', value)}
                      />
                    </div>
                  </div>
                  
                  <BrutalistTextarea
                    label="DESCRIPTION"
                    value={exp.description}
                    onChange={(value: string) => updateExperience(index, 'description', value)}
                    placeholder="Describe your responsibilities and achievements..."
                    rows={3}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

              {resumeData.experience.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300">
                  <p className="font-mono text-gray-500 mb-4">NO EXPERIENCE YET</p>
                  <BrutalistButton onClick={addExperience} icon={<Plus className="w-4 h-4" />}>
                    ADD YOUR FIRST EXPERIENCE
                  </BrutalistButton>
                </div>
              )}
            </motion.div>
        )}

        {activeTab === 'education' && (
          <motion.div
            key="education"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-4 border-black p-6 space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-2xl flex items-center gap-2">
                <span className="w-8 h-8 bg-cyan-400 text-black rounded-full flex items-center justify-center font-black text-lg">🎓</span>
                EDUCATION BULLSHIT
              </h3>
              <BrutalistButton onClick={addEducation} variant="secondary" icon={<Plus className="w-4 h-4" />}>
                ADD EDUCATION
              </BrutalistButton>
            </div>

            <AnimatePresence>
              {resumeData.education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="border-2 border-gray-300 p-4 space-y-4 relative"
                >
                  <button
                    onClick={() => removeEducation(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <BrutalistInput
                      label="DEGREE"
                      value={edu.degree}
                      onChange={(value: string) => updateEducation(index, 'degree', value)}
                      placeholder="Bachelor of Science in Computer Science"
                    />
                    <BrutalistInput
                      label="SCHOOL"
                      value={edu.school}
                      onChange={(value: string) => updateEducation(index, 'school', value)}
                      placeholder="University Name"
                    />
                    <BrutalistInput
                      label="LOCATION"
                      value={edu.location}
                      onChange={(value: string) => updateEducation(index, 'location', value)}
                      placeholder="City, State"
                    />
                    <BrutalistInput
                      label="GRADUATION DATE"
                      type="month"
                      value={edu.graduationDate}
                      onChange={(value: string) => updateEducation(index, 'graduationDate', value)}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

              {resumeData.education.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300">
                  <p className="font-mono text-gray-500 mb-4">NO EDUCATION YET</p>
                  <BrutalistButton onClick={addEducation} icon={<Plus className="w-4 h-4" />}>
                    ADD YOUR EDUCATION
                  </BrutalistButton>
                </div>
              )}
            </motion.div>
        )}

        {activeTab === 'skills' && (
          <motion.div
            key="skills"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-4 border-black p-6 space-y-6"
          >
            <h3 className="font-black text-2xl mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-cyan-400 text-black rounded-full flex items-center justify-center font-black text-lg">⚡</span>
              SKILL ASSETS
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-black text-lg mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-400 text-black rounded-full flex items-center justify-center font-black text-sm">🔧</span>
                  TECHNICAL SKILLS
                </h4>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={skillInput.technical}
                    onChange={(e: any) => setSkillInput(prev => ({ ...prev, technical: e.target.value }))}
                    placeholder="React, TypeScript, Python..."
                    onKeyPress={(e: any) => e.key === 'Enter' && (e.preventDefault(), addSkill('technical'))}
                    className="flex-1 px-4 py-3 border-2 border-black font-mono text-base focus:border-cyan-400 focus:outline-none bg-white"
                  />
                  <BrutalistButton onClick={() => addSkill('technical')} variant="secondary" icon={<Plus className="w-4 h-4" />}>
                    ADD
                  </BrutalistButton>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.technical.map((skill, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-cyan-400 text-black px-3 py-1 font-mono text-sm border border-black flex items-center gap-2"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill('technical', index)}
                        className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <Trash2 className="w-2 h-2" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-black text-lg mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-400 text-black rounded-full flex items-center justify-center font-black text-sm">🤝</span>
                  SOFT SKILLS
                </h4>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={skillInput.soft}
                    onChange={(e: any) => setSkillInput(prev => ({ ...prev, soft: e.target.value }))}
                    placeholder="Leadership, Communication..."
                    onKeyPress={(e: any) => e.key === 'Enter' && (e.preventDefault(), addSkill('soft'))}
                    className="flex-1 px-4 py-3 border-2 border-black font-mono text-base focus:border-cyan-400 focus:outline-none bg-white"
                  />
                  <BrutalistButton onClick={() => addSkill('soft')} variant="secondary" icon={<Plus className="w-4 h-4" />}>
                    ADD
                  </BrutalistButton>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.soft.map((skill, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-green-400 text-black px-3 py-1 font-mono text-sm border border-black flex items-center gap-2"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill('soft', index)}
                        className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <Trash2 className="w-2 h-2" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate Button */}
      <div className="bg-gradient-to-r from-cyan-400 to-purple-400 text-black p-6 border-4 border-black">
        <div className="text-center">
          <BrutalistButton 
            onClick={handleDownload} 
            variant="primary" 
            id="generate-resume"
            icon={<Download className="w-5 h-5" />}
          >
            DOWNLOAD PDF
          </BrutalistButton>
          <p className="font-mono text-sm mt-3 text-gray-700">
            Use the browser’s print dialog to save as PDF.
          </p>
        </div>
      </div>
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border-4 border-black p-6">
            <div className="text-2xl font-black mb-1">Get Your Download</div>
            <div className="font-mono text-sm text-gray-600 mb-4">
              Enter your email to receive tips and updates. You’ll download the PDF immediately.
            </div>
            <div className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                placeholder="you@domain.com"
                className="w-full border-2 border-black px-3 py-3 font-mono text-sm"
              />
              {emailError && <div className="text-red-600 font-mono text-xs">{emailError}</div>}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="bg-white text-black border-4 border-black px-4 py-2 font-black hover:bg-black hover:text-cyan-400 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={submitEmail}
                  className="bg-cyan-400 text-black border-4 border-black px-4 py-2 font-black hover:bg-black hover:text-cyan-400 transition-colors flex-1"
                >
                  CONTINUE
                </button>
              </div>
              <div className="text-center text-xs font-mono text-gray-500">
                No spam. Unsubscribe anytime.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
