import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'fr' | 'ar';

export const translations = {
  en: {
    // Common
    appName: "20 August High School",
    back: "Back",
    submit: "Submit",
    loading: "Loading...",
    viewLeaderboard: "View Leaderboard",
    backToHome: "Back to Home",
    
    // Home page
    heroTitle: "Student Challenge",
    heroSubtitle: "Vote for your favorite student. Every vote counts in this exclusive competition.",
    registerToVote: "Register to Vote",
    submitEntry: "Submit Entry",
    viewResults: "View Results",
    adminLogin: "Admin",
    featuresTitle: "How It Works",
    feature1Title: "Register",
    feature1Desc: "Create your voter account with a valid email",
    feature2Title: "Vote",
    feature2Desc: "Cast your vote for your favorite student",
    feature3Title: "Results",
    feature3Desc: "Watch the live leaderboard update in real-time",
    
    // Register page
    registerTitle: "Register to Vote",
    registerSubtitle: "Create your account to participate in the voting",
    voterRegistration: "Voter Registration",
    voterRegisterDesc: "Enter your details to register as a voter",
    fullName: "Full Name",
    enterFullName: "Enter your full name",
    email: "Email Address",
    enterEmail: "Enter your email",
    registerButton: "Register",
    registering: "Registering...",
    alreadyRegistered: "Already registered?",
    loginHere: "Login here",
    registrationSuccess: "Registration Successful!",
    registrationSuccessDesc: "You're ready to cast your vote.",
    voteNow: "Vote Now",
    
    // Login
    loginTitle: "Login to Vote",
    loginSubtitle: "Enter your email to access your account",
    voterLogin: "Voter Login",
    voterLoginDesc: "Enter your registered email to login",
    loginButton: "Login",
    loggingIn: "Logging in...",
    notRegistered: "Not registered yet?",
    registerHere: "Register here",
    
    // Submit page
    submitTitle: "Submit Your Entry",
    submitSubtitle: "Join the student challenge and compete for votes.",
    studentEntryForm: "Student Entry Form",
    studentFormDesc: "Fill in your details to participate in the challenge.",
    fullNameRequired: "Full Name *",
    shortDescription: "Short Description",
    descriptionPlaceholder: "Tell voters about yourself (optional)",
    photo: "Photo",
    uploadPhoto: "Upload Photo",
    uploadPhotoDesc: "Upload a photo from your phone or computer",
    clickToUpload: "Click to upload",
    dragAndDrop: "or drag and drop",
    photoFormats: "PNG, JPG, GIF up to 5MB",
    submitting: "Submitting...",
    submitEntryButton: "Submit Entry",
    entrySubmitted: "Entry Submitted!",
    entrySubmittedDesc: "Your entry has been added to the challenge.",
    
    // Vote page
    voteTitle: "Cast Your Vote",
    voteSubtitle: "Choose your favorite student to support",
    readyToVote: "Ready to Vote",
    voteCast: "Vote Cast",
    voteButton: "Vote",
    votingFor: "Voting...",
    noStudents: "No Students Yet",
    noStudentsDesc: "Be the first to submit an entry!",
    submitYourEntry: "Submit Your Entry",
    alreadyVoted: "You've Already Voted",
    alreadyVotedDesc: "Thank you for participating! You voted for:",
    votes: "votes",
    
    // Leaderboard page
    leaderboardTitle: "Live Leaderboard",
    leaderboardSubtitle: "Real-time ranking of all participants",
    rank: "Rank",
    student: "Student",
    votesColumn: "Votes",
    noEntries: "No Entries Yet",
    noEntriesDesc: "Be the first to join the challenge!",
    joinChallenge: "Join the Challenge",
    
    // Admin page
    adminTitle: "Admin Dashboard",
    adminSubtitle: "Monitor votes and manage the challenge",
    adminLoginTitle: "Admin Login",
    adminLoginDesc: "Enter your credentials to access the dashboard",
    username: "Username",
    password: "Password",
    loginAsAdmin: "Login as Admin",
    totalStudents: "Total Students",
    totalVoters: "Total Voters",
    totalVotes: "Total Votes",
    participantsOverview: "Participants Overview",
    votersOverview: "Voters Overview",
    active: "Active",
    voter: "Voter",
    votedFor: "Voted for",
    hasNotVoted: "Has not voted",
    deleteStudent: "Delete",
    logout: "Logout",
    
    // Errors
    notLoggedIn: "Not logged in",
    pleaseRegisterFirst: "Please register or login first.",
    voteSuccess: "Vote Cast!",
    voteSuccessDesc: "Your vote has been recorded.",
    voteFailed: "Vote failed",
    submissionFailed: "Submission failed",
    tryAgain: "Please try again.",
    loginFailed: "Login failed",
    invalidCredentials: "Invalid credentials",
    
    // Upload
    fileTooLarge: "File too large",
    fileTooLargeDesc: "Please upload an image under 5MB.",
    uploadFailed: "Upload failed",
    photoUploaded: "Photo uploaded!",
    photoUploadedDesc: "Your photo has been uploaded successfully.",
    
    // Validation
    nameMinChars: "Name must be at least 2 characters",
    descMaxChars: "Description must be under 200 characters",
  },
  fr: {
    // Common
    appName: "Lycée 20 Août",
    back: "Retour",
    submit: "Soumettre",
    loading: "Chargement...",
    viewLeaderboard: "Voir le Classement",
    backToHome: "Retour à l'Accueil",
    
    // Home page
    heroTitle: "Défi Étudiant",
    heroSubtitle: "Votez pour votre étudiant préféré. Chaque vote compte dans cette compétition exclusive.",
    registerToVote: "S'inscrire pour Voter",
    submitEntry: "Soumettre une Candidature",
    viewResults: "Voir les Résultats",
    adminLogin: "Admin",
    featuresTitle: "Comment ça Marche",
    feature1Title: "Inscription",
    feature1Desc: "Créez votre compte électeur avec un email valide",
    feature2Title: "Voter",
    feature2Desc: "Votez pour votre étudiant préféré",
    feature3Title: "Résultats",
    feature3Desc: "Suivez le classement en temps réel",
    
    // Register page
    registerTitle: "Inscription au Vote",
    registerSubtitle: "Créez votre compte pour participer au vote",
    voterRegistration: "Inscription Électeur",
    voterRegisterDesc: "Entrez vos informations pour vous inscrire",
    fullName: "Nom Complet",
    enterFullName: "Entrez votre nom complet",
    email: "Adresse Email",
    enterEmail: "Entrez votre email",
    registerButton: "S'inscrire",
    registering: "Inscription en cours...",
    alreadyRegistered: "Déjà inscrit?",
    loginHere: "Connectez-vous ici",
    registrationSuccess: "Inscription Réussie!",
    registrationSuccessDesc: "Vous êtes prêt à voter.",
    voteNow: "Voter Maintenant",
    
    // Login
    loginTitle: "Connexion pour Voter",
    loginSubtitle: "Entrez votre email pour accéder à votre compte",
    voterLogin: "Connexion Électeur",
    voterLoginDesc: "Entrez votre email enregistré pour vous connecter",
    loginButton: "Se Connecter",
    loggingIn: "Connexion...",
    notRegistered: "Pas encore inscrit?",
    registerHere: "Inscrivez-vous ici",
    
    // Submit page
    submitTitle: "Soumettre Votre Candidature",
    submitSubtitle: "Rejoignez le défi étudiant et concourez pour les votes.",
    studentEntryForm: "Formulaire de Candidature",
    studentFormDesc: "Remplissez vos informations pour participer au défi.",
    fullNameRequired: "Nom Complet *",
    shortDescription: "Courte Description",
    descriptionPlaceholder: "Parlez de vous aux électeurs (optionnel)",
    photo: "Photo",
    uploadPhoto: "Télécharger une Photo",
    uploadPhotoDesc: "Téléchargez une photo depuis votre téléphone ou ordinateur",
    clickToUpload: "Cliquez pour télécharger",
    dragAndDrop: "ou glissez-déposez",
    photoFormats: "PNG, JPG, GIF jusqu'à 5Mo",
    submitting: "Envoi en cours...",
    submitEntryButton: "Soumettre la Candidature",
    entrySubmitted: "Candidature Soumise!",
    entrySubmittedDesc: "Votre candidature a été ajoutée au défi.",
    
    // Vote page
    voteTitle: "Votez",
    voteSubtitle: "Choisissez votre étudiant préféré à soutenir",
    readyToVote: "Prêt à Voter",
    voteCast: "Vote Enregistré",
    voteButton: "Voter",
    votingFor: "Vote en cours...",
    noStudents: "Aucun Étudiant",
    noStudentsDesc: "Soyez le premier à soumettre une candidature!",
    submitYourEntry: "Soumettre Votre Candidature",
    alreadyVoted: "Vous Avez Déjà Voté",
    alreadyVotedDesc: "Merci de votre participation! Vous avez voté pour:",
    votes: "votes",
    
    // Leaderboard page
    leaderboardTitle: "Classement en Direct",
    leaderboardSubtitle: "Classement en temps réel de tous les participants",
    rank: "Rang",
    student: "Étudiant",
    votesColumn: "Votes",
    noEntries: "Aucune Candidature",
    noEntriesDesc: "Soyez le premier à rejoindre le défi!",
    joinChallenge: "Rejoindre le Défi",
    
    // Admin page
    adminTitle: "Tableau de Bord Admin",
    adminSubtitle: "Suivez les votes et gérez le défi",
    adminLoginTitle: "Connexion Admin",
    adminLoginDesc: "Entrez vos identifiants pour accéder au tableau de bord",
    username: "Nom d'utilisateur",
    password: "Mot de passe",
    loginAsAdmin: "Se Connecter en tant qu'Admin",
    totalStudents: "Total Étudiants",
    totalVoters: "Total Électeurs",
    totalVotes: "Total Votes",
    participantsOverview: "Aperçu des Participants",
    votersOverview: "Aperçu des Électeurs",
    active: "Actif",
    voter: "Électeur",
    votedFor: "A voté pour",
    hasNotVoted: "N'a pas voté",
    deleteStudent: "Supprimer",
    logout: "Déconnexion",
    
    // Errors
    notLoggedIn: "Non connecté",
    pleaseRegisterFirst: "Veuillez d'abord vous inscrire ou vous connecter.",
    voteSuccess: "Vote Enregistré!",
    voteSuccessDesc: "Votre vote a été enregistré.",
    voteFailed: "Échec du vote",
    submissionFailed: "Échec de la soumission",
    tryAgain: "Veuillez réessayer.",
    loginFailed: "Échec de la connexion",
    invalidCredentials: "Identifiants invalides",
    
    // Upload
    fileTooLarge: "Fichier trop volumineux",
    fileTooLargeDesc: "Veuillez télécharger une image de moins de 5 Mo.",
    uploadFailed: "Échec du téléchargement",
    photoUploaded: "Photo téléchargée!",
    photoUploadedDesc: "Votre photo a été téléchargée avec succès.",
    
    // Validation
    nameMinChars: "Le nom doit contenir au moins 2 caractères",
    descMaxChars: "La description doit contenir moins de 200 caractères",
  },
  ar: {
    // Common
    appName: "ثانوية 20 أوت",
    back: "رجوع",
    submit: "إرسال",
    loading: "جاري التحميل...",
    viewLeaderboard: "عرض الترتيب",
    backToHome: "العودة للرئيسية",
    
    // Home page
    heroTitle: "تحدي الطلاب",
    heroSubtitle: "صوّت لطالبك المفضل. كل صوت يُحسب في هذه المسابقة الحصرية.",
    registerToVote: "سجّل للتصويت",
    submitEntry: "قدّم ترشيحك",
    viewResults: "عرض النتائج",
    adminLogin: "المشرف",
    featuresTitle: "كيف يعمل",
    feature1Title: "التسجيل",
    feature1Desc: "أنشئ حساب الناخب الخاص بك ببريد إلكتروني صالح",
    feature2Title: "التصويت",
    feature2Desc: "صوّت لطالبك المفضل",
    feature3Title: "النتائج",
    feature3Desc: "تابع الترتيب المباشر في الوقت الفعلي",
    
    // Register page
    registerTitle: "سجّل للتصويت",
    registerSubtitle: "أنشئ حسابك للمشاركة في التصويت",
    voterRegistration: "تسجيل الناخب",
    voterRegisterDesc: "أدخل بياناتك للتسجيل كناخب",
    fullName: "الاسم الكامل",
    enterFullName: "أدخل اسمك الكامل",
    email: "البريد الإلكتروني",
    enterEmail: "أدخل بريدك الإلكتروني",
    registerButton: "تسجيل",
    registering: "جاري التسجيل...",
    alreadyRegistered: "مسجل بالفعل؟",
    loginHere: "سجّل الدخول هنا",
    registrationSuccess: "تم التسجيل بنجاح!",
    registrationSuccessDesc: "أنت جاهز للتصويت.",
    voteNow: "صوّت الآن",
    
    // Login
    loginTitle: "تسجيل الدخول للتصويت",
    loginSubtitle: "أدخل بريدك الإلكتروني للوصول إلى حسابك",
    voterLogin: "دخول الناخب",
    voterLoginDesc: "أدخل بريدك الإلكتروني المسجل لتسجيل الدخول",
    loginButton: "تسجيل الدخول",
    loggingIn: "جاري تسجيل الدخول...",
    notRegistered: "لم تسجل بعد؟",
    registerHere: "سجّل هنا",
    
    // Submit page
    submitTitle: "قدّم ترشيحك",
    submitSubtitle: "انضم إلى تحدي الطلاب وتنافس على الأصوات.",
    studentEntryForm: "نموذج ترشيح الطالب",
    studentFormDesc: "املأ بياناتك للمشاركة في التحدي.",
    fullNameRequired: "الاسم الكامل *",
    shortDescription: "وصف قصير",
    descriptionPlaceholder: "أخبر الناخبين عن نفسك (اختياري)",
    photo: "الصورة",
    uploadPhoto: "رفع صورة",
    uploadPhotoDesc: "ارفع صورة من هاتفك أو حاسوبك",
    clickToUpload: "انقر للرفع",
    dragAndDrop: "أو اسحب وأفلت",
    photoFormats: "PNG, JPG, GIF حتى 5 ميجابايت",
    submitting: "جاري الإرسال...",
    submitEntryButton: "إرسال الترشيح",
    entrySubmitted: "تم إرسال الترشيح!",
    entrySubmittedDesc: "تمت إضافة ترشيحك إلى التحدي.",
    
    // Vote page
    voteTitle: "صوّت",
    voteSubtitle: "اختر طالبك المفضل لدعمه",
    readyToVote: "جاهز للتصويت",
    voteCast: "تم التصويت",
    voteButton: "صوّت",
    votingFor: "جاري التصويت...",
    noStudents: "لا يوجد طلاب",
    noStudentsDesc: "كن أول من يقدم ترشيحه!",
    submitYourEntry: "قدّم ترشيحك",
    alreadyVoted: "لقد صوّت بالفعل",
    alreadyVotedDesc: "شكراً لمشاركتك! لقد صوّت لـ:",
    votes: "صوت",
    
    // Leaderboard page
    leaderboardTitle: "الترتيب المباشر",
    leaderboardSubtitle: "ترتيب جميع المشاركين في الوقت الفعلي",
    rank: "الترتيب",
    student: "الطالب",
    votesColumn: "الأصوات",
    noEntries: "لا توجد ترشيحات",
    noEntriesDesc: "كن أول من ينضم إلى التحدي!",
    joinChallenge: "انضم للتحدي",
    
    // Admin page
    adminTitle: "لوحة تحكم المشرف",
    adminSubtitle: "راقب الأصوات وأدر التحدي",
    adminLoginTitle: "دخول المشرف",
    adminLoginDesc: "أدخل بياناتك للوصول إلى لوحة التحكم",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    loginAsAdmin: "الدخول كمشرف",
    totalStudents: "إجمالي الطلاب",
    totalVoters: "إجمالي الناخبين",
    totalVotes: "إجمالي الأصوات",
    participantsOverview: "نظرة عامة على المشاركين",
    votersOverview: "نظرة عامة على الناخبين",
    active: "نشط",
    voter: "ناخب",
    votedFor: "صوّت لـ",
    hasNotVoted: "لم يصوت",
    deleteStudent: "حذف",
    logout: "تسجيل الخروج",
    
    // Errors
    notLoggedIn: "غير مسجل الدخول",
    pleaseRegisterFirst: "يرجى التسجيل أو تسجيل الدخول أولاً.",
    voteSuccess: "تم التصويت!",
    voteSuccessDesc: "تم تسجيل صوتك.",
    voteFailed: "فشل التصويت",
    submissionFailed: "فشل الإرسال",
    tryAgain: "يرجى المحاولة مرة أخرى.",
    loginFailed: "فشل تسجيل الدخول",
    invalidCredentials: "بيانات اعتماد غير صالحة",
    
    // Upload
    fileTooLarge: "الملف كبير جداً",
    fileTooLargeDesc: "يرجى رفع صورة أقل من 5 ميجابايت.",
    uploadFailed: "فشل الرفع",
    photoUploaded: "تم رفع الصورة!",
    photoUploadedDesc: "تم رفع صورتك بنجاح.",
    
    // Validation
    nameMinChars: "يجب أن يكون الاسم على الأقل حرفين",
    descMaxChars: "يجب أن يكون الوصف أقل من 200 حرف",
  },
};

export type TranslationKey = keyof typeof translations.en;

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'language-storage',
    }
  )
);

export function useTranslation() {
  const { language, setLanguage } = useLanguageStore();
  
  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };
  
  const isRTL = language === 'ar';
  
  return { t, language, setLanguage, isRTL };
}
