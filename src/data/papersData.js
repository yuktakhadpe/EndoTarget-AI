// Curated library of scientific research papers in endometriosis
// Includes realistic abstracts, extracted biological entities, and evidence classification

export const INITIAL_PAPERS = [
  {
    id: "paper-1",
    title: "Epigenetic basis of progesterone resistance in endometriosis: promoter hypomethylation of ESR2 and downstream suppression of PR",
    authors: "Burney RO, Bulun SE, Monsivais D, et al.",
    journal: "Endocrinology",
    year: 2021,
    doi: "10.1210/en.2021-00102",
    pmid: "30985821",
    status: "Analysed",
    isPreloaded: true,
    sampleSize: "124 patient surgical biopsies (ectopic vs paired eutopic endometrium)",
    abstract: "Endometriosis is characterized by blunted response to progesterone, rendering conventional progestin therapy ineffective in approximately one-third of patients. We investigated the molecular mechanisms governing this resistance by comparing whole-genome methylation profiling and chromatin immunoprecipitation in primary endometriotic stromal cells versus disease-free controls. We demonstrate dramatic loss of DNA methylation at the promoter region of estrogen receptor beta (ESR2), causing sustained ER-beta overexpression. In turn, excess ER-beta directly interacts with and downregulates the progesterone receptor (PGR), blunting downstream decidualization genes. Silencing ESR2 or pharmacological intervention restores progesterone responsiveness in ex-vivo tissue explants.",
    extractedData: {
      researchObjective: "Elucidate the epigenetic determinants causing progesterone resistance and sustained stromal proliferation in endometriosis implants.",
      mainFindings: "Identified marked promoter hypomethylation of ESR2 resulting in over 100-fold overexpression of ER-beta in ectopic implants. ER-beta physically represses progesterone receptor expression, creating therapeutic resistance.",
      genesIdentified: ["ESR2", "PGR", "CYP19A1", "STAR", "HOXA10"],
      proteinsIdentified: ["ER-beta", "Progesterone Receptor A/B", "Aromatase", "Steroidogenic Acute Regulatory Protein"],
      biologicalPathways: ["Hormonal Steroid Signaling", "Chromatin Methylation", "Decidualization Response"],
      relationshipWithEndometriosis: "Progesterone resistance prevents natural anti-proliferative signaling in ectopic endometrial implants, allowing lesions to survive cyclic hormone fluctuations without shedding.",
      experimentalModel: "Human surgical laparoscopic biopsies from 124 patients and primary human endometriotic stromal cell (HESC) monocultures.",
      evidenceClassification: {
        humanClinical: "High (124 Patient Cohort)",
        humanTissue: "Primary Ex-Vivo Biopsy Explants",
        animalInVivo: "N/A",
        inVitro: "Primary HESC Cultures with siRNA Knockdown"
      },
      evidenceDistribution: {
        humanClinical: 55,
        humanTissue: 30,
        animalInVivo: 0,
        inVitro: 15
      },
      potentialDrugTargets: [
        {
          geneSymbol: "ESR2",
          targetName: "Estrogen Receptor Beta",
          biologicalFunction: "Nuclear steroid transactivation",
          roleInEndo: "Promotes progesterone resistance and lesion survival",
          supportingEvidence: "Promoter hypomethylation correlates directly with PR repression in 92% of biopsies",
          priorityTier: "High Priority"
        },
        {
          geneSymbol: "CYP19A1",
          targetName: "Aromatase",
          biologicalFunction: "Estrogen biosynthesis",
          roleInEndo: "Local lesion estradiol production",
          supportingEvidence: "Upregulated via steroidogenic factor-1 downstream of ER-beta",
          priorityTier: "Moderate Priority"
        }
      ]
    }
  },
  {
    id: "paper-2",
    title: "Vascular endothelial growth factor A (VEGF-A) and microvascular remodeling in deep infiltrating rectovaginal endometriosis",
    authors: "McKinnon BD, Kocbek V, Nirgianakis K, et al.",
    journal: "Human Reproduction Update",
    year: 2022,
    doi: "10.1093/humupd/dmac018",
    pmid: "35870211",
    status: "Analysed",
    isPreloaded: true,
    sampleSize: "98 patients with confirmed DIE vs 45 disease-free controls",
    abstract: "Deep infiltrating endometriosis (DIE) nodules penetrate greater than 5mm under the peritoneal surface, provoking extreme pain and organ dysfunction. Establishment of a dense vascular network is mandatory for these fibromuscular lesions to persist. We analyzed VEGF-A mRNA and protein isoforms alongside microvessel density (CD31/CD34) and nerve fibers (PGP9.5) in 98 surgical rectovaginal specimens. VEGF-A was markedly elevated in active lesion peripheries, driven by localized hypoxia-inducible factor 1-alpha (HIF1A). Anti-angiogenic targeting in animal models produced marked atrophy of ectopic microvasculature and significant reductions in pain-associated sensory innervation.",
    extractedData: {
      researchObjective: "Determine whether VEGF-A-mediated microvascular sprouting correlates with lesion infiltration depth and pelvic sensory nerve density.",
      mainFindings: "Active DIE nodules exhibit high VEGF-A concentrations that stimulate endothelial migration and co-localize with sensory nerve sprouting, driving intense neuropathic pain.",
      genesIdentified: ["VEGFA", "KDR", "HIF1A", "FLT1", "PGP9.5"],
      proteinsIdentified: ["VEGF-A", "VEGFR-2", "HIF-1alpha", "CD31", "Protein Gene Product 9.5"],
      biologicalPathways: ["Pathological Angiogenesis", "Hypoxia Signaling via HIF-1A", "Neuroangiogenesis"],
      relationshipWithEndometriosis: "Retrograde endometrial tissue requires prompt neovascularization to survive in the ectopic pelvic microenvironment. VEGF-A drives this vascular supply and recruits sensory nerve fibers.",
      experimentalModel: "Human deep infiltrating rectovaginal resection specimens, nude mouse ectopic xenograft model, and human umbilical vein endothelial cells (HUVEC).",
      evidenceClassification: {
        humanClinical: "Moderate (98 Surgical Resection Patients)",
        humanTissue: "Immunohistochemical Microvascular Scoring",
        animalInVivo: "Nude Mouse Subcutaneous Xenograft Model",
        inVitro: "Endothelial Sprouting Transwell Assays"
      },
      evidenceDistribution: {
        humanClinical: 40,
        humanTissue: 35,
        animalInVivo: 15,
        inVitro: 10
      },
      potentialDrugTargets: [
        {
          geneSymbol: "VEGFA",
          targetName: "Vascular Endothelial Growth Factor A",
          biologicalFunction: "Endothelial mitogen & vascular permeability",
          roleInEndo: "Mandatory for lesion vascularization and sensory nerve infiltration",
          supportingEvidence: "Peritoneal fluid and lesion protein levels correlate with DIE lesion volume",
          priorityTier: "High Priority"
        }
      ]
    }
  },
  {
    id: "paper-3",
    title: "Prostaglandin E2 / EP2 signaling amplifies local steroidogenesis and cyclic neuroinflammation in pelvic endometriosis",
    authors: "Santulli P, Chouzenoux S, Fiorese M, et al.",
    journal: "Fertility and Sterility",
    year: 2021,
    doi: "10.1016/j.fertnstert.2021.03.018",
    pmid: "33892910",
    status: "Analysed",
    isPreloaded: true,
    sampleSize: "160 peritoneal fluid and lesion samples",
    abstract: "Cyclooxygenase-2 (COX-2, encoded by PTGS2) is an essential enzyme producing PGE2, which exerts potent autocrine and paracrine actions in the peritoneal microenvironment. In this multicenter prospective study, we mapped PGE2 receptor subtypes (EP1-4) across peritoneal, ovarian, and deep infiltrating lesions. We identified an autonomous positive feedback loop: PGE2 binding to EP2/EP4 upregulates intracellular cAMP, triggering steroidogenic factor-1 (SF-1) and aromatase (CYP19A1) expression, generating estradiol that in turn further induces COX-2. Selective EP4 receptor antagonists broke this cycle without systemic non-steroidal anti-inflammatory adverse effects.",
    extractedData: {
      researchObjective: "Map the autocrine feed-forward circuit connecting prostaglandin synthesis with local estrogen production and pelvic pain.",
      mainFindings: "Discovered that PTGS2/COX-2-derived PGE2 directly stimulates aromatase expression through EP2/EP4 receptors, creating an independent intracrine estrogen factory inside lesions.",
      genesIdentified: ["PTGS2", "PTGER2", "PTGER4", "CYP19A1", "IL1B"],
      proteinsIdentified: ["COX-2", "PGE2 Receptor EP2", "PGE2 Receptor EP4", "Aromatase"],
      biologicalPathways: ["Arachidonic Acid Metabolism", "Prostaglandin E2 Cascade", "Cyclic AMP / PKA Signaling"],
      relationshipWithEndometriosis: "Provides lesions with continuous local estrogen and pain-inducing prostaglandins, explaining why hormonal therapies fail to cure established lesions.",
      experimentalModel: "Human peritoneal fluid aspirates (n=160), ectopic stromal cell cultures, and autologous rat endometriosis model.",
      evidenceClassification: {
        humanClinical: "High (160 Patient Peritoneal Fluid Samples)",
        humanTissue: "Histopathological Mapping of EP Receptors",
        animalInVivo: "Surgically Induced Rat Model",
        inVitro: "cAMP Luminescence Reporter Assays in HESCs"
      },
      evidenceDistribution: {
        humanClinical: 45,
        humanTissue: 30,
        animalInVivo: 15,
        inVitro: 10
      },
      potentialDrugTargets: [
        {
          geneSymbol: "PTGS2",
          targetName: "COX-2 / PTGS2",
          biologicalFunction: "Rate-limiting prostaglandin synthesis",
          roleInEndo: "Drives cyclic pelvic pain and local estrogen feed-forward loop",
          supportingEvidence: "Peritoneal fluid PGE2 strongly correlates with Visual Analog Scale pain scores",
          priorityTier: "High Priority"
        }
      ]
    }
  },
  {
    id: "paper-4",
    title: "Matrix metalloproteinase-9 promotes mesothelial basement membrane invasion and correlates with rASRM stage IV disease",
    authors: "Zondervan KT, Becker CM, Missmer SA, et al.",
    journal: "Cellular and Molecular Life Sciences",
    year: 2022,
    doi: "10.1007/s00018-022-04289-5",
    pmid: "35403212",
    status: "Analysed",
    isPreloaded: true,
    sampleSize: "82 peritoneal fluid and tissue biopsies",
    abstract: "The peritoneal mesothelium normally provides a non-permissive protective barrier preventing cellular adhesion. Viable retrograde shed endometrial tissue fragments overcome this barrier by secreting gelatinases. We evaluated gelatinolytic activities of MMP-2 and MMP-9 in peritoneal fluid from women undergoing diagnostic laparoscopy. Active MMP-9 was elevated 6.4-fold in women with stage III/IV disease compared with control subjects. Recombinant allosteric inhibitors of MMP-9 abrogated the invasive migration of 12Z endometriotic epithelial cells across intact human peritoneal mesothelial monolayers without broad-spectrum toxicity.",
    extractedData: {
      researchObjective: "Investigate how MMP-9 mediates the breakdown of the peritoneal mesothelial barrier during initial lesion attachment.",
      mainFindings: "MMP-9 degrades Type IV collagen in peritoneal basement membranes, opening avenues for deep stromal invasion and subsequent fibrosis.",
      genesIdentified: ["MMP9", "MMP2", "TIMP1", "COL4A1"],
      proteinsIdentified: ["Matrix metalloproteinase-9", "Matrix metalloproteinase-2", "TIMP-1", "Collagen IV"],
      biologicalPathways: ["Extracellular Matrix Degradation", "Peritoneal Mesothelial Invasion", "Gelatinase Activation"],
      relationshipWithEndometriosis: "Permits shedding endometrial fragments to breach the peritoneal barrier, embed into subperitoneal connective tissues, and form invasive endometriotic plaques.",
      experimentalModel: "Laparoscopic peritoneal washes from 82 women and 3D organotypic co-culture with human peritoneal mesothelial cells (HPMCs).",
      evidenceClassification: {
        humanClinical: "Moderate (82 Diagnostic Laparoscopy Patients)",
        humanTissue: "Gelatin Zymography of Peritoneal Fluid",
        animalInVivo: "N/A",
        inVitro: "3D Organotypic Transwell Mesothelial Invasion"
      },
      evidenceDistribution: {
        humanClinical: 40,
        humanTissue: 30,
        animalInVivo: 0,
        inVitro: 30
      },
      potentialDrugTargets: [
        {
          geneSymbol: "MMP9",
          targetName: "Matrix Metallopeptidase 9",
          biologicalFunction: "Extracellular matrix collagen digestion",
          roleInEndo: "Essential for breaking through peritoneal barrier and tissue remodeling",
          supportingEvidence: "Direct correlation with rASRM Stage III/IV disease and invasive nodule depth",
          priorityTier: "High Priority"
        }
      ]
    }
  },
  {
    id: "paper-5",
    title: "HDAC6-mediated tubulin deacetylation directs myofibroblast differentiation and pelvic fibrosis in ovarian endometrioma",
    authors: "Nasu K, Nishida M, Kawano Y, et al.",
    journal: "Reproductive Sciences",
    year: 2023,
    doi: "10.1007/s43032-023-01185-1",
    pmid: "36821450",
    status: "Analysed",
    isPreloaded: true,
    sampleSize: "48 ovarian endometrioma wall biopsies",
    abstract: "Severe fibrosis and pelvic adhesions represent the most debilitating complications of endometriosis, frequently causing frozen pelvis and intractable infertility. Transforming growth factor-beta 1 (TGF-beta1) drives the transdifferentiation of stromal fibroblasts into alpha-smooth muscle actin (alpha-SMA) positive contractile myofibroblasts. We identified histone deacetylase 6 (HDAC6) as a key cytoplasmic amplifier of this fibrogenic cascade. In human endometrioma wall samples, HDAC6 was elevated 3.8-fold. Specific inhibition of HDAC6 with Tubastatin A maintained alpha-tubulin acetylation, suppressed Smad2/3 nuclear translocation, and halted collagen I/III deposition in a surgically induced murine model.",
    extractedData: {
      researchObjective: "Uncover non-hormonal epigenetic regulators of myofibroblast differentiation to combat extensive pelvic adhesions and fibrosis.",
      mainFindings: "Identified HDAC6 as an indispensable regulator of TGF-beta1-induced alpha-SMA expression and collagen synthesis; selective inhibition reversed fibrosis in vitro and in vivo.",
      genesIdentified: ["HDAC6", "TGFB1", "ACTA2", "COL1A1", "SMAD3"],
      proteinsIdentified: ["Histone Deacetylase 6", "TGF-beta1", "alpha-SMA", "Collagen Type I", "Phospho-Smad3"],
      biologicalPathways: ["Pelvic Fibrogenesis", "TGF-beta / Smad Signaling", "Cytoskeletal Tubulin Dynamics"],
      relationshipWithEndometriosis: "Drives progressive organ encapsulation, adhesion formation, and severe tissue distortion in ovarian endometriomas and deep infiltrating rectovaginal nodules.",
      experimentalModel: "Ovarian endometrioma surgical cyst walls (n=48), primary human endometriotic stromal cells, and syngeneic Balb/c mouse model.",
      evidenceClassification: {
        humanClinical: "Moderate (48 Ovarian Endometrioma Resection Specimens)",
        humanTissue: "Immunohistochemical Masson Trichrome Fibrosis Scoring",
        animalInVivo: "Syngeneic Balb/c Murine Endometriosis Model",
        inVitro: "Primary HESC Myofibroblast Differentiation Assays"
      },
      evidenceDistribution: {
        humanClinical: 35,
        humanTissue: 30,
        animalInVivo: 20,
        inVitro: 15
      },
      potentialDrugTargets: [
        {
          geneSymbol: "HDAC6",
          targetName: "Histone Deacetylase 6",
          biologicalFunction: "Cytoplasmic alpha-tubulin deacetylation",
          roleInEndo: "Key epigenetic driver of TGF-beta myofibroblast differentiation and fibrosis",
          supportingEvidence: "Tubastatin A achieves 61% reduction in lesion collagen volume fraction without hormonal side effects",
          priorityTier: "High Priority"
        }
      ]
    }
  }
];
