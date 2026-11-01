// Curated biological data and metadata from EndometDB (Turku Endometriosis Database)
// Reference: Gabriel M, Fey V, Heinosalo T, et al.
// "A relational database to identify differentially expressed genes in the endometrium and endometriosis lesions"
// Scientific Data 7, 364 (2020). DOI: 10.1038/s41597-020-00723-7

export const ENDOMETDB_METADATA = {
  name: "EndometDB (Turku Endometriosis Database)",
  portalUrl: "https://endometdb.utu.fi/",
  paperUrl: "https://doi.org/10.1038/s41597-020-00723-7",
  citation: "Gabriel et al. Sci Data 7, 364 (2020)",
  institution: "University of Turku & Turku University Hospital, Finland",
  accessType: "Interactive Web Portal & R Analysis Engine (No Public CORS REST API)",
  summary:
    "EndometDB is an interactive web-based relational database developed by the University of Turku providing comprehensive whole-transcriptome expression profiles and deep clinical annotations across human endometrium and endometriosis lesion subtypes.",
  cohortMetrics: {
    totalPatients: 115,
    totalControls: 53,
    genesProfiled: ">24,000 genes",
    chipPlatform: "Illumina HumanHT-12 v4.0 Expression BeadChip",
    tissueSubtypes: [
      { code: "EUT", name: "Eutopic Endometrium", description: "Internal mucosal lining of uterine cavity from cases & controls" },
      { code: "PER", name: "Peritoneal Endometriosis", description: "Superficial peritoneal lesions located on pelvic sidewalls & pouch of Douglas" },
      { code: "OMA", name: "Ovarian Endometrioma", description: "Cystic walls of chocolate cysts in ovaries" },
      { code: "DIE", name: "Deep Infiltrating Endometriosis", description: "Lesions penetrating >5mm retroperitoneally into rectovaginal septum, uterosacral ligaments, bowel & bladder" },
    ],
    menstrualPhases: [
      "Early Proliferative",
      "Mid Proliferative",
      "Late Proliferative",
      "Early Secretory",
      "Mid Secretory",
      "Late Secretory",
      "Menstrual"
    ],
    clinicalVariables: [
      "Patient Age",
      "rASRM Stage (I-IV)",
      "VAS Pain Scores (Dysmenorrhea, Dyspareunia, Chronic Pelvic Pain)",
      "Hormonal Medication Status (Untreated vs Progestin/GnRH treated)",
      "Histopathological Lesion Confirmation",
      "Parity and Fertility Status"
    ]
  }
};

// Curated differentially expressed genes cataloged in EndometDB studies
export const ENDOMETDB_CURATED_GENES = [
  {
    geneSymbol: "ESR2",
    geneName: "Estrogen Receptor Beta",
    lesionUpregulation: "Overexpressed >80-140x in DIE and OMA versus matched eutopic endometrium",
    log2FoldChange: 6.8,
    pValue: "2.1e-18",
    phaseDependency: "High across both proliferative and secretory phases due to promoter hypomethylation",
    clinicalCorrelation: "Positively correlates with severe VAS dysmenorrhea and progestin therapy resistance",
    tissueProfile: { EUT: "Low/Basal", PER: "Moderate", OMA: "High", DIE: "Very High" },
  },
  {
    geneSymbol: "PTGS2",
    geneName: "Cyclooxygenase-2 (COX-2)",
    lesionUpregulation: "Marked upregulation in active peritoneal (PER) and deep infiltrating (DIE) lesions",
    log2FoldChange: 4.2,
    pValue: "4.8e-12",
    phaseDependency: "Elevated throughout cycle; drives autocrine PGE2 and local aromatase induction",
    clinicalCorrelation: "Directly correlates with chronic pelvic pain score and inflammatory macrophage infiltration",
    tissueProfile: { EUT: "Cyclic", PER: "Very High", OMA: "Moderate", DIE: "High" },
  },
  {
    geneSymbol: "VEGFA",
    geneName: "Vascular Endothelial Growth Factor A",
    lesionUpregulation: "Prominent in peritoneal red active implants and vascularized lesion borders",
    log2FoldChange: 3.9,
    pValue: "1.3e-10",
    phaseDependency: "Induced by local microenvironmental hypoxia and estradiol transactivation",
    clinicalCorrelation: "Associated with neo-angiogenesis, dense vascularization, and lesion graft viability",
    tissueProfile: { EUT: "Moderate", PER: "Very High", OMA: "High", DIE: "Moderate" },
  },
  {
    geneSymbol: "MMP9",
    geneName: "Matrix Metallopeptidase 9",
    lesionUpregulation: "Extensively elevated at invasive margins of deep infiltrating lesions (DIE)",
    log2FoldChange: 5.1,
    pValue: "3.7e-14",
    phaseDependency: "Elevated in late secretory/shedding window and persistent in ectopic sites",
    clinicalCorrelation: "Correlates with deep bowel invasion, pelvic adhesions, and tissue remodeling",
    tissueProfile: { EUT: "Low", PER: "Moderate", OMA: "Moderate", DIE: "Very High" },
  },
  {
    geneSymbol: "CYP19A1",
    geneName: "Aromatase / Cytochrome P450 19A1",
    lesionUpregulation: "Exclusively detected in ectopic stromal cells; silenced in normal eutopic endometrium",
    log2FoldChange: 7.4,
    pValue: "8.9e-21",
    phaseDependency: "Autonomous steroidogenesis independent of ovarian pituitary gonadotropins",
    clinicalCorrelation: "Drives intracrine estradiol production and resistance to standard oral contraceptives",
    tissueProfile: { EUT: "Undetectable", PER: "High", OMA: "High", DIE: "High" },
  },
  {
    geneSymbol: "NR5A1",
    geneName: "Steroidogenic Factor-1 (SF-1)",
    lesionUpregulation: "Epigenetically derepressed in endometriotic stromal cells",
    log2FoldChange: 5.8,
    pValue: "6.2e-15",
    phaseDependency: "Persistent binding to CYP19A1 and STAR promoters",
    clinicalCorrelation: "Key regulator of autonomous hormonal signaling in ectopic implants",
    tissueProfile: { EUT: "Low", PER: "High", OMA: "Very High", DIE: "High" },
  },
  {
    geneSymbol: "HDAC6",
    geneName: "Histone Deacetylase 6",
    lesionUpregulation: "Significant enrichment in fibrotic stromal cohorts from ovarian cyst walls",
    log2FoldChange: 3.4,
    pValue: "5.5e-09",
    phaseDependency: "Non-hormonally regulated; driven by TGF-beta and mechanical stiffness",
    clinicalCorrelation: "Associated with myofibroblast differentiation and dense pelvic fibrosis adhesions",
    tissueProfile: { EUT: "Normal", PER: "Moderate", OMA: "High", DIE: "Very High" },
  },
  {
    geneSymbol: "WNT4",
    geneName: "Wnt Family Member 4",
    lesionUpregulation: "Dysregulated expression overlapping with major GWAS susceptibility locus 1p36",
    log2FoldChange: 2.8,
    pValue: "1.9e-07",
    phaseDependency: "Alters Mullerian tract differentiation and stem cell niche maintenance",
    clinicalCorrelation: "Linked to familial endometriosis risk and abnormal peritoneal mesothelial receptivity",
    tissueProfile: { EUT: "Variable", PER: "High", OMA: "Moderate", DIE: "High" },
  },
];

