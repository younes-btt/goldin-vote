import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useVoterStore } from "@/lib/auth";
import { useTranslation } from "@/lib/translations";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Crown, Vote, Trophy, CheckCircle, AlertCircle, Search, ArrowLeft } from "lucide-react";
import type { Student, Voter } from "@shared/schema";

export default function VotePage() {
  const { toast } = useToast();
  const { voter, setVoter } = useVoterStore();
  const { t, isRTL } = useTranslation();
  const [email, setEmail] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch students
  const { data: students = [], isLoading: studentsLoading } = useQuery<Student[]>({
    queryKey: ["/api/students"],
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/voters/login", { email });
      return response as Voter;
    },
    onSuccess: (voterData) => {
      setVoter(voterData);
      toast({
        title: t('voteSuccess'),
        description: voterData.hasVoted 
          ? t('alreadyVotedDesc') 
          : t('registrationSuccessDesc'),
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: t('loginFailed'),
        description: error.message || t('pleaseRegisterFirst'),
      });
    },
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ voterId, studentId }: { voterId: string; studentId: string }) => {
      const response = await apiRequest("POST", "/api/votes", {
        voterId,
        studentId,
      });
      return response as { voter: Voter; student: Student };
    },
    onSuccess: (data) => {
      setVoter(data.voter);
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      toast({
        title: t('voteSuccess'),
        description: t('voteSuccessDesc'),
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: t('voteFailed'),
        description: error.message || t('tryAgain'),
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsLoggingIn(true);
      loginMutation.mutate(email.trim());
    }
  };

  const handleVote = (studentId: string) => {
    if (!voter || !voter.id) {
      toast({
        variant: "destructive",
        title: t('notLoggedIn'),
        description: t('pleaseRegisterFirst'),
      });
      return;
    }
    if (voter.hasVoted) {
      toast({
        variant: "destructive",
        title: t('alreadyVoted'),
        description: t('alreadyVotedDesc'),
      });
      return;
    }
    voteMutation.mutate({ voterId: voter.id, studentId });
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string | undefined | null) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Login form if not logged in
  if (!voter) {
    return (
      <div className={`min-h-screen bg-background particles-bg ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <header className="border-b border-primary/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <Link href="/">
                <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home-logo">
                  <Crown className="w-6 h-6 text-primary" />
                  <span className="font-semibold text-foreground">{t('appName')}</span>
                </div>
              </Link>
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <Link href="/">
                  <Button variant="ghost" size="sm" className="text-muted-foreground" data-testid="button-back-home">
                    <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                    {t('back')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
                <span className="gold-gradient-text">{t('loginTitle')}</span>
              </h1>
              <p className="text-muted-foreground">
                {t('loginSubtitle')}
              </p>
            </div>

            <Card className="bg-card border-primary/30">
              <CardContent className="pt-6">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">{t('email')}</label>
                    <Input
                      type="email"
                      placeholder={t('enterEmail')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background border-primary/30 focus:border-primary"
                      data-testid="input-login-email"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full font-semibold"
                    disabled={loginMutation.isPending || !email.trim()}
                    data-testid="button-login"
                  >
                    {loginMutation.isPending ? (
                      <span className="animate-pulse">{t('loggingIn')}</span>
                    ) : (
                      <>
                        <Vote className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {t('loginButton')}
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-primary/20 text-center">
                  <p className="text-sm text-muted-foreground">
                    {t('notRegistered')}{" "}
                    <Link href="/register" className="text-primary hover:underline" data-testid="link-register">
                      {t('registerHere')}
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background particles-bg ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="border-b border-primary/20 sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home-logo">
                <Crown className="w-6 h-6 text-primary" />
                <span className="font-semibold text-foreground hidden sm:inline">{t('appName')}</span>
              </div>
            </Link>
            
            <div className="flex items-center gap-4 flex-wrap">
              <LanguageSwitcher />
              {voter.hasVoted ? (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
                  <CheckCircle className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  {t('voteCast')}
                </Badge>
              ) : (
                <Badge variant="outline" className="border-primary/30 text-foreground">
                  <Vote className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  {t('readyToVote')}
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">{voter.name}</span>
              <Link href="/leaderboard">
                <Button variant="outline" size="sm" className="border-primary/30" data-testid="button-view-leaderboard">
                  <Trophy className={`w-4 h-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                  {t('viewLeaderboard')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">
            <span className="gold-gradient-text">{t('voteTitle')}</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {voter.hasVoted 
              ? t('alreadyVotedDesc')
              : t('voteSubtitle')
            }
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} />
            <Input
              placeholder={t('voteSubtitle')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${isRTL ? 'pr-10' : 'pl-10'} bg-card border-primary/30 focus:border-primary`}
              data-testid="input-search-students"
            />
          </div>
        </div>

        {/* Students Grid */}
        {studentsLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-card border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Skeleton className="w-20 h-20 rounded-full mb-4" />
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-16">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('noStudents')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('noStudentsDesc')}
            </p>
            <Link href="/submit">
              <Button data-testid="button-submit-entry">
                {t('submitYourEntry')}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {filteredStudents.map((student) => (
              <Card
                key={student.id}
                className={`bg-card border-primary/20 gold-border-glow transition-all duration-300 ${
                  voter.votedForId === student.id ? "ring-2 ring-primary" : ""
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 rounded-full ring-2 ring-primary/50 ring-offset-2 ring-offset-card overflow-hidden">
                        <Avatar className="w-full h-full">
                          <AvatarImage src={student.photoUrl || undefined} alt={student.name} />
                          <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      {voter.votedForId === student.id && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-foreground mb-1" data-testid={`text-student-name-${student.id}`}>
                      {student.name}
                    </h3>
                    
                    {student.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {student.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="w-4 h-4 text-primary" />
                      <span className="text-lg font-bold text-primary" data-testid={`text-vote-count-${student.id}`}>
                        {student.voteCount}
                      </span>
                      <span className="text-sm text-muted-foreground">{t('votes')}</span>
                    </div>

                    {voter.hasVoted ? (
                      voter.votedForId === student.id ? (
                        <Badge className="bg-primary text-primary-foreground">
                          <CheckCircle className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                          {t('voteCast')}
                        </Badge>
                      ) : (
                        <Button variant="secondary" disabled className="w-full">
                          {t('voteCast')}
                        </Button>
                      )
                    ) : (
                      <Button
                        onClick={() => handleVote(student.id)}
                        disabled={voteMutation.isPending}
                        className="w-full font-semibold"
                        data-testid={`button-vote-${student.id}`}
                      >
                        {voteMutation.isPending ? (
                          <span className="animate-pulse">{t('votingFor')}</span>
                        ) : (
                          <>
                            <Vote className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {t('voteButton')}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
