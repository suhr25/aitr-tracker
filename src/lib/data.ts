import { Criterion, DepartmentInfo, Role, UserCredentials } from "./types";

// ── User Credentials ──
export const USERS: UserCredentials[] = [
  { username: "chairman", password: "chairman@123", role: "chairman", name: "Chairman/IQAC Head", department: "All Departments" },
  { username: "cse",      password: "cse@123",      role: "cse",      name: "HOD-CSE",  department: "Computer Science & Engineering" },
  { username: "ece",      password: "ece@123",      role: "ece",      name: "HOD-ECE",  department: "Electronics & Communication Engineering" },
  { username: "civil",    password: "civil@123",    role: "civil",    name: "HOD-CE",   department: "Civil Engineering" },
  { username: "me",       password: "me@123",       role: "me",       name: "HOD-ME",   department: "Mechanical Engineering" },
];

// ── Department Info ──
export const DEPARTMENTS: DepartmentInfo[] = [
  { id: "cse",   name: "Computer Science & Engineering",            shortName: "CSE",   color: "#6366f1", coordinator: "HOD-CSE" },
  { id: "ece",   name: "Electronics & Communication Engineering",   shortName: "ECE",   color: "#f59e0b", coordinator: "HOD-ECE" },
  { id: "civil", name: "Civil Engineering",                         shortName: "Civil", color: "#10b981", coordinator: "HOD-CE" },
  { id: "me",    name: "Mechanical Engineering",                    shortName: "ME",    color: "#ef4444", coordinator: "HOD-ME" },
];

// ── NBA Criteria Template (applied to every department) ──
interface CriterionTemplate {
  code: string;
  title: string;
  section: string;
}

const NBA_CRITERIA_TEMPLATE: CriterionTemplate[] = [
  // ── 1. Outcome-Based Curriculum ──
  { code: "1.1.1", title: "Vision and Mission of Institute and Department", section: "1. Outcome-Based Curriculum" },
  { code: "1.1.2", title: "Program Educational Objectives (PEOs)", section: "1. Outcome-Based Curriculum" },
  { code: "1.1.3", title: "Process of Defining V&M and PEOs", section: "1. Outcome-Based Curriculum" },
  { code: "1.1.4", title: "Dissemination of V&M and PEOs", section: "1. Outcome-Based Curriculum" },
  { code: "1.1.5", title: "PEO-Mission Correlation Matrix", section: "1. Outcome-Based Curriculum" },
  { code: "1.2.1", title: "Course-wise Curriculum Structure", section: "1. Outcome-Based Curriculum" },
  { code: "1.2.2", title: "Curriculum Components (% Credits by Category)", section: "1. Outcome-Based Curriculum" },
  { code: "1.2.3", title: "Gap Analysis – Curriculum vs PO/PSO", section: "1. Outcome-Based Curriculum" },
  { code: "1.2.4", title: "Content Beyond Syllabus – Bridge Actions", section: "1. Outcome-Based Curriculum" },
  { code: "1.3.1", title: "Program Specific Outcomes (PSOs)", section: "1. Outcome-Based Curriculum" },
  { code: "1.3.2", title: "Mapping Courses → POs / PSOs", section: "1. Outcome-Based Curriculum" },
  { code: "1.4",   title: "Course Outcomes (Semester-wise)", section: "1. Outcome-Based Curriculum" },
  { code: "1.4.1", title: "Course Articulation Matrix (CO-PO-PSO)", section: "1. Outcome-Based Curriculum" },
  { code: "1.4.2", title: "Program Articulation Matrix", section: "1. Outcome-Based Curriculum" },

  // ── 2. Outcome-Based Teaching Learning ──
  { code: "2.1", title: "Quality of Teaching & Learning Processes", section: "2. Outcome-Based Teaching Learning" },
  { code: "2.2", title: "Quality of Student Capstone Project", section: "2. Outcome-Based Teaching Learning" },
  { code: "2.3", title: "Internship / Industrial Training", section: "2. Outcome-Based Teaching Learning" },
  { code: "2.4", title: "Seminar and Mini / Micro Projects", section: "2. Outcome-Based Teaching Learning" },
  { code: "2.5", title: "Case Studies and Real-Life Examples", section: "2. Outcome-Based Teaching Learning" },
  { code: "2.6", title: "SWAYAM / NPTEL / MOOC / Self Learning", section: "2. Outcome-Based Teaching Learning" },
  { code: "2.7", title: "Solving Complex Engineering Problems + Sustainability (SDGs)", section: "2. Outcome-Based Teaching Learning" },
  { code: "2.8", title: "Industry-Institute Partnerships", section: "2. Outcome-Based Teaching Learning" },

  // ── 3. Outcome-Based Assessment ──
  { code: "3.1",   title: "Continuous Assessment (CIE)", section: "3. Outcome-Based Assessment" },
  { code: "3.2",   title: "Semester End (SEE) Evaluation", section: "3. Outcome-Based Assessment" },
  { code: "3.3",   title: "Laboratory Work & Workshop Evaluation", section: "3. Outcome-Based Assessment" },
  { code: "3.4",   title: "Industrial Training / Internship Evaluation", section: "3. Outcome-Based Assessment" },
  { code: "3.5",   title: "Project Evaluation (PO/PSO linked)", section: "3. Outcome-Based Assessment" },
  { code: "3.6",   title: "Evidence of Addressing SDGs", section: "3. Outcome-Based Assessment" },
  { code: "3.7.1", title: "Assessment Tools & CO Attainment Process", section: "3. Outcome-Based Assessment" },
  { code: "3.7.2", title: "CO Attainment per Course", section: "3. Outcome-Based Assessment" },
  { code: "3.8",   title: "Attainment of POs and PSOs", section: "3. Outcome-Based Assessment" },

  // ── 4. Students' Performance ──
  { code: "4.1",   title: "Enrollment Ratio in First Year", section: "4. Students' Performance" },
  { code: "4.2",   title: "Success Rate in Stipulated Period", section: "4. Students' Performance" },
  { code: "4.3",   title: "Academic Performance – First Year (API)", section: "4. Students' Performance" },
  { code: "4.4",   title: "Academic Performance – Second Year (API)", section: "4. Students' Performance" },
  { code: "4.5",   title: "Academic Performance – Third Year (API)", section: "4. Students' Performance" },
  { code: "4.6",   title: "Placement, Higher Studies & Entrepreneurship", section: "4. Students' Performance" },
  { code: "4.7.1", title: "Societies / Clubs / Events Organised", section: "4. Students' Performance" },
  { code: "4.7.2", title: "Student Participation in Professional Events", section: "4. Students' Performance" },
  { code: "4.7.3", title: "Dept. Journals / Magazines / Newsletters", section: "4. Students' Performance" },
  { code: "4.7.4", title: "Student Publications", section: "4. Students' Performance" },

  // ── 5. Faculty Information ──
  { code: "5.1", title: "Student-Faculty Ratio (SFR)", section: "5. Faculty Information" },
  { code: "5.2", title: "Faculty Qualification Index (FQI)", section: "5. Faculty Information" },
  { code: "5.3", title: "Faculty Cadre Proportion (1:2:6)", section: "5. Faculty Information" },
  { code: "5.4", title: "Visiting / Adjunct / Professor of Practice", section: "5. Faculty Information" },
  { code: "5.5", title: "Faculty Retention", section: "5. Faculty Information" },

  // ── 6. Faculty Contribution ──
  { code: "6.1.1.1", title: "Memberships in Professional Societies", section: "6. Faculty Contribution" },
  { code: "6.1.1",   title: "Faculty as Resource Persons", section: "6. Faculty Contribution" },
  { code: "6.1.1.2", title: "Faculty Participation in STTPs / FDPs", section: "6. Faculty Contribution" },
  { code: "6.1.2",   title: "MOOC Certifications", section: "6. Faculty Contribution" },
  { code: "6.1.4",   title: "FDP / STTP Organised", section: "6. Faculty Contribution" },
  { code: "6.1.5",   title: "Student Innovation Support", section: "6. Faculty Contribution" },
  { code: "6.1.6",   title: "Industry Engagement", section: "6. Faculty Contribution" },
  { code: "6.2.1",   title: "Academic Research (WoS / UGC-CARE)", section: "6. Faculty Contribution" },
  { code: "6.2.2",   title: "Development Activities (Books / Patents)", section: "6. Faculty Contribution" },
  { code: "6.2.3",   title: "Sponsored Research Projects", section: "6. Faculty Contribution" },
  { code: "6.2.4",   title: "Consultancy Work", section: "6. Faculty Contribution" },
  { code: "6.2.5",   title: "Seed Money / Internal R&D", section: "6. Faculty Contribution" },

  // ── 7. Facilities and Technical Support ──
  { code: "7.1", title: "Adequate & Well-Equipped Labs + Technical Manpower", section: "7. Facilities and Technical Support" },
  { code: "7.2", title: "Additional Facilities for Quality of Learning", section: "7. Facilities and Technical Support" },
  { code: "7.3", title: "Maintenance of Laboratories & Overall Ambiance", section: "7. Facilities and Technical Support" },
  { code: "7.4", title: "Safety Measures in Laboratories", section: "7. Facilities and Technical Support" },
  { code: "7.5", title: "Project / Research Laboratory / Centre of Excellence", section: "7. Facilities and Technical Support" },

  // ── 8. Continuous Improvement ──
  { code: "8.1.1", title: "Actions Based on CO Attainment Results", section: "8. Continuous Improvement" },
  { code: "8.1.2", title: "Actions Based on PO/PSO Attainment Results", section: "8. Continuous Improvement" },
  { code: "8.2",   title: "Academic Audit and Corrective Actions", section: "8. Continuous Improvement" },
  { code: "8.3",   title: "Improvement in Faculty Qualifications & Contributions", section: "8. Continuous Improvement" },
  { code: "8.4",   title: "Improvement in Academic Performance", section: "8. Continuous Improvement" },

  // ── 9. Student Support & Governance ──
  { code: "9.1",  title: "First Year Student-Faculty Ratio (FYSFR)", section: "9. Student Support & Governance" },
  { code: "9.2",  title: "Mentoring System", section: "9. Student Support & Governance" },
  { code: "9.3",  title: "Feedback Analysis", section: "9. Student Support & Governance" },
  { code: "9.4",  title: "Training and Placement Support", section: "9. Student Support & Governance" },
  { code: "9.5",  title: "Start-up and Entrepreneurship Activities", section: "9. Student Support & Governance" },
  { code: "9.6",  title: "Governance and Transparency", section: "9. Student Support & Governance" },
  { code: "9.7",  title: "Budget Allocation & Utilization – Institute Level", section: "9. Student Support & Governance" },
  { code: "9.8",  title: "Program Specific Budget", section: "9. Student Support & Governance" },
  { code: "9.9",  title: "Quality of Learning Resources", section: "9. Student Support & Governance" },
  { code: "9.10", title: "E-Governance", section: "9. Student Support & Governance" },
  { code: "9.11", title: "Initiatives & Implementation of SDGs", section: "9. Student Support & Governance" },
  { code: "9.12", title: "Innovative Educational Initiatives", section: "9. Student Support & Governance" },
  { code: "9.13", title: "Faculty Performance Appraisal & Development (FADS)", section: "9. Student Support & Governance" },
  { code: "9.14", title: "Outreach Activities", section: "9. Student Support & Governance" },
];

// Generate criteria for all departments from the template
function generateCriteriaForDept(dept: DepartmentInfo): Criterion[] {
  return NBA_CRITERIA_TEMPLATE.map((t) => ({
    id: `${dept.id}-${t.code}`,
    title: `${t.code} – ${t.title}`,
    description: t.title,
    category: t.section,
    status: "Pending" as const,
    priority: "High" as const,
    department: dept.id as Role,
    assignedTo: dept.coordinator,
    dueDate: "2026-10-31",
    remarks: "",
    lastUpdated: new Date().toISOString(),
    history: [],
  }));
}

export const INITIAL_CRITERIA: Criterion[] = DEPARTMENTS.flatMap(generateCriteriaForDept);
