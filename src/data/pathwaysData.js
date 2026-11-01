// Interactive Biological Pathway Network Data for Endometriosis
// Includes nodes (genes, proteins, receptors, phenotypes) and regulatory connections

export const PATHWAY_CATEGORIES = [
  { id: "all", name: "Global Disease Network", description: "Integrated signaling cascades governing endometriosis initiation, survival, and fibrosis." },
  { id: "hormonal", name: "Hormonal & Epigenetic Signalling", description: "Promoter hypomethylation of ESR2, progesterone resistance, and local aromatase induction." },
  { id: "inflammation", name: "Peritoneal Inflammation & Pain", description: "Peritoneal cytokine storm, PGE2 production, and sensory nerve hyper-sensitization." },
  { id: "angiogenesis", name: "Hypoxia & Pathological Angiogenesis", description: "HIF-1A stabilization, VEGF-A endothelial sprouting, and lesion vascularization." },
  { id: "fibrosis", name: "Invasion & Pelvic Fibrosis", description: "MMP-9 basement membrane degradation, TGF-beta Smad signaling, and HDAC6 myofibroblast differentiation." },
  { id: "immune", name: "Immune Dysfunction & Evasion", description: "IL-6/STAT3 signaling, NK-cell cytotoxicity suppression, and M2 macrophage recruitment." },
];

export const PATHWAY_NODES = [
  // Hormonal Cascade
  {
    id: "ESR2",
    symbol: "ESR2",
    name: "Estrogen Receptor Beta",
    category: "Hormonal Signalling",
    pathwayId: "hormonal",
    role: "Drug Target (Rank #1)",
    priorityScore: 94,
    x: 280,
    y: 160,
    type: "target",
    description: "Hypomethylated promoter causes 140x overexpression. Represses PR-A/B and blocks apoptosis.",
    upstream: ["Promoter Hypomethylation", "17beta-Estradiol (E2)"],
    downstream: ["PGR Repression", "CYP19A1 Induction", "BCL-2 Anti-Apoptosis"],
    keyRef: "Burney et al., Endocrinology 2021; Bulun et al., NEJM 2019"
  },
  {
    id: "PGR",
    symbol: "PGR",
    name: "Progesterone Receptor",
    category: "Hormonal Signalling",
    pathwayId: "hormonal",
    role: "Physiological Effector",
    priorityScore: 68,
    x: 460,
    y: 160,
    type: "receptor",
    description: "Pathologically repressed in lesions, preventing physiological antiproliferative decidualization.",
    upstream: ["ESR2 (Inhibition)"],
    downstream: ["Loss of Decidualization", "Unchecked Proliferation"],
    keyRef: "Zondervan et al., Nat Rev Dis Primers 2020"
  },
  {
    id: "CYP19A1",
    symbol: "CYP19A1",
    name: "Aromatase",
    category: "Hormonal Signalling",
    pathwayId: "hormonal",
    role: "Drug Target (Rank #8)",
    priorityScore: 81,
    x: 150,
    y: 280,
    type: "target",
    description: "Converts circulating androgens into estradiol locally within ectopic implants.",
    upstream: ["PGE2 / EP2 Signaling", "SF-1 Activation"],
    downstream: ["Intracrine 17beta-Estradiol"],
    keyRef: "Bulun et al., NEJM 2019"
  },

  // Inflammation Cascade
  {
    id: "PTGS2",
    symbol: "PTGS2",
    name: "COX-2",
    category: "Inflammation",
    pathwayId: "inflammation",
    role: "Drug Target (Rank #2)",
    priorityScore: 91,
    x: 260,
    y: 360,
    type: "target",
    description: "Converts arachidonic acid to PGE2, establishing an autocrine feed-forward cycle with CYP19A1 and sensitizing pelvic nerves.",
    upstream: ["TNF-alpha", "IL-1beta", "p38 MAPK"],
    downstream: ["Prostaglandin E2 (PGE2)", "Peritoneal Pain / Allodynia", "CYP19A1 Induction"],
    keyRef: "Santulli et al., Fertil Steril 2021"
  },
  {
    id: "PGE2",
    symbol: "PGE2",
    name: "Prostaglandin E2",
    category: "Inflammation",
    pathwayId: "inflammation",
    role: "Signaling Molecule",
    priorityScore: 70,
    x: 160,
    y: 450,
    type: "metabolite",
    description: "Lipid mediator triggering vasodilation, pelvic hyperalgesia, and aromatase expression via EP2/EP4 receptors.",
    upstream: ["PTGS2 / COX-2"],
    downstream: ["EP2 / EP4 Receptors", "Pelvic Pain Nociceptors"],
    keyRef: "McKinnon et al., Hum Reprod 2020"
  },
  {
    id: "TNF",
    symbol: "TNF",
    name: "TNF-alpha",
    category: "Inflammation",
    pathwayId: "inflammation",
    role: "Cytokine Target",
    priorityScore: 76,
    x: 390,
    y: 470,
    type: "target",
    description: "Major inflammatory cytokine orchestrating mesothelial adhesion and leukocyte infiltration.",
    upstream: ["Activated Peritoneal Macrophages"],
    downstream: ["NF-kB Activation", "PTGS2 Induction", "ICAM-1 Adhesion"],
    keyRef: "Santulli et al., Am J Reprod Immunol 2019"
  },
  {
    id: "MAPK14",
    symbol: "MAPK14",
    name: "p38 MAPK",
    category: "Inflammation",
    pathwayId: "inflammation",
    role: "Kinase Target (Rank #7)",
    priorityScore: 82,
    x: 410,
    y: 350,
    type: "target",
    description: "Stress kinase mediating inflammatory cytokine transcription and peripheral nerve fiber sprouting in lesions.",
    upstream: ["Inflammatory Stress", "IL-1beta"],
    downstream: ["PTGS2 Expression", "Nerve Growth Factor (NGF)"],
    keyRef: "Nasu et al., Pain 2021"
  },

  // Angiogenesis
  {
    id: "HIF1A",
    symbol: "HIF1A",
    name: "HIF-1alpha",
    category: "Angiogenesis",
    pathwayId: "angiogenesis",
    role: "Transcription Factor",
    priorityScore: 73,
    x: 600,
    y: 180,
    type: "transcription-factor",
    description: "Stabilized by local hypoxia in retrogradely shed tissue fragments in the peritoneal cavity.",
    upstream: ["Peritoneal Hypoxia"],
    downstream: ["VEGFA Transcription"],
    keyRef: "McKinnon et al., Hum Reprod Update 2022"
  },
  {
    id: "VEGFA",
    symbol: "VEGFA",
    name: "VEGF-A",
    category: "Angiogenesis",
    pathwayId: "angiogenesis",
    role: "Drug Target (Rank #3)",
    priorityScore: 89,
    x: 640,
    y: 300,
    type: "target",
    description: "Master pro-angiogenic driver enabling microvascular sprouting and lesion survival.",
    upstream: ["HIF1A", "Estrogen / ER-beta"],
    downstream: ["KDR / VEGFR-2", "Endothelial Sprouting", "Lesion Revascularization"],
    keyRef: "McKinnon et al., Hum Reprod Update 2022"
  },
  {
    id: "KDR",
    symbol: "KDR",
    name: "VEGFR-2",
    category: "Angiogenesis",
    pathwayId: "angiogenesis",
    role: "Receptor Tyrosine Kinase",
    priorityScore: 78,
    x: 770,
    y: 300,
    type: "receptor",
    description: "Main receptor on endothelial cells mediating VEGF-induced proliferation and capillary formation.",
    upstream: ["VEGFA"],
    downstream: ["Endothelial Neo-vascularization"],
    keyRef: "Am J Obstet Gynecol 2019"
  },

  // Fibrosis & Invasion
  {
    id: "MMP9",
    symbol: "MMP9",
    name: "MMP-9 (Gelatinase B)",
    category: "Tissue Remodelling",
    pathwayId: "fibrosis",
    role: "Drug Target (Rank #4)",
    priorityScore: 86,
    x: 580,
    y: 430,
    type: "target",
    description: "Cleaves basement membrane collagen IV, allowing shed fragments to penetrate peritoneum.",
    upstream: ["Proinflammatory Cytokines", "ERK/MAPK"],
    downstream: ["Peritoneal Mesothelial Invasion", "Latent TGF-beta Activation"],
    keyRef: "Zondervan et al., Cell Mol Life Sci 2022"
  },
  {
    id: "TGFB1",
    symbol: "TGFB1",
    name: "TGF-beta-1",
    category: "Fibrosis",
    pathwayId: "fibrosis",
    role: "Drug Target (Rank #10)",
    priorityScore: 78,
    x: 720,
    y: 440,
    type: "target",
    description: "Master fibrogenic factor converting fibroblasts into alpha-SMA contractile myofibroblasts.",
    upstream: ["MMP-9 Cleavage", "Thrombin"],
    downstream: ["Smad2/3 Phosphorylation", "Myofibroblast Transformation", "Pelvic Adhesions"],
    keyRef: "Fertil Steril 2020"
  },
  {
    id: "HDAC6",
    symbol: "HDAC6",
    name: "Histone Deacetylase 6",
    category: "Fibrosis",
    pathwayId: "fibrosis",
    role: "Drug Target (Rank #6)",
    priorityScore: 84,
    x: 820,
    y: 530,
    type: "target",
    description: "Deacetylates alpha-tubulin, facilitating cell motility and TGF-beta-mediated collagen deposition.",
    upstream: ["TGFB1 Stimulation"],
    downstream: ["alpha-SMA Assembly", "Dense Collagen I/III Matrix", "Frozen Pelvis Adhesions"],
    keyRef: "Nasu et al., Reprod Sci 2023"
  },

  // Immune Dysfunction
  {
    id: "IL6",
    symbol: "IL6",
    name: "Interleukin 6",
    category: "Immune Dysfunction",
    pathwayId: "immune",
    role: "Drug Target (Rank #5)",
    priorityScore: 85,
    x: 480,
    y: 580,
    type: "target",
    description: "Peritoneal cytokine stimulating STAT3 phosphorylation, suppressing NK cell cytotoxicity.",
    upstream: ["Peritoneal Macrophages", "Endometriotic Stromal Cells"],
    downstream: ["JAK/STAT3 Phosphorylation", "NK Cell Evasion", "M2 Macrophage Polarization"],
    keyRef: "Fertil Steril 2020; J Immunol 2021"
  },
  {
    id: "CXCL8",
    symbol: "CXCL8",
    name: "IL-8",
    category: "Immune Dysfunction",
    pathwayId: "immune",
    role: "Drug Target (Rank #9)",
    priorityScore: 79,
    x: 640,
    y: 580,
    type: "target",
    description: "Chemoattractant recruiting neutrophils and synergizing with VEGF-A in microvascular proliferation.",
    upstream: ["NF-kB", "TNF-alpha"],
    downstream: ["CXCR1/2 Receptors", "Neutrophil Peritoneal Infiltration"],
    keyRef: "Gynecol Obstet Invest 2021"
  }
];

export const PATHWAY_EDGES = [
  // Hormonal interactions
  { from: "ESR2", to: "PGR", type: "inhibits", label: "Represses PR transcription" },
  { from: "ESR2", to: "CYP19A1", type: "induces", label: "Promotes local aromatase" },
  { from: "CYP19A1", to: "ESR2", type: "activates", label: "Estradiol synthesis feed-forward" },
  { from: "CYP19A1", to: "PTGS2", type: "activates", label: "Estradiol upregulates COX-2" },

  // Inflammation & Pain
  { from: "PTGS2", to: "PGE2", type: "activates", label: "Synthesizes PGE2" },
  { from: "PGE2", to: "CYP19A1", type: "induces", label: "EP2/EP4 stimulates promoter II" },
  { from: "MAPK14", to: "PTGS2", type: "induces", label: "Stress kinase transcription" },
  { from: "TNF", to: "MAPK14", type: "activates", label: "Cytokine receptor cascade" },
  { from: "TNF", to: "PTGS2", type: "induces", label: "NF-kB / AP-1 induction" },

  // Angiogenesis
  { from: "HIF1A", to: "VEGFA", type: "induces", label: "Hypoxia response element" },
  { from: "ESR2", to: "VEGFA", type: "induces", label: "Estrogenic angiogenesis" },
  { from: "VEGFA", to: "KDR", type: "activates", label: "Ligand-receptor dimerization" },

  // Invasion & Fibrosis
  { from: "TNF", to: "MMP9", type: "induces", label: "Protease upregulation" },
  { from: "MMP9", to: "TGFB1", type: "activates", label: "Releases matrix-bound TGF-beta" },
  { from: "TGFB1", to: "HDAC6", type: "induces", label: "Myofibroblast transdifferentiation" },

  // Immune dysfunction
  { from: "TNF", to: "IL6", type: "induces", label: "Cytokine cascade" },
  { from: "TNF", to: "CXCL8", type: "induces", label: "Chemokine induction" },
  { from: "IL6", to: "ESR2", type: "activates", label: "STAT3 enhances survival" }
];
