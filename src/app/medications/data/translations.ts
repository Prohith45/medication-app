export type Language = "en" | "te";

export interface TranslationDictionary {
  // Navigation & Modes
  appTitle: string;
  appSubtitle: string;
  seniorMode: string;
  seniorModeOn: string;
  settings: string;
  caregiver: string;

  // Tabs
  tabToday: string;
  tabMedicines: string;
  tabProgress: string;
  tabHelp: string;
  helpLine: string;
  emergencyHelp: string;

  // Greetings & Today
  goodMorning: string;
  goodAfternoon: string;
  goodEvening: string;
  todayIs: string;
  dueNow: string;
  yesTookIt: string;
  notYet: string;
  laterTodayTaken: string;
  taken: string;
  takenWithBreakfastAt: string;
  iTookIt: string;

  // Actions & Alerts
  doseDue: string;
  timeToTake: string;
  tookDose: string;
  skipDose: string;
  confirmDose: string;
  testAlarm: string;
  testAlarmFull: string;
  alarmSilenced: string;
  guardianNotified: string;
  silenceAndNotify: string;
  guardianAlertIn: string;
  scheduledFor: string;
  reminderTitle: string;

  // Medicine Form & Details
  addAMedicine: string;
  tellUsAboutMedicine: string;
  whatIsItCalled: string;
  bottleNamePrompt: string;
  howMuchTake: string;
  typeOrChooseDose: string;
  whenTake: string;
  chooseRoutineTimes: string;
  chooseAnotherTime: string;
  howOftenTake: string;
  everyDay: string;
  certainDays: string;
  whenNeeded: string;
  saveThisMedicine: string;
  cancelGoBack: string;
  backToMedicines: string;
  yourPillMatch: string;
  exactMatch: string;
  markedAs: string;
  whatIsThisFor: string;
  howItWorks: string;
  sideEffectsSomePeople: string;
  fromPharmacist: string;
  askPharmacistAboutThis: string;

  // Interactions
  takingTheseTogether: string;
  interactionSubtitle: string;
  importantSafetyWarning: string;
  needsCarefulAttention: string;
  whatCanHappen: string;
  whyThisHappens: string;
  whatToDo: string;
  askPharmacistBefore: string;
  interactionNotice: string;
  callMyPharmacist: string;
  pharmacyContact: string;

  // Progress
  yourProgress: string;
  progressSubtitle: string;
  daysInARow: string;
  moreDaysToReach: string;
  ofDosesTakenMonth: string;
  doingWonderfully: string;
  last4Weeks: string;
  twentyEightDays: string;
  allMedicinesTaken: string;
  partlyTaken: string;
  missedDosesEncouragement: string;
  printDoctorSummary: string;
  printDoctorSubtitle: string;

  // Intake & Timings
  morning: string;
  afternoon: string;
  evening: string;
  night: string;
  takeInMorning: string;
  takeInAfternoon: string;
  takeInEvening: string;
  takeAtNight: string;
  takeWithBreakfast: string;
  takeWithLunch: string;
  takeWithDinner: string;
  beforeMeals: string;
  afterFood: string;
  emptyStomach: string;
  withWater: string;
  asDirected: string;

  // Stats & Schedule
  dayStreak: string;
  keepItUp: string;
  compliance: string;
  yourMedications: string;
  dailyMedications: string;
  noMedicationsYet: string;
  seniorAskFamily: string;
  useFormAbove: string;
  scheduledTime: string;

  // Disclaimer
  safetyNote: string;
  disclaimerText: string;
  educationalRoutineOnly: string;
  appHelpsRemember: string;
  skipped: string;
  triggerEmergency: string;
  adherenceAndSafety: string;
  activeDaysStreak: string;
  daysInARowStreak: string;
  monthlyAdherence: string;
  dosesTakenThisMonth: string;
  emergencyGuardianCard: string;
  telegramActive: string;
  triggerEmergencyAlert: string;
  emergencyAlertSent: string;
  missedDoseWarning: string;
  missedDoseAutoAlert: string;
  afterfood: string;
  beforefood: string;
  withwater: string;
  emptystomach: string;
  customTime: string;
  presetMedicines: string;
  editProfile: string;
  patientNameLabel: string;
  guardianNameLabel: string;
  relationshipLabel: string;
  saveProfile: string;
  clearAllMedicines: string;
  clearAllConfirm: string;
  resetDefaults: string;
  profileSaved: string;
  cancel: string;
  howMuchDose: string;
  whatTimeTake: string;
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    appTitle: "MedAssist AI",
    appSubtitle: "Daily Routine & Caregiver Safety",
    seniorMode: "Senior Mode",
    seniorModeOn: "Senior Mode ON",
    settings: "Settings",
    caregiver: "Caregiver",

    tabToday: "Today",
    tabMedicines: "Medicines",
    tabProgress: "Progress",
    tabHelp: "Help",
    helpLine: "Help line",
    emergencyHelp: "Emergency Help",

    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    todayIs: "Today is",
    dueNow: "Due now",
    yesTookIt: "Yes, I took it",
    notYet: "Not yet",
    laterTodayTaken: "Later today & taken",
    taken: "Taken",
    takenWithBreakfastAt: "Taken with breakfast at",
    iTookIt: "I took it",

    doseDue: "Time to take your medicine",
    timeToTake: "⏰ TIME TO TAKE YOUR MEDICATION",
    tookDose: "I TOOK THIS",
    skipDose: "Skip",
    confirmDose: "Confirm Dose",
    testAlarm: "Test Alarm",
    testAlarmFull: "🚨 Test Guardian Alarm",
    alarmSilenced: "Alarm Stopped",
    guardianNotified: "Guardian notified via Telegram",
    silenceAndNotify: "Silence & Notify Guardian Now",
    guardianAlertIn: "Guardian alert in",
    scheduledFor: "Scheduled for",
    reminderTitle: "Medication Reminder",

    addAMedicine: "Add a medicine",
    tellUsAboutMedicine: "Tell us about your medicine one step at a time.",
    whatIsItCalled: "What is it called?",
    bottleNamePrompt: "Write the name on the front of your pill bottle.",
    howMuchTake: "How much do you take?",
    typeOrChooseDose: "Type the amount above or choose a common amount below:",
    whenTake: "When do you take it?",
    chooseRoutineTimes: "Choose one or more times that suit your routine:",
    chooseAnotherTime: "Choose another time",
    howOftenTake: "How often do you take it?",
    everyDay: "Every day",
    certainDays: "Only certain days",
    whenNeeded: "Only when I need it",
    saveThisMedicine: "Save this medicine",
    cancelGoBack: "Cancel and go back",
    backToMedicines: "Back to medicines",
    yourPillMatch: "Your Pill Match",
    exactMatch: "Exact Match",
    markedAs: "Marked:",
    whatIsThisFor: "What is this for?",
    howItWorks: "How it works",
    sideEffectsSomePeople: "Side effects some people get",
    fromPharmacist: "From your pharmacist",
    askPharmacistAboutThis: "Ask my pharmacist about this",

    takingTheseTogether: "Taking these together",
    interactionSubtitle: "Here is what happens when your medicines meet each other.",
    importantSafetyWarning: "Important safety warning",
    needsCarefulAttention: "Needs careful attention",
    whatCanHappen: "What can happen",
    whyThisHappens: "Why this happens",
    whatToDo: "What to do",
    askPharmacistBefore: "Ask your pharmacist or doctor before taking these together.",
    interactionNotice:
      "This only covers well-known combinations. It cannot know about your other conditions. Your pharmacist can check properly.",
    callMyPharmacist: "Call my pharmacist",
    pharmacyContact: "Emergency Caregiver & Pharmacy Support",

    yourProgress: "Your Progress",
    progressSubtitle: "A clear record of your daily health habits.",
    daysInARow: "days in a row",
    moreDaysToReach: "more days to reach",
    ofDosesTakenMonth: "of your doses taken this month",
    doingWonderfully: "You are doing wonderfully keeping up with your health routine.",
    last4Weeks: "Last 4 weeks",
    twentyEightDays: "28 Days",
    allMedicinesTaken: "All medicines taken",
    partlyTaken: "Partly taken",
    missedDosesEncouragement:
      "Missed doses happen. Just keep going with your next scheduled medicine.",
    printDoctorSummary: "Print a summary for my doctor",
    printDoctorSubtitle: "Takes a clear 1-page paper summary you can bring to your appointment.",

    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
    night: "Night",
    takeInMorning: "TAKE IN THE MORNING",
    takeInAfternoon: "TAKE IN THE AFTERNOON",
    takeInEvening: "TAKE IN THE EVENING",
    takeAtNight: "TAKE AT NIGHT BEFORE BED",
    takeWithBreakfast: "TAKE WITH BREAKFAST",
    takeWithLunch: "TAKE WITH LUNCH",
    takeWithDinner: "TAKE WITH DINNER",
    beforeMeals: "TAKE BEFORE MEALS",
    afterFood: "TAKE AFTER FOOD • DRINK FULL GLASS OF WATER",
    emptyStomach: "TAKE ON EMPTY STOMACH",
    withWater: "DRINK WITH FULL GLASS OF WATER",
    asDirected: "TAKE AS DIRECTED",

    dayStreak: "Day Streak",
    keepItUp: "Day Streak — Keep it up!",
    compliance: "Compliance",
    yourMedications: "Your Medications",
    dailyMedications: "Your Daily Medications",
    noMedicationsYet: "No medications added yet.",
    seniorAskFamily: "Ask a family member to add your medications.",
    useFormAbove: "Use the form above to get started.",
    scheduledTime: "Scheduled",

    safetyNote: "Not medical advice. Consult your doctor.",
    disclaimerText:
      "⚠️ MedAssist AI is a routine-building tool, not medical advice. Always consult your doctor or pharmacist before making any changes to your medication schedule.",
    educationalRoutineOnly:
      "Educational routine tracking only. This tool does not replace professional medical evaluation.",
    appHelpsRemember: "This app helps you remember. It is not medical advice.",
    skipped: "Skipped",
    triggerEmergency: "🚨 Trigger Emergency Alert",
    adherenceAndSafety: "Adherence & Guardian Safety",
    activeDaysStreak: "Active Days Streak",
    daysInARowStreak: "Days in a row!",
    monthlyAdherence: "Monthly Adherence",
    dosesTakenThisMonth: "doses taken this month",
    emergencyGuardianCard: "Emergency Guardian Card",
    telegramActive: "Telegram Active",
    triggerEmergencyAlert: "🚨 Trigger Emergency Alert",
    emergencyAlertSent: "🚨 Emergency alert sent to guardian!",
    missedDoseWarning: "⚠️ You've skipped 2+ doses. Guardian has been notified.",
    missedDoseAutoAlert: "Auto-alert: Multiple missed doses detected",
    afterfood: "After food",
    beforefood: "Before food",
    withwater: "With water",
    emptystomach: "Empty stomach",
    customTime: "Or pick exact time",
    presetMedicines: "Quick picks",
    editProfile: "Edit Profile & Caregiver",
    patientNameLabel: "Patient Name",
    guardianNameLabel: "Caregiver / Guardian Name",
    relationshipLabel: "Relationship",
    saveProfile: "Save Profile",
    clearAllMedicines: "Clear All Medications",
    clearAllConfirm: "Are you sure you want to clear all medications? This will remove all items from your active schedule.",
    resetDefaults: "Reset to Sample Medicines",
    profileSaved: "Profile saved successfully!",
    cancel: "Cancel",
    howMuchDose: "How much do you take?",
    whatTimeTake: "What time do you take it?",
  },
  te: {
    appTitle: "మెడ్ అసిస్ట్ AI",
    appSubtitle: "మందుల రిమైండర్ & సంరక్షకుల భద్రత",
    seniorMode: "పెద్దల మోడ్",
    seniorModeOn: "పెద్దల మోడ్ ఆన్",
    settings: "సెట్టింగ్స్",
    caregiver: "కుటుంబ సంరక్షకులు",

    tabToday: "నేడు",
    tabMedicines: "మందులు",
    tabProgress: "ప్రగతి",
    tabHelp: "సహాయం",
    helpLine: "హెల్ప్‌లైన్",
    emergencyHelp: "అత్యవసర సహాయం",

    goodMorning: "శుభోదయం",
    goodAfternoon: "శుభ మధ్యాహ్నం",
    goodEvening: "శుభ సాయంత్రం",
    todayIs: "ఈ రోజు",
    dueNow: "ఇప్పుడు వేసుకోవాలి",
    yesTookIt: "✓ అవును, వేసుకున్నాను",
    notYet: "ఇంకా లేదు",
    laterTodayTaken: "నేటి మిగతా మందులు & వేసుకున్నవి",
    taken: "వేసుకున్నారు",
    takenWithBreakfastAt: "అల్పాహారంతో వేసుకున్నారు సమయం",
    iTookIt: "నేను వేసుకున్నాను",

    doseDue: "మందులు వేసుకునే సమయం అయింది",
    timeToTake: "⏰ మందులు వేసుకునే సమయం అయింది",
    tookDose: "నేను మందు వేసుకున్నాను",
    skipDose: "వదిలేయండి",
    confirmDose: "వేసుకున్నాను",
    testAlarm: "అలారం పరీక్ష",
    testAlarmFull: "🚨 సంరక్షకుల అలారం పరీక్ష",
    alarmSilenced: "అలారం ఆపబడింది",
    guardianNotified: "కుటుంబ సభ్యులకు టెలిగ్రామ్ ద్వారా సమాచారం పంపబడింది",
    silenceAndNotify: "అలారం ఆపి సంరక్షకులకు తెలపండి",
    guardianAlertIn: "కుటుంబ సభ్యులకు హెచ్చరిక సమయం",
    scheduledFor: "నిర్ణీత సమయం",
    reminderTitle: "మందుల రిమైండర్",

    addAMedicine: "మందును జోడించండి",
    tellUsAboutMedicine: "మీ మందు వివరాలను ఒక్కొక్కటిగా నమోదు చేయండి.",
    whatIsItCalled: "మందు పేరు ఏమిటి?",
    bottleNamePrompt: "మీ మందుల సీసా లేదా స్ట్రిప్ మీద ఉన్న పేరు రాయండి.",
    howMuchTake: "ఎంత మోతాదు వేసుకుంటారు?",
    typeOrChooseDose: "మోతాదు నమోదు చేయండి లేదా క్రింద ఎంచుకోండి:",
    whenTake: "ఎప్పుడు వేసుకుంటారు?",
    chooseRoutineTimes: "మీ దినచర్యకు సరిపడే సమయాన్ని ఎంచుకోండి:",
    chooseAnotherTime: "మరొక సమయాన్ని ఎంచుకోండి",
    howOftenTake: "ఎంత తరచుగా వేసుకుంటారు?",
    everyDay: "ప్రతిరోజూ",
    certainDays: "కొన్ని రోజులు మాత్రమే",
    whenNeeded: "అవసరమైనప్పుడు మాత్రమే",
    saveThisMedicine: "మందును భద్రపరచండి",
    cancelGoBack: "రద్దు చేసి వెనుకకు వెళ్ళండి",
    backToMedicines: "మందుల జాబితాకు వెళ్ళండి",
    yourPillMatch: "మీ మాత్ర పోలిక",
    exactMatch: "సరిగ్గా సరిపోయింది",
    markedAs: "గుర్తు:",
    whatIsThisFor: "ఇది దేని కొరకు?",
    howItWorks: "ఇది ఎలా పనిచేస్తుంది",
    sideEffectsSomePeople: "సాధారణ సైడ్ ఎఫెక్ట్స్",
    fromPharmacist: "మీ ఫార్మసిస్ట్ సూచన",
    askPharmacistAboutThis: "ఫార్మసిస్ట్‌ను సంప్రదించండి",

    takingTheseTogether: "కలిపి వేసుకున్నప్పుడు",
    interactionSubtitle: "ఈ మందులను కలిపి వేసుకుంటే ఏమి జరుగుతుందో ఇక్కడ చూడండి.",
    importantSafetyWarning: "ముఖ్యమైన భద్రతా హెచ్చరిక",
    needsCarefulAttention: "జాగ్రత్త వహించవలసినవి",
    whatCanHappen: "ఏమి జరగవచ్చు",
    whyThisHappens: "ఇది ఎందుకు జరుగుతుంది",
    whatToDo: "మీరు ఏమి చేయాలి",
    askPharmacistBefore: "వీటిని కలిపి వేసుకునే ముందు డాక్టర్‌ను లేదా ఫార్మసిస్ట్‌ను అడగండి.",
    interactionNotice:
      "ఇది సాధారణంగా తెలిసిన కలయికలను మాత్రమే చూపుతుంది. మీ ఇతర ఆరోగ్య సమస్యల గురించి మీ ఫార్మసిస్ట్ మాత్రమే సరిగ్గా పరిశీలించగలరు.",
    callMyPharmacist: "ఫార్మసిస్ట్‌కు కాల్ చేయండి",
    pharmacyContact: "సంరక్షకులు & ఫార్మసీ అత్యవసర సంప్రదింపులు",

    yourProgress: "మీ ప్రగతి",
    progressSubtitle: "మీ రోజువారీ మందుల సమయపాలన వివరాలు.",
    daysInARow: "రోజులు వరుసగా",
    moreDaysToReach: "రోజులు అవసరం చేరడానికి",
    ofDosesTakenMonth: "ఈ నెలలో వేసుకున్న మోతాదుల శాతం",
    doingWonderfully: "మీరు మీ ఆరోగ్య దినచర్యను అద్భుతంగా పాటిస్తున్నారు.",
    last4Weeks: "గత 4 వారాలు",
    twentyEightDays: "28 రోజులు",
    allMedicinesTaken: "అన్ని మందులు వేసుకున్నారు",
    partlyTaken: "కొన్ని మాత్రమే వేసుకున్నారు",
    missedDosesEncouragement:
      "ఒక మోతాదు తప్పిపోయినా ఫరవాలేదు. తదుపరి నిర్ణీత సమయానికి మందు వేసుకోండి.",
    printDoctorSummary: "డాక్టర్ కోసం సారాంశాన్ని ప్రింట్ చేయండి",
    printDoctorSubtitle: "మీ తదుపరి డాక్టర్ అపాయింట్‌మెంట్ కోసం ఒక పేజీ సారాంశం.",

    morning: "ఉదయం",
    afternoon: "మధ్యాహ్నం",
    evening: "సాయంత్రం",
    night: "రాత్రి",
    takeInMorning: "ఉదయం వేసుకోండి",
    takeInAfternoon: "మధ్యాహ్నం వేసుకోండి",
    takeInEvening: "సాయంత్రం వేసుకోండి",
    takeAtNight: "పడుకునే ముందు రాత్రి వేసుకోండి",
    takeWithBreakfast: "అల్పాహారంతో (టిఫిన్) పాటు వేసుకోండి",
    takeWithLunch: "మధ్యాహ్న భోజనంతో పాటు వేసుకోండి",
    takeWithDinner: "రాత్రి భోజనంతో పాటు వేసుకోండి",
    beforeMeals: "భోజనానికి ముందు వేసుకోండి",
    afterFood: "భోజనం తర్వాత వేసుకోండి • మంచి నీళ్లతో మింగండి",
    emptyStomach: "ఖాళీ కడుపుతో వేసుకోండి",
    withWater: "మంచి నీళ్లతో మింగండి",
    asDirected: "వైద్యులు సూచించినట్లు వేసుకోండి",

    dayStreak: "రోజుల వరుస",
    keepItUp: "రోజుల వరుస — ఇలాగే కొనసాగించండి!",
    compliance: "సక్రమంగా వాడిన శాతం",
    yourMedications: "మీ మందులు",
    dailyMedications: "మీ రోజువారీ మందులు",
    noMedicationsYet: "ఇంకా మందులు జోడించబడలేదు.",
    seniorAskFamily: "మందులు జోడించడానికి కుటుంబ సభ్యుల సహాయం తీసుకోండి.",
    useFormAbove: "మందులు నమోదు చేయడానికి పై ఫారమ్ ఉపయోగించండి.",
    scheduledTime: "సమయం",

    safetyNote: "ఇది డాక్టర్ సలహాకు ప్రత్యామ్నాయం కాదు. వైద్యుడిని సంప్రదించండి.",
    disclaimerText:
      "⚠️ ఇది మందుల సమయపాలన కొరకు మాత్రమే, వైద్య సలహా కాదు. మందుల మోతాదు లేదా సమయాల్లో మార్పుల కోసం తప్పనిసరిగా మీ వైద్యుడిని లేదా ఫార్మసిస్ట్‌ను సంప్రదించండి.",
    educationalRoutineOnly:
      "సహాయక సమాచారం కొరకు మాత్రమే. ఇది నిపుణులైన వైద్య చికిత్సకు ప్రత్యామ్నాయం కాదు.",
    appHelpsRemember: "ఈ యాప్ మీకు గుర్తు చేయడానికి మాత్రమే. ఇది వైద్య సలహా కాదు.",
    skipped: "వదిలేశారు",
    triggerEmergency: "🚨 అత్యవసర హెచ్చరిక పంపండి",
    adherenceAndSafety: "మందుల సక్రమత & సంరక్షకుల భద్రత",
    activeDaysStreak: "వరుస రోజుల స్ట్రీక్",
    daysInARowStreak: "రోజులు వరుసగా!",
    monthlyAdherence: "నెలవారీ సక్రమత",
    dosesTakenThisMonth: "ఈ నెలలో వేసుకున్న మోతాదులు",
    emergencyGuardianCard: "అత్యవసర సంరక్షకుల కార్డ్",
    telegramActive: "టెలిగ్రామ్ యాక్టివ్",
    triggerEmergencyAlert: "🚨 అత్యవసర హెచ్చరిక పంపండి",
    emergencyAlertSent: "🚨 సంరక్షకులకు అత్యవసర హెచ్చరిక పంపబడింది!",
    missedDoseWarning: "⚠️ మీరు 2+ మోతాదులు వదిలేశారు. సంరక్షకులకు తెలియజేయబడింది.",
    missedDoseAutoAlert: "ఆటో-హెచ్చరిక: బహుళ మోతాదులు తప్పిపోయాయి",
    afterfood: "భోజనం తర్వాత",
    beforefood: "భోజనానికి ముందు",
    withwater: "నీళ్లతో",
    emptystomach: "ఖాళీ కడుపుతో",
    customTime: "లేదా ఖచ్చితమైన సమయం ఎంచుకోండి",
    presetMedicines: "తక్షణ ఎంపికలు",
    editProfile: "రోగి & సంరక్షకుల వివరాలు సవరించండి",
    patientNameLabel: "రోగి పేరు",
    guardianNameLabel: "సంరక్షకులు / కుటుంబ సభ్యుల పేరు",
    relationshipLabel: "సంబంధం",
    saveProfile: "వివరాలను భద్రపరచండి",
    clearAllMedicines: "అన్ని మందులను తొలగించండి (Clear All)",
    clearAllConfirm: "మీరు నిజంగా అన్ని మందులను తొలగించాలనుకుంటున్నారా? ఇది మీ షెడ్యూల్‌ను రీసెట్ చేస్తుంది.",
    resetDefaults: "నమూనా మందులను పునరుద్ధరించండి",
    profileSaved: "ప్రొఫైల్ విజయవంతంగా సేవ్ చేయబడింది!",
    cancel: "రద్దు చేయండి",
    howMuchDose: "మీరు ఎంత మోతాదు తీసుకుంటారు?",
    whatTimeTake: "మీరు ఏ సమయంలో తీసుకుంటారు?",
  },
};
