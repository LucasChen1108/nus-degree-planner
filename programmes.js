/*
 * Degree requirement data for the NUS SoC Degree Planner.
 *
 * Each programme is a list of requirement groups. A group can have:
 *   reqs   : required slots, each filled by courses matching `any`
 *            { label, any:[patterns] }                 one course
 *            { label, any:[...], pick:n }              n courses
 *            { label, any:[...], units:n }             courses until n units
 *   pool   : patterns for electives that fill the group's remaining units
 *   caps   : sub-limits inside the pool [{ any:[...], max:units }]
 *   checks : extra rules shown under the group (see runCheck in index.html)
 *   rc     : extra patterns accepted when the student is in a Residential College
 *            { utcp:[...], rvrc:[...] }   (NUS College replaces every `cc:true` group)
 *   cc     : true for Common Curriculum groups
 *
 * Pattern syntax (matched against course codes):
 *   CS2040S   exact code            GEC%     any code starting with GEC
 *   MA32xx    x = any digit         CS[3-9]% level-3000 or higher CS course
 *   !ST328%   exclude matches       @ID @CD  courses tagged Interdisciplinary / Cross-disciplinary
 *   @3       level-3000 course     @4+      level-4000 or higher
 *
 * Sources are linked from each programme. Requirements change by intake year:
 * always confirm with the official pages and your EduRec degree audit.
 */
(function(){
"use strict";

const IE_SOC = ["CP3880","IS4010","ETP3201L","CP3200","CP3202","CP3107","CP3110","ETP3205","ETP3206L","CP4101"];
const NOT_IE = IE_SOC.map(c=>"!"+c);

/* ---- Residential College course patterns ---- */
const UT = ["UTC%","UTS%","UTW%"];                 // Tembusu, CAPT, RC4, Acacia (UTCP)
const RV = ["RVC%","RVX%","RVSS%","RVN%"];         // Ridge View RC

/* ---- shared Common Curriculum builders ---- */
const P4 = (k,name,any,rc,extra) => Object.assign({k, name, short:"Pillar", units:4, pillar:true, cc:true, reqs:[{label:name, any}], rc}, extra||{});
function sixPillars(o){
  return [
    P4("dl","Digital Literacy",o.dl, o.rcDl),
    P4("ce","Critique & Expression",o.ce, {utcp:UT, rvrc:["RVX%"]}),
    P4("cc","Cultures & Connections",["GEC%"], {utcp:UT, rvrc:["RVC%"]}),
    P4("dat","Data Literacy",o.dat),
    P4("ss","Singapore Studies",o.ss||["GES%"], {utcp:UT, rvrc:["RVSS%"]}),
    P4("ceng","Communities & Engagement",["GEN%"], {utcp:UT, rvrc:["RVN%"]})
  ];
}
function pillars(o){
  return [
    ...sixPillars(o),
    {k:"eth", name:"Computing Ethics", short:"Ethics", units:4, cc:true, reqs:[{label:"IS1108 Digital and AI Ethics", any:["IS1108"]}]},
    {k:"idcd",name:"Interdisciplinary / Cross-disciplinary", short:"ID/CD", units:12, cc:true, pool:["@ID","@CD"],
      hint:"Mark a course as ID or CD in its edit dialog. HS-coded courses count as ID automatically.",
      checks:[{t:"idcd"}]}
  ];
}
const DATA_LIT = ["GEA1000","BT1101","ST1131","DSA1101"];
const UE = units => ({k:"ue", name:"Unrestricted Electives", short:"UE", units, ue:true, hint:"Any course, plus overflow from full requirement groups."});

const CS_FOCUS = {
  "Algorithms & Theory":["CS3230","CS3231","CS3236","CS4231","CS4232","CS4234","CS4330","CS4430"],
  "Artificial Intelligence":["CS2109S","CS3243","CS3244","CS3263","CS3264","CS3268","CS4243","CS4244","CS4246","CS4248","CS4262","CS4263"],
  "Computer Graphics & Games":["CS3241","CS3242","CS3247","CS4247","CS4350"],
  "Computer Security":["CS2107","CS3235","CS4236","CS4230","CS4238","CS4239"],
  "Database Systems":["CS2102","CS3223","CS4221","CS4224","CS4225"],
  "Human-Computer Interaction":["CS2111","CS3240","CS3249","CS4249","CS4353"],
  "Multimedia Information Retrieval":["CS2108","CS3245","CS4242","CS4248","CS4347"],
  "Networking & Distributed Systems":["CS2105","CS3103","CS4222","CS4226","CS4231"],
  "Parallel Computing":["CS3210","CS3211","CS4231","CS4223"],
  "Programming Languages":["CS2104","CS3211","CS4212","CS4215"],
  "Software Engineering":["CS2103T","CS2103","CS3213","CS3217","CS3219","CS3227","CS3282","CS4211","CS4218","CS4239"]
};

const SOC = "https://www.comp.nus.edu.sg/cug/per-cohort/";

const MAJORS = {
  cs: {
    faculty:"School of Computing", name:"Computer Science", degree:"B.Comp. (Computer Science)", cohort:"Cohorts AY2025/26 and AY2026/27", units:160,
    sources:[{label:"CS cohort 2025/26", url:SOC+"cs/cs-25-26/"},{label:"CS focus areas", url:"https://www.comp.nus.edu.sg/programmes/ug/focus/"}],
    groups:[
      ...pillars({dl:["CS1101S"], ce:["ES2660","UTW%","RVX%"], dat:DATA_LIT}),
      {k:"found", name:"CS Foundation", short:"Found.", units:36, reqs:[
        {label:"CS1231S Discrete Structures", any:["CS1231S","CS1231"]},
        {label:"CS2030S Programming Methodology II", any:["CS2030S","CS2030"]},
        {label:"CS2040S Data Structures and Algorithms", any:["CS2040S","CS2040","CS2040C"]},
        {label:"CS2100 Computer Organisation", any:["CS2100"]},
        {label:"CS2101 Effective Communication", any:["CS2101"]},
        {label:"CS2103T Software Engineering", any:["CS2103T","CS2103"]},
        {label:"CS2106 Operating Systems", any:["CS2106"]},
        {label:"CS2109S Intro to AI and ML", any:["CS2109S"]},
        {label:"CS3230 Design and Analysis of Algorithms", any:["CS3230"]}]},
      {k:"bd", name:"CS Breadth & Depth", short:"B&D", units:32,
        pool:["CS%","IFS%","CP%",...IE_SOC],
        caps:[{label:"Industry Experience", any:IE_SOC, max:12},{label:"Other CP-coded courses", any:["CP%",...NOT_IE], max:12}],
        checks:[
          {t:"focus", areas:CS_FOCUS},
          {t:"minUnits", label:"Level-4000+ units", any:["CS[4-9]%","IFS[4-9]%","CP[4-9]%",...NOT_IE], n:12},
          {t:"ie", list:IE_SOC, min:6, alt:"CP4101"}],
        suggest:["CP3200","CP3880","CP4101"]},
      {k:"math", name:"Mathematics & Sciences", short:"Math", units:12, reqs:[
        {label:"MA1521 Calculus for Computing", any:["MA1521"]},
        {label:"MA1522 Linear Algebra for Computing", any:["MA1522"]},
        {label:"ST2334 Probability and Statistics", any:["ST2334"]}]},
      UE(40)
    ]
  },

  ai: {
    faculty:"School of Computing", name:"Artificial Intelligence", degree:"B.Comp. (Artificial Intelligence)", cohort:"Cohorts AY2025/26 and AY2026/27", units:160,
    sources:[{label:"AI cohort 2025/26", url:SOC+"ai/ai-25-26/"},{label:"AI cohort 2026/27", url:SOC+"ai/ai-26-27/"}],
    groups:[
      ...pillars({dl:["CS1101S"], ce:["ES2660","UTW%","RVX%"], dat:DATA_LIT}),
      {k:"cf", name:"Computing Foundations", short:"Found.", units:20, reqs:[
        {label:"CS2030S Programming Methodology II", any:["CS2030S","CS2030"]},
        {label:"CS2040S Data Structures and Algorithms", any:["CS2040S","CS2040","CS2040C"]},
        {label:"CS2103T Software Engineering (AY25/26 cohort: or CS2100)", any:["CS2103T","CS2103","CS2100"]},
        {label:"CS2101 Effective Communication", any:["CS2101","CS2101X"]},
        {label:"CS3230 Design and Analysis of Algorithms", any:["CS3230"]}]},
      {k:"aif", name:"AI Foundations", short:"AI Found.", units:20, reqs:[
        {label:"CS2109S Intro to AI and ML", any:["CS2109S"]},
        {label:"CS3263 Foundations of AI", any:["CS3263"]},
        {label:"CS3264 Foundations of Machine Learning", any:["CS3264"]},
        {label:"CS3268 Responsible AI", any:["CS3268"]},
        {label:"Perception: CS4243 or CS4248", any:["CS4243","CS4248"]}]},
      {k:"mf", name:"Mathematics Foundations", short:"Math", units:20, reqs:[
        {label:"CS1231S Discrete Structures", any:["CS1231S","CS1231"]},
        {label:"CS2251 Optimization for ML", any:["CS2251"]},
        {label:"MA1521 Calculus for Computing", any:["MA1521"]},
        {label:"MA1522 Linear Algebra for Computing", any:["MA1522"]},
        {label:"ST2334 Probability and Statistics", any:["ST2334","ST2132"]}]},
      {k:"bd", name:"AI Breadth & Depth", short:"B&D", units:20,
        pool:["CS%","IFS%","IS%","CP%",...IE_SOC],
        caps:[{label:"Industry Experience", any:IE_SOC, max:12},{label:"Other CP-coded courses", any:["CP%",...NOT_IE], max:12}],
        checks:[
          {t:"minUnits", label:"AI Technical Electives", any:["CS4220","CS4225","CS4240","CS4244","CS4246","CS4261","CS4262","CS4277","CS4278","CS4347"], n:12},
          {t:"minUnits", label:"Level-4000+ units", any:["CS[4-9]%","IFS[4-9]%","IS[4-9]%","CP[4-9]%",...NOT_IE], n:12},
          {t:"ie", list:IE_SOC, min:6, alt:"CP4101"}],
        suggest:["CS4244","CS4246","CS4262","CS4277","CS4278","CP3200","CP3880"]},
      UE(40)
    ]
  },

  bza: {
    faculty:"School of Computing", name:"Business Analytics", degree:"B.Sc. (Business Analytics)", cohort:"Cohorts AY2025/26 and AY2026/27", units:160,
    sources:[{label:"BZA cohort 2025/26", url:SOC+"ba/ba-25-26"}],
    groups:[
      ...pillars({dl:["CS1010A","CS1010S","CS1010%","CS1101S"], ce:["GEX%"], dat:["BT1101"]}),
      {k:"core", name:"BZA Core", short:"Core", units:60, reqs:[
        {label:"MA1521 Calculus for Computing", any:["MA1521","MA2002"]},
        {label:"MA1522 or MA2001 Linear Algebra", any:["MA1522","MA2001"]},
        {label:"BT2101 Econometrics Modeling", any:["BT2101"]},
        {label:"BT2102 Data Management and Visualisation", any:["BT2102"]},
        {label:"CS2030 Programming Methodology II", any:["CS2030","CS2030S"]},
        {label:"CS2040 Data Structures and Algorithms", any:["CS2040","CS2040S","CS2040C"]},
        {label:"IS2101 Business and Technical Communication", any:["IS2101"]},
        {label:"ST2334 Probability and Statistics", any:["ST2334"]},
        {label:"BT3103 Application Systems Development", any:["BT3103"]},
        {label:"IS3103 IS Leadership and Communication", any:["IS3103"]},
        {label:"BT4103 Business Analytics Capstone (8u)", any:["BT4103"]},
        {label:"BT4101 Dissertation or Industry Experience (12u)", any:["BT4101","CP3880","IS4010","CP3200","CP3202","CP3201","CS4352","ETP3206L"], units:12}]},
      {k:"pe", name:"Programme Electives", short:"PE", units:20,
        pool:["IE3120","IS3150","IS3240","BT4013","BT4016","BT4211","BT4212","DBA4811","IS4241","IS4250","IS4262",
              "BT3017","BT3102","BT3104","CP3100","CS3243","CS3244","CS4248","BT4012","BT4015","BT4221","BT4222","BT4240","BT4241","ST4245",
              "IS3107","IS3221","BT4014","BT4301","IS4226","IS4228","IS4234","IS4246","IS4302","IS4303"],
        checks:[
          {t:"minCount", label:"At least 3 at level 4000", any:["@4+"], n:3},
          {t:"minCount", label:"At least 3 BT-coded", any:["BT%"], n:3}],
        suggest:["BT3017","BT4012","BT4221","BT4222","BT4240"]},
      UE(40)
    ]
  },

  bais: {
    faculty:"School of Computing", name:"Business AI Systems", degree:"B.Comp. (Business Artificial Intelligence Systems)", cohort:"Cohorts AY2025/26 and AY2026/27", units:160,
    sources:[{label:"BAIS cohort 2025/26", url:SOC+"bais/bais-25-26"}],
    groups:[
      ...pillars({dl:["CS1010A","CS1010S","CS1010%","CS1101S"], ce:["GEX%"], dat:["BT1101"]}),
      {k:"core", name:"BAIS Core", short:"Core", units:60, reqs:[
        {label:"BT2102 Data Management and Visualisation", any:["BT2102"]},
        {label:"CS2030 Programming Methodology II", any:["CS2030","CS2030S"]},
        {label:"CS2040 Data Structures and Algorithms", any:["CS2040","CS2040S","CS2040C"]},
        {label:"IS2101 Business and Technical Communication", any:["IS2101"]},
        {label:"IS2108 Full-stack SE for AI Solutions I", any:["IS2108"]},
        {label:"IS2109 AI and ML Techniques I", any:["IS2109"]},
        {label:"IS3103 Digital Transformation and Leadership Comms", any:["IS3103"]},
        {label:"IS4108 AI Solutioning Capstone (8u)", any:["IS4108"]},
        {label:"MA1521 Calculus for Computing", any:["MA1521"]},
        {label:"MA1522 Linear Algebra for Computing", any:["MA1522"]},
        {label:"ST2334 Probability and Statistics", any:["ST2334"]},
        {label:"Industry Experience or CP4101 Dissertation (12u)", any:["CP4101","CP3880","IS4010","CP3200","CP3202","CP3201","CS4352","ETP3206L"], units:12}]},
      {k:"pe", name:"Programme Electives", short:"PE", units:20,
        pool:["IS3150","IS3240","IS4262","IS4226","IS4228","IS4302","IS4303",
              "CS2105","IS2102","IS3108","IS3221","IS4100","IS4234","IS4236","IS4243","IS4248","IS4250","IS4301",
              "BT3017","BT4014","BT4221","BT4301","IS3107","IS3109","IS4151","IS4246","IS4400","IS4401","IS4402","IS4403",
              "CP3100","IS3251","IS4152","IS4241","IS4261","CS2107","IFS4101","IS4231","IS4233","IS4238"],
        checks:[{t:"minCount", label:"At least 3 at level 4000", any:["@4+"], n:3}],
        suggest:["IS3109","IS4401","IS4402","IS4403","IS4246"]},
      UE(40)
    ]
  },

  isc: {
    faculty:"School of Computing", name:"Information Security", degree:"B.Comp. (Information Security)", cohort:"Cohorts AY2025/26 and AY2026/27", units:160,
    sources:[{label:"InfoSec cohort 2025/26", url:SOC+"isc/isc-25-26/"}],
    groups:[
      ...pillars({dl:["CS1010","CS1010%","CS1101S"], ce:["GEX%"], dat:DATA_LIT}),
      {k:"found", name:"Computing Foundation", short:"Found.", units:32, reqs:[
        {label:"CS1231S Discrete Structures", any:["CS1231S","CS1231"]},
        {label:"CS2030 Programming Methodology II", any:["CS2030","CS2030S"]},
        {label:"CS2040C Data Structures and Algorithms", any:["CS2040C","CS2040S","CS2040"]},
        {label:"CS2100 Computer Organisation", any:["CS2100"]},
        {label:"CS2101 Effective Communication", any:["CS2101"]},
        {label:"CS2103T Software Engineering", any:["CS2103T","CS2103"]},
        {label:"CS2105 Computer Networks", any:["CS2105"]},
        {label:"CS2106 Operating Systems", any:["CS2106"]}]},
      {k:"isr", name:"Information Security Requirements", short:"InfoSec", units:28, reqs:[
        {label:"CS2107 Intro to Information Security", any:["CS2107"]},
        {label:"CS3235 Computer Security", any:["CS3235"]},
        {label:"IS4231 Information Security Management", any:["IS4231"]},
        {label:"IFS4205 Capstone, or CS4238 + IFS4103 (8u)", any:["IFS4205","CS4238","IFS4103"], units:8}],
        pool:["CS4230","CS4236","MA4261","CS4238","CS4239","CS4257","CS4276","CS5231","CS5321","CS5322","CS5331","CS5332",
              "IFS4101","IFS4102","IFS4103","IS4204","IS4233","IS4234","IS4238","IS4302"],
        hint:"8 units of programme electives fill the rest of this group.",
        suggest:["CS4236","CS4239","IFS4102","CS5231"]},
      {k:"comp", name:"Computing Requirements", short:"Comp.", units:12,
        pool:["CS[3-9]%","IS[3-9]%","CP%",...IE_SOC],
        checks:[{t:"ie", list:IE_SOC, min:6, alt:"CP4101"}],
        suggest:["CP3200","CP3880"]},
      {k:"math", name:"Mathematics", short:"Math", units:12, reqs:[
        {label:"MA1521 Calculus for Computing", any:["MA1521"]},
        {label:"MA1522 Linear Algebra for Computing", any:["MA1522"]},
        {label:"ST2334 Probability and Statistics", any:["ST2334"]}]},
      UE(36)
    ]
  }
};

/* =====================================================================
 * College of Humanities and Sciences (Science + Arts & Social Sciences)
 * Common Curriculum 52 units + Major 60 units + UE 48 units = 160
 * ===================================================================== */
const CHS_SRC = {label:"CHS Common Curriculum (Faculty of Science)", url:"https://www.science.nus.edu.sg/wp-content/uploads/2025/07/Information-for-Freshmen-to-Science-Majors-CHS_2510.pdf"};
function chsCC(o){
  o = o||{};
  const c = (k,name,any,rc) => Object.assign({k, name, short:"CHS CC", units:4, pillar:true, cc:true, reqs:[{label:name, any}]}, rc?{rc}:{});
  return [
    c("hum","Humanities",["HSH1000"]),
    c("soc","Social Sciences",["HSS1000"]),
    c("asia","Asian Studies",["HSA1000"]),
    c("si1","Scientific Inquiry I",["HSI1000","SP2274"]),
    c("si2","Scientific Inquiry II",["HSI20xx","SP3275"]),
    c("ai","Artificial Intelligence",["HS1501","HS1502","IT1244"]),
    c("dat","Data Literacy",["GEA1000","ST1131","DSA1101","DSE1101","BT1101"]),
    c("dl","Digital Literacy", o.sci ? ["CS1010%","CS1101S","COS1000","COS2000","CM3267","ZB2201","SP2273"]
                                     : ["GEI1001","GEI1002","NM2207","CS1010%","CS1101S","COS1000","COS2000"], {utcp:UT}),
    c("dt","Design Thinking",["DTK1234"]),
    c("ceng","Communities & Engagement",["GEN%"], {utcp:UT, rvrc:RV}),
    c("wr","Writing",["SP1541","SP1541X","FAS1101","SP2271","ES1103","ES2631"], {utcp:UT, rvrc:RV}),
    {k:"chsid", name:"Interdisciplinary Courses", short:"CHS CC", units:8, pillar:true, cc:true,
      reqs:[{label:"2 Interdisciplinary courses (HS29xx)", any:["HS29xx","HS2%","!HS2006"], pick:2}], rc:{utcp:UT, rvrc:RV}}
  ];
}
/* A typical FASS / CHS major: 60 units of department courses, with level rules */
function chsMajor(o){
  return {
    faculty:o.faculty, name:o.name, degree:o.degree, cohort:o.cohort||"Cohorts AY2021/22 onwards", units:160,
    simplified:o.simplified, sources:[...(o.sources||[]), CHS_SRC],
    groups:[
      ...chsCC({sci:o.faculty==="Science"}),
      Object.assign({k:"maj", name:`${o.name} Major`, short:"Major", units:o.units||60, reqs:o.reqs||[],
        pool:o.pool, checks:o.checks||[], suggest:o.suggest, hint:o.hint}, o.caps?{caps:o.caps}:{}),
      ...(o.extraGroups||[]),
      UE(160-52-(o.units||60)-(o.extraGroups||[]).reduce((a,g)=>a+g.units,0))
    ]
  };
}
const FASS = "Arts & Social Sciences";
const lvl = (n3,n4) => [{t:"minUnits", label:"Level-3000+ units", any:["@3+"], n:n3}, {t:"minUnits", label:"Level-4000+ units", any:["@4+"], n:n4}];
function fassMajor(key, name, prefixes, o){
  o=o||{};
  const pool = prefixes.map(p=>p+"%");
  return chsMajor(Object.assign({
    faculty:FASS, name, degree:o.degree||`B.A. (Hons) ${name}`,
    reqs:o.reqs || [{label:`Level-1000 ${prefixes[0]} course${o.intro?` (e.g. ${o.intro})`:""}`, any:o.intro?[o.intro, prefixes[0]+"1%"]:[prefixes[0]+"1%"]}],
    pool, checks:lvl(o.n3||36, o.n4||20),
    hint:o.simplified ? `Simplified: any ${prefixes.join("/")}-coded course counts here. Check your department's page for compulsory courses.` : undefined
  }, o));
}

const CHS_MAJORS = {
  /* ---- Science ---- */
  chem: chsMajor({faculty:"Science", name:"Chemistry", degree:"B.Sc. (Hons) Chemistry",
    sources:[{label:"Dept of Chemistry", url:"https://chemistry.nus.edu.sg/undergraduates-cohort-2021-and-after/"}],
    reqs:[
      ...["CM1102","CM2112","CM2122","CM2133","CM2143","CM3111","CM3121","CM3131","CM3141","CM3191","CM3192"].map(c=>({label:c, any:[c]})),
      {label:"4 CM electives at level 3000–4000", any:["CM3xxx","CM[34]%","!CM3288%","!CM3289%","!CM4288%"], pick:4}]}),
  lsm: chsMajor({faculty:"Science", name:"Life Sciences", degree:"B.Sc. (Hons) Life Sciences",
    sources:[{label:"Dept of Biological Sciences", url:"https://www.dbs.nus.edu.sg/wp-content/uploads/sites/7/2024/07/lifesciencesAY2122.pdf"}],
    reqs:[
      {label:"LSM1111", any:["LSM1111"]},{label:"LSM2105 Molecular Genetics", any:["LSM2105"]},{label:"LSM2106 Fundamental Biochemistry", any:["LSM2106"]},
      {label:"LSM2107 Evolutionary Biology", any:["LSM2107"]},{label:"LSM2191 Lab Techniques", any:["LSM2191A","LSM2191%"]}],
    pool:["LSM22xx","LSM32xx","LSM42xx","LSM4352","LSM3991","LSM4991","LSM4288%","!LSM2289%","!LSM3289%"],
    caps:[{label:"LSM22xx", any:["LSM22xx"], max:12}],
    checks:[{t:"minUnits", label:"Level-4000 LSM units", any:["LSM4%"], n:12}]}),
  math: chsMajor({faculty:"Science", name:"Mathematics", degree:"B.Sc. (Hons) Mathematics",
    sources:[{label:"Dept of Mathematics", url:"https://www.math.nus.edu.sg/wp-content/uploads/sites/4/2026/06/MA_2122_15062026.pdf"}],
    reqs:[
      {label:"MA1100 Basic Discrete Mathematics", any:["MA1100","MA1100T","CS1231S"]},
      {label:"MA2001 Linear Algebra I", any:["MA2001","MA1522"]},{label:"MA2002 Calculus", any:["MA2002","MA1521"]},
      {label:"MA2101 Linear Algebra II", any:["MA2101","MA2101S"]},{label:"MA2104 Multivariable Calculus", any:["MA2104"]},
      {label:"MA2108 Mathematical Analysis I", any:["MA2108","MA2108S"]},{label:"Probability: MA2116 / ST2131", any:["MA2116","MA2116T","MA2216","ST2131"]},
      {label:"MA4198 Mathematics Capstone", any:["MA4198"]},
      {label:"5 courses: MA32xx / MA42xx / ST3236 / ST4238", any:["MA32xx","MA42xx","MA52xx","MA62xx","ST3236","ST4238","!MA[3-6]28[89]%"], pick:5},
      {label:"2 more: MA22xx / MA32xx / MA42xx", any:["MA22xx","MA32xx","MA42xx","!MA[2-4]28[89]%"], pick:2}],
    suggest:["MA3201","MA3210","MA3220","MA3236","MA3238"]}),
  phys: chsMajor({faculty:"Science", name:"Physics", degree:"B.Sc. (Hons) Physics",
    sources:[{label:"Dept of Physics", url:"https://www.physics.nus.edu.sg/student/major-in-physics/"}],
    reqs:["PC1101","PC2031","PC2032","PC2130","PC2135","PC2174A","PC2193","PC3193","PC3274A"].map(c=>({label:c, any:[c]})),
    pool:["PC[34]%"], checks:[{t:"minCount", label:"Research: PC3288 / PC4288 / UPIP / NOC", any:["PC3288%","PC4288%","PC3312","PC3313","ETP%"], n:1}]}),
  stat: chsMajor({faculty:"Science", name:"Statistics", degree:"B.Sc. (Hons) Statistics",
    sources:[{label:"Dept of Statistics & Data Science", url:"https://www.stat.nus.edu.sg/wp-content/uploads/sites/8/2026/07/STHON-AY21-22-after_updated-July-2026.pdf"}],
    reqs:[
      {label:"ST1131", any:["ST1131"]},{label:"MA2001 Linear Algebra I", any:["MA2001","MA1522"]},{label:"MA2002 Calculus", any:["MA2002","MA1521"]},
      {label:"MA2104 / MA2311", any:["MA2104","MA2311"]},{label:"Probability: ST2131 / MA2116", any:["ST2131","MA2116","MA2116T"]},
      {label:"ST2132 Mathematical Statistics", any:["ST2132"]},{label:"ST2137 Statistical Computing", any:["ST2137"]},
      {label:"ST3131 Regression Analysis", any:["ST3131"]},
      {label:"16 units at level 4000: ST42xx (or ST4288 + 2 ST42xx)", any:["ST42xx","ST4288%"], units:16},
      {label:"3 more: ST32xx / ST42xx", any:["ST32xx","ST42xx","!ST328%","!ST4288%"], pick:3}]}),
  dsa: chsMajor({faculty:"Science", name:"Data Science and Analytics", degree:"B.Sc. (Hons) Data Science and Analytics", cohort:"Cohorts AY2022/23 to AY2025/26",
    sources:[{label:"Dept of Statistics & Data Science", url:"https://www.stat.nus.edu.sg/wp-content/uploads/sites/8/2026/07/DSAHON-AY22-23-AY25-26_updated-July-2026.pdf"}],
    reqs:[
      ...["DSA1101","DSA2101","DSA2102","ST2132","CS3244","DSA3101","DSA3102","ST3131"].map(c=>({label:c, any:[c]})),
      {label:"CS2040 Data Structures and Algorithms", any:["CS2040","CS2040%"]},{label:"MA2001 Linear Algebra I", any:["MA2001","MA1522"]},
      {label:"MA2002 Calculus", any:["MA2002","MA1521"]},{label:"MA2104 / MA2311", any:["MA2104","MA2311"]},
      {label:"Probability: ST2131 / MA2116", any:["ST2131","MA2116","MA2116T"]},
      {label:"8 units at level 4000 (DSA42xx / DSE4211 / DSA4288)", any:["DSA42xx","DSE4211","DSE4212","QF4211","QF4212","DSA4288%"], units:8}]}),
  qf: chsMajor({faculty:"Science", name:"Quantitative Finance", degree:"B.Sc. (Hons) Quantitative Finance",
    sources:[{label:"Dept of Mathematics", url:"https://www.math.nus.edu.sg/wp-content/uploads/sites/4/2026/02/QF_2122_23022026.pdf"}],
    reqs:[
      ...["QF1100","QF2103","QF2104","QF3101","QF3103","QF4102","QF4103"].map(c=>({label:c, any:[c]})),
      {label:"MA2001 Linear Algebra I", any:["MA2001","MA1522"]},{label:"MA2002 Calculus", any:["MA2002","MA1521"]},{label:"MA2104", any:["MA2104"]},
      {label:"MA2213 / DSA2102 / CS2040", any:["MA2213","DSA2102","CS2040%"]},{label:"Probability: MA2116 / ST2131", any:["MA2116","MA2116T","ST2131"]},
      {label:"ST3131 / MA3270 / ST3236 / MA3238", any:["ST3131","MA3270","ST3236","MA3238"]},
      {label:"8 units: QF4104 / QF4205 / QF4211 / QF4212 / QF4288", any:["QF4104","QF4204","QF4205","QF4211","DSE4211","QF4212","DSE4212","QF4288%"], units:8}]}),
  fst: chsMajor({faculty:"Science", name:"Food Science and Technology", degree:"B.Sc. (Hons) Food Science and Technology",
    sources:[{label:"Dept of Food Science & Technology", url:"https://www.fst.nus.edu.sg/education/undergraduate-programme/course-structure/primary-major-in-fst/"}],
    reqs:["FST1101B","FST2102B","FST2106","FST2109","FST2110","FST2201","FST3103","FST3107","FST3108","FST3109","FST3110","FST3111","FST3112","FST4103","FST4104"].map(c=>({label:c, any:[c]})),
    hint:"The Research & Innovation or Industrial Applications track adds a 12-unit project or internship from your UEs."}),
  phs: chsMajor({faculty:"Science", name:"Pharmaceutical Science", degree:"B.Sc. (Hons) Pharmaceutical Science", units:64,
    sources:[{label:"Dept of Pharmacy & Pharmaceutical Sciences", url:"https://pharmacy.nus.edu.sg/wp-content/uploads/sites/6/2025/07/BSc-Pharm-Science-Course-Table-for-Cohort-AY2021-22-onwards-updated-2-Jul-2025.pdf"}],
    reqs:[
      ...["PHS1101","PHS2101","PHS2102","PHS2103","PHS2104","PHS2105","PHS2191","PHS3101","PHS3102","PHS3191","LSM3211","PHS4101","PHS4121"].map(c=>({label:c, any:[c]})),
      {label:"8 units: PHS4201 / PR4204 / PR4205 / PR4207 / PHS4288", any:["PHS4201","PR4204","PR4205","PR4207","PHS4288%","PHS4991"], units:8}]}),
  dse: chsMajor({faculty:"Science", name:"Data Science and Economics", degree:"B.Sc. (Hons) Data Science and Economics", simplified:true,
    sources:[{label:"Dept of Mathematics", url:"https://www.math.nus.edu.sg/ug/majmin/primajors/major-in-data-science-and-economics/"}],
    reqs:[{label:"DSE1101", any:["DSE1101"]},{label:"EC1101E", any:["EC1101E"]},{label:"DSE3101", any:["DSE3101"]}],
    pool:["DSE%","EC%","ST%","DSA%","MA%","CS2040%"], checks:lvl(16,12),
    hint:"Simplified: DSE, EC, ST, DSA and MA courses fill this group. Check the department's PDF for the exact list."}),

  /* ---- Arts & Social Sciences ---- */
  econ: fassMajor("econ","Economics",["EC"], {degree:"B.Soc.Sci. (Hons) Economics",
    sources:[{label:"Dept of Economics", url:"https://fass.nus.edu.sg/ecs/requirements-for-economics-major/"}],
    reqs:["EC1101E","EC2101","EC2102","EC2104","EC2303","EC3101","EC3102","EC3303"].map(c=>({label:c, any:[c]}))}),
  psy: fassMajor("psy","Psychology",["PL"], {degree:"B.Soc.Sci. (Hons) Psychology", n3:24, n4:20,
    sources:[{label:"Dept of Psychology", url:"https://fass.nus.edu.sg/psy/honours-programme/"}],
    reqs:[...["PL1101E","PL2131","PL2132","PL3102","PL3103","PL3104","PL3105","PL3106"].map(c=>({label:c, any:[c]})),
      {label:"PL3231 or a PL328x lab course", any:["PL3231","PL328x"]}]}),
  pol: fassMajor("pol","Political Science",["PS"], {degree:"B.Soc.Sci. (Hons) Political Science",
    sources:[{label:"Dept of Political Science", url:"https://fass.nus.edu.sg/pol/graduation-requirements-cohort-2021-onwards/"}],
    reqs:[{label:"PS1101E", any:["PS1101E"]},{label:"PS3257", any:["PS3257"]},{label:"Singapore politics: PS2249 / PS2244 / PS3249 / PS3273", any:["PS2249","PS2244","PS3249","PS3273"]}],
    hint:"Also take at least one course in each subfield: Comparative Politics, International Relations, Political Theory, Governance & Public Policy."}),
  hist: fassMajor("hist","History",["HY"], {
    sources:[{label:"Dept of History", url:"https://fass.nus.edu.sg/hist/history-requirements/"}],
    reqs:[{label:"HY1101E", any:["HY1101E"]},{label:"HY2259 The Craft of History", any:["HY2259"]}]}),
  phil: fassMajor("phil","Philosophy",["PH"], {
    sources:[{label:"Dept of Philosophy", url:"https://fass.nus.edu.sg/philo/overview/academic-requirements/"}],
    reqs:[{label:"GEX1015 Life, the Universe, and Everything", any:["GEX1015"]},{label:"GEX1014 Logic", any:["GEX1014"]}]}),
  soc: fassMajor("soc","Sociology",["SC"], {degree:"B.Soc.Sci. (Hons) Sociology",
    sources:[{label:"Dept of Sociology & Anthropology", url:"https://fass.nus.edu.sg/socanth/overview-programmes-sociology/"}],
    reqs:["SC1101E","SC2101","SC3101","SC4101"].map(c=>({label:c, any:[c]}))}),
  anth: fassMajor("anth","Anthropology",["SC","AN"], {degree:"B.Soc.Sci. (Hons) Anthropology", simplified:true,
    sources:[{label:"Dept of Sociology & Anthropology", url:"https://fass.nus.edu.sg/socanth/overview-programmes-anthropology/"}]}),
  cl:   fassMajor("cl","Chinese Language",["CL"], {simplified:true, sources:[{label:"Dept of Chinese Studies", url:"https://fass.nus.edu.sg/chs/honours-programme/"}]}),
  ch:   fassMajor("ch","Chinese Studies",["CH"], {intro:"CH1101E", simplified:true, sources:[{label:"Dept of Chinese Studies", url:"https://fass.nus.edu.sg/chs/honours-programme/"}]}),
  cnm:  fassMajor("cnm","Communications and New Media",["NM"], {degree:"B.Soc.Sci. (Hons) Communications and New Media", intro:"NM1101E", simplified:true, sources:[{label:"Dept of Communications & New Media", url:"https://fass.nus.edu.sg/cnm/"}]}),
  ell:  fassMajor("ell","English Language and Linguistics",["EL"], {intro:"EL1101E", simplified:true, sources:[{label:"Dept of English, Linguistics & Theatre Studies", url:"https://fass.nus.edu.sg/elts/single-major-b-a-honours-in-english-language-and-linguistics/"}]}),
  eng:  fassMajor("eng","English Literature",["EN"], {intro:"EN1101E", simplified:true, sources:[{label:"Dept of English, Linguistics & Theatre Studies", url:"https://fass.nus.edu.sg/elts/undergraduate-degrees-in-english-literature/"}]}),
  geog: fassMajor("geog","Geography",["GE"], {degree:"B.A. / B.Soc.Sci. (Hons) Geography", intro:"GE1101E", simplified:true, sources:[{label:"Dept of Geography", url:"https://fass.nus.edu.sg/geog/major-programmes/"}]}),
  gl:   fassMajor("gl","Global Studies",["GL"], {intro:"GL1101E", simplified:true, sources:[{label:"Global Studies Programme", url:"https://fass.nus.edu.sg/globalstudies/graduation-requirements/"}]}),
  js:   fassMajor("js","Japanese Studies",["JS"], {intro:"JS1101E", simplified:true, sources:[{label:"Dept of Japanese Studies", url:"https://fass.nus.edu.sg/jps/honours-programme/"}]}),
  ms:   fassMajor("ms","Malay Studies",["MS"], {intro:"MS1102E", simplified:true, sources:[{label:"Dept of Malay Studies", url:"https://fass.nus.edu.sg/mls/honours-programme-and-single-major/"}]}),
  sw:   fassMajor("sw","Social Work",["SW"], {degree:"B.Soc.Sci. (Hons) Social Work", intro:"SW1101E", simplified:true, sources:[{label:"Dept of Social Work", url:"https://fass.nus.edu.sg/swk/entry-graduation-requirement-undergraduate/"}]}),
  sn:   fassMajor("sn","South Asian Studies",["SN"], {intro:"SN1101E", simplified:true, sources:[{label:"South Asian Studies Programme", url:"https://fass.nus.edu.sg/sas/honours-programme/"}]}),
  se:   fassMajor("se","Southeast Asian Studies",["SE"], {intro:"SE1101E", simplified:true, sources:[{label:"Dept of Southeast Asian Studies", url:"https://fass.nus.edu.sg/sea/single-major/"}]}),
  ts:   fassMajor("ts","Theatre and Performance Studies",["TS"], {intro:"TS1101E", simplified:true, sources:[{label:"Dept of English, Linguistics & Theatre Studies", url:"https://fass.nus.edu.sg/elts/undergraduate-degrees-in-theatre-and-performance-studies/"}]})
};

/* =====================================================================
 * College of Design and Engineering (B.Eng.)
 * Common Curriculum 40 + Engineering Core 20 + Major 60 + UE 40 = 160
 * ===================================================================== */
const CDE_SRC = {label:"CDE curriculum (BME requirements AY2025/26)", url:"https://cde.nus.edu.sg/bme/wp-content/uploads/sites/8/2025/07/BME-requirements-and-schedules-2025-2026-onward.pdf"};
function cdeCC(){
  const c = (k,name,any,rc,short) => Object.assign({k, name, short:short||"Pillar", units:4, pillar:true, cc:true, reqs:[{label:name, any}]}, rc?{rc}:{});
  return [
    c("dl","Digital Literacy",["CS1010E","CS1010%","CS1101S"]),
    c("ce","Critique & Expression",["ES2631","GEX%"], {utcp:["UTW%"], rvrc:["RVX%"]}),
    c("cc","Cultures & Connections",["GEC%"], {utcp:UT, rvrc:["RVC%"]}),
    c("dat","Data Literacy",["GEA1000","IE1111R","ST1131"]),
    c("ss","Singapore Studies",["CDE2501","GES%"], {utcp:["UTS%"], rvrc:["RVSS%"]}),
    c("ceng","Communities & Engagement",["GEN%"], {utcp:UT, rvrc:["RVN%"]}),
    c("dtk","Design Thinking",["DTK1234"],null,"CDE CC"),
    c("dm","Design & Make",["EG1311","EG1311%"],null,"CDE CC"),
    c("aiml","Artificial Intelligence",["EE2211","EE2213","IT1244"],null,"CDE CC"),
    c("pm","Project Management",["PF1101A","PF1101%"],null,"CDE CC")
  ];
}
const ENG_CORE = {k:"core", name:"Engineering Core", short:"Eng Core", units:20, reqs:[
  {label:"Engineering maths: MA1511 / MA1512 / MA1513 / CE2407A (8u)", any:["MA1511","MA1512","MA1513","CE2407A","MA1505","MA1508E","CE2407B"], units:8},
  {label:"EG2401A Engineering Professionalism", any:["EG2401A"]},
  {label:"EG3611A Industrial Attachment (10u)", any:["EG3611A","EG3611%","EG3612%"]}]};
function engMajor(o){
  return {
    faculty:"Design & Engineering", name:o.name, degree:`B.Eng. (Hons) ${o.name}`, cohort:o.cohort||"Cohorts AY2025/26 onwards", units:160,
    simplified:o.simplified, sources:[...(o.sources||[]), CDE_SRC],
    groups:[...cdeCC(), ENG_CORE,
      {k:"maj", name:`${o.name} Major`, short:"Major", units:60, reqs:(o.req||[]).map(c=>typeof c==="string"?{label:c, any:[c]}:c),
        pool:o.pool, hint:o.simplified?`Simplified: any ${o.pool.map(p=>p.replace("%","")).join("/")}-coded course counts here. Check your department's curriculum for compulsory courses.`:"Technical electives fill the rest of this group."},
      UE(40)]
  };
}
const CDE_MAJORS = {
  bme: engMajor({name:"Biomedical Engineering", sources:[CDE_SRC],
    req:["BN1112","BN2104","BN2105","BN2112","BN2201","BN2204","BN2301","BN2404","BN3101A","BN3405","BN3406","BN4101"], pool:["BN%"]}),
  me: engMajor({name:"Mechanical Engineering", sources:[{label:"Dept of Mechanical Engineering", url:"https://cde.nus.edu.sg/me/wp-content/uploads/sites/11/2025/07/Sample-Schedule-for-Mechanical-Engineering-Students-from-AY2025-26-Onwards-3.pdf"}],
    req:["ME1103","ME2102","ME2105","ME2116","ME2121","ME2134","ME2162","ME3115","ME3123","ME3142","ME4101A"], pool:["ME%"]}),
  ese: engMajor({name:"Environmental and Sustainability Engineering", sources:[{label:"Dept of Civil & Environmental Engineering", url:"https://cde.nus.edu.sg/cee/wp-content/uploads/sites/7/2025/03/ESEDegreeRequirementsAY2025_26-Feb.pdf"}],
    req:["ESE2000","ESE2001","ESE2101","ESE2102","CE2134","ESE3101","ESE3201","ESE3301","ESE3401","ESE4408","ESE4501","ESE4502R"], pool:["ESE%","CE%"]}),
  mse: engMajor({name:"Materials Science and Engineering", sources:[{label:"Dept of Materials Science & Engineering", url:"https://cde.nus.edu.sg/mse/wp-content/uploads/sites/4/2025/10/Matriculated_fm_AY2122.pdf"}],
    req:["MLE1001B","MLE2001A","MLE2102","MLE2103A","MLE2105","MLE3101A","MLE3101","MLE3103","MLE3111A","MLE3112"], pool:["MLE%"]}),
  ise: engMajor({name:"Industrial and Systems Engineering", simplified:true, sources:[{label:"Dept of Industrial Systems Engineering & Management", url:"https://cde.nus.edu.sg/isem/wp-content/uploads/sites/12/2025/03/AY2025-26-onwards-ISE-Curriculum.pdf"}], pool:["IE%"]}),
  ee: engMajor({name:"Electrical Engineering", simplified:true, sources:[{label:"Dept of Electrical & Computer Engineering", url:"https://cde.nus.edu.sg/ece/undergraduate/electrical-engineering/ee-curriculum-structure-ay2025-26/"}], pool:["EE%","CG%"]}),
  ceg: engMajor({name:"Computer Engineering", simplified:true, sources:[{label:"Computer Engineering (CDE + SoC)", url:"https://ceg.nus.edu.sg/"}],
    req:["CG1111A","CG2111A","CG2023","CG2027","CG2028","CG2271","CS2040C","CS2113","EE2026","CG3207","CG4002"], pool:["CG%","EE%","CS%"]}),
  chbe: engMajor({name:"Chemical Engineering", simplified:true, sources:[{label:"Dept of Chemical & Biomolecular Engineering", url:"https://cde.nus.edu.sg/chbe/"}], pool:["CN%"]}),
  cve: engMajor({name:"Civil Engineering", simplified:true, sources:[{label:"Dept of Civil & Environmental Engineering", url:"https://cde.nus.edu.sg/cee/"}], pool:["CE%"]}),
  rmi: engMajor({name:"Robotics and Machine Intelligence", simplified:true, sources:[{label:"Dept of Mechanical Engineering", url:"https://cde.nus.edu.sg/me/undergraduate/beng-rmi/curriculum-structure/"}], pool:["RB%","ME%","EE%","CS%"]})
};

/* =====================================================================
 * NUS Business School (BBA)
 * Common Curriculum 52 + Major 60–68 + UE 40–48 = 160
 * ===================================================================== */
const BIZ_SRC = {label:"BBA curriculum AY2024/25–2025/26", url:"https://bba.nus.edu.sg/academic-programmes/bba-programme/curriculum-ay2023-2024-for-students-who-switched-ay2024-2025/"};
function bizCC(){
  return [
    ...sixPillars({dl:["CS1010%","GEI%","IT1244","CS1101S"], ce:["ES2002","GEX%"], dat:["GEA1000"]}),
    {k:"be", name:"Business Environment", short:"Biz Env", units:20, cc:true, reqs:
      ["BSP1702","BSP1703","DAO1704","RE1707","MNO2707"].map(c=>({label:c, any:[c, c+"X"]}))},
    {k:"fsp", name:"Field Service Project", short:"FSP", units:8, cc:true, reqs:[{label:"Field Service Project, level 4000 (8u)", any:["BSN48%","BSP48%","FSP%"], units:8}],
      hint:"If your FSP course isn't recognised automatically, set it to count here in its edit dialog."}
  ];
}
const BIZ_FUNC = {k:"bf", name:"Business Function Courses", short:"Biz Func", units:24, reqs:["ACC1701","MKT1705","MNO1706","DAO2702","DAO2703","FIN2704"].map(c=>({label:c, any:[c, c+"X"]}))};
function bizMajor(key,name,prefixes,o){
  o=o||{};
  const units=o.units||36, cap=o.capstone||"BSP4701";
  return {
    faculty:"Business", name, degree:o.degree||`BBA (Hons), ${name} major`, cohort:"Cohorts AY2024/25 and AY2025/26", units:160,
    simplified:true, sources:[BIZ_SRC],
    groups:[...bizCC(), BIZ_FUNC,
      {k:"maj", name:`${name} Major`, short:"Major", units, reqs:[{label:`Capstone ${cap}`, any:[cap]}], pool:prefixes.map(p=>p+"%"),
        checks:[{t:"minUnits", label:"Level-2000/3000 units", any:["@2","@3"], n:24},{t:"minUnits", label:"Level-4000+ units (incl. capstone)", any:["@4+"], n:12}],
        hint:`Simplified: ${prefixes.join("/")}-coded courses count here. Check the BBA page for your major's restricted course list.`},
      UE(160-52-24-units)]
  };
}
const BIZ_MAJORS = {
  bfin: bizMajor("bfin","Finance",["FIN"]),
  bmkt: bizMajor("bmkt","Marketing",["MKT"]),
  bhcm: bizMajor("bhcm","Leadership & Human Capital Management",["MNO"]),
  bops: bizMajor("bops","Operations & Supply Chain Management",["DOS","DAO"]),
  bban: bizMajor("bban","Business Analytics (BBA)",["DBA","DAO"]),
  becn: bizMajor("becn","Business Economics",["BSE"]),
  binn: bizMajor("binn","Innovation & Entrepreneurship",["BSN","MNO"]),
  acc:  bizMajor("acc","Accountancy",["ACC"], {degree:"BBA (Accountancy) (Hons)", units:44, capstone:"ACC4701"}),
  re:   bizMajor("re","Real Estate",["RE"], {degree:"BBA (Real Estate) (Hons)", units:40, capstone:"RE4701"})
};

Object.assign(MAJORS, CHS_MAJORS, CDE_MAJORS, BIZ_MAJORS);

/* NUS College replaces the home faculty's Common Curriculum */
const NUSC = {k:"nusc", name:"NUS College Curriculum", short:"NUSC", cc:true,
  pool:["NTW%","NSW%","GEA1000N","NPS%","NGN%","NGT%","NSS%","NHS%","NST%","NHT%","NEP%"],
  hint:"NUS College's own curriculum (56 units) replaces your faculty's Common Curriculum. Units beyond this group count as UE.",
  source:{label:"NUS College curriculum", url:"https://nuscollege.nus.edu.sg/wp-content/uploads/2026/07/NUSC-curriculum-requirements_AY2022-AY2024_v3_20260727.pdf"}};
const RCS = {
  "":   {name:"None"},
  utcp: {name:"Tembusu / CAPT / RC4 / Acacia (UTCP)", source:{label:"UTCP requirements", url:"https://www.nus.edu.sg/nusbulletin/ay202425/programmes/residential-college-programmes/university-town-college-programme"}},
  rvrc: {name:"Ridge View RC", source:{label:"RVRC programme", url:"https://www.nus.edu.sg/nusbulletin/ay202526/programmes/residential-college-programmes/ridge-view-residential-college-programme/"}},
  nusc: {name:"NUS College", source:NUSC.source}
};

/* ---- Second majors (40 units, up to 16 shared) ---- */
const MATH_DEPT = "https://www.math.nus.edu.sg/";
const SECOND = {
  ma2: {
    name:"Mathematics", kind:"second", units:40, share:16, cohort:"Admitted AY2021/22 onwards", not:["math"],
    sources:[{label:"Dept of Mathematics", url:MATH_DEPT+"wp-content/uploads/sites/4/2025/10/MA2_2122_14102025.pdf"}],
    groups:[
      {k:"l1", name:"Level 1000", units:12, reqs:[
        {label:"CS1231S or MA1100 Discrete Maths", any:["CS1231S","CS1231","MA1100","MA1100T"]},
        {label:"8 units of MA15xx / MA20xx / MA22xx", any:["MA15xx","MA20xx","MA22xx","!MA2288%","!MA2289%"], units:8}]},
      {k:"l2", name:"Level 2000", units:16, reqs:[
        {label:"MA2101 Linear Algebra II", any:["MA2101","MA2101S"]},
        {label:"MA2104 / MA2311 / any MA22xx", any:["MA2104","MA2311","MA22xx","!MA2288%","!MA2289%"]},
        {label:"MA2108 Mathematical Analysis I", any:["MA2108","MA2108S"]},
        {label:"Probability: ST2334 / MA2116 / ST2131", any:["ST2334","MA2116","MA2116T","MA2216","ST2131"]}]},
      {k:"l3", name:"Level 3000+", units:12, reqs:[
        {label:"3 courses: MA32xx / MA42xx / ST3236 / ST4238", any:["MA32xx","MA42xx","ST3236","ST4238","ME3291","ME4291","PC3274A","!MA[34]28[89]%"], pick:3}],
        suggest:["MA3201","MA3210","MA3236","MA3238","MA3252"]}
    ]
  },
  st2: {
    name:"Statistics", kind:"second", units:40, share:16, cohort:"Admitted AY2021/22 onwards", not:["stat","dsa"],
    sources:[{label:"Dept of Statistics & Data Science", url:"https://www.stat.nus.edu.sg/wp-content/uploads/sites/8/2025/06/18062025-ST2MJ-AY21-22-after_22-Aug-2023.pdf"}],
    groups:[
      {k:"l1", name:"Level 1000", units:4, reqs:[{label:"ST1131 Intro to Statistics", any:["ST1131"]}]},
      {k:"l2", name:"Level 2000", units:24, reqs:[
        {label:"Linear algebra: MA1522 / MA2001", any:["MA1522","MA2001","MA1101R","MA1508E","MA1513"]},
        {label:"Calculus: MA1521 / MA2002", any:["MA1521","MA2002","MA1102R","MA1312","MA1505","MA1511"]},
        {label:"MA2104 / MA2311 Advanced Calculus", any:["MA2104","MA2311"]},
        {label:"Probability: ST2334 / ST2131 / MA2116", any:["ST2334","ST2131","MA2216","MA2116"]},
        {label:"ST2132 Mathematical Statistics", any:["ST2132"]},
        {label:"ST2137, or an ST32xx/ST42xx course", any:["ST2137","ST32xx","ST42xx","!ST328%","!ST4288"]}]},
      {k:"l3", name:"Level 3000+", units:12, reqs:[
        {label:"3 courses: ST3131 / ST32xx / ST42xx", any:["ST3131","ST32xx","ST42xx","!ST328%","!ST4288"], pick:3}],
        checks:[{t:"minCount", label:"At least 1 from ST32xx / ST42xx", any:["ST32xx","ST42xx"], n:1}],
        suggest:["ST3131","ST3236","ST3248","ST4248"]}
    ]
  },
  qf2: {
    name:"Quantitative Finance", kind:"second", units:40, share:16, cohort:"Admitted AY2023/24 onwards", not:["qf"],
    sources:[{label:"Dept of Mathematics", url:MATH_DEPT+"wp-content/uploads/sites/4/2025/07/QF2_2324_090725-Final.pdf"}],
    groups:[
      {k:"l1", name:"Level 1000", units:4, reqs:[{label:"QF1100 Intro to Quantitative Finance", any:["QF1100"]}]},
      {k:"l2", name:"Level 2000", units:24, reqs:[
        {label:"8 units: MA15xx / MA20xx / MA2101 / MA2108 / MA2213 / DSA2102", any:["MA15xx","MA20xx","MA2101","MA2101S","MA2108","MA2108S","MA2213","DSA2102"], units:8},
        {label:"MA2104 / MA2311 / ME3291", any:["MA2104","MA2311","ME3291"]},
        {label:"Probability: ST2334 / MA2116 / ST2131 / EC2303", any:["ST2334","MA2116","ST2131","EC2303","MA2301"]},
        {label:"QF2103 Computing for QF", any:["QF2103"]},
        {label:"QF2104 Fundamentals of QF", any:["QF2104"]}]},
      {k:"l3", name:"Level 3000+", units:12, reqs:[
        {label:"QF3101 Investment Instruments and Risk Mgmt", any:["QF3101"]},
        {label:"2 of QF3103 / QF4102 / QF4103 / ST3131 / EC3303 / FIN3702 / FIN3716", any:["QF3103","QF4102","QF4103","ST3131","EC3303","FIN3702%","FIN3716"], pick:2}]}
    ]
  },
  ec2: {
    name:"Economics", kind:"second", units:40, share:16, cohort:"Admitted AY2021/22 onwards", not:["econ"],
    sources:[{label:"Dept of Economics", url:"https://fass.nus.edu.sg/ecs/academic-year-2021-22-and-after-2"}],
    groups:[
      {k:"core", name:"Core", units:32, reqs:[
        {label:"EC1101E Intro to Economic Analysis", any:["EC1101E","BSP1703","BSP1703X","RE1704"]},
        {label:"EC2101 Microeconomic Analysis I", any:["EC2101"]},
        {label:"EC2102 Macroeconomic Analysis I", any:["EC2102","BSE3701"]},
        {label:"EC2104 Quantitative Methods", any:["EC2104"]},
        {label:"EC2303 Foundations for Econometrics", any:["EC2303"]},
        {label:"EC3101 Microeconomic Analysis II", any:["EC3101"]},
        {label:"EC3102 Macroeconomic Analysis II", any:["EC3102"]},
        {label:"EC3303 Econometrics I", any:["EC3303"]}]},
      {k:"el", name:"EC Electives", units:8, pool:["EC%"],
        checks:[{t:"minCount", label:"At least 1 more at level 3000+", any:["EC[3-9]%"], n:1}]}
    ]
  },
  mgt2: {
    name:"Management", kind:"second", units:40, share:16, cohort:"Non-BBA students, admitted AY2023/24 onwards", not:["bfin","bmkt","bhcm","bops","bban","becn","binn","acc","re"],
    sources:[{label:"NUS Business School", url:"https://bba.nus.edu.sg/second-major-minors-for-non-bba-students/"}],
    note:"Upper-level courses are matched by business course prefix. Check each one is on the official Second Major in Management list.",
    groups:[
      {k:"l1", name:"Level 1000", units:16, reqs:[
        {label:"4 of MNO1706X / ACC1701X / MKT1705X / BSP1702X / BSP1703X / DAO1704X", any:["MNO1706X","PL3239","ACC1701X","EC2204","MKT1705X","BSP1702X","BSP1703","BSP1703X","EC1101E","DAO1704X"], pick:4}]},
      {k:"up", name:"Level 2000 & 3000", units:24, reqs:[
        {label:"6 business courses at level 2000–3000", any:["ACC[23]%","BSE[23]%","BSN[23]%","BSP[23]%","DAO[23]%","DOS[23]%","FIN[23]%","MKT[23]%","MNO[23]%","RE[23]%"], pick:6}],
        checks:[
          {t:"minCount", label:"At least 2 at level 2000", any:["@2"], n:2},
          {t:"minCount", label:"At least 3 at level 3000", any:["@3"], n:3},
          {t:"maxCount", label:"At most 4 at level 3000", any:["@3"], n:4}]}
    ]
  },
  cs2: {
    name:"Computer Science", kind:"second", units:40, share:16, cohort:"Admitted AY2021/22 onwards", not:["cs","ai","ceg"],
    sources:[{label:"NUS Computing", url:"https://www.comp.nus.edu.sg/programmes/ug/major/cs-secmajor/"}],
    groups:[
      {k:"core", name:"CS Foundation", units:28, reqs:[
        {label:"CS1010 / CS1101S Programming Methodology", any:["CS1010%","CS1101S"]},
        {label:"CS2030 Programming Methodology II", any:["CS2030%"]},
        {label:"CS2040 Data Structures and Algorithms", any:["CS2040%"]},
        {label:"CS2100 Computer Organisation", any:["CS2100","EE2024","EE2028"]},
        {label:"CS2103 Software Engineering", any:["CS2103%"]},
        {label:"CS2106 Operating Systems", any:["CS2106","CG2271"]},
        {label:"1 of CS1231S / CS2102 / CS2104 / CS2105 / CS2107 / CS2108 / CS2109S", any:["CS1231S","CS1231","MA1100","MA1100T","CS2102","CS2104","CS2105","CS2107","CS2108","CS2109S"]}]},
      {k:"el", name:"CS Electives (level 3000+)", units:12, pool:["CS[3-9]%"]}
    ]
  },
  ba2: {
    name:"Business Analytics", kind:"second", units:40, share:16, cohort:"Admitted AY2021/22 onwards", not:["bza"],
    sources:[{label:"NUS Computing", url:"https://www.comp.nus.edu.sg/programmes/ug/major/ba-secmajor/"}],
    groups:[
      {k:"core", name:"Core", units:28, reqs:[
        {label:"BT1101 Intro to Business Analytics", any:["BT1101"]},
        {label:"BT2101 Econometrics Modeling", any:["BT2101"]},
        {label:"BT2102 Data Management and Visualisation", any:["BT2102"]},
        {label:"BT3103 Application Systems Development", any:["BT3103"]},
        {label:"CS1010S / CS1101S Programming Methodology", any:["CS1010%","CS1101S"]},
        {label:"CS2030 Programming Methodology II", any:["CS2030%"]},
        {label:"ST2334 Probability and Statistics", any:["ST2334","ST2131","ST2132"]}]},
      {k:"el", name:"Electives", units:12, pool:["BT3017","BT3102","BT3104","BT4014","BT4211","BT4212","BT4221","BT4222","BT4240","IS4241"]}
    ]
  },
  isc2: {
    name:"Information Security", kind:"second", units:40, share:16, cohort:"Admitted AY2019/20 onwards", not:["isc"],
    sources:[{label:"NUS Computing", url:"https://www.comp.nus.edu.sg/programmes/ug/major/isc/"}],
    groups:[
      {k:"core", name:"Computing Foundations", units:20, reqs:[
        {label:"CS1010 / CS1101S Programming Methodology", any:["CS1010%","CS1101S"]},
        {label:"CS2040 Data Structures and Algorithms", any:["CS2040%"]},
        {label:"CS2100 Computer Organisation", any:["CS2100"]},
        {label:"CS2105 Computer Networks", any:["CS2105"]},
        {label:"CS2106 Operating Systems", any:["CS2106"]}]},
      {k:"isf", name:"InfoSec Foundations", units:8, reqs:[
        {label:"CS2107 Intro to Information Security", any:["CS2107"]},
        {label:"CS3235 Computer Security", any:["CS3235"]}]},
      {k:"el", name:"InfoSec Electives", units:12,
        pool:["CS4230","CS4236","MA4261","CS4238","CS4239","CS4257","CS4276","CS5231","CS5321","CS5322","CS5331","CS5332",
              "IFS4101","IFS4102","IFS4103","IFS4205","IS4204","IS4231","IS4233","IS4234","IS4238","IS4302"],
        checks:[{t:"minUnits", label:"At least 8 units at level 3000+", any:["@3+"], n:8}]}
    ]
  }
};

/* ---- Minors (20 units, up to 8 shared) ---- */
const MINORS = {
  mamin: {
    name:"Mathematics", kind:"minor", units:20, share:8, cohort:"Admitted AY2021/22 onwards", not:["math"],
    sources:[{label:"Dept of Mathematics", url:MATH_DEPT+"wp-content/uploads/sites/4/2024/04/MAmin_2122_12042024.pdf"}],
    groups:[
      {k:"l1", name:"Level 1000", units:8, reqs:[{label:"8 units: MA1xxx / MA20xx / CS1231S", any:["MA1xxx%","MA20xx","CS1231S","CS1231","!MA1301%"], units:8}]},
      {k:"l2", name:"Level 2000", units:8, reqs:[{label:"2 of MA2101 / MA2104 / MA2108 / MA22xx / ST2334 / MA2116", any:["MA2101","MA2101S","MA2104","MA2311","MA22xx","MA2108","MA2108S","MA2116","MA2216","ST2131","ST2334","!MA2288%","!MA2289%"], pick:2}]},
      {k:"l3", name:"Level 3000", units:4, reqs:[{label:"1 of MA32xx / ST3236 / PC3274A", any:["MA32xx","ST3236","PC3274A","!MA328[89]%"]}]}
    ]
  },
  stmin: {
    name:"Statistics", kind:"minor", units:20, share:8, cohort:"Admitted AY2021/22 onwards", not:["stat","dsa"],
    sources:[{label:"Dept of Statistics & Data Science", url:"https://www.stat.nus.edu.sg/wp-content/uploads/sites/8/2024/05/080324-Minor-Statistics-Programme-Requirements-AY21-22-and-after.pdf"}],
    groups:[
      {k:"all", name:"Requirements", units:20, reqs:[
        {label:"ST1131 Intro to Statistics", any:["ST1131"]},
        {label:"Calculus: MA1521 / MA2002", any:["MA1521","MA2002","MA1312","MA1505","MA1511"]},
        {label:"Probability: ST2334 / ST2131 / MA2116", any:["ST2334","ST2131","MA2216","MA2116"]},
        {label:"ST2132 or ST2137", any:["ST2132","ST2137"]},
        {label:"ST3131 or an ST32xx course", any:["ST3131","ST32xx","!ST328%"]}]}
    ]
  },
  ecmin: {
    name:"Economics", kind:"minor", units:20, share:8, cohort:"Admitted AY2021/22 onwards", not:["econ","becn"],
    sources:[{label:"Dept of Economics", url:"https://fass.nus.edu.sg/ecs/students-matriculated-in-academic-year-2021-22-minor-in-econs"}],
    groups:[
      {k:"all", name:"Requirements", units:20, reqs:[
        {label:"EC1101E Intro to Economic Analysis", any:["EC1101E","BSP1703","BSP1703X","RE1704"]},
        {label:"EC2101 or EC2102", any:["EC2101","EC2102"]}],
        pool:["EC%"], hint:"Up to 4 units may be EC-recognised courses (e.g. MA1521, ST3131). Use the edit dialog to count one here."}
    ]
  },
  aimin: {
    name:"Artificial Intelligence", kind:"minor", units:20, share:8, cohort:"Admitted AY2021/22 onwards", not:["cs","ai","bais","ceg"],
    sources:[{label:"NUS Computing", url:"https://www.comp.nus.edu.sg/programmes/ug/minorc/minor-in-ai/"}],
    groups:[
      {k:"all", name:"Requirements", units:20, reqs:[
        {label:"CS1231 / MA1100 Discrete Maths", any:["CS1231%","MA1100%"]},
        {label:"CS2040 Data Structures and Algorithms", any:["CS2040%"]},
        {label:"CS2109S (or CS3243)", any:["CS2109S","CS3243"]},
        {label:"CS3263 / CS3264 / IT3011", any:["CS3263","CS3264","IT3011"]},
        {label:"Level 4000: CS4243 / CS4244 / CS4246 / CS4248 / CS4262", any:["CS4243","CS4244","CS4246","CS4248","CS4262"]}]}
    ]
  },
  csmin: {
    name:"Computer Science", kind:"minor", units:20, share:8, cohort:"Admitted AY2021/22 onwards", not:["cs","ai","ceg","ee"],
    sources:[{label:"NUS Computing", url:"https://www.comp.nus.edu.sg/programmes/ug/minorc/cs-minor/"}],
    groups:[
      {k:"all", name:"Requirements", units:20, reqs:[
        {label:"CS1010 / CS1101S Programming Methodology", any:["CS1010%","CS1101S"]},
        {label:"3 core computing courses (CS1231, CS2030, CS2040, CS2100, CS2102–CS2109S)", any:["CS1231%","CS2030%","CS2040%","CS2100","CS2102","CS2103%","CS2104","CS2105","CS2106","CS2107","CS2108","CS2109S"], pick:3}],
        pool:["CS[3-9]%"], hint:"The last 4 units come from a CS course at level 3000 or above."}
    ]
  },
  bamin: {
    name:"Business Analytics", kind:"minor", units:20, share:8, cohort:"Admitted AY2021/22 onwards", not:["cs","ai","bais","isc","bza","dsa","bban"],
    sources:[{label:"NUS Computing", url:"https://www.comp.nus.edu.sg/programmes/ug/minorc/ba-minor/"}],
    groups:[
      {k:"all", name:"Requirements", units:20, reqs:[
        {label:"BT1101 Intro to Business Analytics", any:["BT1101"]},
        {label:"BT2101 Econometrics Modeling", any:["BT2101"]},
        {label:"CS1010S / CS1101S Programming Methodology", any:["CS1010%","CS1101S"]}],
        pool:["BT2102","BT3103","BT4014","BT4211","BT4212","BT4221","BT4222","BT4240","IS4241","ST3131"]}
    ]
  },
  iscmin: {
    name:"Information Security", kind:"minor", units:20, share:8, cohort:"Admitted AY2021/22 onwards", not:["cs","ai","bais","isc","bza","ceg"],
    sources:[{label:"NUS Computing", url:"https://www.comp.nus.edu.sg/programmes/ug/minorc/isc-minor/"}],
    groups:[
      {k:"all", name:"Requirements", units:20, reqs:[
        {label:"CS2040 Data Structures and Algorithms", any:["CS2040%"]},
        {label:"CS2107 Intro to Information Security", any:["CS2107"]},
        {label:"3 of IS1108 / CS2100 / CS2105 / CS2106 / CS3235 / IFS4101 / IS4231", any:["IS1108","CS2100","CS2105","CS2106","CS3235","IFS4101","IS4231"], pick:3}],
        checks:[{t:"minCount", label:"At least 1 elective at level 3000+", any:["CS3235","IFS4101","IS4231"], n:1}]}
    ]
  },
  imdmin: {
    name:"Interactive Media Development", kind:"minor", units:20, share:8, cohort:"Admitted AY2022/23 onwards",
    sources:[{label:"Dept of Communications & New Media", url:"https://fass.nus.edu.sg/cnm/undergraduate-minor-imd/"}],
    groups:[
      {k:"nm", name:"NM courses", units:8, reqs:[{label:"8 units of NM courses", any:["NM2207","NM3217","NM3230","NM3243","NM4259","NM4260","NM5219R"], units:8}]},
      {k:"cs", name:"CS courses", units:8, reqs:[{label:"8 units of CS courses", any:["CS1010%","CS1101S","CS3240","CS3249","CS4240","CS4249","CS4350"], units:8}]},
      {k:"any", name:"Either list", units:4, pool:["NM2207","NM3217","NM3230","NM3243","NM4259","NM4260","NM5219R","CS3240","CS3249","CS4240","CS4249","CS4350"]}
    ]
  }
};

window.PROGRAMMES = { MAJORS, SECOND, MINORS, RCS, NUSC };
})();
