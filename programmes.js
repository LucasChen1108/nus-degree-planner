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
 *   checks : extra rules shown under the group (see CHECKS in index.html)
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

/* ---- shared Common Curriculum builders ---- */
function pillars(o){
  return [
    {k:"dl",  name:"Digital Literacy",          short:"Pillar", units:4, pillar:true, reqs:[{label:"Digital Literacy", any:o.dl}]},
    {k:"ce",  name:"Critique & Expression",     short:"Pillar", units:4, pillar:true, reqs:[{label:"Critique & Expression", any:o.ce}]},
    {k:"cc",  name:"Cultures & Connections",    short:"Pillar", units:4, pillar:true, reqs:[{label:"Cultures & Connections", any:["GEC%"]}]},
    {k:"dat", name:"Data Literacy",             short:"Pillar", units:4, pillar:true, reqs:[{label:"Data Literacy", any:o.dat}]},
    {k:"ss",  name:"Singapore Studies",         short:"Pillar", units:4, pillar:true, reqs:[{label:"Singapore Studies", any:["GES%"]}]},
    {k:"ceng",name:"Communities & Engagement",  short:"Pillar", units:4, pillar:true, reqs:[{label:"Communities & Engagement", any:["GEN%"]}]},
    {k:"eth", name:"Computing Ethics", short:"Ethics", units:4, reqs:[{label:"IS1108 Digital and AI Ethics", any:["IS1108"]}]},
    {k:"idcd",name:"Interdisciplinary / Cross-disciplinary", short:"ID/CD", units:12, pool:["@ID","@CD"],
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
    name:"Computer Science", degree:"B.Comp. (Computer Science)", cohort:"Cohorts AY2025/26 and AY2026/27", units:160,
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
    name:"Artificial Intelligence", degree:"B.Comp. (Artificial Intelligence)", cohort:"Cohorts AY2025/26 and AY2026/27", units:160,
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
    name:"Business Analytics", degree:"B.Sc. (Business Analytics)", cohort:"Cohorts AY2025/26 and AY2026/27", units:160,
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
    name:"Business AI Systems", degree:"B.Comp. (Business Artificial Intelligence Systems)", cohort:"Cohorts AY2025/26 and AY2026/27", units:160,
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
    name:"Information Security", degree:"B.Comp. (Information Security)", cohort:"Cohorts AY2025/26 and AY2026/27", units:160,
    sources:[{label:"InfoSec cohort 2025/26", url:SOC+"isc/isc-25-26/"}],
    groups:[
      ...pillars({dl:["CS1010%","CS1101S"], ce:["GEX%"], dat:DATA_LIT}),
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

/* ---- Second majors (40 units, up to 16 shared) ---- */
const MATH_DEPT = "https://www.math.nus.edu.sg/";
const SECOND = {
  ma2: {
    name:"Mathematics", kind:"second", units:40, share:16, cohort:"Admitted AY2021/22 onwards",
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
    name:"Statistics", kind:"second", units:40, share:16, cohort:"Admitted AY2021/22 onwards",
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
    name:"Quantitative Finance", kind:"second", units:40, share:16, cohort:"Admitted AY2023/24 onwards",
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
    name:"Economics", kind:"second", units:40, share:16, cohort:"Admitted AY2021/22 onwards",
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
    name:"Management", kind:"second", units:40, share:16, cohort:"Non-BBA students, admitted AY2023/24 onwards",
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
    name:"Computer Science", kind:"second", units:40, share:16, cohort:"Admitted AY2021/22 onwards", not:["cs","ai"],
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
    name:"Mathematics", kind:"minor", units:20, share:8, cohort:"Admitted AY2021/22 onwards",
    sources:[{label:"Dept of Mathematics", url:MATH_DEPT+"wp-content/uploads/sites/4/2024/04/MAmin_2122_12042024.pdf"}],
    groups:[
      {k:"l1", name:"Level 1000", units:8, reqs:[{label:"8 units: MA1xxx / MA20xx / CS1231S", any:["MA1xxx%","MA20xx","CS1231S","CS1231","!MA1301%"], units:8}]},
      {k:"l2", name:"Level 2000", units:8, reqs:[{label:"2 of MA2101 / MA2104 / MA2108 / MA22xx / ST2334 / MA2116", any:["MA2101","MA2101S","MA2104","MA2311","MA22xx","MA2108","MA2108S","MA2116","MA2216","ST2131","ST2334","!MA2288%","!MA2289%"], pick:2}]},
      {k:"l3", name:"Level 3000", units:4, reqs:[{label:"1 of MA32xx / ST3236 / PC3274A", any:["MA32xx","ST3236","PC3274A","!MA328[89]%"]}]}
    ]
  },
  stmin: {
    name:"Statistics", kind:"minor", units:20, share:8, cohort:"Admitted AY2021/22 onwards",
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
    name:"Economics", kind:"minor", units:20, share:8, cohort:"Admitted AY2021/22 onwards",
    sources:[{label:"Dept of Economics", url:"https://fass.nus.edu.sg/ecs/students-matriculated-in-academic-year-2021-22-minor-in-econs"}],
    groups:[
      {k:"all", name:"Requirements", units:20, reqs:[
        {label:"EC1101E Intro to Economic Analysis", any:["EC1101E","BSP1703","BSP1703X","RE1704"]},
        {label:"EC2101 or EC2102", any:["EC2101","EC2102"]}],
        pool:["EC%"], hint:"Up to 4 units may be EC-recognised courses (e.g. MA1521, ST3131). Use the edit dialog to count one here."}
    ]
  },
  aimin: {
    name:"Artificial Intelligence", kind:"minor", units:20, share:8, cohort:"Admitted AY2021/22 onwards", not:["cs","ai","bais"],
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
    name:"Computer Science", kind:"minor", units:20, share:8, cohort:"Admitted AY2021/22 onwards", not:["cs","ai"],
    sources:[{label:"NUS Computing", url:"https://www.comp.nus.edu.sg/programmes/ug/minorc/cs-minor/"}],
    groups:[
      {k:"all", name:"Requirements", units:20, reqs:[
        {label:"CS1010 / CS1101S Programming Methodology", any:["CS1010%","CS1101S"]},
        {label:"3 core computing courses (CS1231, CS2030, CS2040, CS2100, CS2102–CS2109S)", any:["CS1231%","CS2030%","CS2040%","CS2100","CS2102","CS2103%","CS2104","CS2105","CS2106","CS2107","CS2108","CS2109S"], pick:3}],
        pool:["CS[3-9]%"], hint:"The last 4 units come from a CS course at level 3000 or above."}
    ]
  },
  bamin: {
    name:"Business Analytics", kind:"minor", units:20, share:8, cohort:"Admitted AY2021/22 onwards", not:["cs","ai","bais","isc","bza"],
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
    name:"Information Security", kind:"minor", units:20, share:8, cohort:"Admitted AY2021/22 onwards", not:["cs","ai","bais","isc","bza"],
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

window.PROGRAMMES = { MAJORS, SECOND, MINORS };
})();
